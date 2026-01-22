import { Router, Request, Response, NextFunction } from 'express';
import { modulesController } from '../modules/features/modules.controller';
import { authMiddleware, authorizeRole } from '../middlewares/auth.middleware';

export const modulesRouter = Router();

// All routes require authentication and OWNER role
modulesRouter.use(authMiddleware);

/**
 * GET /owner/modules
 * Get all modules with their enabled state for the business
 * Query params: businessId (required)
 */
modulesRouter.get(
    '/',
    authorizeRole('OWNER'),
    (req: Request, res: Response, next: NextFunction) =>
        modulesController.getModules(req, res, next)
);

/**
 * PATCH /owner/modules/:key
 * Update the enabled state of a specific module
 * Query params: businessId (required)
 * Body: { enabled: boolean }
 */
modulesRouter.patch(
    '/:key',
    authorizeRole('OWNER'),
    (req: Request, res: Response, next: NextFunction) =>
        modulesController.updateModule(req, res, next)
);
