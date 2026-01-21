# Appoint - Appointment Management System

A full-featured appointment booking system with owner dashboard and public booking interface.

## 🚀 Quick Start

### Local Development (Without Docker)

```bash
# 1. Run the setup script
chmod +x setup-local.sh
./setup-local.sh

# 2. Start backend (Terminal 1)
cd backend
npm run dev

# 3. Start frontend (Terminal 2)
cd frontend
npm run dev

# 4. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:3000/api/health
```

### Docker Development

```bash
# Run the setup script
chmod +x setup-docker.sh
./setup-docker.sh

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

## 📋 Prerequisites

### Local Development
- Node.js 20+
- npm 10+
- PostgreSQL 16+
- Redis 7+

### Docker
- Docker 24+
- Docker Compose 2.20+

## 🏗️ Architecture

```
appoint/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── app.ts                    # Express app configuration
│   │   ├── server.ts                 # Server entry point
│   │   ├── config/env.ts             # Environment configuration
│   │   ├── middlewares/
│   │   │   ├── errorHandler.ts       # Centralized error handling
│   │   │   ├── validation.ts         # Request validation
│   │   │   ├── cors.ts               # CORS configuration
│   │   │   ├── security.ts           # Security headers
│   │   │   └── auth.middleware.ts    # JWT authentication
│   │   ├── routes/                   # API routes
│   │   ├── modules/                  # Business logic modules
│   │   └── utils/                    # Utilities
│   ├── prisma/                       # Database schema
│   ├── .env.example                  # Environment variables template
│   ├── Dockerfile                    # Docker build configuration
│   └── package.json
│
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/                    # Page components
│   │   ├── components/               # Reusable components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utilities and helpers
│   │   └── App.tsx                   # Root component
│   ├── Dockerfile                    # Docker build configuration
│   ├── nginx.conf                    # Nginx configuration
│   └── package.json
│
├── docker-compose.yml                # Local development compose
├── docker-compose.prod.yml           # Production compose
├── .env.docker                       # Docker environment template
├── setup-local.sh                    # Local setup script
├── setup-docker.sh                   # Docker setup script
├── SETUP.md                          # Detailed setup guide
├── ERROR_HANDLING.md                 # Error handling & validation guide
└── README.md                         # This file
```

## 🔧 Configuration

### Environment Variables

Create `.env` file (copy from `.env.example`):

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/appoint_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend
FRONTEND_URL=http://localhost:5173

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

See [SETUP.md](SETUP.md) for detailed configuration options.

## 🎯 Features

### Owner Dashboard
- ✅ Authentication (login/signup)
- ✅ Business management
- ✅ Staff management (CRUD)
- ✅ Service management (CRUD)
- ✅ Booking management
- ✅ Protected routes

### Public Booking Interface
- ✅ Browse available services
- ✅ Select staff and time slots
- ✅ Create bookings
- ✅ Email confirmations

### Backend
- ✅ RESTful API
- ✅ JWT authentication
- ✅ Request validation
- ✅ Centralized error handling
- ✅ Security headers
- ✅ CORS configuration
- ✅ Database (PostgreSQL + Prisma)
- ✅ Job queue (Redis + BullMQ)
- ✅ Email notifications

## 📚 Documentation

- [SETUP.md](SETUP.md) - Complete setup and configuration guide
- [ERROR_HANDLING.md](ERROR_HANDLING.md) - Error handling and validation guide
- [API_REFERENCE.md](frontend/docs/API_REFERENCE.md) - API endpoints documentation

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Execute command in container
docker-compose exec backend npm run prisma:migrate

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View service health
docker-compose ps
```

## 📦 Technology Stack

### Backend
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL 16 + Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Job Queue**: Redis + BullMQ
- **Validation**: Custom middleware
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios (custom apiClient)
- **Icons**: Lucide React 0.294
- **Routing**: React Router 6.20

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **Process Manager**: dumb-init

## 🔐 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ CORS configuration
- ✅ Security headers (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Request validation
- ✅ Error handling (no sensitive data leakage)
- ✅ HTTPS ready (Strict-Transport-Security)
- ✅ Rate limiting headers
- ✅ Request ID tracking

## 🧪 Testing

### Backend
```bash
cd backend
npm run lint          # Run ESLint
npm run format        # Format code
npm run type-check    # TypeScript checking
```

### Frontend
```bash
cd frontend
npm run lint          # Run ESLint
npm run format        # Format code
npm run type-check    # TypeScript checking
```

## 🚢 Deployment

### Production with Docker

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Or with environment variables
export NODE_ENV=production
export JWT_SECRET=your-strong-secret-key
export JWT_REFRESH_SECRET=your-strong-refresh-key
# ... set other required variables

docker-compose -f docker-compose.prod.yml up -d
```

See [SETUP.md](SETUP.md) for detailed production deployment guide.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U appoint_user -d appoint_db -c "SELECT 1"

# Check DATABASE_URL in .env
echo $DATABASE_URL
```

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping  # Should return PONG

# Check REDIS_URL in .env
echo $REDIS_URL
```

### Port Already in Use
```bash
# Change ports in .env or docker-compose.yml
# Or kill existing process
lsof -i :3000    # Find process on port 3000
kill -9 <PID>    # Kill the process
```

### Docker Issues
```bash
# View logs
docker-compose logs -f service-name

# Restart services
docker-compose restart

# Rebuild images
docker-compose up -d --build

# Clean everything
docker-compose down -v
docker system prune -a
```

See [SETUP.md](SETUP.md) for more troubleshooting tips.

## 📝 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/refresh
POST /api/auth/logout
```

### Owner Business
```
GET /api/owner/business/:id
PUT /api/owner/business/:id
```

### Owner Staff
```
GET /api/owner/staff/:businessId
POST /api/owner/staff
PUT /api/owner/staff/:id
DELETE /api/owner/staff/:id
```

### Owner Services
```
GET /api/owner/services/:businessId
POST /api/owner/services
PUT /api/owner/services/:id
DELETE /api/owner/services/:id
```

### Bookings
```
GET /api/bookings/:businessId
POST /api/bookings
PATCH /api/bookings/:id/status
```

See [ERROR_HANDLING.md](ERROR_HANDLING.md) for error response formats.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## 📄 License

MIT License

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Last Updated**: January 2024
**Version**: 1.0.0
