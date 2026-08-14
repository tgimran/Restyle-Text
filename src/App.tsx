/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { MainTab, ThemePreset, ToastInfo } from './types';
import { FONT_STYLES } from './data/fontGenerators';
import { SYMBOLS_DATA } from './data/symbolsData';
import { playCopySound, playClickSound } from './utils/sound';
import { LiquidGlassBackground } from './components/LiquidGlassBackground';
import { Header } from './components/Header';
import { TextInputSection } from './components/TextInputSection';
import { FontStylesView } from './components/FontStylesView';
import { SymbolsView } from './components/SymbolsView';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { InfoModal } from './components/InfoModal';
import { SupportModal } from './components/SupportModal';

export default function App() {
  // Main state
  const [activeTab, setActiveTab] = useState<MainTab>('fonts');
  const [inputText, setInputText] = useState<string>('Restyle Text');
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [theme, setTheme] = useState<ThemePreset>(() => {
    try {
      const saved = localStorage.getItem('restyle_text_theme') as ThemePreset | null;
      if (saved && ['aurora-emerald', 'liquid-purple', 'sunset-glass', 'deep-ocean', 'cherry-blossom'].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'aurora-emerald';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem('restyle_text_theme', theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  // One-tap copy handler
  const handleCopy = useCallback(async (textToCopy: string, label: string) => {
    playCopySound(soundEnabled);

    // Mini confetti sparkle
    try {
      confetti({
        particleCount: 22,
        spread: 45,
        startVelocity: 18,
        origin: { y: 0.8 },
        colors: ['#f472b6', '#c084fc', '#38bdf8', '#34d399', '#fde047'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore
    }

    // Try modern Clipboard API, fallback to textarea
    let copySuccessful = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        copySuccessful = true;
      } catch {
        copySuccessful = false;
      }
    }

    if (!copySuccessful) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copySuccessful = true;
      } catch {
        // Fallback failed
      }
    }

    // Show toast notification
    setToast({
      id: String(Date.now()),
      message: `Copied ${label}!`,
      preview: textToCopy,
    });
  }, [soundEnabled]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-pink-500/30 selection:text-pink-100">
      {/* Dynamic Animated Liquid Glass Ambient Backdrop */}
      <LiquidGlassBackground theme={theme} />

      {/* Dynamic iOS Toast Notification */}
      <Toast toast={toast} />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={(t) => {
          playClickSound(soundEnabled);
          setTheme(t);
        }}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        totalFontsCount={FONT_STYLES.length}
        totalSymbolsCount={SYMBOLS_DATA.length}
        onOpenInfo={() => {
          playClickSound(soundEnabled);
          setIsInfoOpen(true);
        }}
        onOpenSupport={() => {
          playClickSound(soundEnabled);
          setIsSupportOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Central Frosted Glass Text Input Dock */}
        <TextInputSection
          inputText={inputText}
          setInputText={setInputText}
          prefix={prefix}
          setPrefix={setPrefix}
          suffix={suffix}
          setSuffix={setSuffix}
          onActionClick={() => playClickSound(soundEnabled)}
        />

        {/* Content View: Fonts or Symbols */}
        {activeTab === 'fonts' ? (
          <FontStylesView
            inputText={inputText}
            prefix={prefix}
            suffix={suffix}
            fontStyles={FONT_STYLES}
            onCopy={handleCopy}
          />
        ) : (
          <SymbolsView
            symbols={SYMBOLS_DATA}
            onCopy={handleCopy}
          />
        )}
      </main>

      {/* Glassmorphic Footer */}
      <Footer
        onOpenSupport={() => {
          playClickSound(soundEnabled);
          setIsSupportOpen(true);
        }}
      />

      {/* Info / About Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        totalFontsCount={FONT_STYLES.length}
        totalSymbolsCount={SYMBOLS_DATA.length}
        onOpenSupport={() => {
          playClickSound(soundEnabled);
          setIsSupportOpen(true);
        }}
      />

      {/* Support Developer (UPI QR & App Logos) Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        upiId="9334078582@ybl"
        payeeName="GW IMRAN"
      />
    </div>
  );
}
