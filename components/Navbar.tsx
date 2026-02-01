
import React, { useState } from 'react';
import { Page } from '../types';
import { Globe, User, ChevronDown } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage, isLoggedIn }) => {
  const { play } = useSound();
  const { nativeLang, targetLang, setNativeLang, setTargetLang, availableLanguages } = useLanguage();
  const [showNativeDropdown, setShowNativeDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const handleNav = (page: Page) => {
    play('whoosh'); // Only on click
    setPage(page);
  };

  const LanguageSelector = ({ 
    label, 
    current, 
    onSelect, 
    isOpen, 
    setIsOpen 
  }: { 
    label: string, 
    current: any, 
    onSelect: (c: string) => void, 
    isOpen: boolean, 
    setIsOpen: (v: boolean) => void 
  }) => (
    <div className="relative">
      <button 
        onClick={() => { play('tick'); setIsOpen(!isOpen); }}
        className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold text-light-400 hidden lg:inline">{label}</span>
        <span className="text-xl">{current.flag}</span>
        <span className="text-sm font-bold text-white">{current.name}</span>
        <ChevronDown size={14} className={`text-light-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-56 max-h-80 overflow-y-auto bg-navy-900 border border-white/10 rounded-xl shadow-2xl p-2 z-[60] hide-scrollbar"
          >
            {availableLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => { play('tick'); onSelect(lang.code); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-teal-500/20 transition-colors ${current.code === lang.code ? 'bg-teal-500/10 border border-teal-500/30' : ''}`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{lang.name}</div>
                  <div className="text-xs text-light-400">{lang.nativeName}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 w-full h-[72px] bg-navy-900/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6 lg:px-12">
      
      {/* BRAND */}
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => handleNav(Page.HOME)}
      >
        <Globe className="w-8 h-8 text-teal-400 group-hover:rotate-12 transition-transform duration-500" />
        <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-white hidden sm:block">
          LinguaConnect
        </span>
      </div>

      {/* LANGUAGE CONTROLS (ALWAYS VISIBLE) */}
      <div className="flex items-center gap-2 lg:gap-4 mx-4">
        <LanguageSelector 
          label="I Speak" 
          current={nativeLang} 
          onSelect={setNativeLang} 
          isOpen={showNativeDropdown}
          setIsOpen={(v) => { setShowNativeDropdown(v); setShowTargetDropdown(false); }}
        />
        <div className="w-px h-8 bg-white/10"></div>
        <LanguageSelector 
          label="I Learn" 
          current={targetLang} 
          onSelect={setTargetLang} 
          isOpen={showTargetDropdown}
          setIsOpen={(v) => { setShowTargetDropdown(v); setShowNativeDropdown(false); }}
        />
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-light-400 mr-4">
          <button onClick={() => handleNav(Page.HOME)} className={`hover:text-teal-400 ${currentPage === Page.HOME ? 'text-teal-400' : ''}`}>Home</button>
          <button onClick={() => handleNav(Page.GAMES)} className={`hover:text-teal-400 ${currentPage === Page.GAMES ? 'text-teal-400' : ''}`}>Games</button>
        </div>
        
        {isLoggedIn ? (
          <button 
            onClick={() => handleNav(Page.LOBBY)}
            className="hidden md:block bg-teal-500 hover:bg-teal-400 text-navy-900 px-5 py-2 rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
            onClickCapture={() => play('tick')}
          >
            Lobby
          </button>
        ) : (
          <button 
            onClick={() => handleNav(Page.AUTH)}
            className="flex items-center gap-2 text-white hover:text-teal-400 transition-colors font-medium"
            onClickCapture={() => play('tick')}
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
