// Clock face with the sector from 12 to `minutes` filled; minute hand points at `minutes`.
export default function Clock({ minutes, size = 120 }) {
  const a = (Math.min(60, minutes) / 60) * 2 * Math.PI; const x = 60 + 50 * Math.sin(a); const y = 60 - 50 * Math.cos(a);
  const sector = minutes >= 60 ? 'M60 10a50 50 0 1 1 0 100a50 50 0 1 1 0-100' : minutes <= 0 ? '' : `M60 60L60 10A50 50 0 ${minutes > 30 ? 1 : 0} 1 ${x} ${y}Z`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`${minutes} minutes past the hour`}>
      <circle cx="60" cy="60" r="50" fill="#fff" stroke="#10294A" strokeWidth="4" />
      {sector && <path d={sector} fill="var(--sun-500)" />}
      {[0, 15, 30, 45].map((m) => <line key={m} x1="60" y1="12" x2="60" y2="20" stroke="#10294A" strokeWidth="3" transform={`rotate(${m * 6} 60 60)`} />)}
      <line x1="60" y1="60" x2={x} y2={y} stroke="#10294A" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
