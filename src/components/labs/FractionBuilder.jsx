import { useEffect, useState } from 'react';
import { equals, frac } from '../../core/fraction/index.js';

const DIAL = [2, 3, 4, 5, 6, 8];
const WORDS = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight' };
export const Frac = ({ n, d, pulse }) => <span className="frac" aria-label={`${n} over ${d}`}><b className={pulse === 'top' ? 'pulse' : ''}>{n}</b><i /><b className={pulse === 'bottom' ? 'pulse' : ''}>{d}</b></span>;

// Beginner Lab B. Props: task (guided target), demo (bump to auto-show), onDiscover(key), onValue(bool).
export default function FractionBuilder({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const [shape, setShape] = useState(task?.shape || 'bar');
  const [d, setD] = useState(task?.start || 4);
  const [on, setOn] = useState([]);
  const [pulse, setPulse] = useState(null);
  const parts = shape === 'stars' ? 8 : d;
  const n = on.length;

  const target = task && (task.read ? frac(task.read[0], task.read[1]) : frac(task.n, task.d));
  useEffect(() => {
    if (n === 1) onDiscover('one');
    if (n === 3) onDiscover('three');
    if (shape === 'stars' && n === 3) onDiscover('stars');
    if (n > 0 && n === parts) onDiscover('whole');
    if (task) onValue(n > 0 && equals(frac(n, parts), target) && (task.shape ? shape === task.shape : true));
  }, [n, parts, shape]);
  useEffect(() => { if (demo && task) { setShape(task.shape || 'bar'); const dd = task.read ? task.read[1] : task.d; if (task.shape !== 'stars') setD(dd); setOn(Array.from({ length: task.read ? task.read[0] : task.n }, (_, i) => i)); } }, [demo]);

  const tap = (i) => { setOn((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i])); setPulse('top'); };
  const dial = (v) => { setD(v); setOn((o) => o.filter((x) => x < v)); setPulse('bottom'); onDiscover('bottom'); };
  const countUp = () => { if (n < parts) tap(Array.from({ length: parts }, (_, i) => i).find((i) => !on.includes(i))); };

  return (
    <div className="builder">
      {!task?.shape && <div className="cutter-modes">{[['bar', 'Bar'], ['stars', 'Stars']].map(([s, t]) => <button key={s} className={s === shape ? 'on' : ''} onClick={() => { setShape(s); setOn([]); }}>{t}</button>)}</div>}
      {shape === 'bar' && <div className="cutter-steps" aria-label="Bottom number">{DIAL.map((v) => <button key={v} className={v === d ? 'on' : ''} onClick={() => dial(v)}>{v}</button>)}</div>}
      <div className={shape === 'stars' ? 'builder-stars' : 'cutter-bar'} role="group" aria-label={`${parts} equal parts, ${n} shaded`}>
        {Array.from({ length: parts }, (_, i) => <button key={i} className={on.includes(i) ? 'shaded' : ''} aria-pressed={on.includes(i)} aria-label={`Part ${i + 1}`} onClick={() => tap(i)}>{shape === 'stars' ? '★' : ''}</button>)}
      </div>
      <div className="readout"><Frac n={n} d={parts} pulse={pulse} /><span>{WORDS[n] || n} of {WORDS[parts]} equal parts{n === parts && n > 0 ? ' = one whole' : ''}</span></div>
      {!task && <button className="secondary" onClick={countUp}>Count up ▶</button>}
    </div>
  );
}
