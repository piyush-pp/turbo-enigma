import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload, extractTokenFromHeader } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'No user context' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Required role(s): ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};
