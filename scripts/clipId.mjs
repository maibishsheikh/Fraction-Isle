export const clipId = (text) => { let h = 5381; for (const c of text) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0; return h.toString(36); };
