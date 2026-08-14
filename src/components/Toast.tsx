import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { ToastInfo } from '../types';

interface ToastProps {
  toast: ToastInfo | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none max-w-[92vw] sm:max-w-md transform-gpu"
        >
          <div
            id="copy-toast-notification"
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/85 backdrop-blur-xl border border-white/25 shadow-2xl shadow-black/60 text-white"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/30 shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{toast.message}</span>
              </div>
              <span className="text-sm font-medium text-slate-100 truncate max-w-[260px] sm:max-w-xs select-all">
                {toast.preview}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
