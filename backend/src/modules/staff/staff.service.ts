import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { CreateStaffRequest, UpdateStaffRequest, StaffResponse, StaffListResponse } from './staff.types';

const prisma = new PrismaClient();

export class StaffService {
  async createStaff(
    businessId: string,
    request: CreateStaffRequest
  ): Promise<StaffResponse> {
    // Validate business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: request.userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if staff already exists for this user in this business
    const existingStaff = await prisma.staff.findUnique({
      where: {
        userId_businessId: {
          userId: request.userId,
          businessId,
        },
      },
    });

    if (existingStaff) {
      throw new ConflictError('Staff member already exists for this business');
    }

    // Create staff
    const staff = await prisma.staff.create({
      data: {
        userId: request.userId,
        businessId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return this.mapToResponse(staff);
  }

  async getStaffByBusiness(businessId: string): Promise<StaffListResponse[]> {
    const staffList = await prisma.staff.findMany({
      where: { businessId, deletedAt: null },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return staffList.map((s) => ({
      id: s.id,
      userId: s.userId,
      email: s.user.email,
      name: s.user.name,
      businessId: s.businessId,
      isActive: !s.deletedAt,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  async updateStaff(
    businessId: string,
    staffId: string,
    request: UpdateStaffRequest
  ): Promise<StaffResponse> {
    // Find staff and verify it belongs to business
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, businessId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!staff) {
      throw new NotFoundError('Staff member not found');
    }

    // Update staff (isActive is managed via soft delete)
    const updatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: {
        deletedAt: request.isActive === false ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return this.mapToResponse(updatedStaff);
  }

  async getStaffById(staffId: string): Promise<StaffResponse> {
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!staff) {
      throw new NotFoundError('Staff member not found');
    }

    return this.mapToResponse(staff);
  }

  async createDefaultStaff(businessId: string): Promise<StaffResponse> {
    // Get business owner
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: true },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Check if default staff already exists
    const existingStaff = await prisma.staff.findUnique({
      where: {
        userId_businessId: {
          userId: business.ownerId,
          businessId,
        },
      },
    });

    if (existingStaff) {
      return this.mapToResponse(existingStaff);
    }

    // Create default staff (owner as staff)
    const staff = await prisma.staff.create({
      data: {
        userId: business.ownerId,
        businessId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return this.mapToResponse(staff);
  }

  private mapToResponse(staff: any): StaffResponse {
    return {
      id: staff.id,
      userId: staff.userId,
      businessId: staff.businessId,
      user: {
        id: staff.user.id,
        email: staff.user.email,
        name: staff.user.name,
      },
      isActive: !staff.deletedAt,
      createdAt: staff.createdAt.toISOString(),
      updatedAt: staff.updatedAt.toISOString(),
    };
  }
}

export const staffService = new StaffService();
