// Lily + Iris record frame — 8-fold radial flowers around a circle.
export function MuchaLilyIris({
  color,
  accent,
  size = 260,
}: {
  color: string;
  accent: string;
  size?: number;
}) {
  return (
    <svg viewBox="0 0 260 260" width={size} height={size} style={{ color }}>
      <defs>
        <g id="mk-lily">
          <path d="M0 -20 Q-4 -10 0 0 Q4 -10 0 -20" fill={accent} opacity="0.7" />
          <path
            d="M0 -22 Q-8 -16 -6 -6 Q0 -14 6 -6 Q8 -16 0 -22"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle cx="0" cy="-12" r="1.2" fill="currentColor" />
        </g>
        <g id="mk-iris">
          <path d="M0 -22 Q-6 -18 -7 -8 Q-3 -14 0 -8 Q3 -14 7 -8 Q6 -18 0 -22" fill={accent} opacity="0.55" />
          <path d="M0 -16 Q-2 -8 0 -2 Q2 -8 0 -16" fill="currentColor" opacity="0.4" />
          <line x1="0" y1="-2" x2="0" y2="6" stroke="currentColor" strokeWidth="0.5" />
        </g>
      </defs>
      <circle cx="130" cy="130" r="125" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <circle cx="130" cy="130" r="118" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      <circle cx="130" cy="130" r="82" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="130" cy="130" r="78" fill="none" stroke={accent} strokeWidth="0.4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const x = 130 + Math.cos(a) * 100;
        const y = 130 + Math.sin(a) * 100;
        const rot = (a * 180) / Math.PI + 90;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <use href={i % 2 === 0 ? "#mk-lily" : "#mk-iris"} />
          </g>
        );
      })}
      <g stroke="currentColor" fill="none" strokeWidth="0.3" opacity="0.5">
        {Array.from({ length: 8 }).map((_, i) => {
          const a1 = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2;
          const x1 = 130 + Math.cos(a1) * 100;
          const y1 = 130 + Math.sin(a1) * 100;
          const x2 = 130 + Math.cos(a2) * 100;
          const y2 = 130 + Math.sin(a2) * 100;
          const mx = 130 + Math.cos((a1 + a2) / 2) * 108;
          const my = 130 + Math.sin((a1 + a2) / 2) * 108;
          return <path key={i} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} />;
        })}
      </g>
    </svg>
  );
}
