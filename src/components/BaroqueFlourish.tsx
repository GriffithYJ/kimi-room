export function CornerScroll({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 60 60"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <path
        d="M2 58 C 2 40, 10 28, 28 28 C 40 28, 46 22, 46 12 C 46 6, 50 4, 54 4"
        opacity="0.85"
      />
      <path
        d="M2 58 C 6 46, 14 38, 24 38 C 32 38, 36 34, 36 28"
        opacity="0.5"
      />
      <circle cx="54" cy="4" r="1.6" fill="currentColor" opacity="0.9" />
      <circle cx="36" cy="28" r="1.1" fill="currentColor" opacity="0.7" />
      <path
        d="M28 28 Q 24 20, 30 18 Q 36 20, 32 28 Z"
        fill="currentColor"
        opacity="0.35"
        stroke="none"
      />
    </svg>
  );
}

export function CenterFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <path d="M10 20 C 40 20, 50 8, 80 20 C 95 26, 100 14, 100 14" opacity="0.7" />
      <path d="M190 20 C 160 20, 150 8, 120 20 C 105 26, 100 14, 100 14" opacity="0.7" />
      <g transform="translate(100 20)">
        <path
          d="M0 -10 C 4 -6, 6 -2, 0 0 C -6 -2, -4 -6, 0 -10 Z"
          fill="currentColor"
          opacity="0.9"
          stroke="none"
        />
        <path
          d="M0 0 C 5 2, 8 5, 0 8 C -8 5, -5 2, 0 0 Z"
          fill="currentColor"
          opacity="0.55"
          stroke="none"
        />
        <circle cx="0" cy="-12" r="1" fill="currentColor" />
      </g>
      <circle cx="10" cy="20" r="1.3" fill="currentColor" opacity="0.7" />
      <circle cx="190" cy="20" r="1.3" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function DamaskPattern({ className = "" }: { className?: string }) {
  const pattern = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23c4a060' stroke-width='0.4' opacity='0.25'><path d='M60 15 C 75 15, 85 25, 85 40 C 85 55, 75 65, 60 65 C 45 65, 35 55, 35 40 C 35 25, 45 15, 60 15 Z'/><path d='M60 55 C 70 55, 78 63, 78 75 C 78 87, 70 95, 60 95 C 50 95, 42 87, 42 75 C 42 63, 50 55, 60 55 Z'/><circle cx='60' cy='40' r='3' fill='%23c4a060' opacity='0.5'/><circle cx='60' cy='75' r='2' fill='%239a7a7a' opacity='0.45'/><path d='M0 60 Q 30 40, 60 60 T 120 60' /><path d='M0 0 Q 30 20, 60 0 T 120 0' /></g></svg>`;
  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("${pattern}")`,
        backgroundSize: "120px 120px",
      }}
    />
  );
}
