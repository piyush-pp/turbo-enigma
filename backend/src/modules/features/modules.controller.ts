import { Request, Response, NextFunction } from 'express';
import { modulesService } from './modules.service';
import { UpdateModuleRequest } from './modules.types';

export class ModulesController {
    /**
     * GET /owner/modules
     * Get all modules with their enabled state for the current business
     */
    async getModules(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
                return;
            }

            // Get businessId from query or user context
            const businessId = req.query.businessId as string;

            if (!businessId) {
                res.status(400).json({ error: 'Bad Request', message: 'businessId is required' });
                return;
            }

            const modules = await modulesService.getBusinessModules(businessId);
            res.json({ modules });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /owner/modules/:key
     * Update the enabled state of a specific module
     */
    async updateModule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
                return;
            }

            const { key } = req.params;
            const businessId = req.query.businessId as string;
            const { enabled } = req.body as UpdateModuleRequest;

            if (!businessId) {
                res.status(400).json({ error: 'Bad Request', message: 'businessId is required' });
                return;
            }

            if (typeof enabled !== 'boolean') {
                res.status(400).json({ error: 'Bad Request', message: 'enabled must be a boolean' });
                return;
            }

            const module = await modulesService.updateModuleState(
                req.user.userId,
                businessId,
                key,
                enabled
            );

            res.json({ module });
        } catch (error) {
            next(error);
        }
    }
}

export const modulesController = new ModulesController();
