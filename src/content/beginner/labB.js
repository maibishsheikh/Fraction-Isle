const say = (text) => ({ text, narration: text });
const q = (id, prompt, correct, wrong, visual) => ({ id, prompt, narration: prompt, visual, options: [{ id: 'yes', text: correct }, ...wrong.map(([text, tag], i) => ({ id: `no${i}`, text, tag }))], correct: 'yes', hints: [{ text: 'Count every equal part.', narration: 'Count every equal part.' }], explain: 'Bottom counts all parts.', explainNarration: 'Bottom counts all parts.' });

export const LAB_B = {
  title: 'Name It', remember: 'Bottom: parts in all. Top: parts we take.',
  intro: say('Shade parts and watch the fraction change.'),
  explore: { c: 'FractionBuilder', parts: 4, shaded: 0, checklist: [
    { key: 'one', label: 'Make a fraction with 1 on top', required: true }, { key: 'three', label: 'Make one with 3 on top', required: true },
    { key: 'bottom', label: 'Change the bottom number', required: true }, { key: 'whole', label: 'Count up to a whole', required: true },
    { key: 'stars', label: 'Shade 3/8 of the stars', required: false },
  ] },
  guided: [
    { id: 'b-b-0', goal: 'Bar: show 2/3.', narration: 'Bar: show two thirds.', shape: 'bar', n: 2, d: 3, start: 4 },
    { id: 'b-b-1', goal: 'Bar: show 5/6.', narration: 'Bar: show five sixths.', shape: 'bar', n: 5, d: 6, start: 4 },
    { id: 'b-b-2', goal: 'Stars: show 3/8.', narration: 'Stars: show three eighths.', shape: 'stars', n: 3, d: 8 },
    { id: 'b-b-3', goal: 'Make the bar read 3/4.', narration: 'Make the bar read three fourths.', shape: 'bar', read: [3, 4], start: 6 },
  ],
  checkin: [
    q('bb1', 'What fraction is shaded?', '2/5', [['5/2', 'SWAP_NUM_DEN'], ['2/3', 'SHADED_OVER_UNSHADED'], ['3/5', 'UNSHADED_OVER_TOTAL']], { parts: 5, shaded: 2 }),
    q('bb2', 'Which number tells how many parts in ALL?', 'The bottom number', [['The top number', 'SWAP_NUM_DEN']], { parts: 4, shaded: 3 }),
  ],
};
