import { Router, Request, Response, NextFunction } from 'express';
import { modulesController } from '../modules/modules/modules.controller';
import { authMiddleware, authorizeRole } from '../middlewares/auth.middleware';

export const modulesRouter = Router();

// Protected routes (owner only)
modulesRouter.use(authMiddleware);
modulesRouter.use(authorizeRole('OWNER'));

// Get all modules for the current business
modulesRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    modulesController.getModules(req, res, next)
);

// Toggle a module on/off
modulesRouter.patch(
  '/:key',
  (req: Request, res: Response, next: NextFunction) =>
    modulesController.toggleModule(req, res, next)
);
