import { LEVELS } from '../config/levels.js';
import { makeInitialState } from './initialState.js';
import { clearState } from './persistence.js';
import { gameStars, starsFor, XP } from '../utils/scoring.js';
const patchLevel = (state, id, fn) => ({ ...state, levels: { ...state.levels, [id]: fn(state.levels[id]) } });
const addXp = (state, amount) => ({ ...state, scoring: { xp: state.scoring.xp + amount } });
export const reducer = (state, action) => {
  switch (action.type) {
    case 'GO': return { ...state, route: action.route };
    case 'SET_NAME': return { ...state, nickname: action.name.trim().slice(0, 12) };
    case 'TOGGLE_SETTING': return { ...state, settings: { ...state.settings, [action.key]: !state.settings[action.key] } };
    case 'LESSON_COMPLETE': { const was = state.levels[action.level].lessons[action.index]; const next = patchLevel(state, action.level, (p) => ({ ...p, lessons: p.lessons.map((done, i) => i === action.index ? true : done) })); return was ? next : addXp(next, XP.lesson); }
    case 'GAME_COMPLETE': { const stars = gameStars(action.correct, action.total); const previous = state.levels[action.level].games[action.index]; const next = patchLevel(state, action.level, (p) => ({ ...p, games: p.games.map((game, i) => i === action.index ? { done: true, stars: Math.max(game.stars, stars) } : game) })); return addXp(next, previous.done ? Math.max(0, stars - previous.stars) * XP.gameStar : XP.game + stars * XP.gameStar); }
    case 'BOSS_COMPLETE': { const cfg = LEVELS[action.level]; const passed = action.correct >= cfg.passMark; const stars = starsFor(action.correct, action.total); const previous = state.levels[action.level].boss; if (!passed) return patchLevel(state, action.level, (p) => ({ ...p, boss: { ...p.boss, best: Math.max(p.boss.best, action.correct) } })); const next = patchLevel(state, action.level, (p) => ({ ...p, boss: { done: true, stars: Math.max(previous.stars, stars), best: Math.max(previous.best, action.correct) } })); return addXp(next, previous.done ? 0 : XP.boss + stars * XP.bossStar); }
    case 'MISCONCEPTION': return { ...state, misconceptions: { ...state.misconceptions, [action.tag]: (state.misconceptions[action.tag] || 0) + 1 } };
    case 'RESET': clearState(); return makeInitialState();
    default: return state;
  }
};
