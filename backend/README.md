# Appoint Backend

Backend server for the appointment management system built with Node.js, Express, and TypeScript.

## Project Structure

```
src/
  app.ts           # Express application setup
  server.ts        # Server bootstrap with graceful shutdown
  config/          # Configuration (environment variables)
  modules/         # Business logic modules
  routes/          # API route handlers
  middlewares/     # Custom middleware functions
  utils/           # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

1. Create `.env` file from `.env.example`
2. Install dependencies: `npm install`
3. Setup database: `npm run prisma:migrate`

### Development

- `npm run dev` - Start dev server with hot reload
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

### Build & Deploy

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

## API Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-20T10:00:00.000Z"
}
```
