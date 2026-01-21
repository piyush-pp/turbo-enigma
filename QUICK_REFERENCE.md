# Quick Reference Guide

## 🚀 Quick Start Commands

### Local Development (No Docker)
```bash
# Setup
chmod +x setup-local.sh
./setup-local.sh

# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Browser: http://localhost:5173
```

### Docker Development
```bash
chmod +x setup-docker.sh
./setup-docker.sh

# Browser: http://localhost:5173
```

### Production Docker
```bash
cp .env.docker .env.prod
# Edit .env.prod with production values
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## 📝 Using Error Handling

### In Route Handlers
```typescript
import { asyncHandler } from '@/middlewares/errorHandler'
import { ValidationError, NotFoundError } from '@/utils/errors'

router.post('/items', asyncHandler(async (req, res) => {
  if (!req.body.name) {
    throw new ValidationError('Name is required')
  }

  const item = await findItem(req.body.id)
  if (!item) {
    throw new NotFoundError('Item not found')
  }

  res.json(item)
}))
```

## ✅ Using Validation

### Request Body Validation
```typescript
import { validate } from '@/middlewares/validation'

router.post('/users',
  validate([
    { field: 'email', type: 'email', required: true },
    { field: 'password', type: 'string', required: true, minLength: 8 },
    { field: 'age', type: 'number', min: 18, max: 120 },
  ]),
  asyncHandler(async (req, res) => {
    // req.body is already validated
    res.json(await createUser(req.body))
  })
)
```

### Query Parameter Validation
```typescript
import { validateQuery } from '@/middlewares/validation'

router.get('/items',
  validateQuery([
    { field: 'page', type: 'number', min: 1 },
    { field: 'limit', type: 'number', min: 1, max: 100 },
  ]),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    res.json(await getItems(page, limit))
  })
)
```

## 🐳 Docker Useful Commands

```bash
# View running services
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Execute command in service
docker-compose exec backend npm run prisma:studio
docker-compose exec backend npm run prisma:migrate

# Rebuild services
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and delete volumes (WARNING: deletes data)
docker-compose down -v

# Restart a service
docker-compose restart backend

# Rebuild specific service
docker-compose up -d --build backend
```

## 🔐 Environment Variables Needed

```bash
# Core
NODE_ENV=development|production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/appoint_db

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=  # For production

# JWT (IMPORTANT: Change in production!)
JWT_SECRET=your-super-secret-key-min-32-chars-change-this
JWT_REFRESH_SECRET=your-super-refresh-secret-key-min-32-chars

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password
EMAIL_FROM=noreply@appoint.local

# Logging
LOG_LEVEL=info|debug|warn|error
```

## 📊 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Details about what went wrong",
    "statusCode": 400
  },
  "timestamp": "2024-01-21T10:30:00.000Z",
  "path": "/api/endpoint",
  "requestId": "1234567890-abc123"
}
```

## 🎯 Common Error Types

| Error | Status | When |
|-------|--------|------|
| `ValidationError` | 400 | Input validation fails |
| `UnauthorizedError` | 401 | Auth fails or token invalid |
| `NotFoundError` | 404 | Resource doesn't exist |
| `ConflictError` | 409 | Resource conflict (duplicate) |
| `AppError` | 500 | Generic server error |

## 🔧 Troubleshooting Quick Fixes

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
kill -9 <PID>

# Check database connection
psql -U appoint_user -d appoint_db -c "SELECT 1"
```

### Database migration fails
```bash
# In backend directory
npm run prisma:migrate reset   # WARNING: Deletes all data
npm run prisma:migrate         # Run migrations
```

### Redis connection fails
```bash
# Check Redis is running
redis-cli ping  # Should return PONG

# For Docker
docker-compose exec redis redis-cli ping
```

### Docker port conflict
```bash
# Change ports in docker-compose.yml or .env
# Or stop conflicting container
docker-compose down
docker ps  # Check for other containers
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| `SETUP.md` | Detailed setup instructions |
| `ERROR_HANDLING.md` | Error handling and validation guide |
| `README-FULL.md` | Full project documentation |
| `IMPLEMENTATION_SUMMARY.md` | What was implemented |

## 🎯 Development Workflow

1. **Create endpoint** in `routes/`
2. **Add validation** using `validate()` middleware
3. **Wrap handler** with `asyncHandler()`
4. **Throw errors** using appropriate error classes
5. **Test** using curl or Postman
6. **Check logs** with `docker-compose logs -f`

## 📋 Pre-Deployment Checklist

- [ ] Update JWT secrets in .env.prod
- [ ] Set ALLOWED_ORIGINS to production domain
- [ ] Configure email provider (SMTP)
- [ ] Set NODE_ENV=production
- [ ] Test all endpoints
- [ ] Check logs for errors
- [ ] Verify database backups configured
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring
- [ ] Document deployment process

## 🚀 Deployment Script Template

```bash
#!/bin/bash

# Pull latest code
git pull

# Copy prod env
cp .env.prod.backup .env.prod

# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec -T backend npm run prisma:migrate

# Check health
docker-compose -f docker-compose.prod.yml ps

echo "Deployment complete!"
```

## 🔗 Useful URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/api/health
- Prisma Studio: http://localhost:5555 (when running npm run prisma:studio)

## 💡 Tips

1. **Always use asyncHandler** for async route handlers
2. **Add validation** early in development
3. **Use request IDs** for debugging
4. **Check logs** with `docker-compose logs -f`
5. **Save .env files** separately per environment
6. **Test Docker locally** before production
7. **Backup database** before migrations
8. **Monitor error rates** in production
9. **Keep secrets** out of version control
10. **Update dependencies** regularly

---

For more details, see the full documentation files.
