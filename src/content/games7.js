const mk = (title, icon, rounds) => ({ title, icon, kind: 'tasks', intro: title, narration: title, rounds });
const wall = (order, row, target, tag) => ({ sim: 'WallLab', order, tag, task: { row, target, text: `${row} equal parts` } });
const shop = (order, total, g, take) => ({ sim: 'SetLab', order, tag: 'OF_MEANS_ONE_PART', task: { total, g, take, text: `${total} coins` } });
const area = (order, cols, rows, c, r) => ({ sim: 'AreaLab', order, tag: 'IGNORED_SECOND_FRACTION', task: { cols, rows, c, r } });
const rib = (order, len, d) => ({ sim: 'RibbonLab', order, tag: 'MULTIPLY_INSTEAD', task: { len, d, text: 'Cut until the ribbon is full.' } });
const bar = (order, T, steps) => ({ sim: 'BarLab', order, tag: 'STOPPED_AFTER_FIRST_STEP', task: { T, steps, text: `Bar of ${T}` } });
const spin = (order, color, n, painted = false) => ({ sim: 'SpinnerLab', order, tag: 'WRONG_TOTAL', task: { color, n, painted, text: order } });

export const REEF_TWINS = mk('Reef Twins', '🐚', [
  wall('Find a twin of 1/2 on the eighths row.', 8, [1, 2], 'NO_EQUIVALENCE_IDEA'), wall('Find a twin of 2/3 on the sixths row.', 6, [2, 3], 'NO_EQUIVALENCE_IDEA'),
  wall('Find a twin of 3/4 on the twelfths row.', 12, [3, 4], 'NO_EQUIVALENCE_IDEA'), wall('Find a twin of 1/3 on the twelfths row.', 12, [1, 3], 'NO_EQUIVALENCE_IDEA'),
  wall('Find a twin of 3/4 on the eighths row.', 8, [3, 4], 'NO_EQUIVALENCE_IDEA')]);
export const REEF_CAFE = mk('Reef Café', '🧁', [
  wall('Fill the bowl to 3/4.', 4, [3, 4], 'ADD_NUM_AND_DEN'), wall('Fill the bowl to 5/6.', 6, [5, 6], 'ADD_NUM_AND_DEN'),
  wall('Fill the bowl to 1/2 + 1/4.', 12, [3, 4], 'ADD_NUM_AND_DEN'), wall('Fill the bowl to 1/3 + 1/4.', 12, [7, 12], 'ADD_NUM_AND_DEN')]);
export const ISLAND_SHOP = mk('Island Shop', '🏷️', [
  shop('Bag 3/4 of 12 coins.', 12, 4, 3), shop('One quarter off 20 coins. Pay?', 20, 4, 3), shop('Take 2/5 of 20 coins.', 20, 5, 2),
  shop('One third off 24 coins. Pay?', 24, 3, 2), shop('Take 5/6 of 18 coins.', 18, 6, 5)]);
export const SUMMIT_GARDEN = mk('Summit Garden', '🌿', [
  area('Plant 1/2 of 1/2.', 2, 2, 1, 1), area('Plant 2/3 of 3/4.', 4, 3, 3, 2), area('Plant 1/3 of 1/2.', 2, 3, 1, 1), area('Plant 3/4 of 2/3.', 3, 4, 2, 3)]);
export const RIBBON_CUTTER = mk('Ribbon Cutter', '✂️', [
  rib('Cut 2 metres into halves.', 2, 2), rib('Cut 3 metres into quarters.', 3, 4), rib('Cut 1 metre into thirds.', 1, 3), rib('Cut 3 metres into thirds.', 3, 3)]);
export const DETECTIVE_AGENCY = mk('Detective Agency', '🕵️', [
  bar('24 coins: spend 1/3, then half the rest.', 24, [0, 2]), bar('16 coins: spend half, then half the rest.', 16, [1, 2]),
  bar('24 coins: spend half, then 1/4 of the rest.', 24, [1, 3]), bar('24 coins: spend 1/3.', 24, [0])]);
export const SPINNER_STUDIO = mk('Spinner Studio', '🎡', [
  spin('Make blue 1/4 of the spinner.', 2, 3), spin('Make green 1/2 of the spinner.', 3, 6), spin('Make red 1/3 of the spinner.', 1, 4),
  spin('Paint it all with gold impossible.', 4, 0, true), spin('Make blue certain.', 2, 12)]);
