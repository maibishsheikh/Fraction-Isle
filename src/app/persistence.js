import { makeInitialState } from './initialState.js';
import { LEVEL_ORDER } from '../config/levels.js';

export const STORAGE_KEY = 'fractionIsles:v2';
export const hydrate = (raw) => {
  const fresh = makeInitialState();
  try {
    const saved = JSON.parse(raw);
    if (saved?.version !== 2) return fresh;
    const levels = {};
    for (const id of LEVEL_ORDER) {
      const f = fresh.levels[id]; const s = saved.levels?.[id];
      levels[id] = { lessons: f.lessons.map((_, i) => Boolean(s?.lessons?.[i])), games: f.games.map((_, i) => ({ done: Boolean(s?.games?.[i]?.done), stars: Math.min(3, Math.max(0, s?.games?.[i]?.stars | 0)) })), boss: { done: Boolean(s?.boss?.done), stars: Math.min(3, Math.max(0, s?.boss?.stars | 0)), best: Math.max(0, s?.boss?.best | 0) } };
    }
    return { ...fresh, nickname: String(saved.nickname || '').slice(0, 12), settings: { ...fresh.settings, ...saved.settings }, scoring: { xp: Math.max(0, saved.scoring?.xp | 0) }, levels, misconceptions: saved.misconceptions || {} };
  } catch { return fresh; }
};
export const loadState = () => { try { return hydrate(localStorage.getItem(STORAGE_KEY)); } catch { return makeInitialState(); } };
export const saveState = (state) => { try { const { route, ...persisted } = state; localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)); } catch { /* memory-only mode */ } };
export const clearState = () => { try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore unavailable storage */ } };
