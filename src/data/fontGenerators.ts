import { FontStyleItem } from '../types';

// Helper for Unicode mapping table
function createCharMap(
  upperStart: number,
  lowerStart: number,
  digitStart?: number,
  exceptions: Record<string, string> = {}
): (text: string) => string {
  return (text: string) => {
    return Array.from(text)
      .map((char) => {
        if (exceptions[char]) {
          return exceptions[char];
        }
        const code = char.charCodeAt(0);
        // Uppercase A-Z (65-90)
        if (code >= 65 && code <= 90) {
          return String.fromCodePoint(upperStart + (code - 65));
        }
        // Lowercase a-z (97-122)
        if (code >= 97 && code <= 122) {
          return String.fromCodePoint(lowerStart + (code - 97));
        }
        // Digits 0-9 (48-57)
        if (digitStart !== undefined && code >= 48 && code <= 57) {
          return String.fromCodePoint(digitStart + (code - 48));
        }
        return char;
      })
      .join('');
  };
}

// Combining diacritics helper
function applyCombining(charString: string, mark: string): string {
  return Array.from(charString)
    .map((c) => (c === ' ' || c === '\n' ? c : c + mark))
    .join('');
}

// Small Caps Map
const smallCapsMap: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
  A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ', I: 'ɪ',
  J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ',
  S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
};

// Tiny Superscript / Mini High Text Map
const miniSuperscriptMap: Record<string, string> = {
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'ᵠ', r: 'ʳ',
  s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ',
  J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', Q: 'ᵠ', R: 'ᴿ',
  S: 'ˢ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
};

// Tiny Subscript / Mini Low Text Map
const miniSubscriptMap: Record<string, string> = {
  a: 'ₐ', b: 'ᵦ', c: '𝒸', d: '𝒹', e: 'ₑ', f: '𝒻', g: '𝓰', h: 'ₕ', i: 'ᵢ',
  j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ', p: 'ₚ', q: 'ᵩ', r: 'ᵣ',
  s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', w: '𝓌', x: 'ₓ', y: 'ᵧ', z: '𝓏',
  A: 'ₐ', B: 'ᵦ', C: '𝒸', D: '𝒹', E: 'ₑ', F: '𝒻', G: '𝓰', H: 'ₕ', I: 'ᵢ',
  J: 'ⱼ', K: 'ₖ', L: 'ₗ', M: 'ₘ', N: 'ₙ', O: 'ₒ', P: 'ₚ', Q: 'ᵩ', R: 'ᵣ',
  S: 'ₛ', T: 'ₜ', U: 'ᵤ', V: 'ᵥ', W: '𝓌', X: 'ₓ', Y: 'ᵧ', Z: '𝓏',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
};

// Micro Caps & Petite Phonetic Map
const microCapsMap: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ꞯ', r: 'ʀ',
  s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
  A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ꜰ', G: 'ɢ', H: 'ʜ', I: 'ɪ',
  J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ꞯ', R: 'ʀ',
  S: 'ꜱ', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
};

// Upside down map
const flipMap: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
  j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I',
  J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'ɹ',
  S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
  '8': '8', '9': '6', '0': '0', '.': '˙', ',': "'", "'": ',', '"': '„',
  '!': '¡', '?': '¿', '<': '>', '>': '<', '&': '⅋', '_': '‾',
};

// Parenthesized map
const parenMap: Record<string, string> = {
  a: '⒜', b: '⒝', c: '⒞', d: '⒟', e: '⒠', f: '⒡', g: '⒢', h: '⒣', i: '⒤',
  j: '⒥', k: '⒦', l: '⒧', m: '⒨', n: '⒩', o: '⒪', p: '⒫', q: '⒬', r: '⒭',
  s: '⒮', t: '⒯', u: '⒰', v: '⒱', w: '⒲', x: '⒳', y: '⒴', z: '⒵',
  A: '⒜', B: '⒝', C: '⒞', D: '⒟', E: '⒠', F: '⒡', G: '⒢', H: '⒣', I: '⒤',
  J: '⒥', K: '⒦', L: '⒧', M: '⒨', N: '⒩', O: '⒪', P: '⒫', Q: '⒬', R: '⒭',
  S: '⒮', T: '⒯', U: '⒰', V: '⒱', W: '⒲', X: '⒳', Y: '⒴', Z: '⒵',
  '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼', '0': '⓪'
};

