#!/bin/bash

echo "🚀 Deploying Backend to Railway..."

# Copy backend files to railway-backend directory
cp -r src railway-backend/
cp -r prisma railway-backend/
cp package.json railway-backend/
cp pnpm-lock.yaml railway-backend/
cp tsconfig.json railway-backend/
cp .env railway-backend/ 2>/dev/null || echo "⚠️  .env file not found - you'll need to set environment variables in Railway"

# Copy railway config files
cp railway-backend/railway.json ./
cp railway-backend/nixpacks.toml ./

echo "✅ Backend files prepared for deployment"
echo "📝 Next steps:"
echo "1. Create a new Railway service for the backend"
echo "2. Connect it to this repository"
echo "3. Set environment variables (DATABASE_URL, OPENAI_API_KEY, etc.)"
echo "4. Deploy!"
