import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Zap,
  CheckCircle,
  Clock,
  Database,
  Activity
} from 'lucide-react';
import { HealthStatus, Tool } from '../types';

interface DashboardProps {
  healthStatus: HealthStatus | null;
  tools: Tool[];
}

const Dashboard: React.FC<DashboardProps> = ({ healthStatus, tools }) => {
  const stats = [
    {
      title: 'Available Tools',
      value: tools.length.toString(),
      icon: Zap,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      description: 'MCP tools ready'
    },
    {
      title: 'System Status',
      value: healthStatus?.ok ? 'Healthy' : 'Error',
      icon: healthStatus?.ok ? CheckCircle : Activity,
      color: healthStatus?.ok ? 'text-success-600' : 'text-danger-600',
      bgColor: healthStatus?.ok ? 'bg-success-50' : 'bg-danger-50',
      description: healthStatus?.db === 'ok' ? 'All systems operational' : 'Database issues detected'
    },
    {
      title: 'Uptime',
      value: healthStatus ? formatUptime(healthStatus.uptime) : 'N/A',
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
      description: 'System runtime'
    },
    {
      title: 'Memory Usage',
      value: healthStatus?.memory?.rss ? formatMemory(healthStatus.memory.rss) : 'N/A',
      icon: Database,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      description: 'Current memory consumption'
    }
  ];

  const toolCategories = [
    {
      name: 'HR Tools',
      icon: Users,
      count: tools.filter(t => t.name.startsWith('hr')).length,
      color: 'from-blue-500 to-blue-600',
      description: 'Employee management and leave tracking'
    },
    {
      name: 'CRM Tools',
      icon: Building2,
      count: tools.filter(t => t.name.startsWith('crm')).length,
      color: 'from-green-500 to-green-600',
      description: 'Customer relationship management'
    },
    {
      name: 'Banking Tools',
      icon: TrendingUp,
      count: tools.filter(t => t.name.startsWith('banking')).length,
      color: 'from-purple-500 to-purple-600',
      description: 'Financial data and portfolio management'
    }
  ];

  function formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  function formatMemory(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enterprise LLM Orchestrator
        </h1>
        <p className="text-gray-600">
          AI-powered enterprise assistant with MCP tool integration for HR, CRM, and Banking operations.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tool Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Tool Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toolCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => window.location.href = '/chat'}
              className="tool-card cursor-pointer hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {category.count}
                </span>
                <span className="text-sm text-gray-500">tools</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/chat'}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Test HR Tool</span>
          </button>
          <button 
            onClick={() => window.location.href = '/chat'}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Test CRM Tool</span>
          </button>
          <button 
            onClick={() => window.location.href = '/chat'}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Test Banking Tool</span>
          </button>
        </div>
      </motion.div>

      {/* System Information */}
      {healthStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Last Updated:</span>
              <span className="ml-2 text-gray-900">
                {new Date(healthStatus.timestamp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Database Status:</span>
              <span className={`ml-2 ${
                healthStatus.db === 'ok' ? 'text-success-600' : 'text-danger-600'
              }`}>
                {healthStatus.db === 'ok' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Heap Memory:</span>
              <span className="ml-2 text-gray-900">
                {formatMemory(healthStatus.memory?.heapUsed || 0)} / {formatMemory(healthStatus.memory?.heapTotal || 0)}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">External Memory:</span>
              <span className="ml-2 text-gray-900">
                {formatMemory(healthStatus.memory?.external || 0)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
