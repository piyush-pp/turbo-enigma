import { Request, Response, NextFunction } from 'express';
import { businessService } from './business.service';

export class BusinessController {
  async createBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const result = await businessService.createBusiness(req.user.userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId } = req.params;
      const result = await businessService.updateBusiness(req.user.userId, businessId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOwnerBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const businesses = await businessService.getOwnerBusinesses(req.user.userId);
      res.json(businesses);
    } catch (error) {
      next(error);
    }
  }

  async getBusinessBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const result = await businessService.getBusinessBySlug(slug);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const businessController = new BusinessController();
