import { describe, expect, it } from 'vitest';
import { makeInitialState } from '../src/app/initialState.js';
import { reducer } from '../src/app/reducer.js';
import { hydrate } from '../src/app/persistence.js';
import { levelUnlocked, nextNodeIndex, nodeStatus, trailOf } from '../src/app/selectors.js';

describe('v3 journey state', () => {
  it('uses the eleven-node Wonder to Boss trail and gates it in order', () => {
    const state = makeInitialState();
    expect(trailOf('beginner')).toHaveLength(11);
    expect(trailOf('beginner').slice(0, 3)).toEqual([{ kind: 'wonder', index: 0 }, { kind: 'story', index: 0 }, { kind: 'lab', index: 0 }]);
    expect(nodeStatus(state, 'beginner', 0)).toBe('available');
    expect(nodeStatus(state, 'beginner', 1)).toBe('locked');
    expect(nextNodeIndex(state, 'beginner')).toBe(0);
  });
  it('awards replay XP once and never lowers game stars', () => {
    let state = makeInitialState();
    state = reducer(state, { type: 'WONDER_COMPLETE', level: 'beginner' });
    expect(state.scoring.xp).toBe(10);
    state = reducer(state, { type: 'WONDER_COMPLETE', level: 'beginner' });
    expect(state.scoring.xp).toBe(10);
    state = reducer(state, { type: 'GAME_COMPLETE', level: 'beginner', index: 0, correct: 3, total: 3 });
    state = reducer(state, { type: 'GAME_COMPLETE', level: 'beginner', index: 0, correct: 1, total: 3 });
    expect(state.levels.beginner.games[0].stars).toBe(3);
  });
  it('only unlocks Builder after a passed boss and never restores routes', () => {
    let state = makeInitialState();
    state = reducer(state, { type: 'BOSS_COMPLETE', level: 'beginner', correct: 3, total: 6 });
    expect(levelUnlocked(state, 'builder')).toBe(false);
    state = reducer(state, { type: 'BOSS_COMPLETE', level: 'beginner', correct: 4, total: 6 });
    expect(levelUnlocked(state, 'builder')).toBe(true);
    expect(hydrate({ ...state, route: { screen: 'boss', level: 'advanced' } }).route).toEqual({ screen: 'home' });
    expect(hydrate({ version: 2 }).version).toBe(3);
  });
});