// Morse Code Dictionary
const morseMap: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....',
  i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.',
  q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
  y: '-.--', z: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  ' ': ' / '
};

// Binary conversion
function textToBinary(text: string): string {
  return Array.from(text)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

// Morse conversion
function textToMorse(text: string): string {
  return Array.from(text.toLowerCase())
    .map((c) => morseMap[c] || c)
    .join(' ');
}

// Zalgo Diacritics
const zalgoUp = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'];
const zalgoDown = ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣'];
const zalgoMid = ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', ' ҉'];

function generateZalgo(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === ' ' || c === '\n') {
      result += c;
      continue;
    }
    result += c;
    result += zalgoUp[i % zalgoUp.length] + zalgoUp[(i + 3) % zalgoUp.length];
    result += zalgoMid[i % zalgoMid.length];
    result += zalgoDown[i % zalgoDown.length] + zalgoDown[(i + 2) % zalgoDown.length];
  }
  return result;
}

export const FONT_STYLES: FontStyleItem[] = [
  // --- MINI SIZE & TINY TEXT ---
  {
    id: 'mini-tiny-superscript',
    name: 'Tiny Superscript (Mini High)',
    category: 'mini',
    description: 'High mini tiny unicode letters and digits',
    badge: 'Mini Text',
    transform: (text) => Array.from(text).map((c) => miniSuperscriptMap[c] || c).join(''),
  },
  {
    id: 'mini-tiny-subscript',
    name: 'Tiny Subscript (Mini Low)',
    category: 'mini',
    description: 'Low subscript small chemistry & math characters',
    badge: 'Mini Sub',
    transform: (text) => Array.from(text).map((c) => miniSubscriptMap[c] || c).join(''),
  },
  {
    id: 'mini-small-caps',
    name: 'Mini Small Capitals',
    category: 'mini',
    description: 'Petite chic small capital letters',
    badge: 'Mini Caps',
    transform: (text) => Array.from(text).map((c) => smallCapsMap[c] || c).join(''),
  },
  {
    id: 'mini-micro-caps',
    name: 'Micro Petite Phonetic',
    category: 'mini',
    description: 'Micro small caps with phonetic variants',
    badge: 'Micro',
    transform: (text) => Array.from(text).map((c) => microCapsMap[c] || c).join(''),
  },
  {
    id: 'mini-cute-quotes',
    name: 'Mini Aesthetic Quotes',
    category: 'mini',
    description: 'Aesthetic mini text framed with mini wings',
    badge: 'Aesthetic',
    transform: (text) => `˗ˏˋ ${Array.from(text).map((c) => miniSuperscriptMap[c] || c).join('')} ˎˊ˗`,
  },
  {
    id: 'mini-starry-sparkle',
    name: 'Mini Starry Sparkle',
    category: 'mini',
    description: 'Miniature tiny text with dreamy galaxy stars',
    badge: 'Cute',
    transform: (text) => `⋆｡°✩ ${Array.from(text).map((c) => miniSuperscriptMap[c] || c).join('')} ✩°｡⋆`,
  },
  {
    id: 'mini-cute-smileys',
    name: 'Mini Cute Smileys',
    category: 'mini',
    description: 'Small caps surrounded by cute smiling faces',
    badge: 'Cute',
    transform: (text) => `˙ᵕ˙ ${Array.from(text).map((c) => smallCapsMap[c] || c).join('')} ˙ᵕ˙`,
  },
  {
    id: 'mini-heart-ribbon',
    name: 'Mini Heart Ribbon',
    category: 'mini',
    description: 'Delicate mini letters bordered by heart ribbons',
    badge: 'Hearts',
    transform: (text) => `ᰔ ${Array.from(text).map((c) => miniSuperscriptMap[c] || c).join('')} ᰔ`,
  },
  {
    id: 'mini-dotted-caps',
    name: 'Mini Dotted Small Caps',
    category: 'mini',
    description: 'Small caps with delicate accent dots',
    badge: 'Mini Dots',
    transform: (text) => applyCombining(Array.from(text).map((c) => smallCapsMap[c] || c).join(''), '\u0307'),
  },
  {
    id: 'mini-under-caps',
    name: 'Mini Underline Small Caps',
    category: 'mini',
    description: 'Compact small caps with neat lower underline',
    badge: 'Mini Under',
    transform: (text) => applyCombining(Array.from(text).map((c) => smallCapsMap[c] || c).join(''), '\u0332'),
  },

  // --- BOLD & SANS (CoolSymbol standard) ---
  {
    id: 'bold-sans',
    name: 'Bold Sans-Serif',
    category: 'bold',
    description: 'Clean modern heavy sans font',
    badge: 'Popular',
    transform: createCharMap(0x1d5d4, 0x1d5ee, 0x1d7ec),
  },
  {
    id: 'bold-serif',
    name: 'Bold Serif',
    category: 'bold',
    description: 'Classic weighted editorial serif',
    badge: 'Classic',
    transform: createCharMap(0x1d400, 0x1d41a, 0x1d7ce),
  },
  {
    id: 'italic-serif',
    name: 'Italic Serif',
    category: 'bold',
    description: 'Elegant slanted traditional serif',
    transform: createCharMap(0x1d434, 0x1d44e, undefined, { h: 'ℎ' }),
  },
  {
    id: 'italic-sans',
    name: 'Italic Sans',
    category: 'bold',
    description: 'Dynamic forward-leaning sans',
    transform: createCharMap(0x1d608, 0x1d622),
  },
  {
    id: 'bold-italic-serif',
    name: 'Bold Italic Serif',
    category: 'bold',
    description: 'Heavy slanted traditional serif',
    badge: 'Header',
    transform: createCharMap(0x1d468, 0x1d482),
  },
  {
    id: 'bold-italic-sans',
    name: 'Bold Italic Sans',
    category: 'bold',
    description: 'Impactful bold italic styling',
    transform: createCharMap(0x1d63c, 0x1d656),
  },
  {
    id: 'sans-serif',
    name: 'Clean Sans',
    category: 'bold',
    description: 'Minimalist sleek sans-serif',
    transform: createCharMap(0x1d5a0, 0x1d5ba, 0x1d7e2),
  },

  // --- CURSIVE & SCRIPT ---
  {
    id: 'script-normal',
    name: 'Cursive Script',
    category: 'cursive',
    description: 'Flowing handwritten calligraphy',
    badge: 'Aesthetic',
    transform: createCharMap(0x1d49c, 0x1d4b6, undefined, {
      B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
      e: 'ℯ', g: 'ℊ', o: 'ℴ',
    }),
  },
  {
    id: 'script-bold',
    name: 'Bold Cursive Script',
    category: 'cursive',
    description: 'Heavy calligraphic luxury script',
    badge: 'Trendy',
    transform: createCharMap(0x1d4d0, 0x1d4ea),
  },

  // --- GOTHIC & FRAKTUR ---
  {
    id: 'fraktur-normal',
    name: 'Gothic Fraktur',
    category: 'gothic',
    description: 'Medieval European blackletter',
    badge: 'Dark',
    transform: createCharMap(0x1d504, 0x1d51e, undefined, {
      C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ',
    }),
  },
  {
    id: 'fraktur-bold',
    name: 'Bold Gothic Blackletter',
    category: 'gothic',
    description: 'Intense heavy medieval gothic',
    badge: 'Medieval',
    transform: createCharMap(0x1d56c, 0x1d586),
  },

  // --- FANCY & AESTHETIC ---
  {
    id: 'double-struck',
    name: 'Double-Struck / Blackboard Bold',
    category: 'fancy',
    description: 'Outlined mathematical blackboard style',
    badge: 'Popular',
    transform: createCharMap(0x1d538, 0x1d552, 0x1d7d8, {
      C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ',
    }),
  },
  {
    id: 'small-caps',
    name: 'Small Capitals',
    category: 'fancy',
    description: 'Chic editorial mini-uppercase',
    badge: 'Bio Favorite',
    transform: (text) => Array.from(text).map((c) => smallCapsMap[c] || c).join(''),
  },
  {
    id: 'vaporwave-fullwidth',
    name: 'Vaporwave Fullwidth',
    category: 'fancy',
    description: 'Retro 80s aesthetic wide typography',
    badge: 'Aesthetic',
    transform: (text) =>
      Array.from(text)
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code >= 33 && code <= 126) {
            return String.fromCharCode(code + 0xfee0);
          }
          if (c === ' ') return '　';
          return c;
        })
        .join(''),
  },
  {
    id: 'spaced-aesthetic',
    name: 'Aesthetic Dot Spaced',
    category: 'fancy',
    description: 'Spaced letters with central dots',
    transform: (text) =>
      Array.from(text.trim())
        .map((c) => (c === ' ' ? '  ' : c.toUpperCase()))
        .join(' · '),
  },
  {
    id: 'spaced-wide',
    name: 'V a p o r w a v e  S p a c e d',
    category: 'fancy',
    description: 'Super spaced relaxed character gaps',
    transform: (text) => Array.from(text).join(' '),
  },
  {
    id: 'leet-hacker',
    name: 'Cyber Hacker / Matrix',
    category: 'fancy',
    description: 'Futuristic cypher substitution',
    transform: (text) => {
      const leet: Record<string, string> = {
        a: '4', A: '4', e: '3', E: '3', i: '1', I: '1', o: '0', O: '0',
        s: '5', S: '5', t: '7', T: '7', b: '8', B: '8', g: '9', G: '9',
      };
      return Array.from(text).map((c) => leet[c] || c).join('');
    },
  },
  {
    id: 'morse-code',
    name: 'Morse Code',
    category: 'fancy',
    description: 'Telegraph dot and dash signal code',
    badge: 'Tech',
    transform: textToMorse,
  },
  {
    id: 'binary-code',
    name: 'Binary 010101',
    category: 'fancy',
    description: 'Digital 8-bit machine bytes',
    badge: 'Code',
    transform: textToBinary,
  },

  // --- MONOSPACE ---
  {
    id: 'monospace',
    name: 'Typewriter Monospace',
    category: 'monospace',
    description: 'Vintage coder typewriter font',
    badge: 'Code',
    transform: createCharMap(0x1d670, 0x1d68a, 0x1d7f6),
  },

  // --- BUBBLE & CIRCLES ---
  {
    id: 'circled-bubble',
    name: 'Circled Bubble',
    category: 'bubble',
    description: 'Playful round circled letters',
    badge: 'Cute',
    transform: createCharMap(0x24b6, 0x24d0, 0x2460, {
      '0': '⓪',
      '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤',
      '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
    }),
  },
  {
    id: 'inverted-circled',
    name: 'Dark Inverted Bubble',
    category: 'bubble',
    description: 'Solid dark filled circular badges',
    badge: 'Bold',
    transform: createCharMap(0x1f150, 0x1f150, 0x2776, {
      '0': '⓿',
      '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺',
      '6': '❻', '7': '❼', '8': '❽', '9': '❾',
    }),
  },
  {
    id: 'squared',
    name: 'Squared Boxed',
    category: 'bubble',
    description: 'Outlined geometric square boxes',
    transform: createCharMap(0x1f130, 0x1f130),
  },
  {
    id: 'inverted-squared',
    name: 'Inverted Solid Square',
    category: 'bubble',
    description: 'Filled dark rectangular stickers',
    badge: 'Sticker',
    transform: createCharMap(0x1f170, 0x1f170),
  },
  {
    id: 'parenthesized',
    name: 'Parenthesized Letters',
    category: 'bubble',
    description: 'Rounded brackets enclosing each char',
    transform: (text) => Array.from(text).map((c) => parenMap[c] || c).join(''),
  },

  // --- UPSIDE DOWN & REVERSE ---
  {
    id: 'upside-down',
    name: 'Upside Down / Flip',
    category: 'upsidedown',
    description: '180-degree inverted mirrored text',
    badge: 'Fun',
    transform: (text) =>
      Array.from(text)
        .reverse()
        .map((c) => flipMap[c] || c)
        .join(''),
  },
  {
    id: 'reversed-mirror',
    name: 'Reverse Backwards',
    category: 'upsidedown',
    description: 'Backwards mirror reflection',
    transform: (text) => Array.from(text).reverse().join(''),
  },

  // --- GLITCH & STRIKE ---
  {
    id: 'zalgo-glitch',
    name: 'Zalgo Glitch / Cursed',
    category: 'glitch',
    description: 'Chaotic glitchy corrupted text',
    badge: 'Glitch',
    transform: generateZalgo,
  },
  {
    id: 'strikethrough',
    name: 'Strikethrough Cross',
    category: 'glitch',
    description: 'Central horizontal strike line',
    transform: (text) => applyCombining(text, '\u0336'),
  },
  {
    id: 'double-strikethrough',
    name: 'Double Strikethrough',
    category: 'glitch',
    description: 'Two parallel strike-through lines',
    transform: (text) => applyCombining(text, '\u0337'),
  },
  {
    id: 'slashed-diagonal',
    name: 'Diagonal Slash',
    category: 'glitch',
    description: 'Diagonal cut through every glyph',
    transform: (text) => applyCombining(text, '\u0338'),
  },
  {
    id: 'underline-single',
    name: 'Single Underline',
    category: 'glitch',
    description: 'Continuous bottom underline',
    transform: (text) => applyCombining(text, '\u0332'),
  },
  {
    id: 'underline-double',
    name: 'Double Underline',
    category: 'glitch',
    description: 'Prominent double bottom line',
    transform: (text) => applyCombining(text, '\u0333'),
  },
  {
    id: 'overline-single',
    name: 'Overline Top Line',
    category: 'glitch',
    description: 'Continuous ceiling upper border line',
    transform: (text) => applyCombining(text, '\u0305'),
  },
  {
    id: 'wavy-tilde',
    name: 'Wavy Tilde Accented',
    category: 'glitch',
    description: 'Playful floating top tilde waves',
    transform: (text) => applyCombining(text, '\u0303'),
  },
  {
    id: 'dotted-above',
    name: 'Dotted Cloud Accent',
    category: 'glitch',
    description: 'Delicate dots above each letter',
    transform: (text) => applyCombining(text, '\u0307'),
  },
  {
    id: 'dotted-below',
    name: 'Dotted Underline Accent',
    category: 'glitch',
    description: 'Subtle dots underneath each letter',
    transform: (text) => applyCombining(text, '\u0323'),
  },

  // --- DECORATIVE FRAMES & COOL TEXT ARTS ---
  {
    id: 'sparkle-stars',
    name: 'Sparkle Star Dust',
    category: 'decorative',
    description: 'Dreamy sparkle star framing',
    badge: 'Aesthetic',
    transform: (text) => `✧･ﾟ: *✧ ${text} ✧*:･ﾟ✧`,
  },
  {
    id: 'angel-wings',
    name: 'Royal Angel Wings',
    category: 'decorative',
    description: 'Crown winged gaming banner',
    badge: 'Gaming',
    transform: (text) => `꧁༺ ${text} ༻꧂`,
  },
  {
    id: 'angel-wings-sparkle',
    name: 'Angel Wings Sparkle',
    category: 'decorative',
    description: 'Winged flourish with star diamonds',
    transform: (text) => `꧁༒☬ ${text} ☬༒꧂`,
  },
  {
    id: 'sweet-hearts',
    name: 'Sweet Love Hearts',
    category: 'decorative',
    description: 'Romantic heart framed border',
    badge: 'Love',
    transform: (text) => `♥*♡∞:｡.｡ ${text} ｡.｡:∞♡*♥`,
  },
  {
    id: 'heart-letters-numbers',
    name: 'Heart Spaced Letters & Numbers',
    category: 'decorative',
    description: 'Every character and number spaced with hearts',
    badge: 'Hearts',
    transform: (text) => Array.from(text).filter(c => c !== ' ').join(' ♥ '),
  },
  {
    id: 'heart-wings',
    name: 'Love Heart Angel Wings',
    category: 'decorative',
    description: 'Sweet heart wings flourish',
    badge: 'Cute',
    transform: (text) => `ʚ♥ɞ ${text} ʚ♥ɞ`,
  },
  {
    id: 'cute-hearts-ribbon',
    name: 'Cute Heart Ribbons',
    category: 'decorative',
    description: 'Whimsical sweet heart bow border',
    transform: (text) => `ღ(¯` + `◕‿◕´¯) ♥ ${text} ♥ (¯` + `◕‿◕´¯)ღ`,
  },
  {
    id: 'circled-numbers-style',
    name: 'Circled Numbers & Digits',
    category: 'numbers',
    description: 'Convert numbers into circled digits',
    badge: 'Numbers',
    transform: (text) => {
      const circMap: Record<string, string> = {
        '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
      };
      return Array.from(text).map(c => circMap[c] || c).join('');
    },
  },
  {
    id: 'black-circled-numbers-style',
    name: 'Solid Black Circled Numbers',
    category: 'numbers',
    description: 'Inverse black disc circled digits',
    badge: 'Numbers',
    transform: (text) => {
      const blackMap: Record<string, string> = {
        '0': '⓿', '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺', '6': '❻', '7': '❼', '8': '❽', '9': '❾',
      };
      return Array.from(text).map(c => blackMap[c] || c).join('');
    },
  },
  {
    id: 'superscript-numbers-style',
    name: 'Superscript Numbers & Exponents',
    category: 'numbers',
    description: 'Math power exponents and small high digits',
    badge: 'Numbers',
    transform: (text) => {
      const superMap: Record<string, string> = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
      };
      return Array.from(text).map(c => superMap[c] || c).join('');
    },
  },
  {
    id: 'subscript-numbers-style',
    name: 'Subscript Numbers & Formulas',
    category: 'numbers',
    description: 'Chemical and math low subscript digits',
    badge: 'Numbers',
    transform: (text) => {
      const subMap: Record<string, string> = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
      };
      return Array.from(text).map(c => subMap[c] || c).join('');
    },
  },
  {
    id: 'double-circled-numbers-style',
    name: 'Double Circled Numbers',
    category: 'numbers',
    description: 'Decorative double ringed digits',
    badge: 'Numbers',
    transform: (text) => {
      const dcircMap: Record<string, string> = {
        '1': '⓵', '2': '⓶', '3': '⓷', '4': '⓸', '5': '⓹', '6': '⓺', '7': '⓻', '8': '⓼', '9': '⓽', '0': '⓪'
      };
      return Array.from(text).map(c => dcircMap[c] || c).join('');
    },
  },
  {
    id: 'japanese-brackets',
    name: 'Japanese Black Brackets',
    category: 'decorative',
    description: 'Bold oriental highlight brackets',
    transform: (text) => `【 ${text} 】`,
  },
  {
    id: 'japanese-corner-quotes',
    name: 'Japanese Corner Quotes',
    category: 'decorative',
    description: 'Minimalist Tokyo corner frames',
    transform: (text) => `『 ${text} 』`,
  },
  {
    id: 'cute-kaomoji-bunny',
    name: 'Cute Bunny Kaomoji',
    category: 'decorative',
    description: 'Adorable shy bunny banner',
    transform: (text) => `꒰ ˶• ༝ •˶꒱  ${text} ♡`,
  },
  {
    id: 'diamond-crown',
    name: 'Imperial Diamond Crown',
    category: 'decorative',
    description: 'Sleek luxury crown framing',
    badge: 'VIP',
    transform: (text) => `♛ ◈━ ${text} ━◈ ♛`,
  },
  {
    id: 'swords-warrior',
    name: 'Crossed Swords Battle',
    category: 'decorative',
    description: 'Fierce battle warrior banner',
    badge: 'Gamer',
    transform: (text) => `⚔️ 彡 ${text} 彡 ⚔️`,
  },
  {
    id: 'fire-energy',
    name: 'Fire Energy Surge',
    category: 'decorative',
    description: 'Blazing hot flame highlights',
    transform: (text) => `🔥 ⚡ ${text} ⚡ 🔥`,
  },
  {
    id: 'arrows-fleur',
    name: 'Cupid Bow & Arrows',
    category: 'decorative',
    description: 'Stylish floral arrow tags',
    transform: (text) => `➳ᴹᴿ°᭄ ${text} ࿐`,
  },
  {
    id: 'loading-bar',
    name: 'Cyber Loading Bar',
    category: 'decorative',
    description: 'High-tech progress loading indicator',
    transform: (text) => `[████████▒▒] 80% ${text}`,
  },
  {
    id: 'retro-glitch-brackets',
    name: 'Cyberpunk Shaded Blocks',
    category: 'decorative',
    description: 'Futuristic high-tech ASCII border',
    transform: (text) => `░▒▓█ ${text} █▓▒░`,
  },
  {
    id: 'music-notes-vibe',
    name: 'Music Vibes Equalizer',
    category: 'decorative',
    description: 'Beating music notes surround',
    transform: (text) => `ılı.lıllılı ${text} ılı.lıllılı`,
  },
  {
    id: 'ornate-scroll',
    name: 'Ornate Vintage Scroll',
    category: 'decorative',
    description: 'Royal antique floral flourish',
    transform: (text) => `════ ≪ °❈° ≫ ════\n${text}\n════ ≪ °❈° ≫ ════`,
  },
];
