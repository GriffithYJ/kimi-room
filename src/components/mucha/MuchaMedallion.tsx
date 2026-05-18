export function MuchaMedallion({
  color,
  accent,
  size = 80,
}: {
  color: string;
  accent: string;
  size?: number;
}) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} style={{ color }}>
      <circle cx="40" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="40" cy="40" r="14" fill={accent} opacity="0.15" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r1 = 22;
        const r2 = i % 2 === 0 ? 32 : 28;
        return (
          <line
            key={i}
            x1={40 + Math.cos(a) * r1}
            y1={40 + Math.sin(a) * r1}
            x2={40 + Math.cos(a) * r2}
            y2={40 + Math.sin(a) * r2}
            stroke="currentColor"
            strokeWidth="0.5"
          />
        );
      })}
      <circle cx="40" cy="40" r="3" fill={accent} />
    </svg>
  );
}
