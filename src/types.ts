export type MainTab = 'fonts' | 'symbols';

export type FontSubcategory = 
  | 'all'
  | 'mini'
  | 'fancy'
  | 'gothic'
  | 'cursive'
  | 'bold'
  | 'monospace'
  | 'bubble'
  | 'numbers'
  | 'upsidedown'
  | 'glitch'
  | 'decorative'
  | 'brackets';

export type SymbolSubcategory =
  | 'all'
  | 'popular'
  | 'arrows'
  | 'borders'
  | 'square'
  | 'triangle'
  | 'circle'
  | 'math'
  | 'objects'
  | 'business'
  | 'weather'
  | 'technical'
  | 'monochrome'
  | 'suitcards'
  | 'totem'
  | 'asterisk'
  | 'flower'
  | 'religious'
  | 'misc'
  | 'hearts'
  | 'numbers'
  | 'stars'
  | 'emoji'
  | 'hands'
  | 'music'
  | 'kaomoji'
  | 'aesthetic'
  | 'gaming'
  | 'zodiac'
  | 'chess'
  | 'geometric'
  | 'brackets';

export interface FontStyleItem {
  id: string;
  name: string;
  category: FontSubcategory;
  description: string;
  badge?: string;
  transform: (text: string) => string;
}

export interface SymbolItem {
  id: string;
  symbol: string;
  name: string;
  category: SymbolSubcategory;
  tags?: string[];
}

export type ThemePreset = 'liquid-purple' | 'sunset-glass' | 'aurora-emerald' | 'deep-ocean' | 'cherry-blossom';

export interface ToastInfo {
  id: string;
  message: string;
  preview: string;
}
