import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError } from '../../utils/errors';
import {
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceResponse,
  ServiceListResponse,
  PublicServiceResponse,
} from './service.types';

const prisma = new PrismaClient();

export class ServiceService {
  async createService(
    businessId: string,
    request: CreateServiceRequest
  ): Promise<ServiceResponse> {
    // Validate business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Validate input
    if (!request.name || request.durationMinutes === undefined) {
      throw new ValidationError('Name and durationMinutes are required');
    }

    if (request.durationMinutes <= 0) {
      throw new ValidationError('Duration must be greater than 0');
    }

    if (request.price !== undefined && request.price < 0) {
      throw new ValidationError('Price must be non-negative');
    }

    // Validate staff IDs if provided
    if (request.staffIds && request.staffIds.length > 0) {
      const staffMembers = await prisma.staff.findMany({
        where: {
          id: { in: request.staffIds },
          businessId,
          deletedAt: null,
        },
      });

      if (staffMembers.length !== request.staffIds.length) {
        throw new ValidationError('One or more staff members not found in this business');
      }
    }

    // Determine currency from business or use provided value
    const currency = request.currency || (business as any).currency || 'USD';

    // Create service with staff assignments
    const service = await prisma.service.create({
      data: {
        name: request.name,
        description: request.description,
        durationMinutes: request.durationMinutes,
        price: request.price,
        currency,
        imageUrl: request.imageUrl,
        businessId,
        isActive: true,
        isPluginEnabled: true,
        ...(request.staffIds && request.staffIds.length > 0 && {
          staff: {
            create: request.staffIds.map((staffId) => ({
              staffId,
            })),
          },
        }),
      },
      include: {
        staff: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapToResponse(service);
  }

  async getServicesByBusiness(businessId: string): Promise<ServiceListResponse[]> {
    // Verify business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Get all services (including inactive ones for owner view)
    const services = await prisma.service.findMany({
      where: { businessId, deletedAt: null },
      include: {
        _count: {
          select: { staff: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return services.map((s) => ({
      id: s.id,
      businessId: s.businessId,
      name: s.name,
      description: s.description,
      durationMinutes: s.durationMinutes,
      price: s.price,
      currency: s.currency,
      imageUrl: s.imageUrl,
      isActive: s.isActive,
      staffCount: s._count.staff,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  async updateService(
    businessId: string,
    serviceId: string,
    request: UpdateServiceRequest
  ): Promise<ServiceResponse> {
    // Find service and verify it belongs to business
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    // Validate input
    if (request.durationMinutes !== undefined && request.durationMinutes <= 0) {
      throw new ValidationError('Duration must be greater than 0');
    }

    if (request.price !== undefined && request.price < 0) {
      throw new ValidationError('Price must be non-negative');
    }

    // Validate staff IDs if provided
    if (request.staffIds !== undefined) {
      if (request.staffIds.length > 0) {
        const staffMembers = await prisma.staff.findMany({
          where: {
            id: { in: request.staffIds },
            businessId,
            deletedAt: null,
          },
        });

        if (staffMembers.length !== request.staffIds.length) {
          throw new ValidationError('One or more staff members not found in this business');
        }
      }
    }

    // Update service in transaction
    await prisma.$transaction(async (tx) => {
      await tx.service.update({
        where: { id: serviceId },
        data: {
          ...(request.name && { name: request.name }),
          ...(request.description !== undefined && { description: request.description }),
          ...(request.price !== undefined && { price: request.price }),
          ...(request.currency && { currency: request.currency }),
          ...(request.durationMinutes && { durationMinutes: request.durationMinutes }),
          ...(request.imageUrl !== undefined && { imageUrl: request.imageUrl }),
        },
      });

      // Update staff assignments if provided
      if (request.staffIds !== undefined) {
        // Delete existing assignments
        await tx.staffService.deleteMany({
          where: { serviceId },
        });

        // Create new assignments
        if (request.staffIds.length > 0) {
          await tx.staffService.createMany({
            data: request.staffIds.map((staffId) => ({
              staffId,
              serviceId,
            })),
          });
        }
      }
    });

    // Fetch updated service with staff
    const updatedService = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        staff: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapToResponse(updatedService!);
  }

  async disableService(businessId: string, serviceId: string): Promise<ServiceResponse> {
    // Find service and verify it belongs to business
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
      include: {
        staff: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapToResponse(updatedService);
  }

  async activateService(businessId: string, serviceId: string): Promise<ServiceResponse> {
    // Find service and verify it belongs to business
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: true },
      include: {
        staff: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapToResponse(updatedService);
  }

  async enableService(businessId: string, serviceId: string): Promise<ServiceResponse> {
    return this.activateService(businessId, serviceId);
  }

  async deactivateService(businessId: string, serviceId: string): Promise<ServiceResponse> {
    return this.disableService(businessId, serviceId);
  }

  async getServiceById(serviceId: string): Promise<ServiceResponse> {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        staff: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    return this.mapToResponse(service);
  }

  async deleteService(businessId: string, serviceId: string): Promise<ServiceResponse> {
    // Find service and verify it belongs to business
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    const deletedService = await prisma.service.update({
      where: { id: serviceId },
      data: { deletedAt: new Date() },
      include: {
        staff: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.mapToResponse(deletedService);
  }

  /**
   * Get public services for a business by slug
   * - Only active services
   * - Not deleted
   * - Services plugin enabled
   * - Business allows services
   */
  async getPublicServicesBySlug(slug: string): Promise<PublicServiceResponse[]> {
    const business = await prisma.business.findUnique({
      where: { slug, deletedAt: null },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Check if services plugin is enabled at business level
    const features = (business as any).features || {};
    const servicesEnabled = features.services?.enabled !== false;

    if (!servicesEnabled) {
      // Return empty array if services plugin is disabled
      return [];
    }

    const services = await prisma.service.findMany({
      where: {
        businessId: business.id,
        isActive: true,
        isPluginEnabled: true,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        durationMinutes: true,
        price: true,
        currency: true,
        imageUrl: true,
      },
      orderBy: { name: 'asc' },
    });

    return services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      durationMinutes: s.durationMinutes,
      price: s.price,
      currency: s.currency,
      imageUrl: s.imageUrl,
    }));
  }

  /**
   * Check if services plugin is enabled for a business
   */
  async isServicesPluginEnabled(businessId: string): Promise<boolean> {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    const features = (business as any).features || {};
    return features.services?.enabled !== false;
  }

  /**
   * Get services assigned to a specific staff member
   */
  async getServicesByStaff(staffId: string, businessId: string): Promise<ServiceResponse[]> {
    const staffMember = await prisma.staff.findFirst({
      where: { id: staffId, businessId, deletedAt: null },
    });

    if (!staffMember) {
      throw new NotFoundError('Staff member not found');
    }

    const services = await prisma.service.findMany({
      where: {
        businessId,
        isActive: true,
        deletedAt: null,
        staff: {
          some: { staffId },
        },
      },
      include: {
        staff: {
          include: {
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return services.map((s) => this.mapToResponse(s));
  }

  /**
   * Get all staff members who can provide a service
   */
  async getStaffForService(serviceId: string, businessId: string) {
    const service = await prisma.service.findFirst({
      where: { id: serviceId, businessId, deletedAt: null },
    });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    const staffMembers = await prisma.staff.findMany({
      where: {
        businessId,
        deletedAt: null,
        services: {
          some: { serviceId },
        },
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

    return staffMembers.map((s) => ({
      id: s.id,
      userId: s.userId,
      email: s.user.email,
      name: s.user.name,
    }));
  }

  private mapToResponse(service: any): ServiceResponse {
    return {
      id: service.id,
      businessId: service.businessId,
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      price: service.price,
      currency: service.currency,
      imageUrl: service.imageUrl,
      isActive: service.isActive,
      isPluginEnabled: service.isPluginEnabled,
      staff: service.staff?.map((ss: any) => ({
        id: ss.staff.id,
        userId: ss.staff.userId,
        email: ss.staff.user.email,
        name: ss.staff.user.name,
      })),
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };
  }
}

export const serviceService = new ServiceService();
