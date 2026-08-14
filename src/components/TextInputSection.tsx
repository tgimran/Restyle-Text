import React, { useState } from 'react';
import {
  X,
  ClipboardPaste,
  Shuffle,
  CaseUpper,
  CaseLower,
  Sparkles,
  ArrowLeftRight,
  SlidersHorizontal,
} from 'lucide-react';

interface TextInputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  prefix: string;
  setPrefix: (val: string) => void;
  suffix: string;
  setSuffix: (val: string) => void;
  onActionClick: () => void;
}

const sampleTexts = [
  'GW IMRAN',
  'Slowedfy',
  'Subscribe Now',
  'Keep Going',
  'Never Give Up',
  'Stay Strong',
  'Believe Yourself',
  'Dream Big',
  'Make It Happen',
  'Keep Moving',
  'Stay Focused',
  'Trust Yourself',
  'Be Consistent',
  'Start Today',
  'One More Step',
  'You Can Do It',
  'Stay Positive',
  'Keep Growing',
  'Think Bigger',
  'Stay Brave',
  'Push Forward',
  "Don't Stop",
  'Keep Learning',
  'Rise Up',
  'Go Beyond',
  'Stay Ready',
  'Be Better',
  'Take Action',
  'Stay Sharp',
  'Move Forward',
  'Think Smart',
  'Work Hard',
  'Stay Calm',
  'Be Bold',
  'Stay True',
  'Keep Faith',
  'Own It',
  'Do More',
  'Start Now',
  'Keep Winning',
  'Stay Driven',
  'Stay Hungry',
  'Make Progress',
  'Enjoy Life',
  'Choose Joy',
  'Stay Happy',
  'Be Kind',
  'Love Life',
  'Live Fully',
  'Find Peace',
  'Stay Humble',
  'Be Yourself',
  'Keep Smiling',
  'Enjoy Today',
  'Stay Grateful',
  'Create Memories',
  'Follow Your Heart',
  'Live Your Dream',
  'Create More',
  'Think Different',
  'Build Ideas',
  'Make Something',
  'Try Again',
  'Learn Daily',
  'Stay Curious',
  'Explore More',
  'Start Creating',
  'Focus Better',
  'Keep Improving',
  'Turn Ideas Into Action',
  'Create Your Future',
  'Make It Simple',
];

