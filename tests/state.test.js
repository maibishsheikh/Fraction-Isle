import { describe, expect, it } from 'vitest';
import { makeInitialState } from '../src/app/initialState.js';
import { reducer } from '../src/app/reducer.js';
import { levelUnlocked, nextNodeIndex, trailOf } from '../src/app/selectors.js';

describe('redesign v2 progression', () => {
  it('builds the Learn → Play trail and gates later stops', () => {
    const state = makeInitialState();
    expect(trailOf('beginner')).toHaveLength(9);
    expect(trailOf('beginner')[0]).toEqual({ kind: 'lesson', index: 0 });
    expect(trailOf('beginner')[1]).toEqual({ kind: 'game', index: 0 });
    expect(nextNodeIndex(state, 'beginner')).toBe(0);
    expect(levelUnlocked(state, 'builder')).toBe(false);
  });

  it('awards lesson XP once and opens the next level after a passed boss', () => {
    let state = makeInitialState();
    state = reducer(state, { type: 'LESSON_COMPLETE', level: 'beginner', index: 0 });
    expect(state.scoring.xp).toBe(15);
    state = reducer(state, { type: 'LESSON_COMPLETE', level: 'beginner', index: 0 });
    expect(state.scoring.xp).toBe(15);
    state = reducer(state, { type: 'BOSS_COMPLETE', level: 'beginner', correct: 4, total: 6 });
    expect(state.levels.beginner.boss.done).toBe(true);
    expect(levelUnlocked(state, 'builder')).toBe(true);
  });
});
