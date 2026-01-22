import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../../utils/password';
import { generateTokenPair, verifyRefreshToken } from '../../utils/jwt';
import { ConflictError, UnauthorizedError, ValidationError } from '../../utils/errors';
import {
  SignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  AuthResponse,
  TokenRefreshResponse,
} from './auth.types';

const prisma = new PrismaClient();

export class AuthService {
  async signup(request: SignupRequest): Promise<AuthResponse> {
    // Validate input
    if (!request.email || !request.password || !request.name || !request.businessName) {
      throw new ValidationError('Missing required fields');
    }

    if (request.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: request.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create user and business in transaction
    const result = await prisma.$transaction(async (tx : any) => {
      const hashedPassword = hashPassword(request.password);

      const user = await tx.user.create({
        data: {
          email: request.email,
          name: request.name,
          password: hashedPassword,
          role: 'OWNER',
        },
      });

      const business = await tx.business.create({
        data: {
          name: request.businessName,
          ownerId: user.id,
          isSingleStaff: false,
          slug: request.businessName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-'),
        },
      });

      return { user, business };
    });

    const { accessToken, refreshToken } = generateTokenPair({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    return {
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      businessId: result.business.id,
      accessToken,
      refreshToken,
    };
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    // Validate input
    if (!request.email || !request.password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: request.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = verifyPassword(request.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Get user's primary business (if any)
    let businessId = '';
    if (user.role === 'OWNER') {
      const business = await prisma.business.findFirst({
        where: { ownerId: user.id },
      });
      businessId = business?.id || '';
    } else if (user.role === 'STAFF') {
      const staff = await prisma.staff.findFirst({
        where: { userId: user.id },
      });
      businessId = staff?.businessId || '';
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      businessId,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(request: RefreshTokenRequest): Promise<TokenRefreshResponse> {
    if (!request.refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Verify refresh token
    const payload = verifyRefreshToken(request.refreshToken);

    // Get user to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Generate new token pair
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}

export const authService = new AuthService();
