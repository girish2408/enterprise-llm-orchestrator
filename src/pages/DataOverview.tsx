import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Copy, 
  Check,
  Database,
  Code,
  MessageSquare,
  Zap,
  ArrowRight,
  Play,
  BarChart3,
  Activity,
  Clock
} from 'lucide-react';
import { Tool } from '../types';

interface DataOverviewProps {
  tools: Tool[];
}

interface ExampleData {
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  examples: {
    input: string;
    output: any;
    description: string;
  }[];
}

interface ConversationStats {
  totalThreads: number;
  totalMessages: number;
  toolInvocations: number;
  recentThreads: Array<{
    id: string;
    title: string;
    lastMessage: string;
    updatedAt: string;
  }>;
}

interface ToolStats {
  toolUsage: Array<{
    toolName: string;
    count: number;
  }>;
}

interface RecentConversation {
  id: string;
  title: string;
  lastMessage: string;
  toolCalls: Array<{
    toolName: string;
    input: any;
    output: any;
    duration: number;
  }>;
  updatedAt: string;
}

const DataOverview: React.FC<DataOverviewProps> = ({ tools }) => {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [toolStats, setToolStats] = useState<ToolStats | null>(null);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from database
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/data/stats', {
        headers: {
          'x-api-key': 'test-api-key-12345'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchToolStats = async () => {
    try {
      const response = await fetch('/api/data/tool-stats', {
        headers: {
          'x-api-key': 'test-api-key-12345'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setToolStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch tool stats:', error);
    }
  };

  const fetchRecentConversations = async () => {
    try {
      const response = await fetch('/api/data/recent-conversations', {
        headers: {
          'x-api-key': 'test-api-key-12345'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch recent conversations:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchToolStats(),
        fetchRecentConversations()
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const exampleData: ExampleData[] = [
    {
      category: 'HR Tools',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      examples: [
        {
          input: 'Get leave balance for employee 2345',
          output: {
            employeeId: '2345',
            name: 'John Doe',
            leaveBalance: {
              annual: 20,
              sick: 10,
              personal: 5
            },
            lastUpdated: '2024-01-15'
          },
          description: 'Retrieve leave balance for employee 2345'
        },
        {
          input: 'Show me vacation days for employee 5678',
          output: {
            employeeId: '5678',
            name: 'Sarah Johnson',
            leaveBalance: {
              annual: 15,
              sick: 8,
              personal: 3
            },
            upcomingLeave: [
              { date: '2024-02-15', type: 'vacation', days: 5 }
            ]
          },
          description: 'Get detailed leave information for employee 5678'
        },
        {
          input: 'Leave balance for employee 9012',
          output: {
            employeeId: '9012',
            name: 'Mike Chen',
            leaveBalance: {
              annual: 25,
              sick: 12,
              personal: 8
            },
            lastUpdated: '2024-01-20'
          },
          description: 'Check leave balance for employee 9012'
        },
        {
          input: 'Employee 3456 vacation days',
          output: {
            employeeId: '3456',
            name: 'Emily Rodriguez',
            leaveBalance: {
              annual: 18,
              sick: 6,
              personal: 4
            },
            upcomingLeave: [
              { date: '2024-03-01', type: 'vacation', days: 3 },
              { date: '2024-03-15', type: 'sick', days: 1 }
            ]
          },
          description: 'View vacation information for employee 3456'
        }
      ]
    },
    {
      category: 'CRM Tools',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      examples: [
        {
          input: 'Look up customer john.doe@acmecorp.com',
          output: {
            customerId: 'CUST-001',
            name: 'John Doe',
            email: 'john.doe@acmecorp.com',
            company: 'Acme Corp',
            status: 'active',
            lastContact: '2024-01-10',
            totalOrders: 15,
            lifetimeValue: 45000
          },
          description: 'Find customer information by email john.doe@acmecorp.com'
        },
        {
          input: 'Customer details for sarah.johnson@techcorp.com',
          output: {
            customerId: 'CUST-002',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@techcorp.com',
            company: 'TechCorp',
            status: 'active',
            lastContact: '2024-01-15',
            totalOrders: 8,
            lifetimeValue: 25000
          },
          description: 'Get customer details for sarah.johnson@techcorp.com'
        },
        {
          input: 'Look up mike.chen@startup.io',
          output: {
            customerId: 'CUST-003',
            name: 'Mike Chen',
            email: 'mike.chen@startup.io',
            company: 'Startup.io',
            status: 'prospect',
            lastContact: '2024-01-20',
            totalOrders: 0,
            lifetimeValue: 0
          },
          description: 'Find information for mike.chen@startup.io'
        },
        {
          input: 'Get all customers from TechCorp',
          output: {
            company: 'TechCorp',
            customers: [
              { id: 'CUST-002', name: 'Sarah Johnson', email: 'sarah.johnson@techcorp.com', status: 'active' },
              { id: 'CUST-004', name: 'Bob Wilson', email: 'bob.wilson@techcorp.com', status: 'inactive' }
            ],
            totalContacts: 2
          },
          description: 'Retrieve all customers from TechCorp'
        },
        {
          input: 'Customer info for emily.rodriguez@enterprise.com',
          output: {
            customerId: 'CUST-005',
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@enterprise.com',
            company: 'Enterprise Corp',
            status: 'active',
            lastContact: '2024-01-18',
            totalOrders: 22,
            lifetimeValue: 75000
          },
          description: 'Get customer information for emily.rodriguez@enterprise.com'
        }
      ]
    },
    {
      category: 'Banking Tools',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      examples: [
        {
          input: 'Portfolio summary for account 12345',
          output: {
            accountId: '12345',
            accountType: 'investment',
            totalValue: 125000,
            currency: 'USD',
            holdings: [
              { symbol: 'AAPL', shares: 100, value: 15000, change: '+2.5%' },
              { symbol: 'GOOGL', shares: 50, value: 7500, change: '+1.2%' },
              { symbol: 'MSFT', shares: 75, value: 25000, change: '-0.8%' }
            ],
            performance: {
              daily: '+1.2%',
              monthly: '+5.8%',
              yearly: '+12.3%'
            }
          },
          description: 'Get portfolio summary for account 12345'
        },
        {
          input: 'Transaction history for account 67890',
          output: {
            accountId: '67890',
            accountType: 'checking',
            transactions: [
              { date: '2024-01-15', description: 'Salary Deposit', amount: 5000, type: 'credit' },
              { date: '2024-01-14', description: 'Rent Payment', amount: -1200, type: 'debit' },
              { date: '2024-01-13', description: 'Grocery Store', amount: -85.50, type: 'debit' }
            ],
            currentBalance: 8750.25
          },
          description: 'Get transaction history for account 67890'
        },
        {
          input: 'Portfolio for account 54321',
          output: {
            accountId: '54321',
            accountType: 'investment',
            totalValue: 85000,
            currency: 'USD',
            holdings: [
              { symbol: 'TSLA', shares: 25, value: 5000, change: '+3.2%' },
              { symbol: 'NVDA', shares: 30, value: 12000, change: '+1.8%' },
              { symbol: 'AMZN', shares: 40, value: 6000, change: '-1.5%' }
            ],
            performance: {
              daily: '+0.8%',
              monthly: '+3.2%',
              yearly: '+8.7%'
            }
          },
          description: 'View portfolio details for account 54321'
        },
        {
          input: 'Account balance for 98765',
          output: {
            accountId: '98765',
            accountType: 'savings',
            currentBalance: 25000.50,
            currency: 'USD',
            interestRate: 2.5,
            lastTransaction: '2024-01-20',
            monthlyDeposits: 2000
          },
          description: 'Check account balance for account 98765'
        },
        {
          input: 'Investment portfolio for account 11111',
          output: {
            accountId: '11111',
            accountType: 'retirement',
            totalValue: 200000,
            currency: 'USD',
            holdings: [
              { symbol: 'VTI', shares: 500, value: 50000, change: '+1.5%' },
              { symbol: 'VXUS', shares: 300, value: 30000, change: '+0.8%' },
              { symbol: 'BND', shares: 200, value: 20000, change: '+0.3%' }
            ],
            performance: {
              daily: '+0.9%',
              monthly: '+2.1%',
              yearly: '+6.8%'
            }
          },
          description: 'Get investment portfolio for account 11111'
        }
      ]
    }
  ];

  const copyToClipboard = async (text: string, exampleId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedExample(exampleId);
      setTimeout(() => setCopiedExample(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const handleExampleClick = (example: string) => {
    // Navigate to chat with the example pre-filled
    window.location.href = `/chat?example=${encodeURIComponent(example)}`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data Overview & Examples
        </h1>
        <p className="text-gray-600">
          Explore the available enterprise data and see example queries you can use in the chat interface.
        </p>
      </motion.div>

      {/* Quick Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Quick Reference - Available Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-blue-600 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              HR Employee IDs
            </h3>
            <div className="space-y-2">
              <div className="bg-blue-50 p-3 rounded-lg">
                <code className="text-sm font-mono">2345</code>
                <p className="text-xs text-gray-600 mt-1">John Doe</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <code className="text-sm font-mono">5678</code>
                <p className="text-xs text-gray-600 mt-1">Sarah Johnson</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <code className="text-sm font-mono">9012</code>
                <p className="text-xs text-gray-600 mt-1">Mike Chen</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <code className="text-sm font-mono">3456</code>
                <p className="text-xs text-gray-600 mt-1">Emily Rodriguez</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-green-600 mb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              CRM Customer Emails
            </h3>
            <div className="space-y-2">
              <div className="bg-green-50 p-3 rounded-lg">
                <code className="text-sm font-mono">john.doe@acmecorp.com</code>
                <p className="text-xs text-gray-600 mt-1">Acme Corp</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <code className="text-sm font-mono">sarah.johnson@techcorp.com</code>
                <p className="text-xs text-gray-600 mt-1">TechCorp</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <code className="text-sm font-mono">mike.chen@startup.io</code>
                <p className="text-xs text-gray-600 mt-1">Startup.io</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <code className="text-sm font-mono">emily.rodriguez@enterprise.com</code>
                <p className="text-xs text-gray-600 mt-1">Enterprise Corp</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-purple-600 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Banking Account IDs
            </h3>
            <div className="space-y-2">
              <div className="bg-purple-50 p-3 rounded-lg">
                <code className="text-sm font-mono">12345</code>
                <p className="text-xs text-gray-600 mt-1">Investment Portfolio</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <code className="text-sm font-mono">67890</code>
                <p className="text-xs text-gray-600 mt-1">Checking Account</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <code className="text-sm font-mono">54321</code>
                <p className="text-xs text-gray-600 mt-1">Investment Portfolio</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <code className="text-sm font-mono">98765</code>
                <p className="text-xs text-gray-600 mt-1">Savings Account</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <code className="text-sm font-mono">11111</code>
                <p className="text-xs text-gray-600 mt-1">Retirement Account</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 How to Use</h4>
          <p className="text-sm text-yellow-700">
            Copy any ID or email from above and use it in your chat queries. For example: 
            <code className="bg-yellow-100 px-2 py-1 rounded mx-1">"Get leave balance for employee 2345"</code> or 
            <code className="bg-yellow-100 px-2 py-1 rounded mx-1">"Look up customer john.doe@acmecorp.com"</code>
          </p>
        </div>
      </motion.div>

      {/* Real Database Data */}
      {!loading && stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Live Database Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Total Conversations</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalThreads}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Total Messages</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{stats.totalMessages}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Tool Calls</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{stats.toolInvocations}</div>
            </div>
          </div>

          {toolStats && toolStats.toolUsage.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Tool Usage Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {toolStats.toolUsage.map((tool, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-gray-700">{tool.toolName}</code>
                      <span className="text-sm font-semibold text-gray-900">{tool.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentConversations.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Recent Conversations
              </h3>
              <div className="space-y-3">
                {recentConversations.slice(0, 5).map((conversation) => (
                  <div key={conversation.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{conversation.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{conversation.lastMessage}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {conversation.toolCalls.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Tools used:</div>
                        <div className="flex flex-wrap gap-1">
                          {conversation.toolCalls.map((tool, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tool.toolName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Available Tools Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available MCP Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
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
                <strong>Required:</strong> {tool.inputSchema.required.join(', ')}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Example Data by Category */}
      {exampleData.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + categoryIndex * 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {category.category}
              </h2>
              <p className="text-sm text-gray-600">
                Example queries and expected responses
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {category.examples.map((example, exampleIndex) => (
              <motion.div
                key={exampleIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + categoryIndex * 0.1 + exampleIndex * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Example {exampleIndex + 1}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {example.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleExampleClick(example.input)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Try This</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Input Query</span>
                      </h4>
                      <button
                        onClick={() => copyToClipboard(example.input, `input-${categoryIndex}-${exampleIndex}`)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        {copiedExample === `input-${categoryIndex}-${exampleIndex}` ? (
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
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <code className="text-sm text-gray-800">
                        "{example.input}"
                      </code>
                    </div>
                  </div>

                  {/* Output */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span>Expected Output</span>
                      </h4>
                      <button
                        onClick={() => copyToClipboard(formatJson(example.output), `output-${categoryIndex}-${exampleIndex}`)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        {copiedExample === `output-${categoryIndex}-${exampleIndex}` ? (
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
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-3 max-h-64 overflow-y-auto">
                      <pre className="text-xs">
                        {formatJson(example.output)}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Quick Start Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Start Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Ask a Question</h3>
            <p className="text-sm text-gray-600">
              Use natural language to ask about HR, CRM, or Banking data
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. AI Routes to Tools</h3>
            <p className="text-sm text-gray-600">
              The AI automatically selects the right enterprise tool
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Get Results</h3>
            <p className="text-sm text-gray-600">
              Receive formatted data and insights from enterprise systems
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.href = '/chat'}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Start Chatting</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DataOverview;
