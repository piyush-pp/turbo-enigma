import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UnauthorizedError } from './errors';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateTokenPair = (payload: JwtPayload): TokenPair => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: '1d'
  });
  

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader) {
    throw new UnauthorizedError('Missing authorization header');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Invalid authorization header format');
  }

  return parts[1];
};
