import { useEffect, useState } from 'react';
import { Frac } from './FractionBuilder.jsx';

export const ACTIONS = [
  { of: 'whole', f: [1, 3] }, { of: 'whole', f: [1, 2] }, { of: 'rest', f: [1, 2] }, { of: 'rest', f: [1, 4] },
];
export const spend = (T, left, a) => { const base = a.of === 'whole' ? T : left; const x = (base * a.f[0]) / a.f[1]; return Number.isInteger(x) && x <= left ? x : null; };
// Advanced Lab C: bar-model detective. task = { T, steps:[idx…], text }; verified by the left-over amount.
export default function BarLab({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const T = task?.T || 24;
  const [left, setLeft] = useState(T);
  const [used, setUsed] = useState([]);
  const want = task && task.steps.reduce((l, s) => l - spend(T, l, ACTIONS[s]), T);
  useEffect(() => {
    if (task) return onValue(left === want && used.length === task.steps.length);
    if (used.length) onDiscover('spent');
    if (used.some((a) => a.of === 'rest')) onDiscover('rest');
    if (used.length && left * 3 === T) onDiscover('third');
    if (used.length && left * 4 === T) onDiscover('quarter');
  }, [left, used]);
  useEffect(() => { if (demo && task) { let l = T; task.steps.forEach((s) => { l -= spend(T, l, ACTIONS[s]); }); setLeft(l); setUsed(task.steps.map((s) => ACTIONS[s])); } }, [demo]);
  const apply = (a) => { const x = spend(T, left, a); if (x !== null) { setLeft(left - x); setUsed([...used, a]); } };
  const label = (a) => `Spend ${a.f[0]}/${a.f[1]} of the ${a.of}`;
  return (
    <div className="barlab">
      <div className="cutter-bar" role="img" aria-label={`${left} of ${T} left`}>{Array.from({ length: T }, (_, i) => <i key={i} style={{ flex: 1 }} className={i >= left ? 'spent' : 'hot'} />)}</div>
      <div className="task-actions">{ACTIONS.map((a, i) => <button key={i} className="secondary" disabled={spend(T, left, a) === null || (task && !task.steps.includes(i))} onClick={() => apply(a)}>{label(a)}</button>)}<button className="secondary" onClick={() => { setLeft(T); setUsed([]); }}>↺ Undo all</button></div>
      <div className="readout"><span>Left:</span><Frac n={left} d={T} /><span>= {left} of {T}</span></div>
      {task && <p className="cutter-meter">{task.text}</p>}
    </div>
  );
}
