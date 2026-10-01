import { useEffect, useState } from 'react';
import { isEqualCutsBar } from '../../core/helpers.js';

const TOTAL = 12;
const WORD = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight' };
const NAMES = { 1: 'one whole', 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths' };
const ONE = { 2: 'a half', 3: 'a third', 4: 'a fourth (quarter)', 5: 'a fifth', 6: 'a sixth', 8: 'an eighth' };
const DISCOVER = { 2: 'halves', 3: 'thirds', 4: 'fourths' };
const MODES = { equal: [1, 2, 3, 4, 5, 6, 8], hand: [2, 3, 4, 6], rebuild: [3, 4, 6] };
export const evenCuts = (n) => Array.from({ length: n - 1 }, (_, i) => ((i + 1) * TOTAL) / n);
const widthsOf = (cuts) => { const p = [0, ...[...cuts].sort((a, b) => a - b), TOTAL]; return p.slice(1).map((x, i) => x - p[i]); };

function Bar({ widths, wobble, lifted, onPiece, label }) {
  return (
    <div className={`cutter-bar ${wobble ? 'wobble' : ''}`} role="group" aria-label={label}>
      {widths.map((w, i) => (
        <button key={i} style={{ flex: w }} className={lifted === i ? 'lifted' : ''} disabled={!onPiece}
          aria-label={`Piece ${i + 1} of ${widths.length}`} onClick={() => onPiece?.(i)} />
      ))}
    </div>
  );
}

// Beginner Lab A. No numerals are taught here: parts are named in words. Calls onDiscover(key) and onValue(bool).
export default function WholeCutter({ task = null, demo = 0, onDiscover = () => {}, onValue = () => {} }) {
  const [mode, setMode] = useState(task && !task.spot ? 'hand' : 'equal');
  const [n, setN] = useState(task?.n || 2);
  const [cuts, setCuts] = useState([]);
  const [lifted, setLifted] = useState(null);
  const [named, setNamed] = useState([]);
  const [placed, setPlaced] = useState(0);
  const [spotted, setSpotted] = useState(false);

  const hand = mode === 'hand';
  const ready = hand && cuts.length === n - 1;
  const fair = ready && isEqualCutsBar(cuts, TOTAL, n);
  const widths = mode === 'equal' ? Array(n).fill(TOTAL / n) : hand ? widthsOf(cuts) : Array(n).fill(TOTAL / n);

  useEffect(() => { if (mode === 'equal' && DISCOVER[n]) onDiscover(DISCOVER[n]); }, [mode, n]);
  useEffect(() => {
    if (!hand || !ready) return;
    onDiscover(fair ? 'hand' : 'unfair');
    if (task) onValue(fair && n === task.n);
  }, [cuts, n, mode]);
  useEffect(() => { if (demo && task && !task.spot) { setMode('hand'); setN(task.n); setCuts(evenCuts(task.n)); } }, [demo]);
  useEffect(() => { if (mode === 'rebuild' && placed === n) onDiscover('rebuilt'); }, [placed, n, mode]);

  const pick = (m) => { setMode(m); setCuts([]); setLifted(null); setPlaced(0); if (!MODES[m].includes(n)) setN(MODES[m][0]); };
  const toggleCut = (k) => setCuts((c) => (c.includes(k) ? c.filter((x) => x !== k) : c.length < n - 1 ? [...c, k] : c));
  const nameIt = (i) => { setLifted(i); const next = named.includes(n) ? named : [...named, n]; setNamed(next); if (next.length >= 2) onDiscover('named'); };

  if (task?.spot) {
    return (
      <div className="cutter">
        <div className="cutter-spot">
          {task.bars.map((w, i) => (
            <Bar key={i} widths={w} label={`Pizza ${i + 1}`} onPiece={() => { if (i === task.odd) { setSpotted(true); onValue(true); } }} />
          ))}
        </div>
        <p className="cutter-meter">{spotted ? '✓ Yes! That one has uneven pieces.' : 'Tap the one that is not fair.'}</p>
      </div>
    );
  }

  return (
    <div className="cutter">
      {!task && <div className="cutter-modes" role="tablist">{[['equal', 'Equal cut'], ['hand', 'Hand cut'], ['rebuild', 'Rebuild']].map(([m, t]) => <button key={m} className={m === mode ? 'on' : ''} onClick={() => pick(m)}>{t}</button>)}</div>}
      {!task && <div className="cutter-steps" aria-label="Number of parts">{MODES[mode].map((v) => <button key={v} className={v === n ? 'on' : ''} onClick={() => { setN(v); setCuts([]); setLifted(null); setPlaced(0); }}>{v}</button>)}</div>}

      {mode === 'rebuild' ? (
        <>
          <div className="cutter-bar outline" aria-label="Crystal outline">{Array.from({ length: n }, (_, i) => <i key={i} style={{ flex: 1 }} className={i < placed ? 'filled' : ''} />)}</div>
          <div className="cutter-scatter">{Array.from({ length: n - placed }, (_, i) => <button key={i} aria-label="Crystal piece, tap to place" onClick={() => setPlaced((p) => p + 1)} />)}</div>
          <p className="cutter-meter">{placed === n ? '💎 ONE WHOLE again!' : 'Tap each piece to put it back.'}</p>
        </>
      ) : (
        <>
          <Bar widths={widths} wobble={ready && !fair} lifted={lifted} label={`Bar cut into ${widths.length} parts`} onPiece={!hand && n > 1 ? nameIt : undefined} />
          {hand && <div className="cutter-notches" aria-label="Cut notches">{Array.from({ length: TOTAL - 1 }, (_, i) => <button key={i} aria-pressed={cuts.includes(i + 1)} aria-label={`Cut at notch ${i + 1}`} className={cuts.includes(i + 1) ? 'on' : ''} onClick={() => toggleCut(i + 1)} />)}</div>}
          <p className="cutter-meter" aria-live="polite">
            {hand ? (ready ? (fair ? '✓ Fair! All the parts match.' : '≠ Not fair yet. Move a cut.') : `Make ${WORD[n - 1] || n - 1} cut${n === 2 ? '' : 's'}.`)
              : lifted !== null ? `One of the ${WORD[n]} equal parts is ${ONE[n]}.` : n === 1 ? 'ONE WHOLE' : `${WORD[n]} equal parts: ${NAMES[n]}. Tap a piece.`}
          </p>
        </>
      )}
    </div>
  );
}
