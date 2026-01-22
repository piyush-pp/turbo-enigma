import { Router, Request, Response, NextFunction } from 'express';
import { slotsController } from '../modules/slots/slots.controller';

export const slotsRouter = Router();

// Public route - no authentication required
slotsRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    slotsController.getSlots(req, res, next)
);
