import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Server, 
  Brain, 
  MessageSquare, 
  Zap, 
  Users, 
  Mail, 
  CreditCard,
  ArrowRight,
  ArrowDown,
  Code,
  GitBranch,
  Cloud,
  Shield,
  Cpu,
  Layers
} from 'lucide-react';

const Architecture: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Layers className="w-7 h-7 mr-3 text-primary-600" />
          System Architecture
        </h1>
        <p className="text-gray-600">
          Simple and clear overview of how the Enterprise LLM Orchestrator works
        </p>
      </motion.div>

      {/* Simple Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <GitBranch className="w-5 h-5 mr-2 text-blue-600" />
          System Flow
        </h2>
        
        <div className="space-y-8">
          {/* Step 1: User Input */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">User Input</h3>
              <p className="text-gray-600">User sends message through React frontend</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Code className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </div>

          {/* Step 2: API Processing */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">API Processing</h3>
              <p className="text-gray-600">Express.js validates request and routes to chat endpoint</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <Server className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </div>

          {/* Step 3: AI Processing */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">AI Processing</h3>
              <p className="text-gray-600">LangChain agent analyzes message and decides on tools</p>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </div>

          {/* Step 4: Tool Execution */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Tool Execution</h3>
              <p className="text-gray-600">MCP server calls appropriate enterprise tools</p>
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </div>

          {/* Step 5: Database Query */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              5
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Database Query</h3>
              <p className="text-gray-600">Tools fetch real data from PostgreSQL database</p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Database className="w-8 h-8 text-indigo-600" />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </div>

          {/* Step 6: Response */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              6
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">AI Response</h3>
              <p className="text-gray-600">OpenAI generates final response and sends back to user</p>
            </div>
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-8 h-8 text-pink-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Components */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-indigo-600" />
          System Components
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Frontend */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Frontend</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• React 18 + TypeScript</li>
              <li>• Tailwind CSS styling</li>
              <li>• Framer Motion animations</li>
              <li>• Vite build tool</li>
            </ul>
          </div>

          {/* Backend */}
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <Server className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Backend</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Node.js + Express.js</li>
              <li>• TypeScript</li>
              <li>• Pino logging</li>
              <li>• Helmet security</li>
            </ul>
          </div>

          {/* AI */}
          <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">AI</h3>
            </div>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>• LangChain framework</li>
              <li>• OpenAI GPT-4</li>
              <li>• GPT-3.5-turbo</li>
              <li>• MCP protocol</li>
            </ul>
          </div>

          {/* Database */}
          <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-indigo-900">Database</h3>
            </div>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li>• PostgreSQL</li>
              <li>• Prisma ORM</li>
              <li>• Entity models</li>
              <li>• Migrations</li>
            </ul>
          </div>

          {/* Tools */}
          <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3 mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-900">Tools</h3>
            </div>
            <ul className="space-y-2 text-sm text-orange-800">
              <li>• HR System</li>
              <li>• CRM System</li>
              <li>• Banking System</li>
              <li>• MCP Server</li>
            </ul>
          </div>

          {/* Security */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-800">
              <li>• API Key auth</li>
              <li>• Rate limiting</li>
              <li>• CORS protection</li>
              <li>• Input validation</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Data Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <ArrowRight className="w-5 h-5 mr-2 text-green-600" />
          Data Flow
        </h2>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div className="flex-1">
                <span className="font-medium">User sends message</span>
                <span className="text-gray-600 ml-2">→ React Frontend</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div className="flex-1">
                <span className="font-medium">API processes request</span>
                <span className="text-gray-600 ml-2">→ Express.js Backend</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div className="flex-1">
                <span className="font-medium">AI analyzes message</span>
                <span className="text-gray-600 ml-2">→ LangChain Agent</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <div className="flex-1">
                <span className="font-medium">Tools execute queries</span>
                <span className="text-gray-600 ml-2">→ MCP Server</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
              <div className="flex-1">
                <span className="font-medium">Database returns data</span>
                <span className="text-gray-600 ml-2">→ PostgreSQL</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">6</div>
              <div className="flex-1">
                <span className="font-medium">AI generates response</span>
                <span className="text-gray-600 ml-2">→ OpenAI GPT</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">7</div>
              <div className="flex-1">
                <span className="font-medium">Response sent to user</span>
                <span className="text-gray-600 ml-2">→ SSE Streaming</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
          Key Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Database-Driven</h3>
            <p className="text-sm text-gray-600">All data stored in PostgreSQL with real-time queries</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Brain className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">GPT-4 for conversations, GPT-3.5 for summaries</p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Tool Integration</h3>
            <p className="text-sm text-gray-600">MCP protocol for seamless enterprise tool integration</p>
          </div>
        </div>
      </motion.div>

      {/* Simple Architecture Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Layers className="w-5 h-5 mr-2 text-indigo-600" />
          Architecture Overview
        </h2>
        
        <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm">
          <pre className="text-gray-700 leading-relaxed">
{`┌─────────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>
      </motion.div>
    </div>
  );
};

export default Architecture;