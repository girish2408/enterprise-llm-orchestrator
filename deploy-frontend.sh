#!/bin/bash

echo "🚀 Deploying Frontend to Railway..."

# Build the frontend
echo "📦 Building frontend..."
cd frontend
pnpm build

# Go back to root
cd ..

# Copy Railway config files
echo "⚙️  Setting up Railway configuration..."
cp railway-frontend.json railway.json
cp nixpacks-frontend.toml nixpacks.toml

# Update Procfile for frontend
echo "📝 Updating Procfile..."
echo "web: cd frontend && pnpm start" > Procfile

# Commit and push changes
echo "📤 Committing and pushing changes..."
git add .
git commit -m "Deploy frontend to Railway as main service"
git push origin master

echo "✅ Frontend deployment configuration complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to your Railway dashboard"
echo "2. Your project should automatically redeploy"
echo "3. The frontend will now be served at your Railway URL"
echo "4. Backend API will be available at: https://web-production-37bd.up.railway.app/"
echo ""
echo "🔗 Your Railway URL will now show the frontend UI!"
