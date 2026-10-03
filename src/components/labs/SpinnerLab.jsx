import { useEffect, useState } from 'react';
import { Frac } from './FractionBuilder.jsx';

export const COLORS = [['Empty', '#E6EDF5'], ['Red', '#E5484D'], ['Blue', '#1AA7C4'], ['Green', '#3FBF7F'], ['Gold', '#FFC93C']];
const N = 12;
const wedge = (i) => { const p = (a) => [60 + 54 * Math.sin(a), 60 - 54 * Math.cos(a)]; const [x1, y1] = p((2 * Math.PI * i) / N); const [x2, y2] = p((2 * Math.PI * (i + 1)) / N); return `M60 60L${x1} ${y1}A54 54 0 0 1 ${x2} ${y2}Z`; };
export const countOf = (s, c) => s.filter((x) => x === c).length;
// Advanced Lab D: paint equal sectors, read the chance. task = { color, n, painted?, text }.
export default function SpinnerLab({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const [s, setS] = useState(Array(N).fill(0));
  useEffect(() => {
    const painted = s.every((x) => x > 0);
    if (task) return onValue(countOf(s, task.color) === task.n && (!task.painted || painted));
    const counts = [1, 2, 3, 4].map((c) => countOf(s, c));
    if (counts.includes(3)) onDiscover('quarter');
    if (counts.includes(6)) onDiscover('half');
    if (painted && counts.some((c) => c === 0) && counts.filter((c) => c > 0).length > 1) onDiscover('impossible');
    if (counts.includes(N)) onDiscover('certain');
  }, [s]);
  useEffect(() => { if (demo && task) setS(Array.from({ length: N }, (_, i) => (i < task.n ? task.color : task.painted ? (task.color === 1 ? 2 : 1) : 0))); }, [demo]);
  return (
    <div className="spinner">
      <svg viewBox="0 0 120 120" width="200" height="200" role="group" aria-label="Spinner with 12 equal sectors">
        {s.map((c, i) => <path key={i} d={wedge(i)} fill={COLORS[c][1]} stroke="#10294A" strokeWidth="2" tabIndex="0" role="button" aria-label={`Sector ${i + 1}: ${COLORS[c][0]}`} onClick={() => setS((a) => a.map((x, j) => (j === i ? (x + 1) % COLORS.length : x)))} onKeyDown={(e) => e.key === 'Enter' && setS((a) => a.map((x, j) => (j === i ? (x + 1) % COLORS.length : x)))} />)}
      </svg>
      <div className="readout">{[1, 2, 3, 4].map((c) => <span key={c}><b style={{ color: COLORS[c][1] }}>●</b> <Frac n={countOf(s, c)} d={N} /></span>)}</div>
      <p className="cutter-meter">{task ? task.text : 'Tap a sector to change its colour.'}</p>
    </div>
  );
}
