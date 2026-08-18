import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenSupport?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupport }) => {
  return (
    <footer className="w-full px-4 sm:px-6 pt-1 pb-10 mt-auto">
      <div
        id="app-footer"
        className="max-w-6xl mx-auto liquid-glass rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Top subtle highlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-70" />

        {/* Brand & Mission */}
        <div className="flex flex-col items-center gap-2.5 max-w-md">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="md" withGlow />
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-purple-300">
              Restyle Text
            </span>
            <Sparkles className="w-4 h-4 text-pink-300 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-medium inline-flex items-center gap-1.5 justify-center flex-wrap">
            <BrandLogo size="xs" />
            <span>Restyle Text by GW IMRAN</span>
          </p>

          {onOpenSupport && (
            <button
              id="footer-support-btn"
              type="button"
              onClick={onOpenSupport}
              className="mt-1 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-200 hover:text-white rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/25 to-purple-500/20 border border-amber-400/40 hover:border-amber-300 transition shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40 animate-pulse" />
              <span>Support Developer</span>
            </button>
          )}
        </div>

        {/* Social Media Links in Glassmorphism Pill Badges */}
        <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-4 my-1">
          {/* YouTube Link */}
          <a
            id="social-link-youtube"
            href="https://www.youtube.com/@GW_IMRAN"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-red-500/20 hover:border-red-400/40 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
            aria-label="Visit GW IMRAN on YouTube"
          >
            {/* Custom YouTube SVG Icon */}
            <svg
              className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide">YouTube</span>
          </a>

          {/* Instagram Link */}
          <a
            id="social-link-instagram"
            href="https://www.instagram.com/gw_imran_23/?hl=am-et"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-amber-500/15 hover:via-pink-500/20 hover:to-purple-600/20 hover:border-pink-400/50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
            aria-label="Visit GW IMRAN on Instagram"
          >
            {/* Authentic Instagram Multi-color Gradient SVG Icon */}
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0"
              viewBox="0 0 24 24"
            >
              <defs>
                <linearGradient id="instagram-brand-gradient-footer" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fdf497" />
                  <stop offset="10%" stopColor="#fdf497" />
                  <stop offset="35%" stopColor="#fd5949" />
                  <stop offset="60%" stopColor="#d6249f" />
                  <stop offset="90%" stopColor="#285AEB" />
                </linearGradient>
              </defs>
              <path
                fill="url(#instagram-brand-gradient-footer)"
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide">Instagram</span>
          </a>

          {/* Facebook Link */}
          <a
            id="social-link-facebook"
            href="https://www.facebook.com/gwimran23/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
            aria-label="Visit GW IMRAN on Facebook"
          >
            {/* Authentic Facebook SVG Icon */}
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="12" fill="#1877F2" />
              <path
                fill="#FFFFFF"
                d="M16.671 15.469l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.554V4.922s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.544H7.078v3.47h3.088v8.385c.618.097 1.25.148 1.894.148.645 0 1.276-.051 1.894-.148v-8.385h2.717z"
              />
            </svg>
            <span className="text-xs font-semibold tracking-wide">Facebook</span>
          </a>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10" />

        {/* Exact required centered copyright string */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-300 font-medium tracking-wide">
          <p id="copyright-text" className="text-center select-all inline-flex items-center gap-2 justify-center flex-wrap">
            <BrandLogo size="xs" />
            <span>Developed and maintained by GW IMRAN</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
