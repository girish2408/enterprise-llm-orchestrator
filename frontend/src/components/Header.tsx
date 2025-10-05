import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Activity, Clock, Database } from 'lucide-react';
import { HealthStatus } from '../types';

interface HeaderProps {
  healthStatus: HealthStatus | null;
}

const Header: React.FC<HeaderProps> = ({ healthStatus }) => {
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Enterprise LLM Orchestrator
            </h1>
            <p className="text-sm text-gray-500">
              AI-powered enterprise tools with MCP integration
            </p>
          </div>
        </motion.div>

        {healthStatus && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                healthStatus.ok ? 'bg-success-500' : 'bg-danger-500'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {healthStatus.ok ? 'System Healthy' : 'System Error'}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span className={healthStatus.db === 'ok' ? 'text-success-600' : 'text-danger-600'}>
                  {healthStatus.db === 'ok' ? 'DB Connected' : 'DB Error'}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatUptime(healthStatus.uptime || 0)}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>{formatMemory(healthStatus.memory?.rss || 0)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
