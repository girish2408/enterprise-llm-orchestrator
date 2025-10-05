import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Bot, 
  Users, 
  Building2, 
  TrendingUp,
  Database,
  Code,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Tool, FlowStep } from '../types';

interface FlowVisualizationProps {
  tools: Tool[];
}

const FlowVisualization: React.FC<FlowVisualizationProps> = ({ tools }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<'hr' | 'crm' | 'banking' | null>(null);

  const flows = {
    hr: {
      name: 'HR Leave Balance Flow',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      steps: [
        {
          id: '1',
          title: 'User Input',
          description: 'User asks for leave balance',
          icon: MessageSquare,
          status: 'completed' as const
        },
        {
          id: '2',
          title: 'AI Processing',
          description: 'LangChain agent analyzes request',
          icon: Bot,
          status: 'completed' as const
        },
        {
          id: '3',
          title: 'Tool Selection',
          description: 'AI selects hr.getLeaveBalance tool',
          icon: Zap,
          status: 'completed' as const
        },
        {
          id: '4',
          title: 'MCP Call',
          description: 'Tool called via MCP protocol',
          icon: Code,
          status: 'active' as const
        },
        {
          id: '5',
          title: 'Data Retrieval',
          description: 'Mock HR system returns data',
          icon: Database,
          status: 'pending' as const
        },
        {
          id: '6',
          title: 'Response',
          description: 'AI formats and returns result',
          icon: CheckCircle,
          status: 'pending' as const
        }
      ]
    },
    crm: {
      name: 'CRM Customer Lookup Flow',
      icon: Building2,
      color: 'from-green-500 to-green-600',
      steps: [
        {
          id: '1',
          title: 'User Input',
          description: 'User requests customer info',
          icon: MessageSquare,
          status: 'completed' as const
        },
        {
          id: '2',
          title: 'AI Processing',
          description: 'LangChain agent analyzes request',
          icon: Bot,
          status: 'completed' as const
        },
        {
          id: '3',
          title: 'Tool Selection',
          description: 'AI selects crm.lookupCustomer tool',
          icon: Zap,
          status: 'completed' as const
        },
        {
          id: '4',
          title: 'MCP Call',
          description: 'Tool called via MCP protocol',
          icon: Code,
          status: 'active' as const
        },
        {
          id: '5',
          title: 'Data Retrieval',
          description: 'Mock CRM system returns data',
          icon: Database,
          status: 'pending' as const
        },
        {
          id: '6',
          title: 'Response',
          description: 'AI formats and returns result',
          icon: CheckCircle,
          status: 'pending' as const
        }
      ]
    },
    banking: {
      name: 'Banking Portfolio Flow',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      steps: [
        {
          id: '1',
          title: 'User Input',
          description: 'User asks for portfolio summary',
          icon: MessageSquare,
          status: 'completed' as const
        },
        {
          id: '2',
          title: 'AI Processing',
          description: 'LangChain agent analyzes request',
          icon: Bot,
          status: 'completed' as const
        },
        {
          id: '3',
          title: 'Tool Selection',
          description: 'AI selects banking.getPortfolioSummary tool',
          icon: Zap,
          status: 'completed' as const
        },
        {
          id: '4',
          title: 'MCP Call',
          description: 'Tool called via MCP protocol',
          icon: Code,
          status: 'active' as const
        },
        {
          id: '5',
          title: 'Data Retrieval',
          description: 'Mock banking system returns data',
          icon: Database,
          status: 'pending' as const
        },
        {
          id: '6',
          title: 'Response',
          description: 'AI formats and returns result',
          icon: CheckCircle,
          status: 'pending' as const
        }
      ]
    }
  };

  const architectureComponents = [
    {
      name: 'Frontend UI',
      description: 'React-based chat interface',
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Express API',
      description: 'REST API with SSE streaming',
      icon: Code,
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'LangChain Agent',
      description: 'AI agent with tool routing',
      icon: Bot,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'MCP Server',
      description: 'Model Context Protocol server',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: 'Enterprise Tools',
      description: 'HR, CRM, Banking mock adapters',
      icon: Database,
      color: 'bg-red-100 text-red-800'
    },
    {
      name: 'PostgreSQL',
      description: 'Conversation and tool call storage',
      icon: Database,
      color: 'bg-gray-100 text-gray-800'
    }
  ];

  useEffect(() => {
    if (selectedFlow && isAnimating) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const flow = flows[selectedFlow];
          if (prev >= flow.steps.length - 1) {
            setIsAnimating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [selectedFlow, isAnimating, flows]);

  const startFlowAnimation = (flowType: 'hr' | 'crm' | 'banking') => {
    setSelectedFlow(flowType);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const getStatusIcon = (status: FlowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'active':
        return <Clock className="w-5 h-5 text-primary-600 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status: FlowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success-50 border-success-200';
      case 'active':
        return 'bg-primary-50 border-primary-200';
      case 'error':
        return 'bg-danger-50 border-danger-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Flow Visualization
        </h1>
        <p className="text-gray-600">
          See how the AI orchestrates requests through the MCP tools and understand the complete flow.
        </p>
      </motion.div>

      {/* Flow Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Choose a Flow to Visualize
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(flows).map(([key, flow]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startFlowAnimation(key as 'hr' | 'crm' | 'banking')}
              disabled={isAnimating}
              className={`p-6 rounded-xl border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedFlow === key
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${flow.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                <flow.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {flow.name}
              </h3>
              <p className="text-sm text-gray-600">
                {flow.steps.length} steps in the process
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Flow Visualization */}
      {selectedFlow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${flows[selectedFlow].color} rounded-lg flex items-center justify-center`}>
                {React.createElement(flows[selectedFlow].icon, { className: "w-5 h-5 text-white" })}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {flows[selectedFlow].name}
                </h2>
                <p className="text-sm text-gray-600">
                  {isAnimating ? 'Animation in progress...' : 'Click to start animation'}
                </p>
              </div>
            </div>
            
            {isAnimating && (
              <div className="flex items-center space-x-2">
                <div className="spinner" />
                <span className="text-sm text-gray-600">Running...</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {flows[selectedFlow].steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: index <= currentStep ? 1.02 : 1
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3
                }}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                  index <= currentStep 
                    ? getStatusColor(step.status)
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(index <= currentStep ? step.status : 'pending')}
                </div>
                
                <div className="flex-shrink-0">
                  <step.icon className="w-8 h-8 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>

                {index < flows[selectedFlow].steps.length - 1 && (
                  <motion.div
                    animate={{ 
                      opacity: index < currentStep ? 1 : 0.3,
                      scale: index < currentStep ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {!isAnimating && (
            <div className="mt-6 text-center">
              <button
                onClick={() => startFlowAnimation(selectedFlow)}
                className="btn-primary"
              >
                Start Animation
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Architecture Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          System Architecture
        </h2>
        <p className="text-gray-600 mb-6">
          The Enterprise LLM Orchestrator consists of multiple components working together to provide AI-powered enterprise tools.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {architectureComponents.map((component, index) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3 mb-2">
                <component.icon className="w-6 h-6 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  {component.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {component.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* MCP Protocol Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Model Context Protocol (MCP)
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            MCP is a protocol that enables AI models to securely access external tools and data sources. 
            In this implementation, we use MCP to connect the LangChain agent with enterprise tools.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Key Benefits:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Standardized tool integration</li>
              <li>Secure communication protocol</li>
              <li>Tool discovery and schema validation</li>
              <li>Error handling and retry logic</li>
              <li>Performance monitoring and logging</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlowVisualization;
