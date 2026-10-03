// Shared Pie: starts at 12 o'clock, fills clockwise. onPart(i) makes wedges tappable.
import { hasPattern } from './PatternDefs.jsx';
export default function Pie({ parts, shaded, on, onPart, size = 120, label }) {
  const lit = (i) => (on ? on.includes(i) : i < shaded);
  const count = on ? on.length : shaded;
  const pt = (a) => [60 + 54 * Math.sin(a), 60 - 54 * Math.cos(a)];
  const wedge = (i) => {
    if (parts === 1) return 'M60 6a54 54 0 1 1 0 108a54 54 0 1 1 0-108';
    const [x1, y1] = pt((2 * Math.PI * i) / parts); const [x2, y2] = pt((2 * Math.PI * (i + 1)) / parts);
    return `M60 60L${x1} ${y1}A54 54 0 ${1 / parts > 0.5 ? 1 : 0} 1 ${x2} ${y2}Z`;
  };
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={label || `${count} of ${parts} parts shaded`}>
      {Array.from({ length: parts }, (_, i) => <path key={i} d={wedge(i)} className={lit(i) ? (hasPattern(parts) ? '' : 'pie-on') : 'pie-off'} fill={lit(i) && hasPattern(parts) ? `url(#den-${parts})` : undefined} stroke="#10294A" strokeWidth="3" onClick={() => onPart?.(i)} />)}
    </svg>
  );
}
