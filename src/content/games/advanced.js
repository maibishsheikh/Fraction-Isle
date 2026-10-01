export const advancedGames = [
  { id: 'slice-of-slice', title: 'Slice of a Slice', icon: '🥧', intro: 'Build an area model for a fraction of a fraction.', rounds: [
    { visual: 'area', prompt: '2/3 × 3/4 = ?', options: ['1/2', '6/7', '6/12'], correct: 0, explain: 'Six twelfths simplifies to one half.' },
    { visual: 'area', prompt: '1/2 × 4/5 = ?', options: ['2/5', '4/7', '5/8'], correct: 0, explain: 'Four tenths simplifies to 2/5.' },
    { visual: 'area', prompt: '3/4 × 2/3 = ?', options: ['1/2', '5/7', '6/7'], correct: 0, explain: 'Six twelfths is one half.' },
    { visual: 'area', prompt: '1/3 of 3/4 = ?', options: ['1/4', '3/7', '1/3'], correct: 0, explain: 'One third of three quarters is one quarter.' },
    { visual: 'area', prompt: 'Which picture shows a part of a part?', options: ['Grid with two shadings', 'One empty bar', 'A clock only'], correct: 0, explain: 'An area grid can show two fraction cuts.' },
  ] },
  { id: 'ribbon-cutter', title: 'Ribbon Cutter', icon: '🎀', intro: 'Divide ribbons and count how many equal parts fit.', rounds: [
    { visual: 'divide', prompt: '3 ÷ 1/4 = ?', options: ['12', '3/4', '4'], correct: 0, explain: 'Twelve quarter lengths fit in three wholes.' },
    { visual: 'divide', prompt: '1/2 ÷ 1/4 = ?', options: ['1/8', '2', '4'], correct: 1, explain: 'Two quarters fit in one half.' },
    { visual: 'divide', prompt: '2/3 ÷ 1/3 = ?', options: ['2', '1/9', '3'], correct: 0, explain: 'Two one-third groups fit in two thirds.' },
    { visual: 'divide', prompt: 'How many 1/5 lengths fit in 2 wholes?', options: ['5', '10', '2/5'], correct: 1, explain: 'Five fit in each whole, so ten fit in two.' },
    { visual: 'divide', prompt: 'Which answer is bigger than 3?', options: ['3 ÷ 1/4', '3 × 1/4', '3 − 1/4'], correct: 0, explain: 'Counting small groups can make the result grow.' },
  ] },
  { id: 'bar-model-detective', title: 'Bar-Model Detective', icon: '📊', intro: 'Use a bar to keep track of a multi-step story.', rounds: [
    { visual: 'bar', prompt: 'After spending 1/3, what remains?', options: ['1/3', '2/3', '3/3'], correct: 1, explain: 'The whole is three thirds.' },
    { visual: 'bar', prompt: 'Half of 2/3 is spent. What is left?', options: ['1/3', '1/2', '2/3'], correct: 0, explain: 'Half of 2/3 is 1/3, so 1/3 remains.' },
    { visual: 'bar', prompt: 'A bar model should show…', options: ['The whole and its parts', 'Only the answer', 'Only the numbers'], correct: 0, explain: 'The whole keeps the story visible.' },
    { visual: 'bar', prompt: 'Which answer is sensible for a remaining share?', options: ['A positive part of the whole', 'A negative whole', 'A random decimal'], correct: 0, explain: 'Check the whole and estimate first.' },
    { visual: 'bar', prompt: 'A learner uses the wrong whole. What helps?', options: ['Redraw the bar', 'Guess faster', 'Add denominators'], correct: 0, explain: 'A fresh model can show the correct whole.' },
  ] },
  { id: 'chance-lab', title: 'Chance Lab', icon: '🎡', intro: 'Use fractions to describe a chance.', rounds: [
    { visual: 'chance', prompt: 'Which chance is bigger?', options: ['1/4', '3/4', 'Same'], correct: 1, explain: 'Three of four parts is more.' },
    { visual: 'chance', prompt: '2 blue parts out of 6 simplifies to…', options: ['1/3', '2/6 only', '6/2'], correct: 0, explain: 'Divide top and bottom by 2.' },
    { visual: 'chance', prompt: 'A fair spinner has 4 equal parts. Chance of one colour?', options: ['1/4', '4/1', '1/2'], correct: 0, explain: 'One equal part out of four.' },
    { visual: 'chance', prompt: 'Which event is certain?', options: ['A whole spinner turn lands somewhere', 'Landing on one tiny colour', 'Picking a hidden card'], correct: 0, explain: 'The spinner must land somewhere.' },
    { visual: 'chance', prompt: 'What should you check before trusting a chance?', options: ['Are the parts equal?', 'Is the font large?', 'Is the answer fast?'], correct: 0, explain: 'Equal parts make fair chances.' },
  ] },
];
