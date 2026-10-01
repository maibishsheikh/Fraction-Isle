export const beginnerGames = [
  { id: 'pizza-slicer', title: 'Pizza Party Slicer', icon: '🍕', intro: 'Cut fair slices, then serve the order.', rounds: [
    { visual: 'equal', prompt: 'Cut the pizza into equal parts.', options: ['2 equal parts', '2 unequal parts'], correct: 0, explain: 'Equal cuts make fair shares.' },
    { visual: 'fraction', prompt: 'Serve 1 of 2 slices.', options: ['1/2', '2/1'], correct: 0, explain: 'One chosen slice out of two is 1/2.' },
    { visual: 'fraction', prompt: 'Serve 3 of 4 slices.', options: ['3/4', '1/4', '4/3'], correct: 0, explain: 'Three chosen slices out of four is 3/4.' },
    { visual: 'fraction', prompt: 'Serve 5 of 6 chocolate pieces.', options: ['5/6', '6/5', '1/6'], correct: 0, explain: 'Five of six pieces is 5/6.' },
    { visual: 'fraction', prompt: 'Serve 2 of 3 slices.', options: ['2/3', '3/2', '1/3'], correct: 0, explain: 'Two of three slices is 2/3.' },
  ] },
  { id: 'fraction-fishing', title: 'Fraction Fishing', icon: '🎣', intro: 'Catch the fish that matches the picture.', rounds: [
    { visual: 'fraction', prompt: 'Catch one half.', options: ['1/2', '2/1', '1/3'], correct: 0, explain: 'One shaded part out of two.' },
    { visual: 'fraction', prompt: 'Catch one fourth.', options: ['4/1', '1/4', '1/3'], correct: 1, explain: 'One shaded part out of four.' },
    { visual: 'fraction', prompt: 'Catch three fourths.', options: ['3/4', '4/3', '1/4'], correct: 0, explain: 'Three shaded parts out of four.' },
    { visual: 'fraction', prompt: 'Catch two thirds.', options: ['3/2', '1/3', '2/3'], correct: 2, explain: 'Two shaded parts out of three.' },
    { visual: 'fraction', prompt: 'Catch five sixths.', options: ['1/6', '5/6', '6/5'], correct: 1, explain: 'Five shaded parts out of six.' },
  ] },
  { id: 'fraction-hunt', title: 'Fraction Hunt', icon: '🔍', intro: 'Find fractions hiding in the world.', rounds: [
    { visual: 'uses', prompt: 'Find the picture that shows 1/2.', options: ['Half a watermelon', 'One whole mango', '1 of 3 bananas'], correct: 0, explain: 'Half means one of two equal parts.' },
    { visual: 'uses', prompt: 'Find the picture that shows 1/4.', options: ['3/4 full glass', 'Quarter sandwich', 'One whole cake'], correct: 1, explain: 'A quarter is one of four equal parts.' },
    { visual: 'uses', prompt: 'Find the picture that shows 3/4.', options: ['1/4 full cup', '3/4 full cup', '1/3 pie'], correct: 1, explain: 'Three of four equal parts are full.' },
    { visual: 'uses', prompt: 'Find a fraction used for time.', options: ['Half an hour', 'A whole shoe', 'One ball'], correct: 0, explain: 'Fractions can describe time.' },
    { visual: 'uses', prompt: 'Find a fraction used for measuring.', options: ['Half a metre', 'One whole hat', 'A full box'], correct: 0, explain: 'Fractions can describe a measure.' },
  ] },
  { id: 'crab-race', title: 'Crab Race', icon: '🦀', intro: 'Predict which fraction reaches farther.', rounds: [
    { visual: 'compare', prompt: 'Which crab goes farther?', options: ['1/2', '1/4'], correct: 0, explain: 'Half is farther than a quarter.' },
    { visual: 'compare', prompt: 'Which crab goes farther?', options: ['1/6', '1/3'], correct: 1, explain: 'Thirds are bigger than sixths.' },
    { visual: 'compare', prompt: 'Which crab goes farther?', options: ['1/8', '1/4'], correct: 1, explain: 'Fourths are bigger than eighths.' },
    { visual: 'compare', prompt: 'Which crab goes farther?', options: ['2/6', '5/6'], correct: 1, explain: 'Same-size pieces: five wins.' },
    { visual: 'compare', prompt: 'What is the result?', options: ['1/2 and 2/4 are twins', '1/2 is smaller', '2/4 is bigger'], correct: 0, explain: 'Different names can show the same distance.' },
  ] },
];
