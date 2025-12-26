import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hey! I'm the AI assistant for this portfolio. Ask me anything about Trishit's code, skills, or projects.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateChatResponse(userMsg.text, messages);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText || "Something went wrong.", timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-btn"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-neo-accent border-4 border-black shadow-neo flex items-center justify-center z-50 hover:bg-yellow-300 transition-colors"
          >
            <Bot size={32} className="text-black" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            ref={containerRef}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[500px] bg-white border-4 border-black shadow-neo-deep z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-neo-secondary p-4 flex justify-between items-center border-b-4 border-black">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 border-2 border-black rounded-full">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-black hover:text-white transition-colors p-1 rounded border-2 border-transparent hover:border-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-neo-bg">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      msg.role === 'user' 
                        ? 'bg-neo-primary text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                        : 'bg-white text-black rounded-tr-lg rounded-bl-lg rounded-br-lg'
                    }`}
                  >
                    <p className="text-sm md:text-base font-medium">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-tr-lg rounded-bl-lg rounded-br-lg">
                    <div className="flex gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-2 h-2 bg-black rounded-full"/>
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-2 h-2 bg-black rounded-full"/>
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-2 h-2 bg-black rounded-full"/>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t-4 border-black flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about my projects..."
                className="flex-1 border-2 border-black p-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-primary"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-black text-white p-2 border-2 border-transparent hover:bg-neo-primary hover:text-black hover:border-black transition-all disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;