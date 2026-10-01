const KEY = 'fractionIsles:v1';
export const loadState = () => { try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); return saved?.version === 1 ? saved : null; } catch { return null; } };
export const saveState = (state) => { try { const { levels, ...rest } = state; localStorage.setItem(KEY, JSON.stringify({ ...rest, levels })); } catch { /* memory-only mode */ } };
export const clearState = () => { try { localStorage.removeItem(KEY); } catch { /* ignore unavailable storage */ } };
