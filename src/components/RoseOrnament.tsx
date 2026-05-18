/** @deprecated 2026-05-16 dead-tag — 0 imports as of nav-sweep. 之后若仍未引用可删. */
export function RoseOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="12" x2="48" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <g transform="translate(60 12)">
        <path
          d="M0 -6 C 3 -4, 5 -1, 0 0 C -5 -1, -3 -4, 0 -6 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <path
          d="M0 0 C 4 1, 6 4, 0 6 C -6 4, -4 1, 0 0 Z"
          fill="currentColor"
          opacity="0.6"
        />
      </g>
      <line x1="72" y1="12" x2="120" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}
