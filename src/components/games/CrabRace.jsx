import { useState } from 'react';
import { Frac } from '../labs/FractionBuilder.jsx';

export const winnerOf = (l, r) => { const a = l[0] * r[1]; const b = r[0] * l[1]; return a > b ? 'l' : a < b ? 'r' : 'same'; };

// Beginner game 4. rounds: [{ l:[n,d], r:[n,d], line, tag }]. Reports first-pick score via onDone(correct,total).
export default function CrabRace({ rounds, calm, onDone, onMiss = () => {} }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [raced, setRaced] = useState(false);
  const [score, setScore] = useState(0);
  const r = rounds[i]; const win = winnerOf(r.l, r.r);
  const choose = (p) => { if (pick) return; setPick(p); if (p === win) setScore((s) => s + 1); else onMiss(r.tag); };
  const next = () => { if (i === rounds.length - 1) onDone(score, rounds.length); else { setI(i + 1); setPick(null); setRaced(false); } };
  const lane = (f, who) => (
    <div className="lane" key={who}><span className="crab" style={{ left: raced ? `${(88 * f[0]) / f[1]}%` : '0%', transition: calm ? 'none' : 'left 1.2s ease-out' }}>🦀</span><Frac n={f[0]} d={f[1]} /></div>
  );
  return (
    <section className="panel crab-game">
      <p className="eyebrow">Crab Race · {i + 1} / {rounds.length}</p>
      <h2>Which crab goes farther?</h2>
      <div className="lanes">{lane(r.l, 'l')}{lane(r.r, 'r')}</div>
      <div className="task-actions">{[['l', 'Left'], ['same', 'Same!'], ['r', 'Right']].map(([p, t]) => <button key={p} className={pick === p ? 'primary' : 'secondary'} disabled={!!pick} onClick={() => choose(p)}>{t}</button>)}</div>
      {pick && !raced && <button className="primary" onClick={() => setRaced(true)}>▶ Race!</button>}
      {raced && <><p className="feedback" aria-live="polite">{pick === win ? '⭐ ' : 'Look again. '}{r.line}</p><button className="primary" onClick={next}>{i === rounds.length - 1 ? 'Finish' : 'Next'}</button></>}
    </section>
  );
}
