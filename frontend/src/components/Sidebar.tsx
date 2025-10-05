import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Code, 
  GitBranch, 
  Database,
  Home,
  Server,
  Layers
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    {
      path: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview and system status'
    },
    {
      path: '/chat',
      icon: MessageSquare,
      label: 'Chat Interface',
      description: 'Interactive AI chat with tools'
    },
    {
      path: '/playground',
      icon: Code,
      label: 'API Playground',
      description: 'Test API endpoints directly'
    },
    {
      path: '/flow',
      icon: GitBranch,
      label: 'Flow Visualization',
      description: 'See how AI routes to tools'
    },
    {
      path: '/data',
      icon: Database,
      label: 'Data Overview',
      description: 'Explore available data and examples'
    },
    {
      path: '/database',
      icon: Server,
      label: 'Database Viewer',
      description: 'View PostgreSQL data directly'
    },
    {
      path: '/architecture',
      icon: Layers,
      label: 'System Architecture',
      description: 'Interactive flow diagram and tech stack'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 border border-primary-200 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-600">
                    {item.description}
                  </div>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Home className="w-4 h-4" />
            <span>Enterprise LLM Orchestrator</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            v1.0.0 - AI + MCP Integration
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
