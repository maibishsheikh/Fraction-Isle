import { describe, expect, it } from 'vitest';
import { add, cmp, div, frac, gcd, mul, simplify, toMixed, fromMixed } from '../src/core/fraction/index.js';

describe('exact fraction core', () => {
  it('reduces and adds without floating point arithmetic', () => {
    expect(gcd(18, 24)).toBe(6);
    expect(simplify(frac(18, 24))).toEqual({ n: 3, d: 4 });
    expect(add(frac(1, 3), frac(1, 6))).toEqual({ n: 1, d: 2 });
  });
  it('multiplies and divides exactly', () => {
    expect(mul(frac(2, 3), frac(3, 4))).toEqual({ n: 1, d: 2 });
    expect(div(frac(3, 1), frac(1, 4))).toEqual({ n: 12, d: 1 });
  });
  it('compares by cross multiplication and round trips mixed numbers', () => {
    expect(cmp(frac(3, 5), frac(2, 3))).toBe(-1);
    expect(fromMixed(toMixed(frac(17, 5)))).toEqual(frac(17, 5));
  });
});
