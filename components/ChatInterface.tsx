
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, MessageRole } from '../types';
import { generateBotResponse } from '../services/geminiService';
import { HUMAN_PERSONAS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../hooks/useSound';
import { Mic, Send, Volume2, Loader2, MoreHorizontal, CheckCheck } from 'lucide-react';

interface ChatInterfaceProps {
  initialConfig?: any;
  userStats: any;
  onXpGain: (xp: number) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userStats, onXpGain }) => {
  const { play } = useSound();
  const { nativeLang, targetLang } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [partner, setPartner] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Persona
  useEffect(() => {
    // Pick random persona matching target language flag if possible, else random
    // For simplicity, random from list
    const randomIdx = Math.floor(Math.random() * HUMAN_PERSONAS.length);
    const p = HUMAN_PERSONAS[randomIdx];
    
    const timer = setTimeout(() => {
      setPartner(p);
      setTimeout(() => {
         setIsTyping(true);
         setTimeout(() => {
            setIsTyping(false);
            const greeting = targetLang.nativeGreeting;
            addMessage({
              id: Date.now().toString(),
              role: MessageRole.BOT,
              text: `${greeting}! I'm ${p.name}.`,
              translatedText: `Hello! I'm ${p.name}.`,
              timestamp: Date.now(),
              language: targetLang.code
            });
         }, 1500);
      }, 800);
    }, 500);

    return () => clearTimeout(timer);
  }, [targetLang]); // Re-init if target language changes drastically? Maybe just let them switch.

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);

  const handleSend = async () => {
    if (!inputValue.trim() || !partner) return;
    play('whoosh');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: inputValue,
      timestamp: Date.now(),
      language: nativeLang.code // User typically types in native or target, we assume input is mixed
    };

    addMessage(userMsg);
    setInputValue('');
    
    setIsTyping(true);
    
    // Call AI
    const response = await generateBotResponse(
      messages, 
      userMsg.text, 
      targetLang.name, 
      nativeLang.name,
      partner.name
    );
    
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: MessageRole.BOT,
        text: response.text,           // Target Language
        translatedText: response.translatedText, // Native Language
        timestamp: Date.now(),
        language: targetLang.code
      });
      play('chime'); // Success sound on reply
      onXpGain(10);
    }, 1000 + Math.random() * 1000);
  };

  const playTTS = (text: string, locale: string) => {
    play('tick');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="pt-[72px] h-screen flex bg-navy-900 relative overflow-hidden">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col relative border-r border-white/5">
        
        {/* HEADER */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-navy-900/50 backdrop-blur-xl z-10">
           {partner ? (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex items-center gap-4">
                <div className="relative">
                   <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold border border-teal-500/30">
                     {partner.name[0]}
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-navy-900 rounded-full"></div>
                </div>
                <div>
                   <h3 className="font-bold text-white flex items-center gap-2">
                     Chatting with {partner.name} <span className="text-2xl">{targetLang.flag}</span>
                   </h3>
                   <span className="text-xs text-teal-400 font-medium">
                     Speak {nativeLang.name}, I'll reply in {targetLang.name}
                   </span>
                </div>
             </motion.div>
           ) : (
             <div className="flex items-center gap-4 opacity-50">
                <Loader2 size={24} className="animate-spin text-teal-400"/>
                <span className="text-sm font-medium">Connecting...</span>
             </div>
           )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] flex flex-col ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'} gap-2`}>
                   <div className={`p-6 rounded-[2rem] shadow-xl border border-white/5 ${
                     msg.role === MessageRole.USER 
                       ? 'bg-teal-500 text-navy-900 rounded-tr-none' 
                       : 'bg-navy-800 text-white rounded-tl-none'
                   }`}>
                      {/* PRIMARY TEXT (Target for Bot, Input for User) */}
                      <p className="text-xl leading-relaxed font-bold mb-2">{msg.text}</p>
                      
                      {/* TRANSLATION (Native) */}
                      {msg.translatedText && (
                         <div className={`pt-2 border-t ${msg.role === MessageRole.USER ? 'border-navy-900/20 text-navy-900/80' : 'border-white/10 text-light-400'} text-base italic`}>
                           {msg.translatedText}
                         </div>
                      )}
                      
                      {/* AUDIO CONTROLS */}
                      <div className="mt-4 flex gap-3">
                         <button 
                           onClick={() => playTTS(msg.text, msg.role === MessageRole.BOT ? targetLang.locale : nativeLang.locale)} 
                           className={`p-2 rounded-full transition-colors flex items-center gap-2 ${msg.role === MessageRole.USER ? 'bg-navy-900/10 hover:bg-navy-900/20' : 'bg-white/10 hover:bg-white/20'}`}
                         >
                           <Volume2 size={16}/>
                           <span className="text-[10px] font-bold uppercase">{msg.role === MessageRole.BOT ? targetLang.code : nativeLang.code}</span>
                         </button>
                         
                         {msg.translatedText && (
                            <button 
                              onClick={() => playTTS(msg.translatedText || "", nativeLang.locale)} 
                              className={`p-2 rounded-full transition-colors flex items-center gap-2 ${msg.role === MessageRole.USER ? 'bg-navy-900/10 hover:bg-navy-900/20' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                              <Volume2 size={16}/>
                              <span className="text-[10px] font-bold uppercase">{nativeLang.code}</span>
                            </button>
                         )}
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex justify-start">
                <div className="bg-navy-800 border border-white/5 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                   <div className="flex gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{animationDelay: `${i*0.2}s`}}></div>)}
                   </div>
                </div>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-8 bg-navy-900/50 backdrop-blur-xl border-t border-white/5">
           <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="flex-1 relative">
                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder={`Type in ${nativeLang.name} or ${targetLang.name}...`}
                   className="w-full h-14 bg-navy-800 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-teal-500 transition-all text-white placeholder-light-400/30"
                 />
                 <button onClick={handleSend} className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-teal-500 text-navy-900 flex items-center justify-center hover:scale-105 transition-transform">
                    <Send size={18}/>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
