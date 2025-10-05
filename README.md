# Enterprise LLM Orchestrator

A production-grade Node.js/TypeScript application that orchestrates enterprise tools (HR, CRM, Banking) through an AI agent using LangChain and MCP (Microservice Communication Protocol).

## 🚀 Features

- **AI-Powered Chat Interface**: GPT-4 powered conversational AI with tool integration
- **Enterprise Tool Integration**: HR, CRM, and Banking system adapters
- **Database-Driven**: PostgreSQL with Prisma ORM for data persistence
- **Real-time Streaming**: Server-Sent Events for live chat responses
- **Production Ready**: Docker support, Railway deployment, comprehensive logging
- **Modern Frontend**: React 18 + TypeScript with Tailwind CSS
- **Security**: API key authentication, rate limiting, CORS protection

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Enterprise LLM Orchestrator                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   React     │    │   Express   │    │ PostgreSQL  │          │
│  │  Frontend   │◄──►│    API      │◄──►│  Database   │          │
│  │ (Port 3000) │    │ (Port 8080) │    │ (Port 5432) │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│         │                   │                   │               │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   Tailwind  │    │  LangChain  │    │   Prisma    │          │
│  │     CSS     │    │    Agent     │    │     ORM     │          │
│  │             │    │             │    │             │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                            │                   │               │
│                            ▼                   ▼               │
│                    ┌─────────────┐    ┌─────────────┐          │
│                    │   MCP       │    │   Entity     │          │
│                    │  Server     │    │   Models     │          │
│                    │             │    │             │          │
│                    └─────────────┘    └─────────────┘          │
│                            │                                   │
│                            ▼                                   │
│                    ┌─────────────┐                             │
│                    │ Enterprise  │                             │
│                    │   Tools     │                             │
│                    │             │                             │
│                    │ HR │ CRM │  │                             │
│                    │    │    │   │                             │
│                    └─────────────┘                             │
│                            │                                   │
│                            ▼                                   │
│                    ┌─────────────┐                             │
│                    │   OpenAI    │                             │
│                    │   GPT-4     │                             │
│                    │ GPT-3.5-turbo│                            │
│                    └─────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Node.js 20+** with TypeScript
- **Express.js** for REST API and SSE streaming
- **LangChain** for AI agent orchestration
- **OpenAI GPT-4/3.5-turbo** for AI responses
- **PostgreSQL** with Prisma ORM
- **Pino** for structured logging
- **Zod** for schema validation

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Vite** for fast development
- **Lucide React** for icons

### DevOps
- **Railway** for cloud deployment
- **Docker** for containerization
- **Nixpacks** for build automation
- **GitHub** for version control

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and pnpm
- PostgreSQL database
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd enterprise-llm-orchestrator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

5. **Start the development servers**
   ```bash
   # Backend (Terminal 1)
   pnpm dev

   # Frontend (Terminal 2)
   cd frontend
   pnpm dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health Check: http://localhost:8080/healthz

## 🚀 Railway Deployment

### Automatic Deployment

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Add PostgreSQL Database**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Railway will provide the `DATABASE_URL`

3. **Configure Environment Variables**
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database
   OPENAI_API_KEY=your_openai_api_key_here
   API_KEY=your_secure_api_key_here
   NODE_ENV=production
   PORT=8080
   LOG_LEVEL=info
   ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Your app will be available at the provided Railway URL

### Manual Deployment

```bash
# Build the application
pnpm build

# Run database migrations
pnpm prisma migrate deploy

# Start the production server
pnpm start
```

## 🐳 Docker Deployment

```bash
# Build the Docker image
docker build -t enterprise-llm-orchestrator .

# Run with environment variables
docker run -p 8080:8080 \
  -e DATABASE_URL="postgresql://..." \
  -e OPENAI_API_KEY="your_key" \
  -e API_KEY="your_api_key" \
  enterprise-llm-orchestrator
```

## 📚 API Documentation

### Endpoints

- `GET /healthz` - Health check
- `GET /tools` - Available tools list
- `POST /chat` - Chat with AI agent
- `GET /data/stats` - Database statistics
- `GET /entities/*` - Entity data endpoints

### Authentication

All API endpoints require the `X-API-Key` header:
```bash
curl -H "X-API-Key: your_api_key" https://your-app.railway.app/tools
```

### Chat API

```bash
curl -X POST https://your-app.railway.app/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"message": "Get leave balance for employee 2345"}'
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `API_KEY` | API authentication key | Yes | - |
| `PORT` | Server port | No | 8080 |
| `NODE_ENV` | Environment | No | development |
| `LOG_LEVEL` | Logging level | No | info |

### Database Schema

The application uses the following main entities:
- **Thread**: Conversation threads
- **Message**: Individual messages in threads
- **ToolInvocation**: Tool call logs
- **Employee**: HR system data
- **Customer**: CRM system data
- **Account**: Banking system data

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm build
```

## 📊 Monitoring

### Health Checks
- **Endpoint**: `/healthz`
- **Response**: `{"status": "ok", "timestamp": "..."}`
- **Railway**: Automatically configured

### Logging
- **Structured JSON logs** in production
- **Pretty logs** in development
- **Log levels**: debug, info, warn, error

### Metrics
- **Request/response times**
- **Database query performance**
- **Tool invocation metrics**
- **Error rates and types**

## 🔒 Security

- **API Key Authentication**: All endpoints protected
- **Rate Limiting**: Prevents abuse
- **CORS Protection**: Configurable origins
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **Helmet**: Security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create a GitHub issue
- **Railway Support**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [discord.gg/railway](https://discord.gg/railway)

## 🎯 Roadmap

- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Webhook integrations
- [ ] Custom tool development
- [ ] Advanced AI features
- [ ] Mobile app support

---

**Built with ❤️ using Node.js, TypeScript, React, and Railway**