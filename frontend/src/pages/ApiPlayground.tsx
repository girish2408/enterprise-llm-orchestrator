import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Copy, 
  Check, 
  Code, 
  Globe, 
  Zap,
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Tool } from '../types';

interface ApiPlaygroundProps {
  tools: Tool[];
}

interface ApiEndpoint {
  name: string;
  description: string;
  method: 'GET' | 'POST';
  path: string;
  requiresAuth: boolean;
  example: string;
  curlExample: string;
}

const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ tools }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const endpoints: ApiEndpoint[] = [
    {
      name: 'Health Check',
      description: 'Check system health and database status',
      method: 'GET',
      path: '/healthz',
      requiresAuth: false,
      example: '{"ok": true, "db": "ok", "uptime": 3600}',
      curlExample: 'curl -s http://localhost:8080/healthz'
    },
    {
      name: 'List Tools',
      description: 'Get all available MCP tools',
      method: 'GET',
      path: '/tools',
      requiresAuth: true,
      example: '{"tools": [...], "count": 3}',
      curlExample: 'curl -H "x-api-key: test-api-key-12345" http://localhost:8080/tools'
    },
    {
      name: 'Chat (Non-streaming)',
      description: 'Send a message and get AI response with tool calls',
      method: 'POST',
      path: '/chat',
      requiresAuth: true,
      example: '{"threadId": "...", "message": "...", "toolCalls": [...]}',
      curlExample: `curl -H "x-api-key: test-api-key-12345" \\
     -H "Content-Type: application/json" \\
     -X POST "http://localhost:8080/chat" \\
     --data '{"message":"Get leave balance for employee 2345"}'`
    },
    {
      name: 'Chat (Streaming)',
      description: 'Send a message and get streaming AI response',
      method: 'POST',
      path: '/chat?stream=1',
      requiresAuth: true,
      example: 'Server-Sent Events stream',
      curlExample: `curl -N -H "x-api-key: test-api-key-12345" \\
     -H "Content-Type: application/json" \\
     -X POST "http://localhost:8080/chat?stream=1" \\
     --data '{"message":"Portfolio summary for account 12345"}'`
    }
  ];

  const testMessages = [
    {
      name: 'HR Tool Test',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      message: 'Get leave balance for employee 2345',
      description: 'Test the HR leave balance tool'
    },
    {
      name: 'CRM Tool Test',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      message: 'Look up customer john.doe@acmecorp.com',
      description: 'Test the CRM customer lookup tool'
    },
    {
      name: 'Banking Tool Test',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      message: 'Portfolio summary for account 12345',
      description: 'Test the banking portfolio tool'
    }
  ];

  const executeRequest = async (endpoint: ApiEndpoint, customMessage?: string) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const url = `/api${endpoint.path}`;
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...(endpoint.requiresAuth && { 'x-api-key': 'test-api-key-12345' })
        }
      };

      if (endpoint.method === 'POST') {
        options.body = JSON.stringify({ 
          message: customMessage || 'Hello, how are you?' 
        });
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data
      });
    } catch (error) {
      setResponse({
        status: 'ERROR',
        statusText: 'Network Error',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          API Playground
        </h1>
        <p className="text-gray-600">
          Test the Enterprise LLM Orchestrator API endpoints and see how they work with real data.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoints List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900">Available Endpoints</h2>
          
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card cursor-pointer transition-all duration-200 ${
                selectedEndpoint?.name === endpoint.name 
                  ? 'ring-2 ring-primary-500 bg-primary-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedEndpoint(endpoint)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-gray-600">
                      {endpoint.path}
                    </code>
                    {endpoint.requiresAuth && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        Auth Required
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {endpoint.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {endpoint.description}
                  </p>
                </div>
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Endpoint Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedEndpoint ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedEndpoint.name}
              </h2>

              {/* Quick Test Messages */}
              {selectedEndpoint.name.includes('Chat') && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Quick Test Messages</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {testMessages.map((test, index) => (
                      <motion.button
                        key={test.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => executeRequest(selectedEndpoint, test.message)}
                        disabled={isLoading}
                        className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${test.color} rounded-lg flex items-center justify-center`}>
                            <test.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-medium text-gray-900">{test.name}</h4>
                            <p className="text-sm text-gray-600">{test.description}</p>
                            <code className="text-xs text-gray-500 mt-1 block">
                              {test.message}
                            </code>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Execute Button */}
              <button
                onClick={() => executeRequest(selectedEndpoint)}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Execute Request</span>
                  </>
                )}
              </button>

              {/* cURL Example */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">cURL Example</h3>
                  <button
                    onClick={() => copyToClipboard(selectedEndpoint.curlExample, 'curl')}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {copied === 'curl' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
                  {selectedEndpoint.curlExample}
                </pre>
              </div>

              {/* Response */}
              {response && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Response</h3>
                    <button
                      onClick={() => copyToClipboard(formatJson(response), 'response')}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      {copied === 'response' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        response.status === 200 || response.status === '200'
                          ? 'bg-green-100 text-green-800'
                          : response.status === 'ERROR'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {response.status} {response.statusText}
                      </span>
                    </div>
                    <pre className="text-sm overflow-x-auto">
                      {formatJson(response.data)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select an Endpoint
              </h3>
              <p className="text-gray-500">
                Choose an endpoint from the list to see details and test it.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Available Tools Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available MCP Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <div key={tool.name} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">
                  {tool.name.includes('hr') ? '👥' : 
                   tool.name.includes('crm') ? '🏢' : 
                   tool.name.includes('banking') ? '💰' : '🔧'}
                </span>
                <code className="text-sm font-mono text-gray-700">
                  {tool.name}
                </code>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {tool.description}
              </p>
              <div className="text-xs text-gray-500">
                Required: {tool.inputSchema.required.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ApiPlayground;
