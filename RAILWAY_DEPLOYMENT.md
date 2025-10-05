# Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub
3. **OpenAI API Key**: Get your API key from [OpenAI](https://platform.openai.com)

## Deployment Steps

### 1. Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `enterprise-llm-orchestrator`

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Copy the `DATABASE_URL` from the database service

### 3. Configure Environment Variables

In your Railway project settings, add these environment variables:

```bash
# Database (Railway will provide this automatically)
DATABASE_URL=postgresql://username:password@host:port/database

# API Configuration
PORT=8080
NODE_ENV=production

# OpenAI API Key (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# API Security (REQUIRED - generate a secure random string)
API_KEY=your_secure_api_key_here

# Logging
LOG_LEVEL=info
```

### 4. Deploy

1. Railway will automatically detect the build configuration
2. The deployment will run:
   - `pnpm install`
   - `pnpm build`
   - `pnpm start`
3. Your app will be available at the provided Railway URL

### 5. Verify Deployment

1. Check the health endpoint: `https://your-app.railway.app/healthz`
2. Test the API: `https://your-app.railway.app/tools`
3. Access the frontend: `https://your-app.railway.app` (if serving static files)

## Configuration Files

The following files are configured for Railway deployment:

- `railway.json` - Railway deployment configuration
- `nixpacks.toml` - Build configuration
- `Procfile` - Process configuration
- `.railwayignore` - Files to ignore during deployment

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key for GPT models | Yes | - |
| `API_KEY` | API authentication key | Yes | - |
| `PORT` | Server port | No | 8080 |
| `NODE_ENV` | Environment | No | production |
| `LOG_LEVEL` | Logging level | No | info |

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure `DATABASE_URL` is set correctly
   - Check if PostgreSQL service is running

2. **OpenAI API Errors**
   - Verify `OPENAI_API_KEY` is valid
   - Check API key permissions and billing

3. **Build Failures**
   - Check Node.js version (requires >=20.0.0)
   - Ensure all dependencies are in package.json

4. **Health Check Failures**
   - Verify `/healthz` endpoint is accessible
   - Check application logs in Railway dashboard

### Logs

View application logs in Railway dashboard:
1. Go to your project
2. Click on the service
3. Go to "Deployments" tab
4. Click on the latest deployment
5. View logs in real-time

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Health check endpoint working
- [ ] API endpoints responding
- [ ] OpenAI integration working
- [ ] Logs are being generated
- [ ] Custom domain configured (optional)

## Scaling

Railway automatically handles:
- Load balancing
- Auto-scaling based on traffic
- Health checks and restarts
- SSL certificates

## Monitoring

Railway provides:
- Real-time logs
- Performance metrics
- Error tracking
- Uptime monitoring

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub Issues: Create an issue in your repository
