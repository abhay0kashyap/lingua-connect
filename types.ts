
export enum MessageRole {
  USER = 'user',
  BOT = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;           // The original text sent/received
  translatedText?: string; // The translation in the user's native language
  transliteration?: string; // Optional pronunciation guide
  timestamp: number;
  language: string;       // Code of the language this message is in
}

export interface User {
  id: string;
  email: string;
  name: string;
  nativeLanguage: string;
  learningLanguage: string;
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
  badges: string[];
}

export enum Page {
  HOME = 'home',
  AUTH = 'auth',
  LOBBY = 'lobby',
  GAMES = 'games'
}

export interface GameType {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  xpReward: number;
  tag?: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string; // e.g. "Deutsch"
  nativeGreeting: string;
  transliteration: string;
  englishTranslation: string;
  flag: string;
  locale: string; 
  voice?: string; // Preferred voice name if available
}

export interface UserPreferences {
  nativeLanguage: string;
  targetLanguage: string;
  autoConnectBot: boolean;
}

export interface ChatConfig {
  targetLanguage?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  accuracy: number;
  lastPlayedAt?: number;
}

export interface LanguageContextType {
  nativeLang: LanguageConfig;
  targetLang: LanguageConfig;
  setNativeLang: (code: string) => void;
  setTargetLang: (code: string) => void;
  availableLanguages: LanguageConfig[];
}
