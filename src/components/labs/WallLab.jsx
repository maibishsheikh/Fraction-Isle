import { useEffect, useState } from 'react';
import { equals, frac } from '../../core/fraction/index.js';
import { Frac } from './FractionBuilder.jsx';

const val = (k, d) => frac(k, d);
// Fraction wall. Explore: cfg.rows + cfg.discover. Guided: task = { row, target:[n,d], text }.
export default function WallLab({ cfg, task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const rows = task ? [task.row] : cfg.rows;
  const [ks, setKs] = useState(() => Object.fromEntries((cfg?.rows || [task.row]).concat(task ? [task.row] : []).map((d) => [d, 0])));
  const set = (d, k) => setKs((s) => ({ ...s, [d]: k }));

  useEffect(() => {
    if (task) return onValue(ks[task.row] > 0 && equals(val(ks[task.row], task.row), frac(task.target[0], task.target[1])));
    const live = rows.filter((d) => ks[d] > 0);
    (cfg.discover || []).forEach((x) => {
      if (x.twins) { const groups = {}; live.forEach((d) => { const v = val(ks[d], d); const key = `${v.n}/${v.d}`; groups[key] = (groups[key] || 0) + 1; }); if (Object.values(groups).some((c) => c >= x.twins)) onDiscover(x.key); }
      else if ((x.row ? [x.row] : live).some((d) => ks[d] > 0 && equals(val(ks[d], d), frac(x.target[0], x.target[1])))) onDiscover(x.key);
    });
  }, [ks]);
  useEffect(() => { if (demo && task) set(task.row, (task.target[0] * task.row) / task.target[1]); }, [demo]);

  return (
    <div className="wall" role="group" aria-label="Fraction wall">
      {!task && <div className="wall-row whole"><span>1</span><i /></div>}
      {rows.map((d) => (
        <div className="wall-row" key={d}>
          <Frac n={ks[d]} d={d} />
          <div className="cutter-bar">{Array.from({ length: d }, (_, i) => <button key={i} className={i < ks[d] ? 'hot' : ''} aria-label={`Part ${i + 1} of ${d}`} onClick={() => set(d, i + 1 === ks[d] ? i : i + 1)} />)}</div>
        </div>
      ))}
      {task && <p className="cutter-meter">{task.text}</p>}
    </div>
  );
}
