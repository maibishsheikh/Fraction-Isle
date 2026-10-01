import { describe, expect, it } from 'vitest';
import { frac } from '../src/core/fraction/index.js';
import { alignedRows, canGroup, isEqualCutsBar, isEqualCutsCircle, splitIntoGroups, subsetsSummingTo } from '../src/core/helpers.js';
describe('visual interaction helpers', () => {
  it('recognises fair cuts', () => { expect(isEqualCutsCircle([0, 6, 12, 18], 24, 4)).toBe(true); expect(isEqualCutsCircle([0, 5, 12, 18], 24, 4)).toBe(false); expect(isEqualCutsBar([6, 12, 18], 24, 4)).toBe(true); });
  it('handles exact group and wall arithmetic', () => { expect(splitIntoGroups(14, 4)).toEqual({ rows: 4, perRow: 3, leftover: 2 }); expect(canGroup(6, 12, 2)).toBe(true); expect(alignedRows(frac(1, 2), [2, 3, 4, 6, 8, 12])).toEqual([2, 4, 6, 8, 12]); });
  it('finds bridge combinations with exact fractions', () => { expect(subsetsSummingTo([frac(1, 2), frac(1, 3), frac(1, 6)], frac(1, 1))).toContain('1/2+1/3+1/6'); });
});
