# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY swagger.json ./
COPY prisma ./prisma/
COPY src ./src/

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Force prisma to re-download engines for this platform
RUN rm -rf node_modules/.prisma && npx prisma generate

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-slim

WORKDIR /app

# Install dumb-init  and required libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files for production
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production --prefer-offline --no-audit

# Force Prisma to generate client with correct engines for this platform
RUN rm -rf node_modules/.prisma && npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist
COPY swagger.json ./

# Create non-root user
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --gid 1001 --disabled-password --gecos '' nodejs

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Set environment variables
ENV NODE_ENV=production

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]

# Start the application
CMD ["node", "dist/server.js"]

EXPOSE 3000
