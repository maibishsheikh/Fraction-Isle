export const builderGames = [
  { id: 'reef-twins', title: 'Reef Twins', icon: '🐚', intro: 'Match fractions with the same value.', rounds: [
    { visual: 'equivalent', prompt: 'Find the twin of 1/2.', options: ['2/4', '2/3', '3/5'], correct: 0, explain: 'Double both numbers: 1/2 = 2/4.' },
    { visual: 'equivalent', prompt: 'Find the twin of 2/3.', options: ['3/6', '4/6', '2/6'], correct: 1, explain: '2/3 = 4/6.' },
    { visual: 'equivalent', prompt: 'Find the twin of 3/4.', options: ['6/8', '3/8', '4/5'], correct: 0, explain: '3/4 = 6/8.' },
    { visual: 'simplify', prompt: 'Shrink 6/8.', options: ['3/4', '6/4', '2/3'], correct: 0, explain: 'Group numerator and denominator by 2.' },
    { visual: 'simplify', prompt: 'Shrink 8/12.', options: ['4/6 only', '2/3', '8/6'], correct: 1, explain: '8/12 simplifies to 2/3.' },
  ] },
  { id: 'reef-cafe', title: 'Reef Café', icon: '🧁', intro: 'Fill each recipe bowl to the target line.', rounds: [
    { visual: 'add', prompt: '1/2 cup + 1/4 cup = ?', options: ['3/4', '2/6', '1/6'], correct: 0, explain: '2/4 + 1/4 = 3/4.' },
    { visual: 'add', prompt: '5/4 cups is…', options: ['1 and 1/4', '5 and 1/4', '1 and 4/5'], correct: 0, explain: 'Four quarters make one whole.' },
    { visual: 'add', prompt: '1/2 cup + 1/3 cup = ?', options: ['2/5', '5/6', '1/6'], correct: 1, explain: '3/6 + 2/6 = 5/6.' },
    { visual: 'add', prompt: 'Double 1/3 cup.', options: ['1/6', '2/3', '3/3'], correct: 1, explain: 'Two thirds make 2/3.' },
    { visual: 'add', prompt: 'Half of 1/2 cup is…', options: ['1/4', '1/2', '2/4 only'], correct: 0, explain: 'Cut one half into two equal pieces.' },
  ] },
  { id: 'island-shop', title: 'Island Shop', icon: '🏷️', intro: 'Split piles into equal groups and make sale prices.', rounds: [
    { visual: 'groups', prompt: '3/4 of 12 mangoes = ?', options: ['3', '9', '12'], correct: 1, explain: 'Four groups of three; take three groups.' },
    { visual: 'groups', prompt: '2/3 of 18 shells = ?', options: ['6', '12', '15'], correct: 1, explain: 'Three groups of six; take two groups.' },
    { visual: 'groups', prompt: '2/5 of 20 fish = ?', options: ['8', '10', '4'], correct: 0, explain: 'Five groups of four; take two groups.' },
    { visual: 'groups', prompt: '20 coins, 1/4 off. You pay…', options: ['5', '15', '20'], correct: 1, explain: 'One quarter is 5 off, so pay 15.' },
    { visual: 'groups', prompt: '12 of 20 crates is simplest as…', options: ['3/5', '12/20', '5/3'], correct: 0, explain: 'Divide both by 4.' },
  ] },
  { id: 'bridge-builder', title: 'Bridge Builder', icon: '🌉', intro: 'Choose planks that fit the gap exactly.', rounds: [
    { visual: 'bridge', prompt: 'Which pair fills one whole?', options: ['1/2 + 1/2', '1/3 + 1/4', '1/6 + 1/4'], correct: 0, explain: 'Two halves make one whole.' },
    { visual: 'bridge', prompt: '1/2 + 1/3 + 1/6 = ?', options: ['1', '5/6', '3/2'], correct: 0, explain: '6/12 + 4/12 + 2/12 = 12/12.' },
    { visual: 'bridge', prompt: 'Which is the missing plank?', options: ['1/6', '1/4', '1/2'], correct: 1, explain: 'The gap left is one quarter.' },
    { visual: 'compare', prompt: 'Order shortest to longest.', options: ['1/6, 1/3, 1/2', '1/2, 1/3, 1/6', '1/3, 1/6, 1/2'], correct: 0, explain: 'More pieces means smaller pieces.' },
    { visual: 'bridge', prompt: 'Which plank set makes 3/2?', options: ['3/4 + 1/2 + 1/4', '1/2 + 1/3', '1 + 1/4'], correct: 0, explain: '3/4 + 2/4 + 1/4 = 6/4 = 3/2.' },
  ] },
];
