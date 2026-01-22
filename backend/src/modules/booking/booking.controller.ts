import { Request, Response, NextFunction } from 'express';
import { bookingService } from './booking.service';
import { businessService } from '../business/business.service';

export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await bookingService.createBooking(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { bookingId } = req.params;
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
          message: 'You do not have permission to manage bookings for this business',
        });
        return;
      }

      const result = await bookingService.updateBooking(businessId, bookingId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized', message: 'User context required' });
        return;
      }

      const { businessId } = req.query;
      const { status, staffId, startDateUtc, endDateUtc } = req.query;

      if (!businessId || typeof businessId !== 'string') {
        res.status(400).json({ error: 'Bad Request', message: 'businessId query parameter required' });
        return;
      }

      // Verify owner of business
      const business = await businessService.getBusinessById(businessId);
      if (business.ownerId !== req.user.userId) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to view bookings for this business',
        });
        return;
      }

      const result = await bookingService.getBookingsByBusiness(businessId, {
        status: typeof status === 'string' ? status : undefined,
        staffId: typeof staffId === 'string' ? staffId : undefined,
        startDateUtc: typeof startDateUtc === 'string' ? startDateUtc : undefined,
        endDateUtc: typeof endDateUtc === 'string' ? endDateUtc : undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
