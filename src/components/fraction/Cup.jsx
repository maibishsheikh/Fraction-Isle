// Cup / bottle / bowl with `parts` equal marks, `filled` of them full. onMark(i) makes marks tappable.
export default function Cup({ parts, filled, onMark, variant = 'cup', size = 96 }) {
  const h = 100; const top = 10; const inner = h - top;
  return (
    <svg viewBox="0 0 60 110" width={size * 0.6} height={size} role="img" aria-label={`${variant}, ${filled} of ${parts} marks full`}>
      <rect x="10" y={top + inner * (1 - filled / parts)} width="40" height={(inner * filled) / parts} fill="var(--lagoon-400)" />
      <path d={variant === 'bottle' ? 'M22 2h16v12l8 10v82H14V24l8-10z' : 'M8 8h44l-6 100H14z'} fill="none" stroke="#10294A" strokeWidth="3" />
      {Array.from({ length: parts - 1 }, (_, i) => <line key={i} x1="10" x2="50" y1={top + (inner * (i + 1)) / parts} y2={top + (inner * (i + 1)) / parts} stroke="#10294A" strokeWidth="1.5" />)}
      {onMark && Array.from({ length: parts }, (_, i) => <rect key={i} x="8" width="44" y={top + (inner * (parts - 1 - i)) / parts} height={inner / parts} fill="transparent" tabIndex="0" role="button" aria-label={`Fill to mark ${i + 1}`} onClick={() => onMark(i + 1)} />)}
    </svg>
  );
}
