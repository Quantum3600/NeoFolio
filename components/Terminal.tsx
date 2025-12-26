import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_TERMINAL_LOGS, PORTFOLIO_DATA } from '../constants';
import { X, Minus, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '../hooks/useClickOutside';

const Terminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(INITIAL_TERMINAL_LOGS);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Default closed to show animation
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    let response = "";
    
    switch (cmd) {
      case 'help':
        response = "Available commands: about, projects, skills, contact, clear, date";
        break;
      case 'about':
        response = PORTFOLIO_DATA.about;
        break;
      case 'projects':
        response = PORTFOLIO_DATA.projects.map(p => `> ${p.title}: ${p.description}`).join('\n');
        break;
      case 'skills':
        response = PORTFOLIO_DATA.skills.map(s => `[${s.category}]: ${s.items.join(', ')}`).join('\n');
        break;
      case 'contact':
        response = `GitHub: ${PORTFOLIO_DATA.socials.github}\nLinkedIn: ${PORTFOLIO_DATA.socials.linkedin}`;
        break;
      case 'clear':
        setLogs([]);
        setInput('');
        return;
      case 'date':
        response = new Date().toLocaleString();
        break;
      case '':
        return;
      default:
        response = `Command not found: ${cmd}. Type 'help' for assistance.`;
    }

    setLogs(prev => [...prev, `user@neo:~$ ${input}`, response]);
    setInput('');
  };

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.button 
          key="terminal-btn"
          layoutId="terminal-container"
          onClick={() => setIsOpen(true)}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 bg-black text-white p-3 border-4 border-neo-primary font-mono shadow-neo hover:shadow-neo-hover transition-all z-40"
        >
          `{'>'}`_ TERM
        </motion.button>
      ) : (
        <motion.div 
          key="terminal-window"
          layoutId="terminal-container"
          ref={containerRef}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 left-4 w-[90vw] md:w-[500px] h-[300px] bg-black border-4 border-black shadow-neo-deep z-40 flex flex-col font-mono"
        >
          {/* Title Bar */}
          <div className="bg-neo-primary p-2 flex justify-between items-center border-b-4 border-black">
            <span className="font-bold text-black text-sm">TRISHIT_OS_TERM_v1</span>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1"><Minus size={16}/></button>
              <button className="hover:bg-white/20 p-1"><Square size={14}/></button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-red-500 hover:text-white p-1"><X size={16}/></button>
            </div>
          </div>

          {/* Content */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-green-500 font-bold text-sm space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap">{log}</div>
            ))}
            
            <form onSubmit={handleCommand} className="flex gap-2">
              <span className="text-white">user@neo:~$</span>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
                autoFocus
              />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terminal;