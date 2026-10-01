export const starsFor = (correct, total) => correct / total >= 0.9 ? 3 : correct / total >= 0.7 ? 2 : correct / total >= 0.5 ? 1 : 0;
export const unlockedLevels = (state) => ({ easy: true, medium: state.levels.easy.boss, hard: state.levels.medium.boss });
