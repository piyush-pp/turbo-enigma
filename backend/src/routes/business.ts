import { Router, Request, Response, NextFunction } from 'express';
import { businessController } from '../modules/business/business.controller';
import { authMiddleware, authorizeRole } from '../middlewares/auth.middleware';

export const businessRouter = Router();

// Public route - get business by slug (no auth required)
businessRouter.get('/public/:slug', (req: Request, res: Response, next: NextFunction) =>
  businessController.getBusinessBySlug(req, res, next)
);

// Protected routes (owner only)
businessRouter.use(authMiddleware);

// Create business
businessRouter.post(
  '/',
  authorizeRole('OWNER'),
  (req: Request, res: Response, next: NextFunction) =>
    businessController.createBusiness(req, res, next)
);

// Update business
businessRouter.put(
  '/:businessId',
  authorizeRole('OWNER'),
  (req: Request, res: Response, next: NextFunction) =>
    businessController.updateBusiness(req, res, next)
);

// Get owner's businesses
businessRouter.get(
  '/',
  authorizeRole('OWNER'),
  (req: Request, res: Response, next: NextFunction) =>
    businessController.getOwnerBusinesses(req, res, next)
);
