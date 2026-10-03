import { describe, expect, it } from 'vitest';
import { CONTENT } from '../src/content/v3.js';
import { isEqualCutsBar } from '../src/core/helpers.js';
import { evenCuts } from '../src/components/labs/WholeCutter.jsx';
import { frac, equals, mulRaw } from '../src/core/fraction/index.js';
import { pickOptions, productCandidates } from '../src/core/distractors.js';

const lab = CONTENT.beginner.labs[0];
const strings = (o) => (typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.entries(o).filter(([k]) => !['id', 'tag', 'c', 'narration'].includes(k)).flatMap(([, v]) => strings(v)) : []);

describe('Beginner Lab A', () => {
  it('shows no digits in any text', () => {
    const t = strings({ i: lab.intro, r: lab.remember, t: lab.title, g: lab.guided.map((g) => g.goal), c: lab.checkin.map((c) => [c.prompt, c.options.map((o) => o.text)]), l: lab.explore.checklist.map((c) => c.label) });
    expect(t.filter((s) => /\d/.test(s))).toEqual([]);
  });
  it('meets lab structure rules', () => {
    expect(lab.explore.checklist.filter((c) => c.required).length).toBeGreaterThanOrEqual(4);
    expect(lab.guided.length).toBeGreaterThanOrEqual(3);
    expect(lab.checkin).toHaveLength(2);
    lab.checkin.forEach((q) => { expect(q.options.filter((o) => o.id === q.correct)).toHaveLength(1); expect(new Set(q.options.map((o) => o.text)).size).toBe(q.options.length); });
  });
  it('guided cuts are verifiable and the spot-it bar is the only unfair one', () => {
    [2, 3, 4].forEach((n) => expect(isEqualCutsBar(evenCuts(n), 12, n)).toBe(true));
    const spot = lab.guided.find((g) => g.spot);
    const fairBar = (w) => w.every((x) => x === w[0]);
    expect(spot.bars.map(fairBar).filter((f) => !f)).toHaveLength(1);
    expect(fairBar(spot.bars[spot.odd])).toBe(false);
  });
});
describe('distractors', () => {
  it('never repeats the correct value', () => {
    const a = frac(2, 3); const b = frac(3, 4); const correct = mulRaw(a, b);
    const opts = pickOptions(correct, productCandidates(a, b));
    expect(opts.every((o) => !equals(o.f, correct))).toBe(true);
    expect(opts.length).toBe(3);
  });
});

import { validateContent } from '../src/utils/validateContent.js';
import { MISCONCEPTIONS } from '../src/content/misconceptions.js';
describe('validateContent', () => {
  it('passes for all levels', () => { expect(validateContent(CONTENT)).toEqual([]); });
  it('has feedback lines of at most 12 words and none say wrong', () => {
    Object.values(MISCONCEPTIONS).forEach((l) => { expect(l.split(/\s+/).length).toBeLessThanOrEqual(12); expect(/wrong/i.test(l)).toBe(false); });
  });
  it('Lab B guided targets are reachable', () => {
    CONTENT.beginner.labs[1].guided.forEach((g) => { const d = g.read ? g.read[1] : g.d; expect([2, 3, 4, 5, 6, 8]).toContain(d); });
  });
});

import { winnerOf } from '../src/components/games/CrabRace.jsx';
import { GADGETS } from '../src/components/labs/ShoreGadgets.jsx';
import { sortedAsc, longer } from '../src/components/labs/SliceRace.jsx';
describe('Beginner Labs C–D and Crab Race', () => {
  const [, , C, D] = CONTENT.beginner.labs;
  const crab = CONTENT.beginner.games[3];
  it('crab race has 7 rounds with the spec winners', () => {
    expect(crab.rounds).toHaveLength(7);
    expect(crab.rounds.map((r) => winnerOf(r.l, r.r))).toEqual(['l', 'l', 'r', 'r', 'r', 'r', 'same']);
  });
  it('guided gadget targets are reachable on their marks', () => {
    C.guided.forEach((t) => { const g = GADGETS.find((x) => x.key === t.gadget); expect(g.opts).toContain(t.p); expect((t.target[0] * t.p) % t.target[1]).toBe(0); });
  });
  it('slice race answers recompute', () => {
    const sort = D.guided.find((t) => t.type === 'sort');
    expect(sortedAsc(sort.items).map((f) => f.join('/'))).toEqual(['1/8', '1/6', '1/4', '1/3', '1/2']);
    expect(longer([1, 2], [1, 4])).toBe(0); expect(longer([3, 8], [5, 8])).toBe(1);
  });
});

