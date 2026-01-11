
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageConfig, LanguageContextType } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to English Native, Spanish Target
  const [nativeLang, setNativeState] = useState<LanguageConfig>(SUPPORTED_LANGUAGES[0]); 
  const [targetLang, setTargetState] = useState<LanguageConfig>(SUPPORTED_LANGUAGES[1]);

  useEffect(() => {
    // Load from local storage
    const savedNative = localStorage.getItem('lc_native_code');
    const savedTarget = localStorage.getItem('lc_target_code');

    if (savedNative) {
      const found = SUPPORTED_LANGUAGES.find(l => l.code === savedNative);
      if (found) setNativeState(found);
    }
    if (savedTarget) {
      const found = SUPPORTED_LANGUAGES.find(l => l.code === savedTarget);
      if (found) setTargetState(found);
    }
  }, []);

  const setNativeLang = (code: string) => {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (found) {
      setNativeState(found);
      localStorage.setItem('lc_native_code', code);
      // Simulate API call
      console.log(`Updated Native Language to ${found.name}`);
    }
  };

  const setTargetLang = (code: string) => {
    const found = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (found) {
      setTargetState(found);
      localStorage.setItem('lc_target_code', code);
      // Simulate API call
      console.log(`Updated Target Language to ${found.name}`);
    }
  };

  return (
    <LanguageContext.Provider value={{
      nativeLang,
      targetLang,
      setNativeLang,
      setTargetLang,
      availableLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
