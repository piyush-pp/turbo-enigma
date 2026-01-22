import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError, ConflictError } from '../../utils/errors';
import {
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingResponse,
  BookingListResponse,
} from './booking.types';
import { addEmailJob } from '../../utils/queue';

const prisma = new PrismaClient();

export class BookingService {
  async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
    // Validate business
    const business = await prisma.business.findUnique({
      where: { slug: request.businessSlug },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Validate service
    const service = await prisma.service.findFirst({
      where: { id: request.serviceId, businessId: business.id, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    // Validate and parse startTimeUtc
    const startTimeUtc = this.parseAndValidateDateTime(request.startTimeUtc);

    // Calculate end time based on service duration
    const endTimeUtc = new Date(startTimeUtc.getTime() + service.durationMinutes * 60 * 1000);

    // Determine staff ID
    let staffId = request.staffId;
    if (!staffId) {
      if (!business.isSingleStaff) {
        throw new ValidationError('staffId is required for multi-staff businesses');
      }

      // Get default staff (owner)
      const staff = await prisma.staff.findFirst({
        where: { businessId: business.id, deletedAt: null },
      });

      if (!staff) {
        throw new NotFoundError('No staff found for this business');
      }

      staffId = staff.id;
    }

    // Validate staff exists and belongs to business
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, businessId: business.id, deletedAt: null },
    });

    if (!staff) {
      throw new NotFoundError('Staff member not found');
    }

    // Validate slot availability
    await this.validateSlotAvailability(staffId, startTimeUtc, endTimeUtc);

    // Validate client data
    if (!request.clientName || !request.clientEmail) {
      throw new ValidationError('Client name and email are required');
    }

    // Create booking in transaction with constraint handling
    try {
      const booking = await prisma.$transaction(
        async (tx) => {
          // Check for conflicts once more in transaction context
          const conflicts = await tx.booking.findMany({
            where: {
              staffId,
              status: { in: ['PENDING', 'CONFIRMED'] },
              startTime: { lt: endTimeUtc },
              endTime: { gt: startTimeUtc },
            },
          });

          if (conflicts.length > 0) {
            throw new ConflictError('Time slot is no longer available');
          }

          // Create booking
          const created = await tx.booking.create({
            data: {
              businessId: business.id,
              staffId,
              serviceId: request.serviceId,
              clientName: request.clientName,
              clientEmail: request.clientEmail,
              clientPhone: request.clientPhone,
              notes: request.notes,
              startTime: startTimeUtc,
              endTime: endTimeUtc,
              status: 'PENDING',
            },
          });

          return created;
        },
        {
          isolationLevel: 'Serializable',
        }
      );

      // Queue confirmation email
      await addEmailJob({
        type: 'booking-confirmation',
        email: request.clientEmail,
        clientName: request.clientName,
        businessName: business.name,
        serviceName: service.name,
        startTime: startTimeUtc.toISOString(),
        endTime: endTimeUtc.toISOString(),
        bookingId: booking.id,
      });

      return this.mapToResponse(booking);
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === 'P2002' && error.meta?.target?.includes('staffId_startTime')) {
        throw new ConflictError('Time slot is already booked');
      }
      throw error;
    }
  }

  async updateBooking(
    businessId: string,
    bookingId: string,
    request: UpdateBookingRequest
  ): Promise<BookingResponse> {
    // Find booking and verify it belongs to business
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Determine new status
    const newStatus = request.status || booking.status;

    // Build update data
    const updateData: any = {
      status: newStatus,
    };

    // Set cancelledAt when cancelling
    if (newStatus === 'CANCELLED' && booking.status !== 'CANCELLED') {
      updateData.cancelledAt = new Date();
    } else if (newStatus !== 'CANCELLED') {
      updateData.cancelledAt = null;
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    // Queue cancellation email if booking was cancelled
    if (newStatus === 'CANCELLED' && booking.status !== 'CANCELLED') {
      const business = await prisma.business.findUnique({
        where: { id: businessId },
      });

      const service = await prisma.service.findUnique({
        where: { id: booking.serviceId },
      });

      if (business && service) {
        await addEmailJob({
          type: 'booking-cancellation',
          email: booking.clientEmail,
          clientName: booking.clientName,
          businessName: business.name,
          serviceName: service.name,
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          bookingId: booking.id,
        });
      }
    }

    return this.mapToResponse(updated);
  }

  async getBookingsByBusiness(
    businessId: string,
    filters?: {
      status?: string;
      staffId?: string;
      startDateUtc?: string;
      endDateUtc?: string;
    }
  ): Promise<BookingListResponse[]> {
    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Build where clause
    const where: any = { businessId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.staffId) {
      where.staffId = filters.staffId;
    }

    if (filters?.startDateUtc || filters?.endDateUtc) {
      where.startTime = {};
      if (filters.startDateUtc) {
        where.startTime.gte = new Date(filters.startDateUtc);
      }
      if (filters.endDateUtc) {
        where.startTime.lte = new Date(filters.endDateUtc);
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: { name: true, durationMinutes: true },
        },
        staff: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    return bookings.map((b) => ({
      id: b.id,
      clientName: b.clientName,
      clientEmail: b.clientEmail,
      clientPhone: b.clientPhone,
      service: {
        name: b.service.name,
        durationMinutes: b.service.durationMinutes,
      },
      staff: {
        name: b.staff.user.name,
        email: b.staff.user.email,
      },
      startTime: b.startTime.toISOString(),
      endTime: b.endTime.toISOString(),
      status: b.status as any,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  async getBookingById(businessId: string, bookingId: string): Promise<BookingResponse> {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    return this.mapToResponse(booking);
  }

  private async validateSlotAvailability(
    staffId: string,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    // Check for overlapping bookings
    const conflicts = await prisma.booking.findMany({
      where: {
        staffId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    if (conflicts.length > 0) {
      throw new ConflictError('Time slot is not available');
    }
  }

  private parseAndValidateDateTime(dateTimeStr: string): Date {
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) {
        throw new Error();
      }

      // Must be in UTC (should end with Z)
      if (!dateTimeStr.endsWith('Z')) {
        throw new ValidationError('DateTime must be in UTC format (ISO 8601 with Z suffix)');
      }

      return date;
    } catch {
      throw new ValidationError('Invalid DateTime format. Use ISO 8601 format with Z suffix');
    }
  }

  private mapToResponse(booking: any): BookingResponse {
    return {
      id: booking.id,
      businessId: booking.businessId,
      staffId: booking.staffId,
      serviceId: booking.serviceId,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      notes: booking.notes,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status as any,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      ...(booking.cancelledAt && { cancelledAt: booking.cancelledAt.toISOString() }),
    };
  }
}

export const bookingService = new BookingService();
