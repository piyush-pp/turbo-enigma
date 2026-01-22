import { Router, Request, Response, NextFunction } from 'express';
import { serviceController } from '../modules/service/service.controller';
import { authMiddleware, authorizeRole } from '../middlewares/auth.middleware';

export const serviceRouter = Router();

// ========================================
// PUBLIC ROUTES (NO AUTH REQUIRED)
// ========================================

/**
 * GET /api/public/services?businessSlug=slug
 * Get active services for public booking page
 */
serviceRouter.get(
  '/public/list',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.getPublicServices(req, res, next)
);

// ========================================
// PROTECTED ROUTES (OWNER AUTH REQUIRED)
// ========================================

serviceRouter.use(authMiddleware);
serviceRouter.use(authorizeRole('OWNER'));

/**
 * POST /api/owner/services/:businessId
 * Create a new service
 */
serviceRouter.post(
  '/:businessId',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.createService(req, res, next)
);

/**
 * GET /api/owner/services/:businessId
 * Get all services for a business
 */
serviceRouter.get(
  '/:businessId',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.getServices(req, res, next)
);

/**
 * GET /api/owner/services/:businessId/:serviceId
 * Get a specific service
 */
serviceRouter.get(
  '/:businessId/:serviceId',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.getService(req, res, next)
);

/**
 * PUT /api/owner/services/:businessId/:serviceId
 * Update service details
 */
serviceRouter.put(
  '/:businessId/:serviceId',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.updateService(req, res, next)
);

/**
 * PATCH /api/owner/services/:businessId/:serviceId/activate
 * Activate a service (make it bookable)
 */
serviceRouter.patch(
  '/:businessId/:serviceId/activate',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.activateService(req, res, next)
);

/**
 * PATCH /api/owner/services/:businessId/:serviceId/deactivate
 * Deactivate a service (prevent bookings)
 */
serviceRouter.patch(
  '/:businessId/:serviceId/deactivate',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.deactivateService(req, res, next)
);

/**
 * DELETE /api/owner/services/:businessId/:serviceId
 * Soft delete a service
 */
serviceRouter.delete(
  '/:businessId/:serviceId',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.deleteService(req, res, next)
);

/**
 * GET /api/owner/services/:businessId/:serviceId/staff
 * Get staff members who can provide a service
 */
serviceRouter.get(
  '/:businessId/:serviceId/staff',
  (req: Request, res: Response, next: NextFunction) =>
    serviceController.getStaffForService(req, res, next)
);
