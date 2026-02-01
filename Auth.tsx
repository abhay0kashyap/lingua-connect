import React, { useState } from 'react';
import { Page } from '../types';

interface AuthProps {
  setPage: (page: Page) => void;
  setIsLoggedIn: (val: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ setPage, setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    setIsLoggedIn(true);
    setPage(Page.LOBBY);
  };

  return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm-400/10 rounded-full blur-3xl" />

      <div className="glass-card w-full max-w-[420px] p-8 rounded-2xl relative z-10">
        <h2 className="text-3xl font-heading font-bold mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Join LinguaConnect'}
        </h2>
        <p className="text-light-400 text-center mb-8">
          {isLogin ? 'Continue your language journey' : 'Start speaking a new language today'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-light-400 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-400 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-light-400 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-400 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-light-400 mb-1">Learning Language</label>
              <select className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-teal-400 transition-colors">
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </div>
          )}

          <div className="flex items-start gap-3 mt-4">
            <input type="checkbox" required className="mt-1" />
            <p className="text-xs text-light-400 leading-relaxed">
              I consent to audio recording for speech-to-text processing and agree to the Terms of Service.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-400 text-navy-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-500/20 mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-light-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-teal-400 hover:text-white font-medium"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
