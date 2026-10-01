export const builderLessons = [
  { id: 'm1-fraction-twins', title: 'Fraction Twins', sticker: '👯', remember: 'Different names. Same amount.', hook: 'Same amount, new name!', otto: 'Are the pieces the same size?', cards: [
    { kind: 'see', visual: 'equivalent', caption: 'Different names can show the same amount.' },
    { kind: 'try', visual: 'equivalent', prompt: 'Tap the twin of 1/2.', options: ['2/4', '1/3', '3/5'], correct: 0, hint: 'Double the top and bottom.' },
    { kind: 'check', visual: 'wall', prompt: 'Which fraction is a twin of 3/4?', options: ['6/8', '3/8', '4/5'], correct: 0, explain: 'Multiply both numbers by 2.' },
  ] },
  { id: 'm2-kitchen-fractions', title: 'Kitchen Fractions', sticker: '🥣', remember: 'Same-size pieces can be added.', hook: 'The café needs exact amounts!', otto: 'Are the pieces the same size?', cards: [
    { kind: 'see', visual: 'add', caption: 'Make pieces match before adding.' },
    { kind: 'try', visual: 'add', prompt: 'Tap the common denominator for 1/2 and 1/3.', options: ['5', '6', '9'], correct: 1, hint: 'Both 2 and 3 fit into 6.' },
    { kind: 'check', visual: 'add', prompt: '1/2 + 1/4 = ?', options: ['3/4', '2/6', '1/6'], correct: 0, explain: '1/2 is 2/4. Then 2/4 + 1/4 = 3/4.' },
  ] },
  { id: 'm3-shop-save', title: 'Shop & Save', sticker: '🏷️', remember: 'Split groups. Take some groups.', hook: 'Sale day at the island shop!', otto: 'How many equal groups?', cards: [
    { kind: 'see', visual: 'groups', caption: 'Bottom: groups in all. Top: groups we take.' },
    { kind: 'try', visual: 'groups', prompt: 'What is 3/4 of 12 mangoes?', options: ['3', '9', '12'], correct: 1, hint: 'Make 4 equal groups, then take 3.' },
    { kind: 'check', visual: 'groups', prompt: 'What is 1/3 of 12 apples?', options: ['4', '3', '8'], correct: 0, explain: 'Twelve split into three groups gives four.' },
  ] },
  { id: 'm4-time-measure', title: 'Time & Measure', sticker: '⏰', remember: 'Use same-size pieces to compare.', hook: 'Practice lasts 3/4 of an hour!', otto: 'Are the pieces the same size?', cards: [
    { kind: 'see', visual: 'clock', caption: 'A quarter hour is 15 minutes.' },
    { kind: 'try', visual: 'clock', prompt: 'Tap the minutes in 3/4 of an hour.', options: ['15', '30', '45'], correct: 2, hint: 'Three groups of 15 minutes.' },
    { kind: 'check', visual: 'compare', prompt: 'Which rope is longer?', options: ['2/3 m', '3/4 m', 'Same'], correct: 1, explain: 'In twelfths, 9/12 is longer than 8/12.' },
  ] },
];
