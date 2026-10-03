import { useState } from 'react';
import { addRaw, equals, frac } from '../../core/fraction/index.js';
import { Frac } from '../labs/FractionBuilder.jsx';

// rounds: [{ gap:[n,d], planks:[[n,d],…] }]. Tap planks so they exactly fill the gap, then Check. Score = solved on first Check.
export default function BridgeBuilder({ rounds, onDone, onMiss = () => {} }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState([]);
  const [score, setScore] = useState(0);
  const [tried, setTried] = useState(false);
  const [note, setNote] = useState('');
  const r = rounds[i]; const gap = frac(r.gap[0], r.gap[1]);
  const sum = pick.reduce((a, j) => addRaw(a, frac(r.planks[j][0], r.planks[j][1])), frac(0, 1));
  const check = () => {
    if (equals(sum, gap)) {
      const s = score + (tried ? 0 : 1);
      if (i === rounds.length - 1) return onDone(s, rounds.length);
      setScore(s); setI(i + 1); setPick([]); setTried(false); setNote(''); return;
    }
    setTried(true); onMiss('ADD_NUM_AND_DEN');
    setNote(sum.n * gap.d > gap.n * sum.d ? 'Too long. Take a plank off.' : 'Too short. Add a plank.');
  };
  return (
    <section className="panel bridge-game">
      <p className="eyebrow">Bridge Builder · {i + 1} / {rounds.length}</p>
      <h2>Fill the gap of <Frac n={r.gap[0]} d={r.gap[1]} /></h2>
      <div className="task-actions">{r.planks.map((p, j) => <button key={j} className={pick.includes(j) ? 'primary' : 'secondary'} aria-pressed={pick.includes(j)} onClick={() => setPick((c) => (c.includes(j) ? c.filter((x) => x !== j) : [...c, j]))}><Frac n={p[0]} d={p[1]} /></button>)}</div>
      <div className="readout"><span>Bridge:</span><Frac n={sum.n} d={sum.d} /><span>Gap:</span><Frac n={gap.n} d={gap.d} /></div>
      <button className="primary" disabled={!pick.length} onClick={check}>Check</button>
      <p className="feedback" aria-live="polite">{note}</p>
    </section>
  );
}
