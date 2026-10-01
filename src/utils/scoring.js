export const starsFor = (correct, total) => total === 0 ? 0 : correct / total >= 0.9 ? 3 : correct / total >= 0.7 ? 2 : correct / total >= 0.5 ? 1 : 0;
export const gameStars = (correct, total) => Math.max(1, starsFor(correct, total));
export const XP = { lesson: 15, game: 20, gameStar: 5, boss: 30, bossStar: 10 };
