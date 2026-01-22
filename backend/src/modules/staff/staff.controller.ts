import { Request, Response, NextFunction } from 'express';
import { staffService } from './staff.service';
import { businessService } from '../business/business.service';

export class StaffController {
  async getPublicBusinessStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { businessId } = req.params;

      const result = await staffService.getStaffByBusiness(businessId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId } = req.params;

      // Verify owner of business
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage staff for this business',
        });
        return;
      }

      const result = await staffService.createStaff(businessId, req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBusinessStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId } = req.params;

      // Verify owner of business
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to view staff for this business',
        });
        return;
      }

      const result = await staffService.getStaffByBusiness(businessId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId, staffId } = req.params;

      // Verify owner of business
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage staff for this business',
        });
        return;
      }

      const result = await staffService.updateStaff(businessId, staffId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const staffController = new StaffController();
