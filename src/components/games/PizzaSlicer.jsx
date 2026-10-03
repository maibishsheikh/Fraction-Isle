import { useState } from 'react';
import { isEqualCutsBar } from '../../core/helpers.js';

const T = 12;
const widths = (cuts) => { const p = [0, ...[...cuts].sort((a, b) => a - b), T]; return p.slice(1).map((x, i) => x - p[i]); };
// rounds: [{ N, k, order }]. Hand-cut N equal slices on a 12-notch bar, tap k slices, press Serve. Score = served right on first Serve.
export default function PizzaSlicer({ rounds, onDone, onMiss = () => {} }) {
  const [i, setI] = useState(0);
  const [cuts, setCuts] = useState([]);
  const [taken, setTaken] = useState([]);
  const [score, setScore] = useState(0);
  const [tried, setTried] = useState(false);
  const [note, setNote] = useState('');
  const r = rounds[i];
  const ready = cuts.length === r.N - 1; const fair = ready && isEqualCutsBar(cuts, T, r.N);
  const serve = () => {
    if (fair && taken.length === r.k) {
      const s = score + (tried ? 0 : 1);
      if (i === rounds.length - 1) return onDone(s, rounds.length);
      setScore(s); setI(i + 1); setCuts([]); setTaken([]); setTried(false); setNote(''); return;
    }
    setTried(true); onMiss(fair ? 'ONLY_COUNT_ONE' : 'UNEQUAL_PARTS_COUNTED');
    setNote(fair ? 'Look at the order. Count the slices to serve.' : 'Look at the sizes. Are all the pieces equal?');
  };
  return (
    <section className="panel pizza-game">
      <p className="eyebrow">Pizza Party Slicer · {i + 1} / {rounds.length}</p>
      <h2>“{r.order}”</h2>
      <div className={`cutter-bar ${ready && !fair ? 'wobble' : ''}`} role="group" aria-label="Pizza bar">{(ready ? widths(cuts) : [T]).map((w, j) => <button key={j} style={{ flex: w }} className={taken.includes(j) ? 'hot' : ''} disabled={!ready} aria-pressed={taken.includes(j)} aria-label={`Slice ${j + 1}`} onClick={() => setTaken((t) => (t.includes(j) ? t.filter((x) => x !== j) : [...t, j]))} />)}</div>
      <div className="cutter-notches" aria-label="Cut notches">{Array.from({ length: T - 1 }, (_, j) => <button key={j} className={cuts.includes(j + 1) ? 'on' : ''} aria-pressed={cuts.includes(j + 1)} aria-label={`Cut at notch ${j + 1}`} onClick={() => { setTaken([]); setCuts((c) => (c.includes(j + 1) ? c.filter((x) => x !== j + 1) : c.length < r.N - 1 ? [...c, j + 1] : c)); }} />)}</div>
      <p className="cutter-meter" aria-live="polite">{!ready ? `Make ${r.N - 1} cut${r.N === 2 ? '' : 's'} for ${r.N} equal slices.` : fair ? '✓ Fair slices! Tap the ones to serve.' : '≠ Not fair yet. Move a cut.'}</p>
      <button className="primary" disabled={!ready} onClick={serve}>Serve!</button>
      <p className="feedback" aria-live="polite">{note}</p>
    </section>
  );
}
