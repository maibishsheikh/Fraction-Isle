import { useEffect, useState } from 'react';
import { equals, frac } from '../../core/fraction/index.js';
import { Frac } from './FractionBuilder.jsx';

export const GADGETS = [
  { key: 'sandwich', icon: '🥪', name: 'Sandwich', goal: 'Make half a sandwich', opts: [2, 4], target: [1, 2] },
  { key: 'bottle', icon: '🧴', name: 'Bottle', goal: 'Make it half full', opts: [2, 4, 8], target: [1, 2] },
  { key: 'clock', icon: '🕒', name: 'Clock', goal: 'Show quarter past', opts: [4], target: [1, 4] },
  { key: 'battery', icon: '🔋', name: 'Battery', goal: 'Charge to three quarters', opts: [4], target: [3, 4] },
  { key: 'line', icon: '📏', name: 'Number line', goal: 'Put the flag halfway', opts: [2, 4, 8], target: [1, 2] },
];
const hit = (k, p, t) => k > 0 && equals(frac(k, p), frac(t[0], t[1]));

function Gadget({ g, p, k, setP, setK }) {
  const line = g.key === 'line';
  const cells = line ? p + 1 : p;
  return (
    <div className="gadget" data-gadget={g.key}>
      {g.opts.length > 1 && <div className="cutter-steps" aria-label="Marks">{g.opts.map((v) => <button key={v} className={v === p ? 'on' : ''} onClick={() => setP(v)}>{v}</button>)}</div>}
      {g.key === 'clock' && <div className="clock-face" style={{ background: `conic-gradient(var(--sun-500) ${(k / p) * 360}deg, #fff 0)` }} aria-label={`${(k * 60) / p} minutes past`} />}
      <div className={`gadget-strip ${line ? 'line' : ''}`} role="group" aria-label={g.name}>
        {Array.from({ length: cells }, (_, i) => {
          const val = line ? i : i + 1;
          return <button key={i} className={line ? (val === k ? 'flag' : '') : val <= k ? 'full' : ''} aria-label={line ? `Tick ${val} of ${p}` : `Mark ${val} of ${p}`} onClick={() => setK(val === k ? (line ? 0 : val - 1) : val)}>{line ? (val === k ? '🚩' : '') : ''}</button>;
        })}
      </div>
      <div className="readout"><Frac n={k} d={p} />{g.key === 'clock' && <span>{(k * 60) / p} minutes past</span>}</div>
    </div>
  );
}

// Beginner Lab C. task = { gadget, target:[n,d], p? } for guided; otherwise all five gadgets in explore.
export default function ShoreGadgets({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const [cur, setCur] = useState(task ? GADGETS.findIndex((g) => g.key === task.gadget) : 0);
  const [st, setSt] = useState(() => Object.fromEntries(GADGETS.map((g) => [g.key, { p: task?.p && g.key === task.gadget ? task.p : g.opts[g.opts.length > 2 ? 1 : 0], k: 0 }])));
  const g = GADGETS[cur];
  const { p, k } = st[g.key];
  const set = (patch) => setSt((s) => ({ ...s, [g.key]: { ...s[g.key], ...patch } }));

  useEffect(() => {
    if (task) onValue(hit(k, p, task.target));
    else if (hit(k, p, g.target)) onDiscover(g.key);
  }, [k, p, cur]);
  useEffect(() => { if (demo && task) { const [n, d] = task.target; set({ p: task.p || d, k: (n * (task.p || d)) / d }); } }, [demo]);

  return (
    <div className="shore">
      {!task && <div className="cutter-modes" role="tablist">{GADGETS.map((x, i) => <button key={x.key} className={i === cur ? 'on' : ''} onClick={() => setCur(i)} aria-label={x.name}>{x.icon}</button>)}</div>}
      {!task && <p className="cutter-meter">{g.icon} {g.goal}</p>}
      <Gadget g={g} p={p} k={k} setP={(v) => set({ p: v, k: 0 })} setK={(v) => set({ k: v })} />
    </div>
  );
}
