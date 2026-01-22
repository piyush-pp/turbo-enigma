import { Request, Response, NextFunction } from 'express';
import { serviceService } from './service.service';
import { businessService } from '../business/business.service';

export class ServiceController {
  /**
   * GET /public/services?businessSlug=slug
   * Public endpoint - get active services for public booking
   */
  async getPublicServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessSlug } = req.query;

      if (!businessSlug || typeof businessSlug !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'businessSlug is required',
        });
        return;
      }

      const services = await serviceService.getPublicServicesBySlug(businessSlug);
      res.json({
        data: services,
        count: services.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /owner/services
   * Create a new service
   */
  async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage services for this business',
        });
        return;
      }

      // Check if services plugin is enabled
      const pluginEnabled = await serviceService.isServicesPluginEnabled(businessId);
      if (!pluginEnabled) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Services module is disabled for this business',
        });
        return;
      }

      const result = await serviceService.createService(businessId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /owner/services
   * Get all services for a business
   */
  async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to view services for this business',
        });
        return;
      }

      const result = await serviceService.getServicesByBusiness(businessId);
      res.json({
        data: result,
        count: result.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /owner/services/:serviceId
   * Get a specific service
   */
  async getService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId, serviceId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to view services for this business',
        });
        return;
      }

      const result = await serviceService.getServiceById(serviceId);

      // Verify service belongs to business
      if (result.businessId !== businessId) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Service not found',
        });
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /owner/services/:serviceId
   * Update service (full update)
   */
  async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId, serviceId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage services for this business',
        });
        return;
      }

      const result = await serviceService.updateService(businessId, serviceId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /owner/services/:serviceId/activate
   * Activate a service
   */
  async activateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId, serviceId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage services for this business',
        });
        return;
      }

      const result = await serviceService.activateService(businessId, serviceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /owner/services/:serviceId/deactivate
   * Deactivate a service
   */
  async deactivateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId, serviceId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage services for this business',
        });
        return;
      }

      const result = await serviceService.deactivateService(businessId, serviceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /owner/services/:serviceId
   * Soft delete a service
   */
  async deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId, serviceId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage services for this business',
        });
        return;
      }

      const result = await serviceService.deleteService(businessId, serviceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /owner/services/:serviceId/staff
   * Get staff members who can provide a service
   */
  async getStaffForService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId, serviceId } = req.params;

      // Verify ownership
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to view services for this business',
        });
        return;
      }

      const result = await serviceService.getStaffForService(serviceId, businessId);
      res.json({
        data: result,
        count: result.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const serviceController = new ServiceController();
