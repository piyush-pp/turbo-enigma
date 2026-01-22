import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fvgfftgftydvhghgfhgfhgfhgf',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'gfhgytgtgvtrvhthgfhgfhgfhg',
    expiry: process.env.JWT_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@appoint.local',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
}

export const isDevelopment = config.nodeEnv === 'development'
export const isProduction = config.nodeEnv === 'production'
export const isTest = config.nodeEnv === 'test'

