#!/bin/bash

# Appoint Application - Docker Quick Start Script

set -e

echo "=========================================="
echo "Appoint - Docker Setup"
echo "=========================================="

# Check prerequisites
echo ""
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✅ Docker $(docker --version)"

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✅ Docker Compose $(docker-compose --version)"

# Create env file if not exists
echo ""
if [ ! -f .env ]; then
    echo "Creating .env from .env.docker..."
    cp .env.docker .env
    echo "⚠️  Update .env with your configuration"
fi

# Build and start services
echo ""
echo "=========================================="
echo "Building and starting services..."
echo "=========================================="

docker-compose up -d --build

# Wait for services to be healthy
echo ""
echo "Waiting for services to be healthy..."

echo -n "PostgreSQL... "
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U ${DB_USER:-appoint_user} &> /dev/null; then
        echo "✅"
        break
    fi
    echo -n "."
    sleep 1
    attempt=$((attempt + 1))
done

echo -n "Redis... "
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T redis redis-cli ping &> /dev/null; then
        echo "✅"
        break
    fi
    echo -n "."
    sleep 1
    attempt=$((attempt + 1))
done

# Run migrations
echo ""
echo "Running database migrations..."
docker-compose exec backend npm run prisma:migrate

# Display instructions
echo ""
echo "=========================================="
echo "Setup Complete! ✅"
echo "=========================================="
echo ""
echo "Access the application:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend API: http://localhost:3000"
echo "  - Database: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "Useful commands:"
echo ""
echo "  # View logs"
echo "  docker-compose logs -f"
echo ""
echo "  # Database UI"
echo "  docker-compose exec backend npm run prisma:studio"
echo ""
echo "  # Stop services"
echo "  docker-compose down"
echo ""
echo "  # Stop and remove volumes (WARNING: deletes data)"
echo "  docker-compose down -v"
echo ""
