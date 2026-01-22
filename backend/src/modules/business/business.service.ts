import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError, ConflictError } from '../../utils/errors';
import { CreateBusinessRequest, UpdateBusinessRequest, BusinessResponse } from './business.types';
import { staffService } from '../staff/staff.service';

const prisma = new PrismaClient();

export class BusinessService {
  async createBusiness(
    userId: string,
    request: CreateBusinessRequest
  ): Promise<BusinessResponse> {
    // Validate input
    if (!request.name || !request.slug) {
      throw new ValidationError('Name and slug are required');
    }

    // Validate slug format (alphanumeric, hyphens, underscores)
    if (!/^[a-z0-9_-]+$/i.test(request.slug)) {
      throw new ValidationError(
        'Slug must contain only alphanumeric characters, hyphens, and underscores'
      );
    }

    // Check if slug is already taken
    const existingBusiness = await prisma.business.findUnique({
      where: { slug: request.slug },
    });

    if (existingBusiness) {
      throw new ConflictError('Slug already in use');
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        name: request.name,
        description: request.description,
        slug: request.slug,
        timezone: request.timezone || 'UTC',
        isSingleStaff: request.isSingleStaff || false,
        ownerId: userId,
      },
    });

    // If single-staff mode, auto-create default staff (owner)
    if (request.isSingleStaff) {
      await staffService.createDefaultStaff(business.id);
    }
    return this.mapToResponse(business);
  }

  async updateBusiness(
    userId: string,
    businessId: string,
    request: UpdateBusinessRequest
  ): Promise<BusinessResponse> {
    // Verify ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ValidationError('You do not have permission to update this business');
    }

    // If transitioning to single-staff mode, auto-create default staff
    if (
      request.isSingleStaff === true &&
      business.isSingleStaff === false
    ) {
      await staffService.createDefaultStaff(businessId);
    }

    // Update business
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        ...(request.name && { name: request.name }),
        ...(request.description !== undefined && { description: request.description }),
        ...(request.timezone && { timezone: request.timezone }),
        ...(request.isSingleStaff !== undefined && { isSingleStaff: request.isSingleStaff }),
      },
    });

    return this.mapToResponse(updatedBusiness);
  }

  async getBusinessById(businessId: string): Promise<BusinessResponse> {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    return this.mapToResponse(business);
  }

  async getBusinessBySlug(slug: string): Promise<BusinessResponse> {
    const business = await prisma.business.findUnique({
      where: { slug },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    return this.mapToResponse(business);
  }

  async getOwnerBusinesses(userId: string): Promise<BusinessResponse[]> {
    const businesses = await prisma.business.findMany({
      where: { ownerId: userId, deletedAt: null },
    });

    return businesses.map((b) => this.mapToResponse(b));
  }

  private mapToResponse(business: any): BusinessResponse {
    return {
      id: business.id,
      name: business.name,
      description: business.description,
      slug: business.slug,
      timezone: business.timezone,
      isSingleStaff: business.isSingleStaff,
      ownerId: business.ownerId,
      createdAt: business.createdAt.toISOString(),
      updatedAt: business.updatedAt.toISOString(),
    };
  }
}

export const businessService = new BusinessService();
