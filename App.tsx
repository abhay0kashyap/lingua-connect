
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Auth from './components/Auth';
import ChatInterface from './components/ChatInterface';
import Games from './components/Games';
import { Page, ChatConfig, UserStats } from './types';
import { Trophy, Star } from 'lucide-react';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatConfig, setChatConfig] = useState<ChatConfig | undefined>(undefined);
  
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('user-stats');
    return saved ? JSON.parse(saved) : { level: 1, xp: 0, streak: 3, accuracy: 85 };
  });

  const [toasts, setToasts] = useState<{id: number, xp: number}[]>([]);

  useEffect(() => {
    localStorage.setItem('user-stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleXpGain = (amount: number) => {
    const newXp = userStats.xp + amount;
    const nextLevelXp = userStats.level * 500;
    
    if (newXp >= nextLevelXp) {
       setUserStats(prev => ({ ...prev, level: prev.level + 1, xp: newXp - nextLevelXp }));
    } else {
       setUserStats(prev => ({ ...prev, xp: newXp }));
    }

    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, xp: amount }]);
    setTimeout(() => {
       setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Hero setPage={setCurrentPage} setChatConfig={setChatConfig} userStats={userStats} />;
      case Page.AUTH:
        return <Auth setPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />;
      case Page.LOBBY:
        return <ChatInterface initialConfig={chatConfig} userStats={userStats} onXpGain={handleXpGain} />;
      case Page.GAMES:
        return <Games setPage={setCurrentPage} userStats={userStats} onXpGain={handleXpGain} />;
      default:
        return <Hero setPage={setCurrentPage} setChatConfig={setChatConfig} userStats={userStats} />;
    }
  };

  return (
    // Global container handled by body style, but this wrapper ensures proper stacking
    <div className="min-h-screen text-light-100 selection:bg-primary-500/30 font-sans">
      <Navbar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        isLoggedIn={isLoggedIn} 
      />
      
      <main className="relative z-0">
        {renderPage()}
      </main>

      {/* PLAYFUL TOAST NOTIFICATIONS */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
         <AnimatePresence>
            {toasts.map(toast => (
               <motion.div 
                 key={toast.id}
                 initial={{ opacity: 0, y: 50, scale: 0.8 }}
                 animate={{ opacity: 1, y: 0, scale: 1, rotate: [0, -5, 5, 0] }}
                 exit={{ opacity: 0, x: 100, scale: 0.5 }}
                 className="bg-accent-yellow text-navy-900 px-6 py-4 rounded-[2rem] font-heading font-bold shadow-[0_10px_30px_rgba(250,204,21,0.4)] flex items-center gap-3 border-4 border-white transform origin-bottom-right"
               >
                  <div className="bg-white/20 p-2 rounded-full">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg leading-none">+{toast.xp} XP</span>
                    <span className="text-[10px] uppercase opacity-80 tracking-widest">Level {userStats.level}</span>
                  </div>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
