import { addRaw, equals, frac } from './fraction/index.js';
export const isEqualCutsCircle = (positions, total, n) => {
  if (positions.length !== n || new Set(positions).size !== n) return false;
  const p = [...positions].sort((a, b) => a - b);
  return p.every((x, i) => ((p[(i + 1) % n] - x + total) % total || total) === total / n);
};
export const isEqualCutsBar = (cuts, total, n) => {
  if (cuts.length !== n - 1 || new Set(cuts).size !== n - 1) return false;
  const p = [0, ...[...cuts].sort((a, b) => a - b), total];
  return p.slice(1).every((x, i) => x - p[i] === total / n);
};
export const splitIntoGroups = (count, n) => ({ rows: n, perRow: Math.floor(count / n), leftover: count % n });
export const canGroup = (num, den, g) => g > 1 && num % g === 0 && den % g === 0;
export const alignedRows = (pos, rows) => rows.filter((r) => (pos.n * r) % pos.d === 0);
export const subsetsSummingTo = (planks, gap) => { const out = []; const go = (i, sum, picked) => { if (equals(sum, gap)) out.push(picked); if (i === planks.length) return; for (let j = i; j < planks.length; j += 1) go(j + 1, addRaw(sum, planks[j]), [...picked, j]); }; go(0, frac(0, 1), []); const key = (idx) => idx.map((j) => `${planks[j].n}/${planks[j].d}`).sort().join('+'); return [...new Set(out.map(key))]; };
