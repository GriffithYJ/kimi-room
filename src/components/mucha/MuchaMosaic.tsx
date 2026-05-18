export function MuchaMosaic({
  color,
  accent,
  size = 60,
}: {
  color: string;
  accent: string;
  size?: number;
}) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ color }}>
      {Array.from({ length: 6 }).flatMap((_, r) =>
        Array.from({ length: 6 }).map((_, c) => {
          const d = (r + c) % 3;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * 10}
              y={r * 10}
              width="9"
              height="9"
              fill={d === 0 ? "currentColor" : d === 1 ? accent : "none"}
              stroke="currentColor"
              strokeWidth="0.3"
              opacity={d === 0 ? 0.15 : d === 1 ? 0.3 : 0.6}
            />
          );
        }),
      )}
    </svg>
  );
}
