import { Request, Response, NextFunction } from 'express'
import { isDevelopment } from '../config/env'

export interface CorsOptions {
  origin?: string | string[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void)
  credentials?: boolean
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  maxAge?: number
}

/**
 * CORS configuration
 */
export const getCorsOptions = (): CorsOptions => {
  const allowedOrigins = isDevelopment
    ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000']
    : process.env.ALLOWED_ORIGINS?.split(',') || ['https://appoint.local']

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('CORS not allowed'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400, // 24 hours
  }
}

/**
 * CORS middleware
 */
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const options = getCorsOptions()
  const origin = req.headers.origin

  // Check if origin is allowed
  if (typeof options.origin === 'function') {
    ;(options.origin as Function)(origin, (err: Error | null, allowed?: boolean) => {
      if (err || !allowed) {
        // Still continue, just don't set CORS headers
        return next()
      }
      setCorsHeaders(res, origin, options)
      if (req.method === 'OPTIONS') {
        res.sendStatus(204)
      } else {
        next()
      }
    })
  } else if (Array.isArray(options.origin)) {
    if (options.origin.includes(origin!)) {
      setCorsHeaders(res, origin, options)
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
    } else {
      next()
    }
  } else {
    setCorsHeaders(res, origin, options)
    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
    } else {
      next()
    }
  }
}

/**
 * Set CORS headers on response
 */
const setCorsHeaders = (
  res: Response,
  origin: string | undefined,
  options: CorsOptions
): void => {
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  if (options.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  if (options.methods) {
    res.setHeader('Access-Control-Allow-Methods', options.methods.join(', '))
  }

  if (options.allowedHeaders) {
    res.setHeader('Access-Control-Allow-Headers', options.allowedHeaders.join(', '))
  }

  if (options.exposedHeaders) {
    res.setHeader('Access-Control-Expose-Headers', options.exposedHeaders.join(', '))
  }

  if (options.maxAge) {
    res.setHeader('Access-Control-Max-Age', options.maxAge.toString())
  }
}
