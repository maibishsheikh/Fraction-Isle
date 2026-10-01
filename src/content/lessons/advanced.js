export const advancedLessons = [
  { id: 'a1-slice-slice', title: 'A Slice of a Slice', sticker: '✖️', remember: 'Multiply to find a part of a part.', hook: 'A slice inside a slice!', otto: 'What part is shaded twice?', cards: [
    { kind: 'see', visual: 'area', caption: 'A grid shows a part of a part.' },
    { kind: 'try', visual: 'area', prompt: 'Tap the product of 2/3 × 3/4.', options: ['1/2', '6/7', '6/12'], correct: 0, hint: 'Multiply tops and bottoms, then simplify.' },
    { kind: 'check', visual: 'area', prompt: '2/3 × 3/4 = ?', options: ['1/2', '5/7', '3/4'], correct: 0, explain: '6/12 simplifies to 1/2.' },
  ] },
  { id: 'a2-how-many-fit', title: 'How Many Fit?', sticker: '➗', remember: 'Division can count groups.', hook: 'How many quarter steps fit?', otto: 'How many groups fit?', cards: [
    { kind: 'see', visual: 'divide', caption: 'Division can count how many groups fit.' },
    { kind: 'try', visual: 'divide', prompt: 'How many quarters fit in 3 wholes?', options: ['3', '7', '12'], correct: 2, hint: 'Four quarters fit in each whole.' },
    { kind: 'check', visual: 'divide', prompt: '3 ÷ 1/4 = ?', options: ['12', '3/4', '4'], correct: 0, explain: 'Twelve quarter-groups fit in three wholes.' },
  ] },
  { id: 'a3-bar-model', title: 'Bar-Model Detective', sticker: '📊', remember: 'Track the whole and the remainder.', hook: 'Follow the whole story!', otto: 'Does the answer make sense?', cards: [
    { kind: 'see', visual: 'bar', caption: 'A bar keeps every part in view.' },
    { kind: 'try', visual: 'bar', prompt: 'A third is spent. What remains?', options: ['1/3', '2/3', '3/3'], correct: 1, hint: 'The whole is three thirds.' },
    { kind: 'check', visual: 'bar', prompt: 'Half of the 2/3 remainder is spent. What is left?', options: ['1/3', '1/2', '2/3'], correct: 0, explain: 'Half of 2/3 is 1/3, so 1/3 remains.' },
  ] },
  { id: 'a4-chance-lab', title: 'Chance Lab', sticker: '🎡', remember: 'Fractions can describe chance.', hook: 'Spin, predict, explain!', otto: 'Does the answer make sense?', cards: [
    { kind: 'see', visual: 'chance', caption: 'A fraction can show how likely something is.' },
    { kind: 'try', visual: 'chance', prompt: 'Which chance is bigger?', options: ['1/4', '3/4', 'Same'], correct: 1, hint: 'More shaded space means more chance.' },
    { kind: 'check', visual: 'chance', prompt: 'A spinner has 2 blue parts and 6 equal parts. Chance of blue?', options: ['1/3', '2/6 only', '6/2'], correct: 0, explain: '2/6 simplifies to 1/3.' },
  ] },
];
