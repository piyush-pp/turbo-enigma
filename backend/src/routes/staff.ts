import { Router, Request, Response, NextFunction } from 'express';
import { staffController } from '../modules/staff/staff.controller';
import { authMiddleware, authorizeRole } from '../middlewares/auth.middleware';

export const staffRouter = Router();

// Public route - get staff for a business (no auth required)
staffRouter.get(
  '/public/:businessId',
  (req: Request, res: Response, next: NextFunction) =>
    staffController.getPublicBusinessStaff(req, res, next)
);

// Protected routes require owner authentication
staffRouter.use(authMiddleware);
staffRouter.use(authorizeRole('OWNER'));

// Create staff for a business
staffRouter.post(
  '/:businessId',
  (req: Request, res: Response, next: NextFunction) =>
    staffController.createStaff(req, res, next)
);

// Get staff for a business (authenticated owner)
staffRouter.get(
  '/:businessId',
  (req: Request, res: Response, next: NextFunction) =>
    staffController.getBusinessStaff(req, res, next)
);

// Update staff (activate/deactivate)
staffRouter.patch(
  '/:businessId/:staffId',
  (req: Request, res: Response, next: NextFunction) =>
    staffController.updateStaff(req, res, next)
);
