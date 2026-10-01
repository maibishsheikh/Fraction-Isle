import { useEffect, useState } from 'react';
import { frac } from '../../core/fraction/index.js';
import { Frac } from './FractionBuilder.jsx';

const STEPS = [1, 2, 3, 4, 5, 6, 8];
export const longer = (a, b) => (a[0] * b[1] > b[0] * a[1] ? 0 : a[0] * b[1] < b[0] * a[1] ? 1 : -1);
export const sortedAsc = (items) => [...items].sort((a, b) => a[0] * b[1] - b[0] * a[1]);
const Bar = ({ f, label }) => <div className="race-bar" role="img" aria-label={label || `${f[0]} over ${f[1]}`}><i style={{ width: `${(100 * f[0]) / f[1]}%` }} /></div>;

// Beginner Lab D. task: { type:'longer', a, b } | { type:'sort', items } for guided; explore otherwise.
export default function SliceRace({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const [mode, setMode] = useState('one');
  const [n, setN] = useState(2);
  const [kept, setKept] = useState([]);
  const [k, setK] = useState(0);
  const [order, setOrder] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => { if (kept.length >= 3) onDiscover('keep3'); if (kept.length === 7) onDiscover('keep7'); }, [kept]);
  useEffect(() => { if (mode === 'same') { if (k === 3) onDiscover('m38'); if (k === 5) onDiscover('m58'); } }, [k, mode]);
  useEffect(() => { if (demo && task) { if (task.type === 'sort') setOrder(sortedAsc(task.items).map((f) => f.join('/'))); onValue(true); } }, [demo]);

  if (task?.type === 'longer') {
    const win = longer(task.a, task.b);
    return (
      <div className="race">{[task.a, task.b].map((f, i) => (
        <button key={i} className="race-pick" aria-label={`${f[0]} over ${f[1]}`} onClick={() => { const ok = i === win; setNote(ok ? '✓ Yes, that piece is longer!' : 'Look at the lengths. Try the other one.'); onValue(ok); }}>
          <Bar f={f} /><Frac n={f[0]} d={f[1]} />
        </button>))}<p className="cutter-meter" aria-live="polite">{note || 'Tap the longer piece.'}</p></div>
    );
  }
  if (task?.type === 'sort') {
    const want = sortedAsc(task.items).map((f) => f.join('/'));
    const tap = (key) => {
      if (order.includes(key)) return;
      if (want[order.length] !== key) { setOrder([]); setNote('Not that one first. Start with the shortest.'); onValue(false); return; }
      const next = [...order, key]; setOrder(next); setNote(''); onValue(next.length === want.length);
    };
    return (
      <div className="race">{task.items.map((f) => { const key = f.join('/'); const pos = order.indexOf(key); return (
        <button key={key} className={`race-pick ${pos >= 0 ? 'placed' : ''}`} onClick={() => tap(key)} aria-label={`${f[0]} over ${f[1]}`}><Bar f={f} /><Frac n={f[0]} d={f[1]} />{pos >= 0 && <b>{pos + 1}</b>}</button>); })}
        <p className="cutter-meter" aria-live="polite">{note || 'Tap shortest to longest.'}</p></div>
    );
  }

  const keep = () => setKept((c) => (c.includes(n) ? c : [...c, n]));
  const sort = () => { setKept((c) => [...c].sort((a, b) => b - a)); if (kept.length >= 3) onDiscover('sorted'); };
  const d = mode === 'same' ? 8 : n;
  return (
    <div className="race">
      <div className="cutter-modes">{[['one', 'One piece'], ['same', 'Same pieces']].map(([m, t]) => <button key={m} className={m === mode ? 'on' : ''} onClick={() => { setMode(m); setK(0); }}>{t}</button>)}</div>
      {mode === 'one' ? (
        <>
          <div className="cutter-steps" aria-label="Number of parts">{STEPS.map((v) => <button key={v} className={v === n ? 'on' : ''} onClick={() => setN(v)}>{v}</button>)}</div>
          <div className="cutter-bar">{Array.from({ length: n }, (_, i) => <i key={i} style={{ flex: 1 }} className={i === 0 ? 'hot' : ''} />)}</div>
          <div className="readout"><Frac n={1} d={n} /><button className="secondary" onClick={keep}>Keep this piece</button><button className="secondary" onClick={sort}>Sort ↑</button></div>
          <div className="ruler" aria-label="Piece ruler">{kept.map((v) => <Bar key={v} f={[1, v]} label={`one over ${v}`} />)}</div>
        </>
      ) : (
        <>
          <div className="cutter-bar">{Array.from({ length: 8 }, (_, i) => <button key={i} className={i < k ? 'hot' : ''} aria-label={`Part ${i + 1}`} onClick={() => setK(i + 1 === k ? i : i + 1)} />)}</div>
          <div className="readout"><Frac n={k} d={d} /><span>{k ? 'More same-size pieces is more.' : 'Shade 3, then 5.'}</span></div>
        </>
      )}
    </div>
  );
}
