import express, { Express, Request, Response, NextFunction } from 'express'
import swaggerUi from 'swagger-ui-express'
import { isDevelopment } from './config/env'
import { healthRouter } from './routes/health'
import { authRouter } from './routes/auth'
import { businessRouter } from './routes/business'
import { staffRouter } from './routes/staff'
import { serviceRouter } from './routes/service'
import { availabilityRouter } from './routes/availability'
import { slotsRouter } from './routes/slots'
import { bookingRouter } from './routes/booking'
import { modulesRouter } from './routes/modules'
import { errorHandler } from './middlewares/errorHandler'
import { corsMiddleware } from './middlewares/cors'
import { securityHeaders, requestId, noCache } from './middlewares/security'
import swaggerDocument from '../swagger.json'

const app: Express = express()

// Trust proxy
app.set('trust proxy', 1)

// Middlewares - Request ID
app.use(requestId)

// Middlewares - Security Headers
app.use(securityHeaders)

// Middlewares - CORS
app.use(corsMiddleware)

// Middlewares - Body Parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Middlewares - No Cache
app.use(noCache)

// Request logging middleware (development)
if (isDevelopment) {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const requestId = (req as any).requestId
    console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.path}`)
    next()
  })
}

// Health check endpoint (no auth required)
app.use('/api/health', healthRouter)

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Serve swagger.json
app.get('/swagger.json', (_req: Request, res: Response) => {
  res.json(swaggerDocument)
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/owner/business', businessRouter)
app.use('/api/owner/staff', staffRouter)
app.use('/api/public/services', serviceRouter)
app.use('/api/owner/services', serviceRouter)
app.use('/api/owner/availability', availabilityRouter)
app.use('/api/public/slots', slotsRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/owner/modules', modulesRouter)

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint does not exist',
      statusCode: 404,
    },
    timestamp: new Date().toISOString(),
  })
})

// Error handler (must be last)
app.use(errorHandler)

export default app
