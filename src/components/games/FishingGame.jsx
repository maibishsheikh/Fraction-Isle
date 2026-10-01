import { useState } from 'react';
import Pie from '../fraction/Pie.jsx';
import { Frac } from '../labs/FractionBuilder.jsx';

export const Pic = ({ p }) => {
  const [kind, parts, n] = p;
  if (kind === 'pie') return <Pie parts={parts} shaded={n} size={96} />;
  if (kind === 'set') return <div className="fish-set" role="img" aria-label={`${n} red of ${parts}`}>{Array.from({ length: parts }, (_, i) => <span key={i}>{i < n ? '🍎' : '🍏'}</span>)}</div>;
  return <div className="cutter-bar fish-bar" role="img" aria-label={`${n} of ${parts} shaded`}>{Array.from({ length: parts }, (_, i) => <i key={i} style={{ flex: 1 }} className={i < n ? 'hot' : ''} />)}</div>;
};
const Face = ({ x }) => (Array.isArray(x) && typeof x[0] === 'string' ? <Pic p={x} /> : <Frac n={x[0]} d={x[1]} />);

// rounds: [{ bait, fish:[{ x, tag? }] }] — fish[0] is correct. bait/x: picture ['bar'|'pie'|'set',parts,shaded] or fraction [n,d].
export default function FishingGame({ rounds, onDone, onMiss = () => {} }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(false);
  const [note, setNote] = useState('');
  const r = rounds[i];
  const order = r.fish.map((_, j) => (j + i * 2) % r.fish.length);
  const tap = (j) => {
    if (j === 0) {
      const s = score + (missed ? 0 : 1);
      if (i === rounds.length - 1) return onDone(s, rounds.length);
      setScore(s); setI(i + 1); setMissed(false); setNote(''); return;
    }
    setMissed(true); onMiss(r.fish[j].tag); setNote('Look again. Count all the parts.');
  };
  return (
    <section className="panel fish-game">
      <p className="eyebrow">Fraction Fishing · {i + 1} / {rounds.length}</p>
      <h2>Catch the fish that matches the bait.</h2>
      <div className="fish-bait"><Face x={r.bait} /></div>
      <div className="fish-row">{order.map((j) => <button key={j} className="secondary fish" onClick={() => tap(j)} aria-label="Fish"><span>🐟</span><Face x={r.fish[j].x} /></button>)}</div>
      <p className="feedback" aria-live="polite">{note}</p>
    </section>
  );
}
