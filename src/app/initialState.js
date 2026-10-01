import { LEVELS, LEVEL_ORDER } from '../config/levels.js';

export const makeLevelProgress = (levelId) => ({
  wonder: false, story: false,
  labs: Array(LEVELS[levelId].labCount).fill(false),
  games: Array.from({ length: LEVELS[levelId].gameCount }, () => ({ done: false, stars: 0 })),
  boss: { done: false, stars: 0, best: 0 },
});
export const makeInitialState = () => ({
  version: 3, route: { screen: 'home' }, nickname: '',
  settings: { audio: true, calmMotion: false, unlockAll: false }, scoring: { xp: 0 },
  levels: Object.fromEntries(LEVEL_ORDER.map((id) => [id, makeLevelProgress(id)])), misconceptions: {}, seen: {},
});
export const initialState = makeInitialState();
