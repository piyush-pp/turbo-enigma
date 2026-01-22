import { Router, Request, Response, NextFunction } from 'express';
import { bookingController } from '../modules/booking/booking.controller';
import { authMiddleware, authorizeRole } from '../middlewares/auth.middleware';

export const bookingRouter = Router();

// Public route - create booking (no auth required)
bookingRouter.post(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    bookingController.createBooking(req, res, next)
);

// Owner routes - requires authentication
bookingRouter.use(authMiddleware);
bookingRouter.use(authorizeRole('OWNER'));

// Update booking (status change, cancellation, etc.)
bookingRouter.patch(
  '/:bookingId',
  (req: Request, res: Response, next: NextFunction) =>
    bookingController.updateBooking(req, res, next)
);

// Get bookings for a business
bookingRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    bookingController.getBookings(req, res, next)
);
