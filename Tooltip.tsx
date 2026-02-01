
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: {
    meaning: string;
    pronunciation: string;
    type: string;
  };
  enabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, enabled = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!enabled) return <>{children}</>;

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseDown={() => setIsVisible(false)} // Close on click
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[150] pointer-events-none"
          >
            <div className="glass-card px-4 py-3 rounded-2xl min-w-[160px] shadow-2xl border border-teal-500/30">
               <div className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-1">{content.type}</div>
               <div className="text-white font-bold text-lg mb-0.5">{content.meaning}</div>
               <div className="text-light-400 text-xs italic opacity-70">/{content.pronunciation}/</div>
               {/* Arrow */}
               <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-navy-800 rotate-45 border-r border-b border-teal-500/30 -mt-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
