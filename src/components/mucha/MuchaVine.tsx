export function MuchaVine({
  color,
  accent,
  width = "100%",
}: {
  color: string;
  accent: string;
  width?: number | string;
}) {
  return (
    <svg viewBox="0 0 300 24" width={width} style={{ color, display: "block" }}>
      <path
        d="M10 12 Q30 4 50 12 Q70 20 90 12 Q110 4 130 12 Q150 20 170 12 Q190 4 210 12 Q230 20 250 12 Q270 4 290 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
      <g fill={accent} opacity="0.8">
        <circle cx="50" cy="12" r="2" />
        <circle cx="150" cy="12" r="2.5" />
        <circle cx="250" cy="12" r="2" />
      </g>
      <g stroke="currentColor" fill="none" strokeWidth="0.4" opacity="0.6">
        <ellipse cx="90" cy="12" rx="2" ry="5" transform="rotate(20 90 12)" />
        <ellipse cx="210" cy="12" rx="2" ry="5" transform="rotate(-20 210 12)" />
      </g>
    </svg>
  );
}
