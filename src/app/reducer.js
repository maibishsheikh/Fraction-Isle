import { LEVELS } from '../config/levels.js';
import { makeInitialState } from './initialState.js';
import { clearState } from './persistence.js';
import { gameStars, starsFor, XP } from '../utils/scoring.js';
const patch = (state, level, fn) => ({ ...state, levels: { ...state.levels, [level]: fn(state.levels[level]) } });
const addXp = (state, n) => ({ ...state, scoring: { xp: state.scoring.xp + n } });
const mark = (state, level, field, index, reward) => { const was = index === undefined ? state.levels[level][field] : state.levels[level][field][index]; const next = patch(state, level, (p) => index === undefined ? { ...p, [field]: true } : { ...p, [field]: p[field].map((v, i) => i === index ? true : v) }); return was ? next : addXp(next, reward); };
export const reducer = (state, action) => {
  switch (action.type) {
    case 'GO': return { ...state, route: action.route };
    case 'SET_NAME': return { ...state, nickname: action.name.trim().slice(0, 12) };
    case 'TOGGLE_SETTING': return { ...state, settings: { ...state.settings, [action.key]: !state.settings[action.key] } };
    case 'MARK_SEEN': return { ...state, seen: { ...state.seen, [action.key]: true } };
    case 'WONDER_COMPLETE': return mark(state, action.level, 'wonder', undefined, XP.wonder);
    case 'STORY_COMPLETE': return mark(state, action.level, 'story', undefined, XP.story);
    case 'LAB_COMPLETE': return mark(state, action.level, 'labs', action.index, XP.lab);
    case 'GAME_COMPLETE': { const stars = gameStars(action.correct, action.total); const old = state.levels[action.level].games[action.index]; const next = patch(state, action.level, (p) => ({ ...p, games: p.games.map((g, i) => i === action.index ? { done: true, stars: Math.max(g.stars, stars) } : g) })); return addXp(next, (old.done ? 0 : XP.game) + Math.max(0, stars - old.stars) * XP.gameStar); }
    case 'BOSS_COMPLETE': { const old = state.levels[action.level].boss; if (action.correct < LEVELS[action.level].passMark) return patch(state, action.level, (p) => ({ ...p, boss: { ...p.boss, best: Math.max(p.boss.best, action.correct) } })); const stars = starsFor(action.correct, action.total); const next = patch(state, action.level, (p) => ({ ...p, boss: { done: true, stars: Math.max(p.boss.stars, stars), best: Math.max(p.boss.best, action.correct) } })); return addXp(next, (old.done ? 0 : XP.boss) + Math.max(0, stars - old.stars) * XP.bossStar); }
    case 'MISCONCEPTION': return { ...state, misconceptions: { ...state.misconceptions, [action.tag]: (state.misconceptions[action.tag] || 0) + 1 } };
    case 'RESET': clearState(); return makeInitialState();
    default: return state;
  }
};
