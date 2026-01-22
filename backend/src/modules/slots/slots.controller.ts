import { Request, Response, NextFunction } from 'express';
import { slotsService } from './slots.service';

export class SlotsController {
  async getSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessSlug, serviceId, staffId, date, timezone } = req.query;

      // Validate required parameters
      if (!businessSlug || typeof businessSlug !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'businessSlug query parameter is required',
        });
        return;
      }

      if (!serviceId || typeof serviceId !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'serviceId query parameter is required',
        });
        return;
      }

      if (!date || typeof date !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'date query parameter is required (YYYY-MM-DD format)',
        });
        return;
      }

      const result = await slotsService.generateSlots({
        businessSlug,
        serviceId,
        staffId: staffId ? (typeof staffId === 'string' ? staffId : undefined) : undefined,
        date,
        timezone: timezone ? (typeof timezone === 'string' ? timezone : undefined) : undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const slotsController = new SlotsController();
