import { useState } from 'react';
import { Pic } from './FishingGame.jsx';
import { Frac } from '../labs/FractionBuilder.jsx';

// scenes: [{ title, target:[n,d], items:[{ e, p, ok, why }] }]. Find the 3 items per scene. correct = good taps, total = good + wrong taps.
export default function FractionHunt({ rounds: scenes, onDone }) {
  const [s, setS] = useState(0);
  const [found, setFound] = useState([]);
  const [good, setGood] = useState(0);
  const [bad, setBad] = useState(0);
  const [note, setNote] = useState('');
  const sc = scenes[s];
  const tap = (idx) => {
    const it = sc.items[idx];
    if (found.includes(idx)) return;
    if (!it.ok) { setBad(bad + 1); setNote(`Not this one: ${it.why}`); return; }
    const f = [...found, idx]; setFound(f); setGood(good + 1); setNote('⭐ Found one!');
    if (f.length === sc.items.filter((x) => x.ok).length) {
      if (s === scenes.length - 1) onDone(good + 1, good + 1 + bad);
      else { setS(s + 1); setFound([]); setNote(''); }
    }
  };
  return (
    <section className="panel hunt-game">
      <p className="eyebrow">Fraction Hunt · {sc.title} ({s + 1} / {scenes.length})</p>
      <h2>Find 3 that show <Frac n={sc.target[0]} d={sc.target[1]} /></h2>
      <div className="hunt-grid">{sc.items.map((it, idx) => <button key={idx} className={`secondary hunt-item ${found.includes(idx) ? 'found' : ''}`} onClick={() => tap(idx)} aria-label={`${it.e} item`}><span>{it.e}</span><Pic p={it.p} /></button>)}</div>
      <p className="feedback" aria-live="polite">{note || `${found.length} of 3 found`}</p>
    </section>
  );
}
