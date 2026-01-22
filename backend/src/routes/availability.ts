import { Router, Request, Response, NextFunction } from 'express';
import { availabilityController } from '../modules/availability/availability.controller';
import { authMiddleware, authorizeRole } from '../middlewares/auth.middleware';

export const availabilityRouter = Router();

// All routes require owner authentication
availabilityRouter.use(authMiddleware);
availabilityRouter.use(authorizeRole('OWNER'));

// Set availability rules for a staff member
availabilityRouter.put(
  '/:staffId',
  (req: Request, res: Response, next: NextFunction) =>
    availabilityController.setAvailability(req, res, next)
);

// Get availability rules for a staff member
availabilityRouter.get(
  '/:staffId',
  (req: Request, res: Response, next: NextFunction) =>
    availabilityController.getAvailability(req, res, next)
);
