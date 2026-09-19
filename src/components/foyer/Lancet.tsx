import { FOYER_DAY, FOYER_NIGHT } from "./tokens";
import { LancetStar } from "./Ornaments";

/**
 * One lancet of the triptych — the same shape by day and by night, reskinned: a
 * floral panel by day, a piece of stained glass by night. The middle one stands
 * a little taller.
 *
 * Behind each sits a blurred, enlarged copy of its own image, breathing on its
 * own cycle. The light comes from behind the glass; it is not drawn onto the
 * frame.
 */

type Variant = "side" | "center";

const GEOM: Record<Variant, { w: number; innerH: number; outerR: string; innerR: string }> = {
  side: { w: 80, innerH: 232, outerR: "40px 40px 3px 3px", innerR: "36px 36px 2px 2px" },
  center: { w: 92, innerH: 272, outerR: "46px 46px 3px 3px", innerR: "42px 42px 2px 2px" },
};

const GLOW = {
  day: {
    side: { left: -12, top: -8, w: 104, h: 256, blur: 24, sat: 1.35, op: 0.3, dur: 7 },
    center: { left: -12, top: -8, w: 116, h: 296, blur: 26, sat: 1.35, op: 0.32, dur: 7 },
  },
  night: {
    side: { left: -14, top: -10, w: 108, h: 262, blur: 28, sat: 1.7, op: 0.5, dur: 6 },
    center: { left: -14, top: -10, w: 120, h: 302, blur: 30, sat: 1.7, op: 0.55, dur: 6 },
  },
} as const;

export function Lancet({
  variant,
  night,
  src,
  objectPosition,
  label,
  labelAccent = false,
  fadeDelay,
  glowDelay,
}: {
  variant: Variant;
  night: boolean;
  src: string;
  objectPosition?: string;
  label?: string;
  labelAccent?: boolean;
  fadeDelay: number;
  glowDelay: number;
}) {
  const g = GEOM[variant];
  const glow = GLOW[night ? "night" : "day"][variant];
  const frameOpacity = night
    ? variant === "center"
      ? 0.7
      : 0.6
    : variant === "center"
      ? 0.68
      : 0.6;
  const innerOpacity = night && variant === "center" ? 0.28 : 0.26;

  return (
    <div
      style={{
        position: "relative",
        flex: "none",
        width: g.w,
        animation: `foyer-fadeup 1s ease ${fadeDelay}s both`,
      }}
    >
      {/* the colour coming through from behind */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          left: glow.left,
          top: glow.top,
          width: glow.w,
          height: glow.h,
          objectFit: "cover",
          objectPosition,
          filter: `blur(${glow.blur}px) saturate(${glow.sat})`,
          opacity: glow.op,
          animation: `foyer-flick ${glow.dur}s ease-in-out ${glowDelay}s infinite`,
        }}
      />
      <div
        style={{
          position: "relative",
          boxSizing: "border-box",
          border: `1px solid rgba(${night ? "201,167,104" : "150,110,90"},${frameOpacity})`,
          borderRadius: g.outerR,
          padding: 4,
          background: night ? FOYER_NIGHT.lancetBg : "rgba(251,245,234,.65)",
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            border: `1px solid rgba(${night ? "201,167,104" : "150,110,90"},${innerOpacity})`,
            borderRadius: g.innerR,
            overflow: "hidden",
            height: g.innerH,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: objectPosition ?? "top",
              display: "block",
            }}
          />
        </div>
      </div>

      {night ? (
        <LancetStar />
      ) : (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: -3,
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: FOYER_DAY.rose,
          }}
        />
      )}

      {/* the sill */}
      <div
        style={{
          height: 2,
          margin: "6px 6px 0",
          background: `linear-gradient(90deg, transparent, ${night ? FOYER_NIGHT.sill : FOYER_DAY.sill}, transparent)`,
        }}
      />

      {label && (
        <div
          style={{
            textAlign: "center",
            fontSize: 6.5,
            letterSpacing: 2,
            color: labelAccent ? FOYER_DAY.rose : FOYER_DAY.mute,
            marginTop: 5,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
