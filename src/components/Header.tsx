import React from 'react';
import { Volume2, VolumeX, Palette, Heart, Info } from 'lucide-react';
import { MainTab, ThemePreset } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  theme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  totalFontsCount?: number;
  totalSymbolsCount?: number;
  onOpenInfo: () => void;
  onOpenSupport: () => void;
}

const themeOptions: { id: ThemePreset; label: string; color: string }[] = [
  { id: 'aurora-emerald', label: 'Aurora Emerald', color: 'from-emerald-400 to-teal-500' },
  { id: 'liquid-purple', label: 'Liquid Purple', color: 'from-purple-500 to-pink-500' },
  { id: 'sunset-glass', label: 'Sunset Glow', color: 'from-orange-500 to-rose-500' },
  { id: 'deep-ocean', label: 'Deep Ocean', color: 'from-cyan-400 to-blue-600' },
  { id: 'cherry-blossom', label: 'Cherry Glass', color: 'from-pink-400 to-rose-500' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  favoritesCount,
  showFavoritesOnly,
  setShowFavoritesOnly,
  totalFontsCount = 0,
  totalSymbolsCount = 0,
  onOpenInfo,
  onOpenSupport,
}) => {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);
  const themeMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-4 pb-3">
      <div
        id="main-app-header"
        className="max-w-6xl mx-auto liquid-glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex flex-col gap-4 shadow-xl"
      >
        {/* Top bar: Brand + Controls */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <BrandLogo size="lg" withGlow />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  Restyle Text
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-400/30 shadow-sm">
                  <BrandLogo size="xs" />
                  <span>by GW IMRAN</span>
                </span>
              </div>
              <p className="text-xs text-slate-300/80 hidden xs:block font-medium">
                Fancy Unicode Fonts, Symbols & Emoji Generator
              </p>
            </div>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Picker */}
            <div className="relative" ref={themeMenuRef}>
              <button
                id="btn-theme-switcher"
                type="button"
                onClick={() => setShowThemeMenu((v) => !v)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-white/15 transition flex items-center gap-1.5 text-xs font-medium"
                title="Change Ambient Glow Theme"
                aria-label="Change Theme"
              >
                <Palette className="w-4 h-4 text-purple-300" />
                <span className="hidden md:inline">Theme</span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Liquid Atmosphere
                  </div>
                  {themeOptions.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-white/10 transition ${
                        theme === t.id ? 'text-white font-bold bg-white/10' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${t.color} shadow`} />
                        <span>{t.label}</span>
                      </div>
                      {theme === t.id && <span className="text-emerald-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              id="btn-sound-toggle"
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl liquid-glass-pill transition ${
                soundEnabled ? 'text-cyan-300 hover:bg-white/20' : 'text-slate-400 hover:bg-white/10'
              }`}
              title={soundEnabled ? 'Haptic Sound Enabled' : 'Haptic Sound Muted'}
              aria-label="Toggle Sound Effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Favorites Toggle */}
            <button
              id="btn-favorites-filter"
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-2.5 py-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${
                showFavoritesOnly
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40 shadow-lg shadow-rose-500/20'
                  : 'liquid-glass-pill text-slate-300 hover:text-white hover:bg-white/15'
              }`}
              title="Filter Favorite Items"
              aria-label="Show Favorites"
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span className="min-w-[18px] h-4 px-1.5 text-[10px] rounded-full bg-rose-500/50 text-rose-100 font-bold leading-none inline-flex items-center justify-center shadow-sm">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Info / About Button */}
            <button
              id="btn-info-modal"
              type="button"
              onClick={onOpenInfo}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-pink-500/20 hover:border-pink-400/40 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="About Restyle Text by GW IMRAN"
              aria-label="App Information"
            >
              <Info className="w-4 h-4 text-pink-300" />
              <span className="hidden sm:inline">Info</span>
            </button>

            {/* Support Developer Button */}
            <button
              id="btn-support-modal"
              type="button"
              onClick={onOpenSupport}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/25 to-purple-500/20 border border-amber-400/40 hover:border-amber-300 text-amber-200 hover:text-white transition flex items-center gap-1.5 text-xs font-bold shadow-sm shadow-amber-500/10 hover:shadow-amber-500/25"
              title="Support Developer - GW IMRAN"
              aria-label="Support Developer"
            >
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300/40 animate-pulse" />
              <span className="hidden xs:inline">Support</span>
            </button>
          </div>
        </div>

        {/* Bottom bar: iOS Glass Segmented Switcher for Main Categories (Fonts / Symbols) */}
        <div className="flex items-center justify-center pt-1">
          <div
            id="main-category-switcher"
            className="w-full max-w-md p-1 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/15 grid grid-cols-2 gap-1 shadow-inner"
          >
            <button
              id="tab-fonts-btn"
              type="button"
              onClick={() => {
                setActiveTab('fonts');
                if (showFavoritesOnly) setShowFavoritesOnly(false);
              }}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'fonts' && !showFavoritesOnly
                  ? 'liquid-glass-pill-active text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="text-sm sm:text-base">𝔉</span>
              <span>Fonts</span>
              {totalFontsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] leading-none font-bold rounded-full bg-white/15 border border-white/20 text-purple-200 shadow-sm">
                  {totalFontsCount}
                </span>
              )}
            </button>

            <button
              id="tab-symbols-btn"
              type="button"
              onClick={() => {
                setActiveTab('symbols');
                if (showFavoritesOnly) setShowFavoritesOnly(false);
              }}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'symbols' && !showFavoritesOnly
                  ? 'liquid-glass-pill-active text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="text-sm sm:text-base">✨</span>
              <span>Symbols & Emoji</span>
              {totalSymbolsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] leading-none font-bold rounded-full bg-white/15 border border-white/20 text-pink-200 shadow-sm">
                  {totalSymbolsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
