import { ImageResponse } from "next/og";

export const alt = "kimi · room";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const [cormorant300, cormorant500] = await Promise.all([
    loadFont(
      "https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-300-normal.ttf",
    ),
    loadFont(
      "https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-500-normal.ttf",
    ),
  ]);

  const fonts: {
    name: string;
    data: ArrayBuffer;
    weight: 300 | 500;
    style: "normal";
  }[] = [];
  if (cormorant300) fonts.push({ name: "Cormorant", data: cormorant300, weight: 300, style: "normal" });
  if (cormorant500) fonts.push({ name: "Cormorant", data: cormorant500, weight: 500, style: "normal" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 70% 30%, #3a2a1e 0%, #1a1410 35%, #0c0c0c 80%)",
          color: "#d8d0c8",
          fontFamily: "Cormorant",
          position: "relative",
        }}
      >
        {/* gold vignette border */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid rgba(196,160,96,0.35)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 32,
            border: "1px solid rgba(196,160,96,0.15)",
            display: "flex",
          }}
        />

        {/* corner ornaments */}
        {(
          [
            { top: 40, left: 40, deg: 0 },
            { top: 40, right: 40, deg: 90 },
            { bottom: 40, right: 40, deg: 180 },
            { bottom: 40, left: 40, deg: 270 },
          ] as const
        ).map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "top" in p ? p.top : undefined,
              bottom: "bottom" in p ? p.bottom : undefined,
              left: "left" in p ? p.left : undefined,
              right: "right" in p ? p.right : undefined,
              width: 60,
              height: 60,
              transform: `rotate(${p.deg}deg)`,
              display: "flex",
            }}
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <path
                d="M2 58 C 2 40, 10 28, 28 28 C 40 28, 46 22, 46 12 C 46 6, 50 4, 54 4"
                stroke="#b8a070"
                strokeWidth="0.8"
                fill="none"
                opacity="0.8"
              />
              <circle cx="54" cy="4" r="2" fill="#c4a060" />
            </svg>
          </div>
        ))}

        {/* center mark · V2 generic (fork 后 user 改 own initials/handle 起码 */}
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.6em",
            color: "#c4a060",
            textTransform: "uppercase",
            fontWeight: 300,
            marginBottom: 20,
            display: "flex",
          }}
        >
          companion room
        </div>

        <div
          style={{
            fontSize: 180,
            fontWeight: 500,
            letterSpacing: "0.06em",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <span style={{ color: "#c4a060", fontStyle: "italic" }}>kimi</span>
        </div>

        <div
          style={{
            fontSize: 32,
            fontStyle: "italic",
            color: "#9a7a7a",
            marginTop: 24,
            letterSpacing: "0.15em",
            display: "flex",
          }}
        >
          · room ·
        </div>

      </div>
    ),
    {
      ...size,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  );
}
