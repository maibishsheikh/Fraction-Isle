import { useEffect, useState } from 'react';
import { Frac } from './FractionBuilder.jsx';

export const piecesIn = (len, d) => len * d; // length (m) divided by 1/d
// Advanced Lab B: cut a ribbon into 1/d pieces and count how many fit. task = { len, d, text }.
export default function RibbonLab({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const [len, setLen] = useState(task?.len || 2);
  const [d, setD] = useState(task?.d || 4);
  const [c, setC] = useState(0);
  const max = piecesIn(len, d);
  const full = c === max;
  useEffect(() => {
    if (task) return onValue(full);
    if (full) { onDiscover('full'); if (d === 2) onDiscover('halves'); if (d === 3) onDiscover('thirds'); if (d === 4) onDiscover('quarters'); }
  }, [c, len, d]);
  useEffect(() => { if (demo && task) setC(piecesIn(task.len, task.d)); }, [demo]);
  const reset = (fn) => (v) => { fn(v); setC(0); };
  return (
    <div className="ribbon">
      {!task && <div className="cutter-steps"><span>Length (m)</span>{[1, 2, 3].map((v) => <button key={v} className={v === len ? 'on' : ''} onClick={() => reset(setLen)(v)}>{v}</button>)}<span>Piece</span>{[2, 3, 4].map((v) => <button key={v} className={v === d ? 'on' : ''} aria-label={`one over ${v}`} onClick={() => reset(setD)(v)}>1/{v}</button>)}</div>}
      <div className="cutter-bar" role="img" aria-label={`${c} pieces cut from ${len} metres`}>{Array.from({ length: max }, (_, i) => <i key={i} style={{ flex: 1 }} className={i < c ? 'hot' : ''} />)}</div>
      <div className="task-actions"><button className="secondary" disabled={full} onClick={() => setC((x) => x + 1)}>Cut 1 piece</button><button className="secondary" disabled={full} onClick={() => setC((x) => Math.min(max, x + d))}>Cut 1 metre</button></div>
      <div className="readout"><span>{len} m ÷</span><Frac n={1} d={d} /><span>= {c} pieces so far{full ? ` — all ${max} fit!` : ''}</span></div>
      {task && <p className="cutter-meter">{task.text}</p>}
    </div>
  );
}
