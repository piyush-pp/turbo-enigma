import { Request, Response, NextFunction } from 'express';
import { availabilityService } from './availability.service';
import { businessService } from '../business/business.service';

export class AvailabilityController {
  async setAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { staffId } = req.params;
      const { businessId } = req.query;

      if (!businessId || typeof businessId !== 'string') {
        res.status(400).json({ error: 'Bad Request', message: 'businessId query parameter required' });
        return;
      }

      // Verify owner of business
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage availability for this business',
        });
        return;
      }

      const result = await availabilityService.setAvailability(businessId, staffId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { staffId } = req.params;
      const { businessId } = req.query;

      if (!businessId || typeof businessId !== 'string') {
        res.status(400).json({ error: 'Bad Request', message: 'businessId query parameter required' });
        return;
      }

      // Verify owner of business
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to view availability for this business',
        });
        return;
      }

      const result = await availabilityService.getAvailability(businessId, staffId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const availabilityController = new AvailabilityController();
