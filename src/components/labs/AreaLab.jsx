import { useEffect, useState } from 'react';
import { Frac } from './FractionBuilder.jsx';

export const overlap = (cols, rows) => cols * rows;
// Advanced Lab A: a part of a part. Shade columns (first fraction), then take rows (second). Overlap = product.
export default function AreaLab({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const [D, setD] = useState(task?.cols || 4);
  const [R, setR] = useState(task?.rows || 3);
  const [c, setC] = useState([]);
  const [r, setRw] = useState([]);
  const both = c.length * r.length;
  useEffect(() => {
    if (both > 0) onDiscover('overlap');
    if (both > 0 && c.length < D && r.length < R) onDiscover('smaller');
    if (D === 2 && R === 2 && c.length === 1 && r.length === 1) onDiscover('quarter');
    if (both > 0 && (c.length === D || r.length === R)) onDiscover('whole');
    if (task) onValue(c.length === task.c && r.length === task.r);
  }, [c, r, D, R]);
  useEffect(() => { if (demo && task) { setC(Array.from({ length: task.c }, (_, i) => i)); setRw(Array.from({ length: task.r }, (_, i) => i)); } }, [demo]);
  const flip = (a, set, i) => set(a.includes(i) ? a.filter((x) => x !== i) : [...a, i]);
  const dial = (set, other, v) => { set(v); setC([]); setRw([]); };
  return (
    <div className="area">
      {!task && <div className="cutter-steps" aria-label="Columns and rows">{[2, 3, 4].map((v) => <button key={`c${v}`} className={v === D ? 'on' : ''} onClick={() => dial(setD, 0, v)}>{v} cols</button>)}{[2, 3, 4].map((v) => <button key={`r${v}`} className={v === R ? 'on' : ''} onClick={() => dial(setR, 0, v)}>{v} rows</button>)}</div>}
      <div className="area-grid" style={{ gridTemplateColumns: `repeat(${D}, 1fr)` }} role="group" aria-label="Area model">
        {Array.from({ length: D * R }, (_, k) => { const x = k % D; const y = Math.floor(k / D); const a = c.includes(x); const b = r.includes(y); return <button key={k} className={a && b ? 'both' : a ? 'col' : b ? 'row' : ''} aria-label={`Cell ${x + 1},${y + 1}`} onClick={() => (flip(a ? c : c, setC, x), 0)} />; })}
      </div>
      <div className="cutter-steps"><span>Columns:</span>{Array.from({ length: D }, (_, i) => <button key={i} className={c.includes(i) ? 'on' : ''} onClick={() => flip(c, setC, i)}>{i + 1}</button>)}<span>Rows:</span>{Array.from({ length: R }, (_, i) => <button key={i} className={r.includes(i) ? 'on' : ''} onClick={() => flip(r, setRw, i)}>{i + 1}</button>)}</div>
      <div className="readout"><Frac n={c.length} d={D} /><span>of</span><Frac n={r.length} d={R} /><span>= {both} of {D * R} cells</span></div>
    </div>
  );
}
