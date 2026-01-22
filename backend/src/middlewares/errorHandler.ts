import { Request, Response, NextFunction } from 'express'
import { isDevelopment, isProduction } from '../config/env'
import { AppError } from '../utils/errors'

export interface ErrorResponse {
  error: {
    code: string
    message: string
    statusCode: number
    stack?: string
  }
  timestamp: string
  path?: string
  requestId?: string
}

/**
 * Global error handling middleware
 * Catches all errors and returns standardized error responses
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString()
  const path = req.path
  const requestId = (req as any).requestId

  // Log error
  if (isProduction) {
    if (err instanceof AppError && err.statusCode < 500) {
      console.warn(`[${timestamp}] ${err.statusCode} ${err.name}: ${err.message}`)
    } else {
      console.error(`[${timestamp}] Unexpected error:`, err)
    }
  } else {
    console.error(`[${timestamp}] Error in ${req.method} ${path}:`, err)
  }

  // Handle known AppError
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: {
        code: err.name,
        message: err.message,
        statusCode: err.statusCode,
      },
      timestamp,
      path,
      ...(requestId && { requestId }),
    }

    if (isDevelopment && err.statusCode >= 500) {
      response.error.stack = err.stack
    }

    res.status(err.statusCode).json(response)
    return
  }

  // Handle specific error types
  if (err instanceof SyntaxError) {
    const response: ErrorResponse = {
      error: {
        code: 'SYNTAX_ERROR',
        message: 'Invalid JSON in request body',
        statusCode: 400,
      },
      timestamp,
      path,
      ...(requestId && { requestId }),
    }
    res.status(400).json(response)
    return
  }

  // Handle unexpected errors
  const statusCode = (err as any).statusCode || 500
  const response: ErrorResponse = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDevelopment ? err.message : 'An unexpected error occurred',
      statusCode,
    },
    timestamp,
    path,
    ...(requestId && { requestId }),
  }

  if (isDevelopment) {
    response.error.stack = err.stack
  }

  res.status(statusCode).json(response)
}

/**
 * Async error wrapper for route handlers
 * Catches errors in async route handlers and passes to error handler
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
