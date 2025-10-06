# 🚀 Dual Deployment Guide: Frontend + Backend

## Current Status
- ✅ **Frontend**: Deployed to Railway (working)
- ❌ **Backend**: Not deployed (causing 404 errors)

## Solution: Deploy Backend as Separate Railway Service

### Step 1: Create Backend Railway Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `girish2408/enterprise-llm-orchestrator`
5. Name it: `enterprise-llm-backend`

### Step 2: Configure Backend Service

1. **Service Settings**:
   - **Root Directory**: `/` (root of repository)
   - **Build Command**: `pnpm install --frozen-lockfile && pnpm build`
   - **Start Command**: `pnpm start:prod`
   - **Port**: Railway will auto-detect

2. **Environment Variables** (Critical!):
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://username:password@host:port/database
   OPENAI_API_KEY=your-openai-key
   API_KEY=test-api-key-12345
   LOG_LEVEL=info
   ```

3. **Database**:
   - Add PostgreSQL service to the project
   - Copy the `DATABASE_URL` from PostgreSQL service
   - Run migrations: `pnpm prisma migrate deploy`

### Step 3: Update Frontend Configuration

Once backend is deployed, you'll get a new Railway URL like:
`https://enterprise-llm-backend-production-xxxx.up.railway.app`

Update the frontend to use this URL:

```bash
# Update frontend API configuration
echo "VITE_API_URL=https://enterprise-llm-backend-production-xxxx.up.railway.app" > frontend/.env.production
```

### Step 4: Redeploy Frontend

```bash
git add .
git commit -m "Update frontend to use backend Railway URL"
git push origin master
```

## Expected Result

- **Frontend**: `https://web-production-37bd.up.railway.app/` ✅
- **Backend**: `https://enterprise-llm-backend-production-xxxx.up.railway.app/` ✅
- **API Calls**: Frontend → Backend Railway URL ✅
- **Database**: PostgreSQL on Railway ✅

## Alternative: Single Service Deployment

If you prefer one service, we can modify the Dockerfile to serve both frontend and backend from the same container.

## Quick Commands

```bash
# Check current deployments
railway status

# Deploy backend (after creating service)
railway up

# Check logs
railway logs

# Set environment variables
railway variables set DATABASE_URL=your-db-url
railway variables set OPENAI_API_KEY=your-key
```
