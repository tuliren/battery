// Felt-tip palette following the Minicharts house style: clear colours softened toward six
// marker pigments, a calm dark ink, one red accent and a soft brown for small writing.

const SAT = 0.8;
const LIFT = 0.08;
const PIGMENTS: Array<[number, number]> = [
  [13, 0.56],
  [40, 0.74],
  [86, 0.34],
  [150, 0.28],
  [208, 0.3],
  [345, 0.42],
];

const hueToRgb = (m1: number, m2: number, h: number): number => {
  const hh = ((h % 1) + 1) % 1;
  if (hh < 1 / 6) return m1 + (m2 - m1) * hh * 6;
  if (hh < 0.5) return m2;
  if (hh < 2 / 3) return m1 + (m2 - m1) * (2 / 3 - hh) * 6;
  return m1;
};

/** Softens a clear hex colour into its marker tone (same maths as the Minicharts build). */
export const soften = (hex: string): string => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let l = (max + min) / 2;
  let s = 0;
  let h = 0;
  if (max !== min) {
    const d = max - min;
    s = l <= 0.5 ? d / (max + min) : d / (2 - max - min);
    const rc = (max - r) / d;
    const gc = (max - g) / d;
    const bc = (max - b) / d;
    h = r === max ? bc - gc : g === max ? 2 + rc - bc : 4 + gc - rc;
    h = (((h / 6) % 1) + 1) % 1;
  }

  if (l > 0.3) l += (0.8 - l) * LIFT;
  if (l > 0.2 && l < 0.58) l += (0.62 - l) * 0.42;
  if (s > 0.04) {
    const deg = h * 360;
    const dist = (a: number) => Math.min(Math.abs(a - deg), 360 - Math.abs(a - deg));
    const [target, cap] = PIGMENTS.reduce((best, p) => (dist(p[0]) < dist(best[0]) ? p : best));
    const e = ((((target - deg + 180) % 360) + 360) % 360) - 180;
    h = ((((deg + e * 0.6) % 360) + 360) % 360) / 360;
    s = Math.min(cap, s * SAT);
  }

  let out: number[];
  if (s === 0) {
    out = [l, l, l];
  } else {
    const m2 = l <= 0.5 ? l * (1 + s) : l + s - l * s;
    const m1 = 2 * l - m2;
    out = [hueToRgb(m1, m2, h + 1 / 3), hueToRgb(m1, m2, h), hueToRgb(m1, m2, h - 1 / 3)];
  }
  return (
    '#' +
    out
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
};

export const INK = '#2a2b2f';
export const RED = '#c66756';
/** Soft brown for leaders, notes and small writing. */
export const LN = '#8a8174';
export const SHADOW = '#778aa5';
/** Shade colour: mixC(fill, TONE, .35) is a fill's darker tone for its inner lines. */
export const TONE = '#676976';
export const PAPER = '#fbf6ec';
export const DESK = '#e3dac8';
export const CREAM = '#fdf9f1';

export const mixC = (a: string, b: string, t: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return (
    '#' +
    pa
      .map((v, i) =>
        Math.round(v + (pb[i] - v) * t)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
};

/** A fill's darker tone, for its inner lines. */
export const toneOf = (c: string): string => mixC(c, TONE, 0.35);

// The Minicharts WASH colours (already softened) plus clear colours for the scenes.
const RAW = {
  tan: '#e3c999',
  wood: '#bd9963',
  pink: '#e2b7c2',
  rose: '#de9a89',
  sage: '#a0cab4',
  sky: '#bcccdb',
  blue: '#96adc7',
  gold: '#e2b34d',
  steel: '#c7cbcd',
  shade: '#e3e0d2',
  cream: '#f2e9d6',
  plum: '#b797ad',
  moss: '#9aad7b',
  water: '#8fbbe8',
  deep: '#5f8fd6',
  leaf: '#7cc495',
  grass: '#a9d18e',
  gravel: '#b9ada0',
  stone: '#d8cfc4',
  earth: '#8b7a6c',
  bark: '#a8754a',
  salmon: '#f08a7a',
  spawn: '#e45a4f',
  silver: '#dfe6ea',
  egg: '#f59a62',
  bear: '#8a6a55',
  bearLight: '#c9a487',
  city: '#cbc3d6',
  cityDark: '#a99fbd',
  coral: '#f3a6bb',
  knob: '#e8573d',
  krill: '#f7b5a6',
};

export type PaletteKey = keyof typeof RAW;

export const PAL = Object.fromEntries(
  Object.entries(RAW).map(([k, v]) => [k, soften(v)])
) as Record<PaletteKey, string>;
