# Local Development Setup

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (for containerized setup)

## Local Setup (Without Docker)

### 1. Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Update .env with your local configuration
# DATABASE_URL=postgresql://user:password@localhost:5432/appoint_db
# REDIS_URL=redis://localhost:6379

# Install dependencies
npm install

# Run Prisma migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend will be available at `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Database Setup

Make sure PostgreSQL is running:

```bash
# Create database if not exists
createdb appoint_db

# Run migrations
cd backend
npm run prisma:migrate
```

### 4. Redis Setup

Make sure Redis is running:

```bash
redis-server
```

Or using Homebrew on macOS:

```bash
brew services start redis
```

## Docker Setup

### Development with Docker Compose

```bash
# Copy environment file
cp .env.docker .env

# Build and start all services
docker-compose up -d

# Wait for services to be healthy
docker-compose ps

# Run database migrations
docker-compose exec backend npm run prisma:migrate

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Production with Docker Compose

```bash
# Copy and configure production environment
cp .env.docker .env.prod

# Update .env.prod with production values
# - Change JWT_SECRET and JWT_REFRESH_SECRET
# - Change ALLOWED_ORIGINS
# - Configure SMTP for emails
# - Set strong REDIS_PASSWORD

# Build and start all services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

Access the application:
- Frontend: http://localhost:80
- Backend API: http://localhost:3000

## Environment Variables

### Core Configuration

```
NODE_ENV=development|production|test
PORT=3000
```

### Database

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Redis

```
REDIS_URL=redis://host:6379
REDIS_PASSWORD=password  # for production
```

### JWT Configuration

```
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### CORS & Frontend

```
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

### Email Configuration

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password
EMAIL_FROM=noreply@appoint.local
```

### Logging

```
LOG_LEVEL=debug|info|warn|error
```

## Common Commands

### Backend

```bash
# Development
npm run dev

# Build
npm run build

# Start production build
npm start

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Database
npm run prisma:migrate
npm run prisma:studio
npm run prisma:generate

# Background worker
npm run dev:worker
npm start:worker
```

### Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Docker Commands

```bash
# Build specific service
docker-compose build backend
docker-compose build frontend

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs -f

# Execute command in running container
docker-compose exec backend npm run prisma:studio

# Rebuild services
docker-compose up -d --build

# Remove everything including volumes
docker-compose down -v

# Health check
docker-compose ps
```

## Troubleshooting

### Database Connection Issues

- Check PostgreSQL is running: `psql -U appoint_user -d appoint_db`
- Verify DATABASE_URL in .env
- Check port 5432 is not blocked

### Redis Connection Issues

- Check Redis is running: `redis-cli ping` (should return PONG)
- Verify REDIS_URL in .env
- Check port 6379 is not blocked

### Docker Issues

- **Port already in use**: Change ports in docker-compose.yml or `docker-compose down`
- **Permissions denied**: Try `sudo docker-compose` or add user to docker group
- **Services not healthy**: Check logs with `docker-compose logs`

### Frontend Not Loading

- Ensure backend is running: `curl http://localhost:3000/api/health`
- Check VITE_API_URL in frontend environment
- Check CORS configuration in backend

### Migration Issues

```bash
# Reset database (WARNING: deletes all data)
cd backend
npm run prisma:migrate reset

# Or manually in Docker
docker-compose exec backend npm run prisma:migrate reset
```

## Health Checks

All services have health checks configured:

```bash
# Check service health
docker-compose ps

# Manual health checks
curl http://localhost:3000/api/health           # Backend
curl http://localhost:5173                       # Frontend (if dev)
redis-cli ping                                   # Redis
psql -U appoint_user -d appoint_db -c "SELECT 1"  # PostgreSQL
```

## Performance & Optimization

### Development

- Use `npm run dev` for hot reloading
- Check logs regularly: `docker-compose logs -f`
- Use Prisma Studio for database inspection: `npm run prisma:studio`

### Production

- Set `NODE_ENV=production`
- Use strong JWT secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up email provider (Gmail, SendGrid, etc.)
- Monitor logs and performance
- Use Redis for caching and job queue
- Set up automated backups for PostgreSQL

## Next Steps

1. Configure environment variables in `.env`
2. Run database migrations
3. Start all services
4. Visit http://localhost:5173 (or configured port)
5. Create an owner account
6. Start managing appointments!
