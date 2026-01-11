
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Info } from 'lucide-react';

interface Step {
  target?: string;
  title: string;
  description: string;
}

interface TutorialOverlayProps {
  gameId: string;
  steps: Step[];
  onComplete: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ gameId, steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isDone = localStorage.getItem(`tutorial_${gameId}`);
    if (!isDone) {
      setShow(true);
    } else {
      onComplete();
    }
  }, [gameId, onComplete]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    localStorage.setItem(`tutorial_${gameId}`, 'done');
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-navy-950/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full glass-card p-8 rounded-[2rem] border-teal-500/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6">
          <button onClick={finish} className="text-light-400 hover:text-white transition-colors"><X/></button>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-8">
           <Info size={32} />
        </div>

        <div className="mb-1 text-teal-400 text-xs font-bold uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</div>
        <h2 className="text-3xl font-bold mb-4 text-white">{steps[currentStep].title}</h2>
        <p className="text-light-400 text-lg leading-relaxed mb-12">{steps[currentStep].description}</p>

        <div className="flex items-center justify-between">
           <button onClick={finish} className="text-light-400 text-sm font-bold hover:text-white transition-colors">Skip Tutorial</button>
           <button 
             onClick={handleNext}
             className="px-8 py-3 bg-teal-500 text-navy-900 font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
           >
              {currentStep === steps.length - 1 ? 'Start Playing' : 'Next Step'}
              <ChevronRight size={20}/>
           </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
           {steps.map((_, i) => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-teal-500' : 'w-2 bg-white/10'}`} />
           ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TutorialOverlay;
