export const hash = (...parts) => {
  let h = 2166136261;
  for (const char of parts.join('|')) { h ^= char.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
};
export const mulberry32 = (seed) => () => {
  let t = seed += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
export const makeRng = (seed) => {
  const next = mulberry32(seed);
  return { next, int: (min, max) => Math.floor(next() * (max - min + 1)) + min, pick: (items) => items[Math.floor(next() * items.length)], shuffle: (items) => { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(next() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; } };
};
