// 10 unique Mucha-inspired ornaments — 给 /playlist 10 首歌 grid card 当装饰.
// 都是简笔单色 SVG, 用 currentColor 跟 palette accent 联动.
// 仿 Mucha hour series / season series 的植物花卉 motif:
//  vine · rose · iris · lily · peony · daisy · ivy · laurel · clematis · olive

type Props = { idx: number; size?: number; color?: string; accent?: string };

/** @deprecated 2026-05-16 dead-tag — 0 imports as of nav-sweep. 之后若仍未引用可删. */
export function MuchaPanelOrnament({ idx, size = 38, color = "currentColor", accent }: Props) {
  const variant = idx % 10;
  const a = accent ?? color;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden
      style={{ color, flexShrink: 0, opacity: 0.85 }}
    >
      {variant === 0 && /* vine 卷藤 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <path d="M6 32 Q10 22 14 18 Q20 12 26 10 Q32 8 34 4" />
          <ellipse cx="14" cy="18" rx="2.2" ry="1" transform="rotate(-30 14 18)" fill={color} />
          <ellipse cx="22" cy="13" rx="2" ry="0.9" transform="rotate(-25 22 13)" fill={color} />
          <ellipse cx="29" cy="9" rx="1.8" ry="0.8" transform="rotate(-20 29 9)" fill={color} />
          <circle cx="34" cy="4" r="1.4" fill={a} />
        </g>
      )}
      {variant === 1 && /* rose 玫瑰 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <circle cx="20" cy="18" r="6" />
          <path d="M20 12 Q22 14 22 18 Q22 22 20 24 Q18 22 18 18 Q18 14 20 12 Z" fill={a} opacity="0.6" />
          <path d="M14 18 Q20 16 26 18" />
          <path d="M14 28 Q20 26 26 28" />
          <line x1="20" y1="24" x2="20" y2="36" />
          <ellipse cx="14" cy="32" rx="3" ry="1.2" transform="rotate(-35 14 32)" fill={color} />
        </g>
      )}
      {variant === 2 && /* iris 鸢尾 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <path d="M20 6 Q16 12 18 18 Q22 18 20 6 Z" fill={a} opacity="0.6" />
          <path d="M20 8 Q24 14 26 22" />
          <path d="M20 8 Q16 14 14 22" />
          <line x1="20" y1="20" x2="20" y2="36" />
          <path d="M16 28 L20 30 L24 28" />
        </g>
      )}
      {variant === 3 && /* lily 百合 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <path d="M20 8 Q14 14 16 22 Q20 22 20 8 Z" />
          <path d="M20 8 Q26 14 24 22 Q20 22 20 8 Z" />
          <line x1="20" y1="20" x2="20" y2="36" />
          <ellipse cx="20" cy="14" rx="1.2" ry="2.5" fill={a} />
          <path d="M14 30 Q20 27 26 30" />
        </g>
      )}
      {variant === 4 && /* peony 牡丹 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <circle cx="20" cy="18" r="8" />
          <circle cx="20" cy="18" r="5" />
          <circle cx="20" cy="18" r="2.5" fill={a} />
          <line x1="20" y1="26" x2="20" y2="36" />
          <ellipse cx="14" cy="32" rx="3" ry="1.2" transform="rotate(-35 14 32)" fill={color} />
          <ellipse cx="26" cy="32" rx="3" ry="1.2" transform="rotate(35 26 32)" fill={color} />
        </g>
      )}
      {variant === 5 && /* daisy 雏菊 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <circle cx="20" cy="14" r="2" fill={a} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="20"
              cy="8"
              rx="1.4"
              ry="3.5"
              fill={color}
              transform={`rotate(${deg} 20 14)`}
              opacity="0.7"
            />
          ))}
          <line x1="20" y1="20" x2="20" y2="36" />
        </g>
      )}
      {variant === 6 && /* ivy 常春藤 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <path d="M20 4 Q20 20 20 36" />
          <path d="M20 10 Q14 8 12 12 Q14 16 20 14 Z" fill={color} />
          <path d="M20 18 Q26 16 28 20 Q26 24 20 22 Z" fill={color} />
          <path d="M20 26 Q14 24 12 28 Q14 32 20 30 Z" fill={color} />
          <circle cx="20" cy="6" r="1.2" fill={a} />
        </g>
      )}
      {variant === 7 && /* laurel 月桂 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <path d="M20 36 Q14 28 12 18 Q12 10 20 4" />
          <path d="M20 36 Q26 28 28 18 Q28 10 20 4" />
          {[8, 14, 20, 26].map((y, i) => (
            <g key={y}>
              <ellipse cx={i % 2 === 0 ? 12 : 14} cy={y} rx="2" ry="0.9" transform={`rotate(-50 ${i % 2 === 0 ? 12 : 14} ${y})`} fill={color} />
              <ellipse cx={i % 2 === 0 ? 28 : 26} cy={y} rx="2" ry="0.9" transform={`rotate(50 ${i % 2 === 0 ? 28 : 26} ${y})`} fill={color} />
            </g>
          ))}
          <circle cx="20" cy="6" r="1.4" fill={a} />
        </g>
      )}
      {variant === 8 && /* clematis 铁线莲 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="20"
              cy="11"
              rx="2"
              ry="6"
              transform={`rotate(${deg} 20 18)`}
              fill={color}
              opacity="0.55"
            />
          ))}
          <circle cx="20" cy="18" r="2" fill={a} />
          <line x1="20" y1="24" x2="20" y2="36" />
        </g>
      )}
      {variant === 9 && /* olive 橄榄 */ (
        <g fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round">
          <path d="M6 30 Q14 22 22 18 Q30 14 36 8" />
          <ellipse cx="14" cy="22" rx="1.2" ry="2.6" transform="rotate(-50 14 22)" fill={color} />
          <ellipse cx="20" cy="19" rx="1.2" ry="2.6" transform="rotate(-40 20 19)" fill={color} />
          <ellipse cx="26" cy="15" rx="1.2" ry="2.6" transform="rotate(-30 26 15)" fill={color} />
          <ellipse cx="32" cy="11" rx="1.2" ry="2.6" transform="rotate(-20 32 11)" fill={color} />
          <circle cx="36" cy="8" r="1.4" fill={a} />
        </g>
      )}
    </svg>
  );
}