export const TextInputSection: React.FC<TextInputSectionProps> = ({
  inputText,
  setInputText,
  prefix,
  setPrefix,
  suffix,
  setSuffix,
  onActionClick,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const charCount = Array.from(inputText).length;
  const wordCount = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;

  const handlePaste = async () => {
    onActionClick();
    try {
      if (navigator.clipboard) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          setInputText(clipText);
        }
      }
    } catch {
      // Clipboard permissions may fail in some iframe environments
    }
  };

  const handleRandomSample = () => {
    onActionClick();
    const available = sampleTexts.filter((t) => t !== inputText);
    const pool = available.length > 0 ? available : sampleTexts;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setInputText(random);
  };

  const handleUppercase = () => {
    onActionClick();
    setInputText(inputText.toUpperCase());
  };

  const handleLowercase = () => {
    onActionClick();
    setInputText(inputText.toLowerCase());
  };

  const handleTitleCase = () => {
    onActionClick();
    const title = inputText.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
    setInputText(title);
  };

  const handleMiniText = () => {
    onActionClick();
    const miniSup: Record<string, string> = {
      a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
      j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'ᵠ', r: 'ʳ',
      s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
      A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ',
      J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', Q: 'ᵠ', R: 'ᴿ',
      S: 'ˢ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    };
    setInputText(Array.from(inputText).map((c: string) => miniSup[c] || c).join(''));
  };

  const handleReverse = () => {
    onActionClick();
    setInputText(Array.from(inputText).reverse().join(''));
  };

  const handleClear = () => {
    onActionClick();
    setInputText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-4">
      <div
        id="text-input-container"
        className="liquid-glass-input rounded-3xl p-4 sm:p-6 transition-all duration-300 relative group"
      >
        {/* Top Input Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <label
              htmlFor="main-text-input"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              Type or Paste Text Here
            </label>
          </div>

          {/* Counts & Custom Frame toggle */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
              {charCount} {charCount === 1 ? 'char' : 'chars'}
            </span>
            <span className="hidden xs:inline-block px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            <button
              id="btn-toggle-custom-frame"
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className={`p-1.5 rounded-full transition ${
                showAdvanced || prefix || suffix
                  ? 'bg-pink-500/30 text-pink-200 border border-pink-400/30'
                  : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
              title="Custom Prefix & Suffix Frames"
              aria-label="Custom Framing"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Main Stylish Liquid Input */}
        <div className="relative">
          <textarea
            id="main-text-input"
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your text to restyle"
            className="w-full bg-black/25 text-white placeholder-slate-400/80 text-lg sm:text-xl font-medium rounded-2xl p-3.5 sm:p-4 border border-white/15 focus:border-pink-400/60 focus:bg-black/35 focus:ring-4 focus:ring-pink-500/15 outline-none transition resize-none shadow-inner"
          />

          {inputText && (
            <button
              id="btn-clear-text"
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 top-3.5 p-1.5 rounded-full bg-white/15 text-slate-300 hover:text-white hover:bg-white/25 transition"
              title="Clear input text"
              aria-label="Clear Text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Custom Framing (Prefix & Suffix) Row */}
        {showAdvanced && (
          <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="text-xs font-semibold text-pink-300 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Custom Wrapper:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
              <input
                id="input-custom-prefix"
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Prefix (e.g. ꧁༺)"
                className="w-full bg-black/30 text-white placeholder-slate-500 text-xs px-2.5 py-1.5 rounded-xl border border-white/10 focus:border-pink-400 outline-none"
              />
            </div>
            <div className="text-xs text-slate-400">[ Text ]</div>
            <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
              <input
                id="input-custom-suffix"
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="Suffix (e.g. ༻꧂)"
                className="w-full bg-black/30 text-white placeholder-slate-500 text-xs px-2.5 py-1.5 rounded-xl border border-white/10 focus:border-pink-400 outline-none"
              />
            </div>
            {(prefix || suffix) && (
              <button
                type="button"
                onClick={() => {
                  setPrefix('');
                  setSuffix('');
                }}
                className="text-[11px] text-rose-300 hover:underline px-1.5"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Quick Transformation Action Buttons */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              id="btn-quick-uppercase"
              type="button"
              onClick={handleUppercase}
              disabled={!inputText}
              className="px-2.5 py-1.5 rounded-xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-semibold"
            >
              <CaseUpper className="w-3.5 h-3.5 text-pink-300" />
              <span>UPPER</span>
            </button>

            <button
              id="btn-quick-lowercase"
              type="button"
              onClick={handleLowercase}
              disabled={!inputText}
              className="px-2.5 py-1.5 rounded-xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-semibold"
            >
              <CaseLower className="w-3.5 h-3.5 text-purple-300" />
              <span>lower</span>
            </button>

            <button
              id="btn-quick-titlecase"
              type="button"
              onClick={handleTitleCase}
              disabled={!inputText}
              className="px-2.5 py-1.5 rounded-xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-semibold"
            >
              Title Case
            </button>

            <button
              id="btn-quick-mini"
              type="button"
              onClick={handleMiniText}
              disabled={!inputText}
              className="px-2.5 py-1.5 rounded-xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-semibold"
              title="Convert into Mini Size Text"
            >
              <span className="text-[11px] font-bold text-amber-300">ᵃᵇᶜ</span>
              <span>Mini</span>
            </button>

            <button
              id="btn-quick-reverse"
              type="button"
              onClick={handleReverse}
              disabled={!inputText}
              className="px-2.5 py-1.5 rounded-xl liquid-glass-pill text-slate-200 hover:text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-semibold"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-300" />
              <span>Reverse</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="btn-quick-paste"
              type="button"
              onClick={handlePaste}
              className="px-2.5 py-1.5 rounded-xl liquid-glass-pill text-cyan-200 hover:text-white hover:bg-white/15 transition flex items-center gap-1 text-xs font-semibold"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>

            <button
              id="btn-quick-random-sample"
              type="button"
              onClick={handleRandomSample}
              className="px-2.5 py-1.5 rounded-xl liquid-glass-pill text-pink-200 hover:text-white hover:bg-white/15 transition flex items-center gap-1 text-xs font-semibold"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Sample</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
