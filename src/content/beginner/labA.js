// Beginner Lab A — "Break the Crystal". No digits in any spoken or shown text (spec §9.3).
const say = (text) => ({ text, narration: text });
const q = (id, prompt, correct, wrong, parts) => ({ id, prompt, narration: prompt, visual: { c: 'FractionBar', p: parts }, options: [{ id: 'yes', text: correct }, ...wrong.map(([text, tag], i) => ({ id: `no${i}`, text, tag }))], correct: 'yes', hints: [{ text: 'Look at the size of each piece.', narration: 'Look at the size of each piece.' }], explain: 'That picture shows it clearly.', explainNarration: 'That picture shows it clearly.' });

export const LAB_A = {
  title: 'Break the Crystal', remember: 'A fraction is equal parts of one whole.',
  intro: say('Cut one whole into fair pieces.'),
  explore: {
    c: 'WholeCutter', parts: 4, shaded: 0,
    checklist: [
      { key: 'halves', label: 'Make halves', required: true }, { key: 'thirds', label: 'Make thirds', required: true },
      { key: 'fourths', label: 'Make fourths', required: true }, { key: 'unfair', label: 'See an unfair cut wobble', required: true },
      { key: 'hand', label: 'Cut fairly by hand', required: true }, { key: 'named', label: 'Name a piece in two cuts', required: true },
      { key: 'rebuilt', label: 'Rebuild the crystal', required: true },
    ],
  },
  guided: [
    { id: 'b-a-0', goal: 'Hand-cut the bar into two equal parts.', narration: 'Hand-cut the bar into two equal parts.', n: 2 },
    { id: 'b-a-1', goal: 'Hand-cut the bar into three equal parts.', narration: 'Hand-cut the bar into three equal parts.', n: 3 },
    { id: 'b-a-2', goal: 'Hand-cut the bar into four equal parts.', narration: 'Hand-cut the bar into four equal parts.', n: 4 },
    { id: 'b-a-3', goal: 'Find the pizza that is not fair.', narration: 'Find the pizza that is not fair.', spot: true, odd: 1, bars: [[3, 3, 3, 3], [1, 2, 4, 5], [6, 6]] },
  ],
  checkin: [
    q('ba1', 'Which pizza is cut into fair shares?', 'Four slices, all the same size', [['Four slices, different sizes', 'UNEQUAL_PARTS_COUNTED'], ['Three slices, different sizes', 'UNEQUAL_PARTS_COUNTED']], { parts: 4, shaded: 0 }),
    q('ba2', 'A bar is cut into three equal parts. Each part is a…', 'third', [['half', 'WRONG_TOTAL'], ['fourth', 'WRONG_TOTAL']], { parts: 3, shaded: 1 }),
  ],
};
