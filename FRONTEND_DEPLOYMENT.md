# Frontend Deployment Guide

## 🚀 Deploy Frontend to Railway

Your backend is already deployed at: https://web-production-37bd.up.railway.app/

### Option 1: Deploy Frontend as Separate Railway Service (Recommended)

1. **Create a new Railway project for the frontend:**
   ```bash
   cd frontend
   railway login
   railway init
   ```

2. **Set environment variable:**
   ```bash
   railway variables set VITE_API_URL=https://web-production-37bd.up.railway.app
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

### Option 2: Deploy to Vercel (Alternative)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Set environment variable in Vercel dashboard:**
   - `VITE_API_URL` = `https://web-production-37bd.up.railway.app`

### Option 3: Deploy to Netlify (Alternative)

1. **Build the frontend:**
   ```bash
   cd frontend
   pnpm build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Set environment variable: `VITE_API_URL` = `https://web-production-37bd.up.railway.app`

## 🔗 Access Your Application

Once deployed, you'll have:
- **Backend API**: https://web-production-37bd.up.railway.app/
- **Frontend UI**: [Your frontend URL]

## 🛠️ Local Development

To run locally with the Railway backend:

```bash
# Backend (already running)
cd /path/to/enterprise-llm-orchestrator
pnpm dev

# Frontend
cd frontend
VITE_API_URL=https://web-production-37bd.up.railway.app pnpm dev
```

## 📝 Notes

- The frontend is configured to use the Railway backend URL
- All API calls will be proxied to your Railway backend
- The frontend includes all the features: Chat, Data Overview, Database Viewer, Architecture, etc.
