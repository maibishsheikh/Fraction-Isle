const f = (x, tag) => ({ x, tag });
export const FISHING = { title: 'Fraction Fishing', icon: '🎣', kind: 'fish', intro: 'Catch the fish that matches the bait.', narration: 'Catch the fish that matches the bait.', rounds: [
  { bait: ['bar', 2, 1], fish: [f([1, 2]), f([2, 1], 'SWAP_NUM_DEN'), f([1, 1], 'SHADED_OVER_UNSHADED'), f([1, 3], 'WRONG_TOTAL')] },
  { bait: ['bar', 4, 1], fish: [f([1, 4]), f([4, 1], 'SWAP_NUM_DEN'), f([1, 3], 'SHADED_OVER_UNSHADED'), f([1, 5], 'WRONG_TOTAL')] },
  { bait: ['bar', 4, 3], fish: [f([3, 4]), f([4, 3], 'SWAP_NUM_DEN'), f([3, 1], 'SHADED_OVER_UNSHADED'), f([1, 4], 'ONLY_COUNT_ONE')] },
  { bait: ['pie', 3, 2], fish: [f([2, 3]), f([3, 2], 'SWAP_NUM_DEN'), f([2, 1], 'SHADED_OVER_UNSHADED'), f([1, 3], 'ONLY_COUNT_ONE')] },
  { bait: ['pie', 6, 5], fish: [f([5, 6]), f([6, 5], 'SWAP_NUM_DEN'), f([5, 1], 'SHADED_OVER_UNSHADED'), f([1, 6], 'ONLY_COUNT_ONE')] },
  { bait: ['set', 8, 3], fish: [f([3, 8]), f([8, 3], 'SWAP_NUM_DEN'), f([3, 5], 'SHADED_OVER_UNSHADED'), f([5, 8], 'UNSHADED_OVER_TOTAL')] },
  { bait: [2, 5], fish: [f(['bar', 5, 2]), f(['bar', 5, 3], 'UNSHADED_OVER_TOTAL'), f(['bar', 7, 2], 'WRONG_TOTAL'), f(['bar', 3, 2], 'WRONG_TOTAL')] },
  { bait: [3, 4], fish: [f(['pie', 4, 3]), f(['pie', 4, 1], 'UNSHADED_OVER_TOTAL'), f(['pie', 7, 3], 'WRONG_TOTAL'), f(['pie', 3, 2], 'WRONG_TOTAL')] },
] };
