import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Zap, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { ChatMessage, Tool, ToolCall } from '../types';
import { apiClient } from '../utils/api';

interface ChatInterfaceProps {
  tools: Tool[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ tools }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle pre-filled examples from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const example = urlParams.get('example');
    if (example) {
      setInputMessage(decodeURIComponent(example));
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiClient.sendMessage(inputMessage.trim(), currentThreadId);
      setCurrentThreadId(response.threadId);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        toolCalls: response.toolCalls,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      await apiClient.sendStreamingMessage(
        inputMessage.trim(),
        currentThreadId,
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        },
        (response) => {
          setCurrentThreadId(response.threadId);
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
            toolCalls: response.toolCalls,
          };
          setMessages(prev => [...prev, assistantMessage]);
          setStreamingContent('');
        },
        (error) => {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Error: ${error.message}`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
          setStreamingContent('');
        }
      );
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const getToolIcon = (toolName: string) => {
    if (toolName.includes('hr')) return '👥';
    if (toolName.includes('crm')) return '🏢';
    if (toolName.includes('banking')) return '💰';
    return '🔧';
  };

  const getToolColor = (toolName: string) => {
    if (toolName.includes('hr')) return 'bg-blue-100 text-blue-800';
    if (toolName.includes('crm')) return 'bg-green-100 text-green-800';
    if (toolName.includes('banking')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const suggestedPrompts = [
    "Get leave balance for employee 2345",
    "Look up customer john.doe@acmecorp.com",
    "Portfolio summary for account 12345",
    "Show me the available tools"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Chat Interface
        </h1>
        <p className="text-gray-600">
          Interact with the Enterprise LLM Orchestrator. Try asking about HR, CRM, or Banking data.
        </p>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 mb-6">
                Ask me about HR, CRM, or Banking data using the available tools.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Try these examples:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(prompt)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-4 ${
                    message.role === 'user' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.toolCalls.map((toolCall) => (
                          <div
                            key={toolCall.id}
                            className="bg-white bg-opacity-20 rounded-lg p-3"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getToolIcon(toolCall.toolName)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getToolColor(toolCall.toolName)}`}>
                                {toolCall.toolName}
                              </span>
                              <span className="text-xs opacity-75">
                                {toolCall.durationMs}ms
                              </span>
                            </div>
                            
                            <div className="text-xs space-y-1">
                              <div>
                                <span className="font-medium">Input:</span>
                                <pre className="mt-1 bg-black bg-opacity-10 rounded p-2 text-xs overflow-x-auto">
                                  {JSON.stringify(toolCall.input, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <span className="font-medium">Output:</span>
                                <pre className="mt-1 bg-black bg-opacity-10 rounded p-2 text-xs overflow-x-auto">
                                  {JSON.stringify(toolCall.output, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-75 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Streaming Message */}
          {isStreaming && streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-lg p-4">
                  <div className="whitespace-pre-wrap">{streamingContent}</div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Loader className="w-3 h-3 animate-spin" />
                    <span className="text-xs opacity-75">Streaming...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading Indicator */}
          {isLoading && !isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about HR, CRM, or Banking data..."
              className="flex-1 input-field"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={handleStreamingMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              title="Streaming mode"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Press Enter to send, or use the lightning bolt for streaming</span>
            {currentThreadId && (
              <span>Thread: {currentThreadId.slice(0, 8)}...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
