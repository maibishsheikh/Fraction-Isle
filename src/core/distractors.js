import { frac, equals, mulRaw, divRaw, addRaw, subRaw } from './fraction/index.js';
export const productCandidates = (a, b) => [
  { f: addRaw(a, b), tag: 'ADD_INSTEAD_OF_MULT' }, { f: frac(a.n + b.n, a.d + b.d), tag: 'ADD_NUM_AND_DEN' },
  { f: a, tag: 'IGNORED_SECOND_FRACTION' }, { f: b, tag: 'IGNORED_SECOND_FRACTION' }, { f: frac(a.n * b.n, a.d + b.d), tag: 'MULT_TOPS_ADD_BOTTOMS' },
];
export const quotientCandidates = (total, piece) => [
  { f: mulRaw(total, piece), tag: 'MULTIPLY_INSTEAD' }, { f: divRaw(piece, total), tag: 'FLIPPED_WRONG_PART' },
  { f: frac(piece.d, 1), tag: 'USED_DEN_ONLY' }, { f: subRaw(total, piece), tag: 'SUBTRACT_INSTEAD' },
];
export const pickOptions = (correct, candidates, count = 3) => {
  const seen = [correct]; const out = [];
  for (const c of candidates) {
    if (out.length === count) break;
    if (c.f.n <= 0 || seen.some((x) => equals(x, c.f))) continue;
    seen.push(c.f); out.push(c);
  }
  return out;
};
