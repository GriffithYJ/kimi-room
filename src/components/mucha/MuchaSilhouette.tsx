/** @deprecated 2026-05-16 dead-tag — 0 imports as of nav-sweep. 之后若仍未引用可删. */
export function MuchaSilhouette({
  color,
  hair,
  bodice,
}: {
  color: string;
  hair: string;
  bodice: string;
}) {
  return (
    <svg viewBox="0 0 200 340" width="100%" height="100%">
      {/* flowing hair halo */}
      <g fill={hair} opacity="0.85">
        <path d="M100 30 Q60 30 56 68 Q52 105 70 120 Q55 115 50 140 Q50 165 72 170 L80 120 Q85 80 100 60 Q115 80 120 120 L128 170 Q150 165 150 140 Q145 115 130 120 Q148 105 144 68 Q140 30 100 30" />
      </g>
      {/* head */}
      <circle cx="100" cy="58" r="20" fill={color} />
      {/* bodice — fitted top */}
      <path
        d="M78 82 Q78 78 82 78 L118 78 Q122 78 122 82 L128 120 L124 160 L76 160 L72 120 Z"
        fill={bodice}
      />
      {/* belt */}
      <rect x="75" y="156" width="50" height="4" fill={color} opacity="0.7" />
      {/* flowing skirt — Mucha draped */}
      <path
        d="M76 160 Q60 220 58 320 L142 320 Q140 220 124 160 Z"
        fill={color}
      />
      {/* skirt inner drapery lines */}
      <g stroke={hair} fill="none" strokeWidth="0.6" opacity="0.4">
        <path d="M85 175 Q82 240 78 315" />
        <path d="M100 175 L100 315" />
        <path d="M115 175 Q118 240 122 315" />
      </g>
      {/* shoulder drape */}
      <path d="M82 78 Q70 90 68 110 Q74 92 80 88 Z" fill={color} opacity="0.9" />
      <path d="M118 78 Q130 90 132 110 Q126 92 120 88 Z" fill={color} opacity="0.9" />
      {/* hair front strands */}
      <g fill={hair}>
        <path d="M88 45 Q92 52 90 60 Q86 55 86 48 Z" />
        <path d="M112 45 Q108 52 110 60 Q114 55 114 48 Z" />
      </g>
    </svg>
  );
}
