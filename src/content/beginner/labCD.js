const say = (text) => ({ text, narration: text });
const q = (id, prompt, correct, wrong, visual) => ({ id, prompt, narration: prompt, visual, options: [{ id: 'yes', text: correct }, ...wrong.map(([text, tag], i) => ({ id: `no${i}`, text, tag }))], correct: 'yes', hints: [{ text: 'Look at the picture.', narration: 'Look at the picture.' }], explain: 'The picture shows it.', explainNarration: 'The picture shows it.' });
const g = (id, goal, extra) => ({ id, goal, narration: goal, ...extra });

export const LAB_C = {
  title: 'Shore Town', remember: 'Fractions tell how much of a whole.',
  intro: say('Fix five gadgets around Shore Town.'),
  explore: { c: 'ShoreGadgets', parts: 4, shaded: 0, checklist: [
    { key: 'sandwich', label: 'Make half a sandwich', required: true }, { key: 'bottle', label: 'Make the bottle half full', required: true },
    { key: 'clock', label: 'Show quarter past', required: true }, { key: 'battery', label: 'Charge to three quarters', required: true },
    { key: 'line', label: 'Put the flag halfway', required: true },
  ] },
  guided: [
    g('b-c-0', 'Drag the flag to 1/2.', { gadget: 'line', p: 2, target: [1, 2] }),
    g('b-c-1', 'Put the flag at 3/4.', { gadget: 'line', p: 4, target: [3, 4] }),
    g('b-c-2', 'Fill the bottle 1/4 full.', { gadget: 'bottle', p: 4, target: [1, 4] }),
    g('b-c-3', 'Set the clock to half past.', { gadget: 'clock', p: 4, target: [1, 2] }),
  ],
  checkin: [
    q('bc1', 'A bottle has 2 equal parts. One is full. What fraction?', '1/2', [['2/1', 'SWAP_NUM_DEN'], ['1/3', 'WRONG_TOTAL'], ['2/3', 'WRONG_TOTAL']], { parts: 2, shaded: 1 }),
    q('bc2', 'The flag is halfway from 0 to 1. Which fraction?', '1/2', [['1/4', 'WRONG_TOTAL'], ['2/1', 'SWAP_NUM_DEN']], { parts: 2, shaded: 1 }),
  ],
};
export const LAB_D = {
  title: 'Slice Race', remember: 'More pieces means smaller pieces.',
  intro: say('Cut the bar and compare the pieces.'),
  explore: { c: 'SliceRace', parts: 2, shaded: 0, checklist: [
    { key: 'keep3', label: 'Keep 3 different pieces', required: true }, { key: 'sorted', label: 'Sort the piece ruler', required: true },
    { key: 'm38', label: 'Make 3/8', required: true }, { key: 'm58', label: 'Make 5/8', required: true },
    { key: 'keep7', label: 'Keep all seven pieces', required: false },
  ] },
  guided: [
    g('b-d-0', 'Tap the longer piece.', { type: 'longer', a: [1, 2], b: [1, 4] }),
    g('b-d-1', 'Line them up, shortest to longest.', { type: 'sort', items: [[1, 4], [1, 2], [1, 8], [1, 3], [1, 6]] }),
    g('b-d-2', 'Same-size pieces: tap the longer.', { type: 'longer', a: [3, 8], b: [5, 8] }),
  ],
  checkin: [
    q('bd1', 'Which is bigger?', '1/3', [['1/5', 'BIG_DENOM_BIG_FRACTION'], ['Same', 'COUNT_PIECES_ONLY']], { parts: 3, shaded: 1 }),
    q('bd2', 'Which is bigger?', '5/8', [['3/8', 'SAME_BOTTOM_COMPARE_SLIP'], ['Same', 'COUNT_PIECES_ONLY']], { parts: 8, shaded: 5 }),
  ],
};
export const CRAB_GAME = { title: 'Crab Race', icon: '🦀', kind: 'crab', intro: 'Pick the farther crab, then race!', narration: 'Pick the farther crab, then race!', rounds: [
  { l: [1, 2], r: [1, 4], line: 'Fewer cuts make bigger pieces.', tag: 'BIG_DENOM_BIG_FRACTION' },
  { l: [1, 3], r: [1, 6], line: 'Thirds are bigger than sixths.', tag: 'BIG_DENOM_BIG_FRACTION' },
  { l: [1, 8], r: [1, 4], line: 'Eight pieces are smaller than four.', tag: 'BIG_DENOM_BIG_FRACTION' },
  { l: [2, 6], r: [5, 6], line: 'Same-size pieces: more pieces wins.', tag: 'COUNT_PIECES_ONLY' },
  { l: [3, 8], r: [3, 4], line: 'Same number of pieces: bigger pieces win.', tag: 'BIG_DENOM_BIG_FRACTION' },
  { l: [3, 8], r: [1, 2], line: 'Half is four of eight pieces.', tag: 'COUNT_PIECES_ONLY' },
  { l: [1, 2], r: [2, 4], line: 'Different names, same distance. Twins!', tag: 'NO_EQUIVALENCE_IDEA' },
] };
