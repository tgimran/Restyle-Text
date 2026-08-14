import React, { useEffect } from 'react';
import { Sparkles, X, Type, Hash, Zap, ExternalLink, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalFontsCount?: number;
  totalSymbolsCount?: number;
  onOpenSupport?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  totalFontsCount = 70,
  totalSymbolsCount = 1733,
  onOpenSupport,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="info-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div
        id="info-modal-card"
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/25 text-white flex flex-col gap-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-80" />

        {/* Header with Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="lg" withGlow />
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="info-modal-title"
                  className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-purple-300"
                >
                  Restyle Text
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-400/30">
                  <BrandLogo size="xs" />
                  <span>by GW IMRAN</span>
                </span>
              </div>
              <p className="text-xs text-slate-300/80 font-medium mt-0.5">
                About & Overview
              </p>
            </div>
          </div>

          <button
            id="btn-close-info-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl liquid-glass-pill text-slate-300 hover:text-white hover:bg-white/20 transition shrink-0"
            aria-label="Close information dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Info Text */}
        <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
          <p className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-100 shadow-inner">
            <strong className="text-pink-300 font-semibold">Restyle Text</strong> is a simple and creative text styling website designed to make your text more unique and expressive. Choose from <span className="font-bold text-white underline decoration-purple-400 decoration-2 underline-offset-2">{totalFontsCount} different fonts Style</span> and <span className="font-bold text-white underline decoration-pink-400 decoration-2 underline-offset-2">{totalSymbolsCount} symbols</span> to customize your text for social media, profiles, bios, usernames, posts, and more.
          </p>

          <p className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200">
            Explore different font styles, copy your favorite text instantly, and give your words a fresh new look - fast, simple, and free to use.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 flex flex-col items-center text-center gap-1.5 shadow-sm">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Type className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-white">{totalFontsCount} Styles</span>
            <span className="text-[11px] text-slate-400 font-medium">Font Generators</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 flex flex-col items-center text-center gap-1.5 shadow-sm">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
              <Hash className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-white">{totalSymbolsCount} Symbols</span>
            <span className="text-[11px] text-slate-400 font-medium">Curated Unicode</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-black/25 border border-white/10 flex flex-col items-center text-center gap-1.5 shadow-sm">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-extrabold text-white">1-Tap Copy</span>
            <span className="text-[11px] text-slate-400 font-medium">Fast & 100% Free</span>
          </div>
        </div>

        {/* Developer & Socials Footer */}
        <div className="pt-2 border-t border-white/10 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium tracking-wide">
            <BrandLogo size="xs" />
            <span>Developed and maintained by <strong className="text-white font-bold">GW IMRAN</strong></span>
          </div>

          {onOpenSupport && (
            <button
              id="info-support-developer-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenSupport();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-200 hover:text-white rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/25 to-purple-500/20 border border-amber-400/40 hover:border-amber-300 transition shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40 animate-pulse" />
              <span>Support Developer with UPI / QR</span>
            </button>
          )}

          <div className="flex items-center justify-center flex-wrap gap-2.5">
            <a
              id="info-social-youtube"
              href="https://www.youtube.com/@GW_IMRAN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-pill text-xs font-semibold text-slate-200 hover:text-white hover:bg-red-500/20 hover:border-red-400/40 transition shadow-sm"
            >
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              id="info-social-instagram"
              href="https://www.instagram.com/gw_imran_23/?hl=am-et"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-pill text-xs font-semibold text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-amber-500/15 hover:via-pink-500/20 hover:to-purple-600/20 hover:border-pink-400/50 transition shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="instagram-brand-gradient-modal" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="10%" stopColor="#fdf497" />
                    <stop offset="35%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#instagram-brand-gradient-modal)"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              id="info-social-facebook"
              href="https://www.facebook.com/gwimran23/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-pill text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 transition shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#1877F2" />
                <path
                  fill="#FFFFFF"
                  d="M16.671 15.469l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.554V4.922s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.544H7.078v3.47h3.088v8.385c.618.097 1.25.148 1.894.148.645 0 1.276-.051 1.894-.148v-8.385h2.717z"
                />
              </svg>
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
