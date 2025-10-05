import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ChatInterface from './pages/ChatInterface';
import ApiPlayground from './pages/ApiPlayground';
import FlowVisualization from './pages/FlowVisualization';
import DataOverview from './pages/DataOverview';
import DatabaseViewer from './pages/DatabaseViewer';
import Architecture from './pages/Architecture';
import Sidebar from './components/Sidebar';

// Types
import { HealthStatus, Tool } from './types';

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check health status
        const health = await fetch('http://localhost:8080/healthz').then(res => res.json());
        setHealthStatus(health);

        // Load tools
        const toolsResponse = await fetch('http://localhost:8080/tools', {
          headers: { 'x-api-key': 'test-api-key-12345' }
        }).then(res => res.json());
        setTools(toolsResponse.tools);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Enterprise LLM Orchestrator
          </h2>
          <p className="text-gray-500">Initializing AI-powered enterprise tools...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header healthStatus={healthStatus} />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 ml-64">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6"
            >
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Dashboard 
                      healthStatus={healthStatus} 
                      tools={tools} 
                    />
                  } 
                />
                <Route 
                  path="/chat" 
                  element={<ChatInterface tools={tools} />} 
                />
                <Route 
                  path="/playground" 
                  element={<ApiPlayground tools={tools} />} 
                />
                <Route 
                  path="/flow" 
                  element={<FlowVisualization tools={tools} />} 
                />
                <Route 
                  path="/data" 
                  element={<DataOverview tools={tools} />} 
                />
                <Route 
                  path="/database" 
                  element={<DatabaseViewer />} 
                />
                <Route 
                  path="/architecture" 
                  element={<Architecture />} 
                />
              </Routes>
            </motion.div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
