import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { getBusinessModules, toggleBusinessModule } from './modules.service';

const prisma = new PrismaClient();

export class ModulesController {
  /**
   * GET /owner/modules
   * Get all modules and their enabled/disabled state for the current business
   */
  async getModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      // Get businessId from query param or owner's first business
      let businessId = req.query.businessId as string | undefined;

      if (!businessId) {
        // Get owner's first business
        const business = await prisma.business.findFirst({
          where: { ownerId: req.user.userId, deletedAt: null },
        });

        if (!business) {
          res.status(404).json({ error: 'Not Found', message: 'No business found for this owner' });
          return;
        }

        businessId = business.id;
      } else {
        // Verify ownership
        const business = await prisma.business.findUnique({
          where: { id: businessId },
        });

        if (!business) {
          res.status(404).json({ error: 'Not Found', message: 'Business not found' });
          return;
        }

        if (business.ownerId !== req.user.userId) {
          res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to access this business' });
          return;
        }
      }

      const result = await getBusinessModules(businessId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /owner/modules/:key
   * Toggle a module on/off for the current business
   */
  async toggleModule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { key } = req.params;
      const { enabled } = req.body;

      if (typeof enabled !== 'boolean') {
        res.status(400).json({ error: 'Validation Error', message: 'enabled must be a boolean' });
        return;
      }

      // Get businessId from query param or owner's first business
      let businessId = req.query.businessId as string | undefined;

      if (!businessId) {
        // Get owner's first business
        const business = await prisma.business.findFirst({
          where: { ownerId: req.user.userId, deletedAt: null },
        });

        if (!business) {
          res.status(404).json({ error: 'Not Found', message: 'No business found for this owner' });
          return;
        }

        businessId = business.id;
      } else {
        // Verify ownership
        const business = await prisma.business.findUnique({
          where: { id: businessId },
        });

        if (!business) {
          res.status(404).json({ error: 'Not Found', message: 'Business not found' });
          return;
        }

        if (business.ownerId !== req.user.userId) {
          res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to access this business' });
          return;
        }
      }

      const result = await toggleBusinessModule(businessId, key, enabled);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const modulesController = new ModulesController();
