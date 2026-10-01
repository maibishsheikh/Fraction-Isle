import { makeInitialState } from './initialState.js';
import { LEVEL_ORDER } from '../config/levels.js';
export const STORAGE_KEY = 'fractionIsles:v3';
export const hydrate = (raw) => {
  const base = makeInitialState();
  try {
    const saved = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!saved || saved.version !== 3) return base;
    const state = { ...base, nickname: typeof saved.nickname === 'string' ? saved.nickname.slice(0, 12) : '', settings: { ...base.settings, ...(saved.settings || {}) }, scoring: { xp: Number.isFinite(saved.scoring?.xp) ? saved.scoring.xp : 0 }, misconceptions: saved.misconceptions && typeof saved.misconceptions === 'object' ? saved.misconceptions : {}, seen: saved.seen && typeof saved.seen === 'object' ? saved.seen : {} };
    for (const id of LEVEL_ORDER) { const p = saved.levels?.[id]; const f = base.levels[id]; if (!p) continue; state.levels[id] = { wonder: p.wonder === true, story: p.story === true, labs: f.labs.map((_, i) => p.labs?.[i] === true), games: f.games.map((_, i) => ({ done: p.games?.[i]?.done === true, stars: Math.min(3, Math.max(0, Number(p.games?.[i]?.stars) || 0)) })), boss: { done: p.boss?.done === true, stars: Math.min(3, Math.max(0, Number(p.boss?.stars) || 0)), best: Math.max(0, Number(p.boss?.best) || 0) } }; }
    return state;
  } catch { return base; }
};
export const loadState = () => { try { return hydrate(localStorage.getItem(STORAGE_KEY)); } catch { return makeInitialState(); } };
export const saveState = (state) => { try { const { route, ...saved } = state; localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch {} };
export const clearState = () => { try { localStorage.removeItem(STORAGE_KEY); } catch {} };
