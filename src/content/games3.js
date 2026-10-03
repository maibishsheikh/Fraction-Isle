const it = (e, p, ok, why = '') => ({ e, p, ok, why });
const meta = (title, icon, kind, rounds) => ({ title, icon, kind, intro: title, narration: title, rounds });
export const PIZZA = meta('Pizza Party Slicer', '🍕', 'pizza', [
  { N: 2, k: 1, order: 'Half a pizza, please!' }, { N: 4, k: 1, order: 'One quarter, please!' }, { N: 4, k: 3, order: 'Three of the four slices!' },
  { N: 3, k: 2, order: 'Two of the three slices!' }, { N: 6, k: 5, order: 'Five of the six pieces!' }]);
export const HUNT = meta('Fraction Hunt', '🔎', 'hunt', [
  { title: 'Island Market', target: [1, 2], items: [it('🍉', ['pie', 2, 1], true), it('🧴', ['cup', 2, 1], true), it('🥥', ['pie', 2, 1], true), it('🍰', ['uneven', 3, 1], false, 'the pieces are not equal.'), it('🍌', ['set', 3, 1], false, 'one of three is a third.'), it('🥭', ['pie', 1, 1], false, 'an uncut mango is one whole.')] },
  { title: 'Beach Café', target: [1, 4], items: [it('🥪', ['bar', 4, 1], true), it('🔋', ['bar', 4, 1], true), it('🕒', ['clock', 4, 1], true), it('🥧', ['pie', 3, 1], false, 'one of three is a third.'), it('🥛', ['cup', 4, 3], false, 'that is three fourths.'), it('🍕', ['uneven', 3, 1], false, 'the slices are not equal.')] },
  { title: 'Fun Park', target: [3, 4], items: [it('🥤', ['cup', 4, 3], true), it('🎠', ['set', 4, 3], true), it('🎈', ['set', 4, 3], true), it('🎈', ['set', 8, 3], false, 'that is three eighths.'), it('🍕', ['pie', 6, 3], false, 'three of six is a half.'), it('🧃', ['cup', 4, 1], false, 'that is one fourth.')] }]);
export const BRIDGE = meta('Bridge Builder', '🌉', 'bridge', [
  { gap: [1, 1], planks: [[1, 2], [1, 4], [1, 4], [1, 3]] }, { gap: [3, 4], planks: [[1, 2], [1, 4], [1, 3], [1, 6]] },
  { gap: [5, 6], planks: [[1, 2], [1, 3], [1, 6], [1, 4]] }, { gap: [1, 1], planks: [[1, 3], [1, 3], [1, 3], [1, 2]] }]);
