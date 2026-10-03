import { useEffect, useState } from 'react';
import { equals, frac } from '../../core/fraction/index.js';
import { Frac } from './FractionBuilder.jsx';

export const shareOf = (total, taken, groups) => (total * taken) / groups;
// Builder Lab C (Sale Shop): split a set into equal groups, take some groups. task = { total, g, take, text }.
export default function SetLab({ cfg, task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const total = task?.total || cfg.total || 12;
  const opts = [2, 3, 4, 5, 6, 10].filter((v) => total % v === 0);
  const [g, setG] = useState(task?.g || opts[2] || opts[0]);
  const [on, setOn] = useState([]);
  const n = on.length;
  useEffect(() => {
    if (task) return onValue(n === task.take && g === task.g);
    if (n > 0) onDiscover('take');
    if (n > 0 && equals(frac(n, g), frac(1, 2))) onDiscover('half');
    if (n > 0 && equals(frac(n, g), frac(3, 4))) onDiscover('threeq');
  }, [n, g]);
  useEffect(() => { if (demo && task) setOn(Array.from({ length: task.take }, (_, i) => i)); }, [demo]);
  const per = total / g;
  return (
    <div className="setlab">
      {!task && <div className="cutter-steps" aria-label="Number of groups">{opts.map((v) => <button key={v} className={v === g ? 'on' : ''} onClick={() => { setG(v); setOn([]); onDiscover('regroup'); }}>{v}</button>)}</div>}
      <div className="set-groups" role="group" aria-label={`${total} coins in ${g} equal groups`}>
        {Array.from({ length: g }, (_, i) => <button key={i} className={on.includes(i) ? 'full' : ''} aria-pressed={on.includes(i)} aria-label={`Group ${i + 1}, ${per} coins`} onClick={() => setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))}>{'🪙'.repeat(per)}</button>)}
      </div>
      <div className="readout"><Frac n={n} d={g} /><span>of {total} coins = {shareOf(total, n, g)}</span></div>
      {task && <p className="cutter-meter">{task.text}</p>}
    </div>
  );
}
