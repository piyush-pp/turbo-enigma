import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError } from '../../utils/errors';
import { GetSlotsRequest, SlotsResponse, TimeSlot } from './slots.types';

const prisma = new PrismaClient();

const SLOT_INTERVAL = 15; // Generate slots every 15 minutes

export class SlotsService {
  async generateSlots(request: GetSlotsRequest): Promise<SlotsResponse> {
    // Validate and fetch business
    const business = await prisma.business.findUnique({
      where: { slug: request.businessSlug },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Validate and fetch service
    const service = await prisma.service.findFirst({
      where: { id: request.serviceId, businessId: business.id, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    // Determine staff ID
    let staffId = request.staffId;
    if (!staffId) {
      if (!business.isSingleStaff) {
        throw new ValidationError('staffId is required for multi-staff businesses');
      }

      // Get default staff (owner)
      const staff = await prisma.staff.findFirst({
        where: { businessId: business.id },
      });

      if (!staff) {
        throw new NotFoundError('No staff found for this business');
      }

      staffId = staff.id;
    }

    // Validate and fetch staff
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, businessId: business.id, deletedAt: null },
    });

    if (!staff) {
      throw new NotFoundError('Staff member not found');
    }

    // Validate date format
    const date = this.validateAndParseDate(request.date);

    // Use business timezone or provided timezone
    const timezone = request.timezone || business.timezone;

    // Get availability rules for this staff
    const availabilityRules = await prisma.availabilityRule.findMany({
      where: { staffId, businessId: business.id },
    });

    if (availabilityRules.length === 0) {
      throw new NotFoundError('No availability rules found for staff');
    }

    // Get day of week (0-6)
    const dayOfWeek = date.getUTCDay();

    // Find availability for this day
    const dayAvailability = availabilityRules.find((r) => r.dayOfWeek === dayOfWeek);

    if (!dayAvailability) {
      throw new NotFoundError('No availability rules for this day');
    }

    // Check if it's a working day
    const isWorkingDay = !(dayAvailability.startTime === '00:00' && dayAvailability.endTime === '00:00');

    if (!isWorkingDay) {
      return {
        businessSlug: request.businessSlug,
        serviceId: request.serviceId,
        staffId,
        date: request.date,
        timezone,
        serviceDuration: service.durationMinutes,
        slots: [],
        totalSlots: 0,
        availableSlots: 0,
      };
    }

    // Generate slot times in local timezone
    const slots = this.generateSlotTimes(
      date,
      dayAvailability.startTime,
      dayAvailability.endTime,
      service.durationMinutes,
      timezone
    );

    // Get existing bookings for this staff on this date (in UTC)
    const dateUtc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const nextDayUtc = new Date(dateUtc);
    nextDayUtc.setUTCDate(nextDayUtc.getUTCDate() + 1);

    const bookings = await prisma.booking.findMany({
      where: {
        staffId,
        startTime: { gte: dateUtc, lt: nextDayUtc },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    // Mark booked slots
    const slotsWithAvailability = slots.map((slot) => {
      const slotStartUtc = new Date(slot.startTimeUtc);
      const slotEndUtc = new Date(slot.endTimeUtc);
  
      const isBooked = bookings.some(
         (booking) =>
         slotStartUtc < booking.endTime && slotEndUtc > booking.startTime
      );
      return {
        ...slot,
        available: !isBooked,
      };
    });

    const availableCount = slotsWithAvailability.filter((s) => s.available).length;

    return {
      businessSlug: request.businessSlug,
      serviceId: request.serviceId,
      staffId,
      date: request.date,
      timezone,
      serviceDuration: service.durationMinutes,
      slots: slotsWithAvailability,
      totalSlots: slotsWithAvailability.length,
      availableSlots: availableCount,
    };
  }

  private validateAndParseDate(dateStr: string): Date {
    // Validate YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      throw new ValidationError('Date must be in YYYY-MM-DD format');
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new ValidationError('Invalid date');
    }

    // Ensure we're using UTC and at start of day
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    return new Date(Date.UTC(year, month, day));
  }

  private generateSlotTimes(
    date: Date,
    startTime: string,
    endTime: string,
    serviceDuration: number,
    timezone: string
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];

    // Parse times
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    // Convert local times to UTC for this date
    // Get UTC offset for this timezone on this date
    // Using simple approach: calculate the offset based on the timezone

    // Calculate minutes to subtract from local time to get UTC
    // For simplicity, we'll use the timezone string directly with date parts
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // Create a probe date to calculate offset
    const probeDate = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        12,
        0,
        0
      )
    );

    const parts = tzFormatter.formatToParts(probeDate);
    const tzHour = parseInt(
      parts.find((p) => p.type === 'hour')?.value || '12',
      10
    );
    const offsetMinutes = (12 - tzHour) * 60;

    // Generate slots
    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + serviceDuration <= endMinutes) {
      const slotStartHour = Math.floor(currentMinutes / 60);
      const slotStartMin = currentMinutes % 60;
      const slotEndHour = Math.floor((currentMinutes + serviceDuration) / 60);
      const slotEndMin = (currentMinutes + serviceDuration) % 60;

      // Local time (for display)
      const localStart = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        slotStartHour,
        slotStartMin,
        0
      );
      const localEnd = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        slotEndHour,
        slotEndMin,
        0
      );

      // UTC time (for storage)
      const utcStart = new Date(localStart.getTime() - offsetMinutes * 60 * 1000);
      const utcEnd = new Date(localEnd.getTime() - offsetMinutes * 60 * 1000);

      slots.push({
        startTime: this.formatLocalTime(localStart),
        endTime: this.formatLocalTime(localEnd),
        startTimeUtc: utcStart.toISOString(),
        endTimeUtc: utcEnd.toISOString(),
        available: true,
      });

      currentMinutes += SLOT_INTERVAL;
    }

    return slots;
  }

  private formatLocalTime(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
}

export const slotsService = new SlotsService();
