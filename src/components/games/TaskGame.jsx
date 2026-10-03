import { useState } from 'react';
import WallLab from '../labs/WallLab.jsx';
import SetLab from '../labs/SetLab.jsx';
import AreaLab from '../labs/AreaLab.jsx';
import RibbonLab from '../labs/RibbonLab.jsx';
import BarLab from '../labs/BarLab.jsx';
import SpinnerLab from '../labs/SpinnerLab.jsx';

const SIMS = { WallLab, SetLab, AreaLab, RibbonLab, BarLab, SpinnerLab };
// rounds: [{ sim, order, tag, task }]. Child does the task on the live picture, then presses Done.
// Score = rounds finished right on the FIRST Done press. Wrong Done = gentle hint, no penalty beyond the score.
export default function TaskGame({ rounds, title, onDone, onMiss = () => {} }) {
  const [i, setI] = useState(0);
  const [ok, setOk] = useState(false);
  const [tried, setTried] = useState(false);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState('');
  const r = rounds[i]; const Sim = SIMS[r.sim];
  const done = () => {
    if (ok) {
      const s = score + (tried ? 0 : 1);
      if (i === rounds.length - 1) return onDone(s, rounds.length);
      setScore(s); setI(i + 1); setOk(false); setTried(false); setNote(''); return;
    }
    setTried(true); onMiss(r.tag); setNote('Look again. Check the picture and the order.');
  };
  return (
    <section className="panel task-game">
      <p className="eyebrow">{title} · {i + 1} / {rounds.length}</p>
      <h2>{r.order}</h2>
      <Sim key={i} task={r.task} onValue={setOk} />
      <button className="primary" onClick={done}>Done!</button>
      <p className="feedback" aria-live="polite">{note}</p>
    </section>
  );
}
