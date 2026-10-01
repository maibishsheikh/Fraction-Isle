import { LEVELS, LEVEL_ORDER } from '../config/levels.js';

export const makeLevelProgress = (levelId) => ({
  lessons: Array(LEVELS[levelId].lessonCount).fill(false),
  games: Array.from({ length: LEVELS[levelId].gameCount }, () => ({ done: false, stars: 0 })),
  boss: { done: false, stars: 0, best: 0 },
});

export const makeInitialState = () => ({
  version: 2,
  route: { screen: 'home' },
  nickname: '',
  settings: { audio: true, calmMotion: false, unlockAll: false },
  scoring: { xp: 0 },
  levels: Object.fromEntries(LEVEL_ORDER.map((id) => [id, makeLevelProgress(id)])),
  misconceptions: {},
});

export const initialState = makeInitialState();
