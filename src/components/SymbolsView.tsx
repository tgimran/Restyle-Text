import React, { useState, useMemo, useCallback, useDeferredValue, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Heart,
  Search,
  Sparkles,
} from 'lucide-react';
import { SymbolItem, SymbolSubcategory } from '../types';

interface SymbolsViewProps {
  symbols: SymbolItem[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onCopy: (symbol: string, label: string) => void;
  showFavoritesOnly?: boolean;
}

const symbolSubcategories: { id: SymbolSubcategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Symbols & Emoji', icon: '✨' },
  { id: 'popular', label: 'Popular Symbols', icon: '★' },
  { id: 'arrows', label: 'Arrows & Pointers', icon: '⤵' },
  { id: 'borders', label: 'Borders & Lines', icon: '│' },
  { id: 'square', label: 'Square Symbols', icon: '■' },
  { id: 'triangle', label: 'Triangle Symbols', icon: '▲' },
  { id: 'circle', label: 'Circle Symbols', icon: '●' },
  { id: 'math', label: 'Mathematical & Currency', icon: '∑' },
  { id: 'objects', label: 'Objects Symbols', icon: '✂' },
  { id: 'business', label: 'Business Symbols', icon: '©' },
  { id: 'weather', label: 'Weather & Nature', icon: '☀' },
  { id: 'technical', label: 'Technical Symbols', icon: '⌘' },
  { id: 'monochrome', label: 'Monochrome Emoji', icon: '☻' },
  { id: 'suitcards', label: 'Suit Card Symbols', icon: '🂡' },
  { id: 'totem', label: 'Totem Symbols', icon: '𓁿' },
  { id: 'asterisk', label: 'Asterisk Symbols', icon: '✱' },
  { id: 'flower', label: 'Flower Symbols', icon: '❀' },
  { id: 'religious', label: 'Religious & Cultural', icon: '✝' },
  { id: 'misc', label: 'Miscellaneous Symbols', icon: '⚓' },
  { id: 'hearts', label: 'Hearts & Love', icon: '♥' },
  { id: 'numbers', label: 'Numbers & Circled', icon: '➊' },
  { id: 'stars', label: 'Stars & Sparkles', icon: '✦' },
  { id: 'emoji', label: 'Emoji & Smileys', icon: '😀' },
  { id: 'hands', label: 'Hands & Gestures', icon: '👍' },
  { id: 'music', label: 'Music & Audio', icon: '♪' },
  { id: 'kaomoji', label: 'Kaomoji Emoticons', icon: '(｡◕‿◕｡)' },
  { id: 'aesthetic', label: 'Aesthetic & Japanese', icon: '✿' },
  { id: 'gaming', label: 'Gaming & Clan Badges', icon: '亗' },
  { id: 'zodiac', label: 'Zodiac & Astrology', icon: '♈' },
  { id: 'chess', label: 'Chess & Game Symbols', icon: '♔' },
  { id: 'geometric', label: 'Geometric & Shapes', icon: '◆' },
  { id: 'brackets', label: 'Brackets & Quotes', icon: '«»' },
];

const INITIAL_BATCH_SIZE = 72;
const BATCH_INCREMENT = 72;

interface SymbolCardItemProps {
  item: SymbolItem;
  isFav: boolean;
  isCopied: boolean;
  symbolSize: 'mini' | 'normal' | 'large';
  symbolCardPaddingClass: string;
  onCopySymbol: (item: SymbolItem) => void;
  onToggleFav: (id: string) => void;
}

const SymbolCardItem: React.FC<SymbolCardItemProps> = React.memo(({
  item,
  isFav,
  isCopied,
  symbolSize,
  symbolCardPaddingClass,
  onCopySymbol,
  onToggleFav,
}) => {
  const isLongSymbol =
    item.symbol.length > 5 ||
    item.category === 'borders' ||
    item.category === 'kaomoji' ||
    item.category === 'gaming';

  const textSizeClass = isLongSymbol
    ? symbolSize === 'mini'
      ? 'text-xs break-all'
      : 'text-sm sm:text-base break-all'
    : symbolSize === 'mini'
    ? 'text-lg sm:text-xl'
    : symbolSize === 'large'
    ? 'text-3xl sm:text-4xl'
    : 'text-2xl sm:text-3xl';

  return (
    <div
      id={`symbol-card-${item.id}`}
      onClick={() => onCopySymbol(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCopySymbol(item);
        }
      }}
      className={`liquid-glass-card rounded-2xl ${symbolCardPaddingClass} flex flex-col justify-between cursor-pointer group relative overflow-hidden text-center select-none cv-auto ${
        isLongSymbol ? 'col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3' : 'col-span-1'
      } ${
        isCopied
          ? 'ring-2 ring-emerald-400/80 bg-emerald-950/30 shadow-emerald-500/20'
          : ''
      }`}
    >
      {/* Top action icons */}
      <div
        className="flex items-center justify-between gap-1 mb-1 opacity-60 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[10px] text-slate-400 truncate max-w-[120px] text-left">
          {item.name}
        </span>
        
        <div className="flex items-center gap-0.5">
          <button
            id={`btn-fav-sym-${item.id}`}
            type="button"
            onClick={() => onToggleFav(item.id)}
            className={`p-1 rounded-full transition ${
              isFav ? 'text-rose-400' : 'text-slate-400 hover:text-rose-300'
            }`}
            title={isFav ? 'Remove Favorite' : 'Save to Favorites'}
            aria-label="Toggle Favorite"
          >
            <Heart className={`w-3 h-3 ${isFav ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Symbol Display */}
      <div className={`my-2 flex items-center justify-center ${symbolSize === 'mini' ? 'min-h-[32px]' : symbolSize === 'large' ? 'min-h-[56px]' : 'min-h-[44px]'}`}>
        <span
          className={`font-semibold text-white tracking-normal group-hover:scale-110 transition-transform duration-200 select-all ${textSizeClass}`}
        >
          {item.symbol}
        </span>
      </div>

      {/* Copy Label status */}
      <div className="pt-1.5 border-t border-white/10 flex items-center justify-center text-[10px] font-semibold text-slate-300">
        {isCopied ? (
          <span className="text-emerald-300 flex items-center gap-1 font-bold">
            <Check className="w-3 h-3 stroke-[3]" /> Copied!
          </span>
        ) : (
          <span className="text-slate-400 group-hover:text-pink-300 flex items-center gap-1">
            <Copy className="w-2.5 h-2.5" /> One-tap copy
          </span>
        )}
      </div>
    </div>
  );
});

SymbolCardItem.displayName = 'SymbolCardItem';

export const SymbolsView: React.FC<SymbolsViewProps> = ({
  symbols,
  favorites,
  toggleFavorite,
  onCopy,
  showFavoritesOnly = false,
}) => {
  const [selectedSubcat, setSelectedSubcat] = useState<SymbolSubcategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [symbolSize, setSymbolSize] = useState<'mini' | 'normal' | 'large'>('normal');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  const deferredSearch = useDeferredValue(searchQuery);

  // Dynamically calculate accurate counts per symbol subcategory
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: symbols.length };
    symbols.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [symbols]);

  // Reset pagination when category or search changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [selectedSubcat, deferredSearch, showFavoritesOnly]);

  const filteredSymbols = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return symbols.filter((item) => {
      if (showFavoritesOnly && !favorites.includes(item.id)) {
        return false;
      }
      if (selectedSubcat !== 'all' && item.category !== selectedSubcat) {
        return false;
      }
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSym = item.symbol.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesSym || matchesCat;
      }
      return true;
    });
  }, [symbols, selectedSubcat, deferredSearch, favorites, showFavoritesOnly]);

  // Render visible slice for maximum performance
  const displayedSymbols = useMemo(() => {
    return filteredSymbols.slice(0, visibleCount);
  }, [filteredSymbols, visibleCount]);

  const hasMore = visibleCount < filteredSymbols.length;

  // Infinite scroll observer for butter-smooth progressive loading
  useEffect(() => {
    if (!hasMore) return;
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filteredSymbols.length));
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, filteredSymbols.length]);

  const handleCopySymbol = useCallback((item: SymbolItem) => {
    onCopy(item.symbol, item.name);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId((current) => (current === item.id ? null : current));
    }, 1800);
  }, [onCopy]);

  const gridColsClass = useMemo(() => {
    return symbolSize === 'mini'
      ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2'
      : symbolSize === 'large'
      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5';
  }, [symbolSize]);

  const symbolCardPaddingClass = useMemo(() => {
    return symbolSize === 'mini' ? 'p-2 sm:p-2.5' : symbolSize === 'large' ? 'p-4 sm:p-5' : 'p-3 sm:p-3.5';
  }, [symbolSize]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      {/* Subcategories & Search */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Horizontal scrollable subcategory badges with accurate mini counts */}
        <div
          id="symbol-subcategories-bar"
          className="flex items-center gap-2 overflow-x-auto py-3 px-1.5 scrollbar-none"
        >
          {symbolSubcategories.map((sub) => {
            const isActive = selectedSubcat === sub.id;
            const count = categoryCounts[sub.id] || 0;
            return (
              <button
                key={sub.id}
                id={`symbol-subcat-${sub.id}`}
                type="button"
                onClick={() => setSelectedSubcat(sub.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-150 flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'liquid-glass-pill-active text-white ring-1 ring-white/40'
                    : 'liquid-glass-pill text-slate-300 hover:text-white hover:bg-white/15'
                }`}
              >
                <span className="text-sm">{sub.icon}</span>
                <span>{sub.label}</span>
                <span
                  className={`px-2 py-0.5 text-[11px] leading-none font-bold rounded-full inline-flex items-center justify-center ${
                    isActive
                      ? 'bg-white/30 text-white'
                      : 'bg-black/40 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Size Switcher + Search Input */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Controls: Symbol Size Switcher + Search Bar */}
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto sm:ml-auto">
            {/* Symbol Size Switcher */}
            <div className="flex items-center rounded-xl bg-black/30 border border-white/15 p-0.5 text-[11px] font-semibold text-slate-300">
              <span className="px-2 py-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider hidden xs:inline">
                Size:
              </span>
              <button
                type="button"
                onClick={() => setSymbolSize('mini')}
                className={`px-2 py-1 rounded-lg transition text-[10px] font-bold ${
                  symbolSize === 'mini'
                    ? 'bg-pink-500/30 text-pink-200 border border-pink-400/40 shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Mini Size Symbols Grid"
              >
                Mini
              </button>
              <button
                type="button"
                onClick={() => setSymbolSize('normal')}
                className={`px-2 py-1 rounded-lg transition text-[10px] font-bold ${
                  symbolSize === 'normal'
                    ? 'bg-pink-500/30 text-pink-200 border border-pink-400/40 shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Normal Size Symbols Grid"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setSymbolSize('large')}
                className={`px-2 py-1 rounded-lg transition text-[10px] font-bold ${
                  symbolSize === 'large'
                    ? 'bg-pink-500/30 text-pink-200 border border-pink-400/40 shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Large Size Symbols Grid"
              >
                Large
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-60 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="search-symbols-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Symbols & Emoji..."
                className="w-full bg-black/30 text-white placeholder-slate-400/70 text-xs rounded-full pl-8 pr-7 py-1.5 border border-white/15 focus:border-pink-400/60 focus:bg-black/40 outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Symbols & Emoji */}
      {filteredSymbols.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-12 text-center my-8">
          <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-3 opacity-60 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No symbols or emoji found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try searching for something else or browse all Symbols & Emoji categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubcat('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-full liquid-glass-pill text-xs font-semibold text-pink-300 hover:text-white transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div
            id="symbols-grid"
            className={`grid ${gridColsClass}`}
          >
            {displayedSymbols.map((item) => (
              <SymbolCardItem
                key={item.id}
                item={item}
                isFav={favorites.includes(item.id)}
                isCopied={copiedId === item.id}
                symbolSize={symbolSize}
                symbolCardPaddingClass={symbolCardPaddingClass}
                onCopySymbol={handleCopySymbol}
                onToggleFav={toggleFavorite}
              />
            ))}
          </div>

          {/* Infinite Scroll Anchor & Load More Indicator */}
          {hasMore && (
            <div ref={observerTarget} className="flex justify-center pt-8 pb-4">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filteredSymbols.length))}
                className="px-6 py-2.5 rounded-full liquid-glass-pill text-xs font-bold text-pink-200 hover:text-white hover:bg-white/20 transition shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Load More Symbols ({filteredSymbols.length - visibleCount} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
