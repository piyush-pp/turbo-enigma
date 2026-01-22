# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_URL=http://localhost:3000/api

# Copy package files
COPY package*.json ./
COPY tsconfig.json tsconfig.node.json ./
COPY vite.config.ts ./
COPY tailwind.config.js postcss.config.js ./
COPY index.html ./
COPY src ./src/

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# Build the application with the build arg as environment variable
RUN VITE_API_URL=$VITE_API_URL npm run build

# Runtime stage - Using nginx for serving static files
FROM nginx:alpine

# Copy built artifacts from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
