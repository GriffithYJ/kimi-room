// Line-art hourglass — used on memory review 页 "expire / deactivate"
// 按钮. 替代 ⏳ emoji (跨平台渲染不一致 + 跟 Mucha line-art vibe 不搭).

export function HourglassIcon({
  size = 14,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* top + bottom plates */}
      <line x1="3" y1="2.5" x2="13" y2="2.5" />
      <line x1="3" y1="13.5" x2="13" y2="13.5" />
      {/* left funnel curve */}
      <path d="M3.2 2.6 Q5 5.2 8 8 Q5 10.8 3.2 13.4" />
      {/* right funnel curve */}
      <path d="M12.8 2.6 Q11 5.2 8 8 Q11 10.8 12.8 13.4" />
      {/* sand at top — fill triangle indicates remaining time */}
      <path d="M5 3 L11 3 L8 6.7 Z" fill={color} opacity="0.55" stroke="none" />
      {/* tiny grain falling through neck */}
      <circle cx="8" cy="9.5" r="0.5" fill={color} stroke="none" opacity="0.7" />
    </svg>
  );
}
