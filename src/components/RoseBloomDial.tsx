// /room day-mode hero — single Mucha-pink rose head, slow rotate + breath.
// owner dropped rose-single.png (full-bloom top-down view, just the flower
// head, no stem). PIL recolored to Mucha pink #A42B5E with checkerboard
// stripped (rose-single-pink.png).
//
// Replaces the previous 4-stage cross-fade which felt stiff and had
// color inconsistency between frames. Now one image, idle slow rotate
// (90s/turn) + subtle breath scale (1.0 ↔ 1.04 every 4.5s) + soft pink
// drop-shadow glow that pulses gently.

const PINK_GLOW = "rgba(164,43,94,0.55)";

export function RoseBloomDial({
  size = 64,
}: {
  size?: number;
  // legacy props (no-ops, kept for parity with /room/page.tsx call site)
  day?: number;
  accentMain?: string;
  accentDeep?: string;
  hairline?: string;
}) {
  return (
    <div
      className="rose-bloom-dial"
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
      }}
      aria-label="rose"
    >
      <style>{`
        .rose-bloom-dial { isolation: isolate; }

        @keyframes rose-rotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rose-breath {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }
        @keyframes rose-glow-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.85; }
        }

        .rose-bloom-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          animation: rose-rotate 90s linear infinite;
          will-change: transform;
          pointer-events: none;
          user-select: none;
        }
        .rose-bloom-breath {
          width: 100%;
          height: 100%;
          animation: rose-breath 4.5s ease-in-out infinite;
          will-change: transform;
          filter: drop-shadow(0 0 6px ${PINK_GLOW})
                  drop-shadow(0 0 14px rgba(164,43,94,0.32));
        }
        .rose-bloom-halo {
          position: absolute;
          inset: -10%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            ${PINK_GLOW} 0%,
            transparent 60%
          );
          opacity: 0.55;
          pointer-events: none;
          animation: rose-glow-pulse 4.5s ease-in-out infinite;
          will-change: opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .rose-bloom-img,
          .rose-bloom-breath,
          .rose-bloom-halo {
            animation: none;
          }
        }
      `}</style>

      <div className="rose-bloom-halo" aria-hidden />

      <div className="rose-bloom-breath">
        <img
          src="/icons/rose-single-pink.png?v=1"
          alt=""
          aria-hidden
          draggable={false}
          className="rose-bloom-img"
        />
      </div>
    </div>
  );
}
