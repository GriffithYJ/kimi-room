// Mucha dual-avatars — two overlapping circles with accent ring.
// Rotation only when `playing` is true (used on /playlist/now-playing).
//
// V2 props-driven: callers pass selfSrc + otherSrc. Default = inline SVG data-URL
// (ring + 0 fill), so V2 fork day-0 first-launch 0 portrait JPG ship 仍 渲染 干净
// placeholder ring. canon callers (e.g. /room/page.tsx) explicit pass JPG path.
// `otherCrop` toggles the high-face crop (ito portrait sits high in source).

const PLACEHOLDER_DATA_URL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-opacity="0.25" stroke-width="0.8"/></svg>',
  );

export function DualAvatars({
  size = 58,
  accent = "#8a6558",
  gap = -6,
  playing = false,
  selfSrc,
  otherSrc,
  otherCrop = false,
}: {
  size?: number;
  accent?: string;
  gap?: number;
  playing?: boolean;
  selfSrc?: string;
  otherSrc?: string;
  otherCrop?: boolean;
}) {
  const anim = playing ? "kt-spin 12s linear infinite" : "none";
  const resolvedSelf = selfSrc ?? PLACEHOLDER_DATA_URL;
  const resolvedOther = otherSrc ?? PLACEHOLDER_DATA_URL;

  const ring = (
    src: string,
    z: number,
    ml: number,
    innerStyle?: React.CSSProperties,
  ) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${accent}`,
        padding: 2,
        boxShadow: `0 0 0 1px ${accent}33, 0 4px 16px rgba(0,0,0,0.15)`,
        overflow: "hidden",
        position: "relative",
        zIndex: z,
        marginLeft: ml,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: anim,
          ...innerStyle,
        }}
      />
    </div>
  );
  return (
    <div style={{ display: "inline-flex", alignItems: "center", position: "relative" }}>
      <style>{`@keyframes kt-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      {ring(resolvedSelf, 2, 0)}
      {ring(
        resolvedOther,
        1,
        gap,
        otherCrop
          ? { backgroundSize: "125%", backgroundPosition: "center 28%" }
          : undefined,
      )}
    </div>
  );
}
