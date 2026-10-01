export const beginnerLessons = [
  { id: 'b1-fair-shares', title: 'Fair Shares', sticker: '🍕', remember: 'Equal parts. Same size.', hook: 'Four friends. One pizza!', otto: 'Are the pieces equal?', cards: [
    { kind: 'see', visual: 'equal', caption: 'Fair shares are the same size.' },
    { kind: 'try', visual: 'equal', prompt: 'Tap the fair share.', options: ['Equal pieces', 'Unequal pieces'], correct: 0, hint: 'Look for matching pieces.' },
    { kind: 'check', visual: 'fraction', prompt: 'Which picture shows fair shares?', options: ['4 equal pieces', '4 unequal pieces'], correct: 0, explain: 'Fair shares have equal pieces.' },
  ] },
  { id: 'b2-name-parts', title: 'Name the Parts', sticker: '🔢', remember: 'Top: chosen. Bottom: all.', hook: 'How do we name a share?', otto: 'How many parts in all?', cards: [
    { kind: 'see', visual: 'fraction', caption: 'Bottom counts all. Top counts chosen.' },
    { kind: 'try', visual: 'shade', prompt: 'Tap the fraction that shows 3 of 4.', options: ['3/4', '4/3'], correct: 0, hint: 'The bottom number counts every part.' },
    { kind: 'check', visual: 'fraction', prompt: 'What fraction is shaded?', options: ['2/5', '5/2', '3/5'], correct: 0, explain: 'Two shaded parts out of five is 2/5.' },
  ] },
  { id: 'b3-fractions-everywhere', title: 'Fractions Everywhere', sticker: '🌍', remember: 'Fractions show part of a whole.', hook: 'Where do fractions hide?', otto: 'What is the whole?', cards: [
    { kind: 'see', visual: 'uses', caption: 'Fractions help us share and measure.' },
    { kind: 'try', visual: 'uses', prompt: 'Tap a real fraction use.', options: ['Half a pizza', 'A whole ball'], correct: 0, hint: 'A fraction shows part of a whole.' },
    { kind: 'check', visual: 'cup', prompt: 'A bottle has 2 equal parts. One is full. What fraction?', options: ['1/2', '2/1', '1/3'], correct: 0, explain: 'One of two equal parts is 1/2.' },
  ] },
  { id: 'b4-bigger-smaller', title: 'Bigger or Smaller?', sticker: '⚖️', remember: 'More pieces means smaller pieces.', hook: 'Which piece is bigger?', otto: 'Are the pieces the same size?', cards: [
    { kind: 'see', visual: 'compare', caption: 'More cuts make smaller pieces.' },
    { kind: 'try', visual: 'compare', prompt: 'Tap the longer piece.', options: ['1/3', '1/5'], correct: 0, hint: 'Fewer cuts make bigger pieces.' },
    { kind: 'check', visual: 'compare', prompt: 'Which is bigger?', options: ['1/3', '1/5', 'Same'], correct: 0, explain: 'Thirds are bigger than fifths.' },
  ] },
];
