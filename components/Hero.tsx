
import React, { useState } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { AVAILABLE_GAMES } from '../constants';
import Globe3D from './Globe3D';
import { Page, UserStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  MessageCircle, Gamepad2, Zap, ArrowRight, Star, 
  Heart, Sparkles, Smile, Mic, Volume2, Globe as GlobeIcon,
  Phone, Mail, Linkedin, Github, User, Check
} from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface HeroProps {
  setPage: (page: Page) => void;
  setChatConfig?: (config: any) => void;
  userStats: UserStats;
}

// --- ANIMATION VARIANTS (BOUNCY & FUN) ---
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 } 
  },
  hover: { 
    y: -10, 
    scale: 1.02,
    transition: { type: "spring", bounce: 0.6, duration: 0.3 }
  }
};

const textVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", bounce: 0.3, duration: 0.8 } 
  }
};

const Hero: React.FC<HeroProps> = ({ setPage, userStats }) => {
  const { play } = useSound();
  const { nativeLang, targetLang, setNativeLang, setTargetLang, availableLanguages } = useLanguage();
  const { scrollYProgress } = useScroll();

  // Parallax for globe
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Language Selector Modal State (Simplified for Hero)
  const [activeSelector, setActiveSelector] = useState<'native' | 'target' | null>(null);

  // --- HELPER COMPONENTS ---
  const LangPill = ({ type, lang, onClick }: { type: 'I SPEAK' | 'I WANT TO LEARN', lang: any, onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => { play('tick'); onClick(); }}
      className="flex flex-col items-start gap-1 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 backdrop-blur-md hover:bg-white/20 transition-colors w-full sm:w-auto min-w-[160px]"
    >
      <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest opacity-80">{type}</span>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{lang.flag}</span>
        <span className="font-heading font-bold text-lg text-white">{lang.name}</span>
      </div>
    </motion.button>
  );

  return (
    <div className="relative w-full overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="lg:grid lg:grid-cols-2 min-h-screen relative z-10">
        
        {/* LEFT: TEXT & CTAs */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-20 py-32 relative z-20">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            
            {/* Tagline */}
            <motion.div variants={textVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-yellow/10 text-accent-yellow font-bold text-xs uppercase tracking-widest mb-6 border border-accent-yellow/20">
              <Star size={14} fill="currentColor" />
              <span>Fun. Fast. Effective.</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={textVariants} className="text-5xl md:text-7xl font-heading font-extrabold leading-tight mb-6 text-white drop-shadow-sm">
              Learn languages by <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-blue">playing</span>, not memorizing.
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={textVariants} className="text-xl text-light-400 mb-10 font-medium leading-relaxed max-w-lg">
              Talk, play, listen, and live the language in a fun, interactive way. No boring textbooks allowed. 🚫📚
            </motion.p>

            {/* Language Selectors */}
            <motion.div variants={textVariants} className="flex flex-wrap gap-4 mb-10">
              <LangPill type="I SPEAK" lang={nativeLang} onClick={() => setActiveSelector('native')} />
              <LangPill type="I WANT TO LEARN" lang={targetLang} onClick={() => setActiveSelector('target')} />
            </motion.div>
            
            {/* Language Selection Popover (Simple) */}
            {activeSelector && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-navy-800 p-4 rounded-3xl shadow-2xl border border-white/10 w-full max-w-sm">
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto hide-scrollbar">
                  {availableLanguages.map(l => (
                    <button 
                      key={l.code}
                      onClick={() => { 
                        play('tick'); 
                        activeSelector === 'native' ? setNativeLang(l.code) : setTargetLang(l.code);
                        setActiveSelector(null);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors text-left"
                    >
                      <span className="text-xl">{l.flag}</span>
                      <span className="text-sm font-bold">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <motion.div variants={textVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { play('whoosh'); setPage(Page.LOBBY); }}
                className="px-8 py-5 bg-primary-500 hover:bg-primary-400 text-white rounded-3xl font-heading font-bold text-lg shadow-[0_10px_30px_rgba(20,184,166,0.3)] flex items-center justify-center gap-3 transition-all"
              >
                <MessageCircle size={24} className="animate-bounce" />
                Start Chatting
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { play('whoosh'); setPage(Page.GAMES); }}
                className="px-8 py-5 bg-navy-800 hover:bg-navy-700 text-white border-2 border-navy-700 hover:border-primary-400 rounded-3xl font-heading font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg"
              >
                <Gamepad2 size={24} className="text-accent-purple" />
                Play Games
              </motion.button>
            </motion.div>

          </motion.div>
        </div>

        {/* RIGHT: GLOBE & ATMOSPHERE */}
        <div className="relative h-[50vh] lg:h-auto w-full flex items-center justify-center">
           {/* Background Atmosphere - Blends globe into page */}
           <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
              <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-purple/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{animationDelay: '2s'}}></div>
           </div>

           {/* The Globe with Mask */}
           <motion.div 
             style={{ y: globeY }}
             className="w-full h-full relative z-10"
           >
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                   maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)',
                   WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)'
                }}
              >
                <Globe3D />
              </div>
           </motion.div>
        </div>
      </div>


      {/* --- STORY SECTION 1: WHY? --- */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="glass-card p-12 md:p-16 relative overflow-hidden group"
          >
             <div className="absolute -right-10 -top-10 text-9xl opacity-10 group-hover:scale-110 transition-transform duration-700">😅</div>
             
             <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
               Tired of boring <br/> language apps?
             </h2>
             <p className="text-xl md:text-2xl text-light-400 font-medium leading-relaxed">
               We make learning feel like a <span className="text-accent-yellow">game</span>, not homework. 
               Forget the grammar drills and start having fun.
             </p>
          </motion.div>
        </div>
      </section>


      {/* --- STORY SECTION 2: HOW IT WORKS --- */}
      <section className="py-24 px-6 lg:px-20 relative z-20">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">How it works ✨</h2>
            <p className="text-light-400">Three simple steps to fluency.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Choose", desc: "Pick a language and start your journey.", icon: "🎯", color: "bg-accent-pink" },
              { title: "Play & Chat", desc: "Dive into 3D worlds and mini-games.", icon: "🎮", color: "bg-accent-blue" },
              { title: "Speak", desc: "Gain confidence with real-time feedback.", icon: "🗣️", color: "bg-primary-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { type: "spring", delay: i * 0.2, bounce: 0.5 } 
                  }
                }}
                whileHover="hover"
                className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden"
              >
                 <div className={`w-20 h-20 rounded-3xl ${item.color} flex items-center justify-center text-4xl mb-6 shadow-lg shadow-white/10 transform rotate-3 group-hover:rotate-12 transition-transform`}>
                    {item.icon}
                 </div>
                 <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                 <p className="text-light-400">{item.desc}</p>
              </motion.div>
            ))}
         </div>
      </section>


      {/* --- STORY SECTION 3: GAMES HUB PREVIEW --- */}
      <section className="py-24 px-6 lg:px-20 bg-navy-900/50 relative z-20">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
               <div>
                  <h2 className="text-4xl font-heading font-bold mb-2 flex items-center gap-3">
                     Game Zone <Gamepad2 className="text-accent-purple" size={40}/>
                  </h2>
                  <p className="text-light-400 text-lg">Earn XP, unlock badges, and level up.</p>
               </div>
               <button 
                 onClick={() => { play('whoosh'); setPage(Page.GAMES); }}
                 className="text-primary-400 font-bold text-lg hover:text-white flex items-center gap-2 transition-colors"
               >
                 View All Games <ArrowRight size={20}/>
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {AVAILABLE_GAMES.slice(0, 4).map((game, i) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    whileHover={{ y: -10, rotate: i % 2 === 0 ? 2 : -2 }}
                    onClick={() => { play('whoosh'); setPage(Page.GAMES); }}
                    className="glass-card p-6 cursor-pointer group hover:bg-white/5 transition-colors border-2 border-transparent hover:border-primary-500/30"
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-navy-800 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                           <Zap size={28} />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-accent-yellow/20 text-accent-yellow text-xs font-bold uppercase">
                           +{game.xpReward} XP
                        </div>
                     </div>
                     <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                     <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden">
                        <div className="bg-primary-500 h-full w-2/3 rounded-full"></div>
                     </div>
                     <p className="text-xs text-light-400 mt-2 font-bold uppercase tracking-wide">Level 1 • Easy</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>


      {/* --- STORY SECTION 4: ABOUT (WARM & HUMAN) --- */}
      <section className="py-24 px-6 relative z-20">
         <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={cardVariants}
           className="max-w-4xl mx-auto glass-card p-12 md:p-20 text-center relative overflow-hidden rounded-[3rem]"
         >
            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-blue via-accent-purple to-primary-500"></div>
            <Sparkles className="absolute top-12 left-12 text-accent-yellow animate-spin-slow opacity-50" size={48} />
            <Heart className="absolute bottom-12 right-12 text-accent-pink animate-bounce opacity-50" size={48} />

            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary-400 mb-8">Why LinguaConnect?</h2>
            
            <div className="space-y-8 text-xl md:text-2xl font-medium leading-relaxed text-light-100">
               <p>
                 LinguaConnect was built for people who want to actually <span className="text-white font-bold underline decoration-accent-blue decoration-4 underline-offset-4">use</span> a language, not just study it.
               </p>
               <p className="text-light-400">
                 We believe learning should feel fun, not stressful. That’s why we mix games, conversations, and playful design to help you learn naturally.
               </p>
            </div>

            <div className="mt-12 p-8 bg-navy-950/50 rounded-3xl border border-white/5 inline-block">
               <p className="text-lg text-primary-400 font-bold mb-2">Our Goal</p>
               <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">
                 "Make learning feel like a game you love playing."
               </h3>
            </div>
         </motion.div>
      </section>


      {/* --- STORY SECTION 5: CONNECT (FRIENDLY) --- */}
      <section className="py-24 px-6 flex justify-center relative z-20 pb-40">
         <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
               <h2 className="text-5xl font-heading font-bold mb-4">Let's Connect 👋</h2>
               <p className="text-xl text-light-400">Questions? Ideas? Just want to say hi?</p>
            </div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-10 rounded-[3rem] border-t-4 border-t-accent-purple"
            >
               <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-accent-blue p-1 mb-6 shadow-xl">
                     <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center overflow-hidden">
                        <User size={64} className="text-white opacity-80" />
                     </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-2">Abhay Kashyap</h3>
                  <p className="text-primary-400 font-bold uppercase tracking-widest text-xs mb-8">Founder & Lead Engineer</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                     <a 
                       href="mailto:KashyapAbhay745@gmail.com"
                       onClick={() => play('tick')}
                       className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-navy-950 hover:bg-primary-500 hover:text-white transition-all font-bold group border border-white/5"
                     >
                        <Mail size={20} className="text-primary-400 group-hover:text-white"/> Email Me
                     </a>
                     <a 
                       href="tel:+919855333991"
                       onClick={() => play('tick')}
                       className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-navy-950 hover:bg-accent-blue hover:text-white transition-all font-bold group border border-white/5"
                     >
                        <Phone size={20} className="text-accent-blue group-hover:text-white"/> Call Me
                     </a>
                     <a 
                       href="#"
                       onClick={() => play('tick')}
                       className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-navy-950 hover:bg-white hover:text-navy-900 transition-all font-bold group border border-white/5"
                     >
                        <Github size={20} className="text-light-400 group-hover:text-navy-900"/> GitHub
                     </a>
                     <a 
                       href="#"
                       onClick={() => play('tick')}
                       className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-navy-950 hover:bg-[#0077b5] hover:text-white transition-all font-bold group border border-white/5"
                     >
                        <Linkedin size={20} className="text-[#0077b5] group-hover:text-white"/> LinkedIn
                     </a>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-light-400 text-sm opacity-60">
         <p>&copy; 2024 LinguaConnect. Made with ❤️ and ☕.</p>
      </footer>

    </div>
  );
};

export default Hero;
