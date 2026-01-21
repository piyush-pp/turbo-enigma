#!/bin/bash

# Appoint Application - Quick Start Script
# Runs all services locally without Docker

set -e

echo "=========================================="
echo "Appoint - Local Development Setup"
echo "=========================================="

# Check prerequisites
echo ""
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
echo "✅ Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm $(npm --version)"

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found - you'll need PostgreSQL running separately"
else
    echo "✅ PostgreSQL client $(psql --version | awk '{print $3}')"
fi

if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis CLI not found - you'll need Redis running separately"
else
    echo "✅ Redis $(redis-cli --version)"
fi

# Backend setup
echo ""
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="

cd backend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Update .env with your database credentials"
fi

if [ ! -d node_modules ]; then
    echo "Installing backend dependencies..."
    npm install
fi

echo "Running Prisma migrations..."
npm run prisma:migrate || echo "⚠️  Migration failed - check database connection"

cd ..

# Frontend setup
echo ""
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="

cd frontend

if [ ! -d node_modules ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

cd ..

# Display instructions
echo ""
echo "=========================================="
echo "Setup Complete! ✅"
echo "=========================================="
echo ""
echo "Make sure these services are running:"
echo "  - PostgreSQL (default: localhost:5432)"
echo "  - Redis (default: localhost:6379)"
echo ""
echo "Start the services:"
echo ""
echo "  Terminal 1 - Backend:"
echo "    cd backend"
echo "    npm run dev"
echo ""
echo "  Terminal 2 - Frontend:"
echo "    cd frontend"
echo "    npm run dev"
echo ""
echo "Then open:"
echo "  - http://localhost:5173 (Frontend)"
echo "  - http://localhost:3000/api/health (Backend health check)"
echo ""