import { FISHING } from '../src/content/beginner/fishing.js';
import { BUILDER_LABS } from '../src/content/builder/labs.js';
import { ADVANCED_LAB_A } from '../src/content/advanced/labs.js';
describe('Fishing, Wall and Area labs', () => {
  const val = (x) => (typeof x[0] === 'string' ? x[2] / x[1] : x[0] / x[1]);
  it('fishing: fish[0] matches the bait by value and no distractor does', () => {
    expect(FISHING.rounds).toHaveLength(8);
    FISHING.rounds.forEach((r) => { const b = val(r.bait); expect(Math.abs(val(r.fish[0].x) - b)).toBeLessThan(1e-9); r.fish.slice(1).forEach((f) => expect(Math.abs(val(f.x) - b)).toBeGreaterThan(1e-9)); });
  });
  it('wall guided targets land on whole cells', () => {
    Object.values(BUILDER_LABS).forEach((l) => l.guided.forEach((t) => expect((t.target[0] * t.row) % t.target[1]).toBe(0)));
  });
  it('area guided: columns/rows give the stated product', () => {
    ADVANCED_LAB_A.guided.forEach((t) => { expect(t.c).toBeLessThanOrEqual(t.cols); expect(t.r).toBeLessThanOrEqual(t.rows); });
    const t = ADVANCED_LAB_A.guided[2]; expect((t.c * t.r) / (t.cols * t.rows)).toBe(0.5);
  });
});

import { BUILDER_LAB_C } from '../src/content/builder/labC.js';
import { ADVANCED_LABS } from '../src/content/advanced/labsBCD.js';
import { shareOf } from '../src/components/labs/SetLab.jsx';
import { piecesIn } from '../src/components/labs/RibbonLab.jsx';
import { ACTIONS, spend } from '../src/components/labs/BarLab.jsx';
describe('Sale Shop, Ribbon, Bar model and Spinner labs', () => {
  it('sale shop tasks: groups divide the set; amounts match the spec', () => {
    BUILDER_LAB_C.guided.forEach((t) => expect(t.total % t.g).toBe(0));
    expect(BUILDER_LAB_C.guided.map((t) => shareOf(t.total, t.take, t.g))).toEqual([12, 9, 16]);
  });
  it('ribbon tasks: 2÷1/2=4, 2÷1/3=6, 3÷1/4=12', () => {
    expect(ADVANCED_LABS.b.guided.map((t) => piecesIn(t.len, t.d))).toEqual([4, 6, 12]);
  });
  it('bar tasks are playable and leave 16, 8, 6', () => {
    const left = ADVANCED_LABS.c.guided.map((t) => t.steps.reduce((l, s) => { const x = spend(t.T, l, ACTIONS[s]); expect(x).not.toBeNull(); return l - x; }, t.T));
    expect(left).toEqual([16, 8, 6]);
  });
  it('spinner tasks fit 12 sectors', () => { ADVANCED_LABS.d.guided.forEach((t) => expect(t.n).toBeLessThanOrEqual(12)); });
});

import { subsetsSummingTo } from '../src/core/helpers.js';
import { PIZZA, HUNT, BRIDGE } from '../src/content/games3.js';
describe('Pizza, Hunt, Bridge', () => {
  it('pizza orders fit a 12-notch bar', () => { PIZZA.rounds.forEach((r) => { expect(12 % r.N).toBe(0); expect(r.k).toBeLessThanOrEqual(r.N); }); });
  it('hunt: 3 correct items per scene, 6 total', () => { HUNT.rounds.forEach((s) => { expect(s.items).toHaveLength(6); expect(s.items.filter((x) => x.ok)).toHaveLength(3); s.items.filter((x) => !x.ok).forEach((x) => expect(x.why.length).toBeGreaterThan(0)); }); });
  it('every bridge round is solvable', () => { BRIDGE.rounds.forEach((r) => expect(subsetsSummingTo(r.planks.map(([n, d]) => frac(n, d)), frac(r.gap[0], r.gap[1])).length).toBeGreaterThan(0)); });
});

import * as G7 from '../src/content/games7.js';
import { ACTIONS as BAR_ACTIONS, spend as barSpend } from '../src/components/labs/BarLab.jsx';
describe('Builder/Advanced task games', () => {
  const all = Object.values(G7);
  it('every game is a tasks game with known misconception tags', () => { all.forEach((g) => { expect(g.kind).toBe('tasks'); g.rounds.forEach((r) => expect(MISCONCEPTIONS[r.tag]).toBeTruthy()); }); });
  it('every round is solvable', () => {
    all.forEach((g) => g.rounds.forEach((r) => {
      const t = r.task;
      if (r.sim === 'WallLab') expect((t.target[0] * t.row) % t.target[1]).toBe(0);
      if (r.sim === 'SetLab') { expect(t.total % t.g).toBe(0); expect(t.take).toBeLessThanOrEqual(t.g); }
      if (r.sim === 'AreaLab') { expect(t.c).toBeLessThanOrEqual(t.cols); expect(t.r).toBeLessThanOrEqual(t.rows); }
      if (r.sim === 'RibbonLab') expect(t.len * t.d).toBeGreaterThan(0);
      if (r.sim === 'BarLab') t.steps.reduce((l, s) => { const x = barSpend(t.T, l, BAR_ACTIONS[s]); expect(x).not.toBeNull(); return l - x; }, t.T);
      if (r.sim === 'SpinnerLab') expect(t.n).toBeLessThanOrEqual(12);
    }));
  });
  it('shop answers match the order text', () => { expect(G7.ISLAND_SHOP.rounds.map((r) => (r.task.total * r.task.take) / r.task.g)).toEqual([9, 15, 8, 16, 15]); });
  it('area products are right', () => { expect(G7.SUMMIT_GARDEN.rounds.map((r) => `${r.task.c * r.task.r}/${r.task.cols * r.task.rows}`)).toEqual(['1/4', '6/12', '1/6', '6/12']); });
});
