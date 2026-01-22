import { Router } from 'express';
import { authController } from '../modules/auth/auth.controller';

export const authRouter = Router();

authRouter.post('/signup', (req, res, next) => authController.signup(req, res, next));
authRouter.post('/login', (req, res, next) => authController.login(req, res, next));
authRouter.post('/refresh', (req, res, next) => authController.refreshToken(req, res, next));
