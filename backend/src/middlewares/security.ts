import { Request, Response, NextFunction } from 'express'
import { isDevelopment } from '../config/env'

/**
 * Security headers middleware
 * Sets various security-related HTTP headers
 */
export const securityHeaders = (_req: Request, res: Response, next: NextFunction): void => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')

  // Disable DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off')

  // Strict Transport Security (HTTPS)
  if (!isDevelopment) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Feature Policy / Permissions Policy
  res.setHeader(
    'Permissions-Policy',
    [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', ')
  )

  // Remove potentially dangerous headers
  res.removeHeader('X-Powered-By')

  next()
}

/**
 * Request ID middleware
 * Adds a unique request ID for tracking and logging
 */
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const id =
    req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  ;(req as any).requestId = id
  res.setHeader('X-Request-Id', id)
  next()
}

/**
 * No cache middleware for API responses
 */
export const noCache = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  next()
}

/**
 * Rate limiting headers
 */
export const rateLimitHeaders = (
  limit: number,
  windowMs: number
) => {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('X-RateLimit-Limit', limit.toString())
    res.setHeader('X-RateLimit-Window', Math.ceil(windowMs / 1000).toString())
    res.setHeader('X-RateLimit-Remaining', (limit - 1).toString())
    next()
  }
}
