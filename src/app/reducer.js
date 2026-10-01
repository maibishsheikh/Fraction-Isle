import { initialState, makeLevelProgress } from './initialState.js';
import { clearState } from './persistence.js';

export const reducer = (state, action) => {
  switch (action.type) {
    case 'START': return { ...state, nickname: action.nickname.trim().slice(0, 12), phase: 'wonder' };
    case 'SET_PHASE': return { ...state, phase: action.phase };
    case 'SET_LEVEL': return { ...state, level: action.level };
    case 'TOGGLE_AUDIO': return { ...state, audioEnabled: !state.audioEnabled };
    case 'TOGGLE_MOTION': return { ...state, calmMotion: !state.calmMotion };
    case 'WONDER_NEXT': return action.done ? { ...state, wonderDone: true, phase: 'story' } : { ...state, wonderStep: state.wonderStep + 1 };
    case 'STORY_NEXT': return { ...state, levels: { ...state.levels, [state.level]: { ...state.levels[state.level], storyPanel: Math.min(2, state.levels[state.level].storyPanel + 1) } }, phase: action.last ? 'simulate' : state.phase };
    case 'STORY_PREV': return { ...state, levels: { ...state.levels, [state.level]: { ...state.levels[state.level], storyPanel: Math.max(0, state.levels[state.level].storyPanel - 1) } } };
    case 'STATION_COMPLETE': {
      const progress = state.levels[state.level];
      const stations = progress.stations.map((done, index) => index === action.station ? true : done);
      return { ...state, levels: { ...state.levels, [state.level]: { ...progress, stations } }, scoring: { ...state.scoring, xp: state.scoring.xp + 25 }, phase: action.allDone ? 'play' : state.phase };
    }
    case 'ANSWER': {
      const progress = state.levels[state.level];
      const questions = progress.questions.map((done, index) => index === action.index ? true : done);
      const answers = [...progress.answers, { index: action.index, correct: action.correct }];
      const streak = action.correct ? state.scoring.streak + 1 : 0;
      return { ...state, levels: { ...state.levels, [state.level]: { ...progress, questions, answers } }, scoring: { ...state.scoring, xp: state.scoring.xp + (action.correct ? 12 : 0), streak, maxStreak: Math.max(streak, state.scoring.maxStreak) }, misconceptions: action.tag && !action.correct ? { ...state.misconceptions, [action.tag]: (state.misconceptions[action.tag] || 0) + 1 } : state.misconceptions };
    }
    case 'LEVEL_COMPLETE': return { ...state, levels: { ...state.levels, [state.level]: { ...state.levels[state.level], stars: action.stars, boss: true } }, phase: action.nextLevel ? 'story' : 'reflect', level: action.nextLevel || state.level };
    case 'REFLECT_DONE': return { ...state, reflectDone: true, phase: 'certificate' };
    case 'NEW_GAME': clearState(); return { ...initialState };
    default: return state;
  }
};
