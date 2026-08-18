import React, { useState, useMemo, useCallback, useDeferredValue } from 'react';
import {
  Copy,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';
import { FontStyleItem, FontSubcategory } from '../types';

interface FontStylesViewProps {
  inputText: string;
  prefix: string;
  suffix: string;
  fontStyles: FontStyleItem[];
  onCopy: (text: string, label: string) => void;
}

const subcategories: { id: FontSubcategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Styles', icon: '✨' },
  { id: 'mini', label: 'Mini Size & Tiny', icon: 'ᵃᵇᶜ' },
  { id: 'fancy', label: 'Fancy', icon: '✦' },
  { id: 'gothic', label: 'Gothic', icon: '𝔉' },
  { id: 'cursive', label: 'Cursive', icon: '𝒮' },
  { id: 'bold', label: 'Bold', icon: '𝗕' },
  { id: 'numbers', label: 'Numbers & Digits', icon: '➊' },
  { id: 'monospace', label: 'Monospace', icon: '𝙼' },
  { id: 'bubble', label: 'Bubble', icon: 'Ⓒ' },
  { id: 'upsidedown', label: 'Upside Down', icon: 'ɐ' },
  { id: 'glitch', label: 'Glitch & Strike', icon: '̶' },
  { id: 'decorative', label: 'Decorative Frames', icon: '꧁' },
];

interface FontCardItemProps {
  style: FontStyleItem;
  displayText: string;
  prefix: string;
  suffix: string;
  isCopied: boolean;
  previewTextSizeClass: string;
  onCopyCard: (style: FontStyleItem, formattedOutput: string) => void;
}

const FontCardItem: React.FC<FontCardItemProps> = React.memo(({
  style,
  displayText,
  prefix,
  suffix,
  isCopied,
  previewTextSizeClass,
  onCopyCard,
}) => {
  const transformed = useMemo(() => style.transform(displayText), [style, displayText]);
  const finalOutput = prefix || suffix ? `${prefix}${transformed}${suffix}` : transformed;

  return (
    <div
      id={`font-card-${style.id}`}
      onClick={() => onCopyCard(style, finalOutput)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCopyCard(style, finalOutput);
        }
      }}
      className={`liquid-glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer group relative overflow-hidden text-left select-none cv-auto ${
        isCopied
          ? 'ring-2 ring-emerald-400/80 bg-emerald-950/30 shadow-emerald-500/20'
          : ''
      }`}
    >
      {/* Top card header */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-slate-300 truncate">
            {style.name}
          </span>
          {style.badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 shrink-0">
              {style.badge}
            </span>
          )}
        </div>
      </div>

      {/* Transformed Result Preview */}
      <div className={`my-2 px-3 rounded-xl bg-black/25 border border-white/10 flex items-center overflow-x-auto scrollbar-none transition-all ${previewTextSizeClass}`}>
        <span className="text-white tracking-wide break-all select-all">
          {finalOutput}
        </span>
      </div>

      {/* Bottom Card Footer: Tap to copy indicator */}
      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px] text-slate-400/80 truncate">
          {style.description}
        </span>

        <div
          className={`flex items-center gap-1 font-semibold text-xs transition-colors duration-150 ${
            isCopied ? 'text-emerald-300 font-bold' : 'text-slate-300 group-hover:text-pink-300'
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Tap to copy</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

FontCardItem.displayName = 'FontCardItem';

export const FontStylesView: React.FC<FontStylesViewProps> = ({
  inputText,
  prefix,
  suffix,
  fontStyles,
  onCopy,
}) => {
  const [selectedSubcat, setSelectedSubcat] = useState<FontSubcategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<'mini' | 'normal' | 'large'>('normal');

  const deferredSearch = useDeferredValue(searchQuery);
  const deferredInput = useDeferredValue(inputText);

  // Calculate accurate counts per subcategory
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: fontStyles.length };
    fontStyles.forEach((style) => {
      counts[style.category] = (counts[style.category] || 0) + 1;
    });
    return counts;
  }, [fontStyles]);

  // Fallback text if user cleared input
  const displayText = deferredInput.trim() || 'Restyle Text';

  // Filter styles based on category and search
  const filteredStyles = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return fontStyles.filter((style) => {
      // Subcategory filter
      if (selectedSubcat !== 'all' && style.category !== selectedSubcat) {
        return false;
      }
      // Search query filter
      if (query) {
        const matchesName = style.name.toLowerCase().includes(query);
        const matchesDesc = style.description.toLowerCase().includes(query);
        const matchesBadge = style.badge?.toLowerCase().includes(query);
        const matchesCat = style.category.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesBadge || matchesCat;
      }
      return true;
    });
  }, [fontStyles, selectedSubcat, deferredSearch]);

  const handleCopyCard = useCallback((style: FontStyleItem, formattedOutput: string) => {
    onCopy(formattedOutput, style.name);
    setCopiedId(style.id);
    setTimeout(() => {
      setCopiedId((current) => (current === style.id ? null : current));
    }, 1800);
  }, [onCopy]);

  const previewTextSizeClass = useMemo(() => {
    return previewSize === 'mini'
      ? 'text-xs sm:text-sm font-normal py-1.5 min-h-[42px]'
      : previewSize === 'large'
      ? 'text-lg sm:text-xl font-semibold py-2.5 min-h-[58px]'
      : 'text-base sm:text-lg font-medium py-2 min-h-[52px]';
  }, [previewSize]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      {/* Subcategory Pills */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Horizontal scrollable subcategory badges with accurate mini count badges */}
        <div
          id="font-subcategories-bar"
          className="flex items-center gap-2 overflow-x-auto py-3 px-1.5 scrollbar-none"
        >
          {subcategories.map((sub) => {
            const isActive = selectedSubcat === sub.id;
            const count = categoryCounts[sub.id] || 0;
            return (
              <button
                key={sub.id}
                id={`font-subcat-${sub.id}`}
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

        {/* Toolbar: Search input + Preview text size selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Controls: Size Switcher + Search Bar */}
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto sm:ml-auto">
            {/* Font Preview Size Switcher */}
            <div className="flex items-center rounded-xl bg-black/30 border border-white/15 p-0.5 text-[11px] font-semibold text-slate-300">
              <span className="px-2 py-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider hidden xs:inline">
                Size:
              </span>
              <button
                type="button"
                onClick={() => setPreviewSize('mini')}
                className={`px-2 py-1 rounded-lg transition text-[10px] font-bold ${
                  previewSize === 'mini'
                    ? 'bg-pink-500/30 text-pink-200 border border-pink-400/40 shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Mini Size Text Font"
              >
                Mini
              </button>
              <button
                type="button"
                onClick={() => setPreviewSize('normal')}
                className={`px-2 py-1 rounded-lg transition text-[10px] font-bold ${
                  previewSize === 'normal'
                    ? 'bg-pink-500/30 text-pink-200 border border-pink-400/40 shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Normal Size Font"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setPreviewSize('large')}
                className={`px-2 py-1 rounded-lg transition text-[10px] font-bold ${
                  previewSize === 'large'
                    ? 'bg-pink-500/30 text-pink-200 border border-pink-400/40 shadow-sm'
                    : 'hover:text-white'
                }`}
                title="Large Size Font"
              >
                Large
              </button>
            </div>

            {/* Font Search input */}
            <div className="relative flex-1 sm:w-60 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="search-fonts-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fonts (e.g. mini, gothic)..."
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

      {/* Grid of Generated Font Style Cards */}
      {filteredStyles.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-12 text-center my-8">
          <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-3 opacity-60 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No font styles found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or switching to another category.
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
        <div
          id="font-styles-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
        >
          {filteredStyles.map((style) => (
            <FontCardItem
              key={style.id}
              style={style}
              displayText={displayText}
              prefix={prefix}
              suffix={suffix}
              isCopied={copiedId === style.id}
              previewTextSizeClass={previewTextSizeClass}
              onCopyCard={handleCopyCard}
            />
          ))}
        </div>
      )}
    </div>
  );
};
