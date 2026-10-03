// Tiny WebAudio SFX, no files. Silent when audio is off.
let ctx; let enabled = true;
export const setSfx = (on) => { enabled = on; };
export const audioOn = () => enabled;
const tone = (f, d = 0.12, t = 0, type = 'sine') => {
  if (!enabled || typeof window === 'undefined') return;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator(); const g = ctx.createGain(); const at = ctx.currentTime + t;
  o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.12, at); g.gain.exponentialRampToValueAtTime(0.001, at + d);
  o.connect(g).connect(ctx.destination); o.start(at); o.stop(at + d);
};
export const sfx = {
  click: () => tone(520, 0.05), snap: () => tone(660, 0.06, 0, 'triangle'), pop: () => tone(780, 0.08),
  chime: () => { tone(660, 0.15); tone(880, 0.2, 0.12); }, whoosh: () => tone(220, 0.2, 0, 'sawtooth'),
  tryAgain: () => tone(300, 0.15, 0, 'triangle'), fanfare: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, i * 0.12)),
};
