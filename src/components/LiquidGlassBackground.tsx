import React from 'react';
import { ThemePreset } from '../types';

interface LiquidGlassBackgroundProps {
  theme: ThemePreset;
}

const themeStyles: Record<ThemePreset, {
  bgBase: string;
  orb1: string;
  orb2: string;
  orb3: string;
  orb4: string;
}> = {
  'liquid-purple': {
    bgBase: 'bg-slate-950',
    orb1: 'from-fuchsia-600/40 via-purple-600/30 to-indigo-700/20',
    orb2: 'from-cyan-500/35 via-blue-600/25 to-violet-800/20',
    orb3: 'from-pink-500/30 via-rose-500/20 to-purple-900/30',
    orb4: 'from-indigo-500/25 to-sky-400/20',
  },
  'sunset-glass': {
    bgBase: 'bg-stone-950',
    orb1: 'from-orange-500/40 via-amber-600/30 to-rose-700/25',
    orb2: 'from-pink-600/35 via-purple-700/30 to-indigo-900/20',
    orb3: 'from-yellow-400/30 via-red-500/25 to-amber-900/30',
    orb4: 'from-rose-400/25 to-orange-600/20',
  },
  'aurora-emerald': {
    bgBase: 'bg-zinc-950',
    orb1: 'from-emerald-500/40 via-teal-600/30 to-cyan-800/20',
    orb2: 'from-lime-400/30 via-green-600/25 to-teal-900/20',
    orb3: 'from-cyan-400/35 via-blue-600/25 to-emerald-900/30',
    orb4: 'from-teal-300/25 to-emerald-700/20',
  },
  'deep-ocean': {
    bgBase: 'bg-slate-950',
    orb1: 'from-blue-600/40 via-indigo-600/35 to-cyan-700/20',
    orb2: 'from-cyan-400/35 via-sky-600/25 to-blue-950/30',
    orb3: 'from-teal-500/30 via-indigo-700/25 to-blue-900/30',
    orb4: 'from-sky-400/25 to-indigo-500/20',
  },
  'cherry-blossom': {
    bgBase: 'bg-neutral-950',
    orb1: 'from-pink-500/45 via-rose-400/35 to-fuchsia-700/20',
    orb2: 'from-rose-300/35 via-pink-600/25 to-purple-900/20',
    orb3: 'from-fuchsia-400/30 via-rose-500/25 to-neutral-900/30',
    orb4: 'from-pink-400/25 to-rose-600/20',
  },
};

export const LiquidGlassBackground: React.FC<LiquidGlassBackgroundProps> = ({ theme }) => {
  const current = themeStyles[theme] || themeStyles['aurora-emerald'];

  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none overflow-hidden ${current.bgBase} transition-colors duration-1000`}>
      {/* Animated Glowing Liquid Gradient Mesh Orbs with hardware acceleration */}
      <div
        className={`absolute -top-[15%] -left-[10%] w-[60vw] h-[60vw] max-w-[720px] max-h-[720px] rounded-full bg-gradient-to-tr ${current.orb1} blur-[75px] sm:blur-[90px] animate-blob-1 opacity-80 mix-blend-screen transition-all duration-1000 transform-gpu`}
      />
      <div
        className={`absolute top-[25%] -right-[15%] w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full bg-gradient-to-bl ${current.orb2} blur-[80px] sm:blur-[95px] animate-blob-2 opacity-75 mix-blend-screen transition-all duration-1000 transform-gpu`}
      />
      <div
        className={`absolute -bottom-[20%] left-[20%] w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr ${current.orb3} blur-[85px] sm:blur-[100px] animate-blob-3 opacity-70 mix-blend-screen transition-all duration-1000 transform-gpu`}
      />
      <div
        className={`absolute top-[40%] left-[30%] w-[40vw] h-[40vw] max-w-[480px] max-h-[480px] rounded-full bg-gradient-to-r ${current.orb4} blur-[65px] sm:blur-[80px] opacity-50 mix-blend-screen transition-all duration-1000 transform-gpu`}
      />

      {/* Subtle Specular Noise Grid / Glass Refraction */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0,transparent_100%)]" />
      <div className="absolute inset-0 bg-slate-950/20" />
    </div>
  );
};
