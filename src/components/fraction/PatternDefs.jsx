// One colour + one pattern per denominator, so meaning never rests on colour alone.
const DEN = { 2: ['#E5484D', ''], 3: ['#FFC93C', 'M0 8L8 0'], 4: ['#1AA7C4', 'M4 4h.1'], 5: ['#7A5AF8', 'M0 0L8 8M8 0L0 8'], 6: ['#3FBF7F', 'M0 5Q2 2 4 5T8 5'], 8: ['#F06BA8', 'M0 6L4 2L8 6'], 10: ['#F28C28', 'M1 1h6v6H1z'], 12: ['#28508A', 'M4 0L8 4L4 8L0 4z'] };
export const hasPattern = (n) => n in DEN;
export default function PatternDefs() {
  return (
    <svg aria-hidden="true" className="patterns" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>{Object.entries(DEN).map(([n, [c, d]]) => (
        <pattern id={`den-${n}`} key={n} width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill={c} />{d && <path d={d} stroke={n === '3' ? '#10294A' : '#fff'} strokeWidth={n === '4' ? 3 : 1.4} strokeLinecap="round" fill="none" />}</pattern>))}
      </defs>
    </svg>
  );
}
