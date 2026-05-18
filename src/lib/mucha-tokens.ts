// Mucha colorway tokens — ported from design-refs/mucha-wardrobe.html.
// Keep bronze/pearl around for future pages if we decide to pivot a colorway.

export type MuchaPalette = {
  bg: string;
  paper: string;
  paper2?: string;
  ink: string;
  accent: string;
  accent2: string;
  mute: string;
  hair: string;
  hairDark?: string;
  bodice?: string;
};

export type MuchaColorway = {
  name: string;
  sub: string;
  light: MuchaPalette;
  dark: MuchaPalette;
};

export const MUCHA_COLORWAYS: Record<"ivory" | "bronze" | "pearl", MuchaColorway> = {
  ivory: {
    name: "Ivory · 象牙金",
    sub: "cream / antique gold / sage / rose",
    dark: {
      bg: "radial-gradient(ellipse at 50% 10%, #1a1612 0%, #0a0806 70%)",
      paper: "#100c08",
      ink: "#f3e6cd",
      accent: "#c19a56",
      accent2: "#8a9b6e",
      mute: "rgba(243, 230, 205, 0.55)",
      hair: "rgba(193, 154, 86, 0.38)",
    },
    light: {
      bg: "linear-gradient(180deg, #ffffff 0%, #fbf7ee 40%, #f4ecdc 100%)",
      paper: "rgba(255, 255, 253, 0.85)",
      paper2: "rgba(250, 244, 232, 0.7)",
      ink: "#3a2a1c",
      accent: "#8a6558",
      accent2: "#b8a296",
      mute: "rgba(58, 42, 28, 0.45)",
      hair: "rgba(138, 101, 88, 0.18)",
      hairDark: "#6a4a3c",
      bodice: "#9a7a6a",
    },
  },
  bronze: {
    name: "Bronze · 青铜深玫瑰",
    sub: "warm ivory / bronze / deep olive / terracotta",
    dark: {
      bg: "radial-gradient(ellipse at 50% 10%, #1a130e 0%, #0a0705 70%)",
      paper: "#120c08",
      ink: "#efd9b6",
      accent: "#b87d3e",
      accent2: "#5a6a3e",
      mute: "rgba(239, 217, 182, 0.55)",
      hair: "rgba(184, 125, 62, 0.4)",
    },
    light: {
      bg: "linear-gradient(180deg, #f4e8d4 0%, #e8d3b2 45%, #d4b88c 100%)",
      paper: "rgba(252, 244, 224, 0.72)",
      ink: "#3f1f12",
      accent: "#a0471e",
      accent2: "#556b2f",
      mute: "rgba(63, 31, 18, 0.55)",
      hair: "rgba(160, 71, 30, 0.28)",
      hairDark: "#5a2a15",
      bodice: "#8a3e1f",
    },
  },
  pearl: {
    name: "Pearl · 珠母苔绿",
    sub: "oyster / pale gold / dusty celadon / blush",
    dark: {
      bg: "radial-gradient(ellipse at 50% 10%, #15151a 0%, #080809 70%)",
      paper: "#0d0d10",
      ink: "#ecdfd0",
      accent: "#b8a274",
      accent2: "#95aa9b",
      mute: "rgba(236, 223, 208, 0.55)",
      hair: "rgba(184, 162, 116, 0.35)",
    },
    light: {
      bg: "linear-gradient(180deg, #f1ebe0 0%, #e3dccd 45%, #cfd2c2 100%)",
      paper: "rgba(252, 250, 244, 0.72)",
      ink: "#2e3428",
      accent: "#7a6538",
      accent2: "#6b8075",
      mute: "rgba(46, 52, 40, 0.55)",
      hair: "rgba(122, 101, 56, 0.25)",
      hairDark: "#3a3020",
      bodice: "#5a5040",
    },
  },
};

// Ivory chip override (B-pink) — committed for wardrobe
export const IVORY_CHIP = {
  tint: "rgba(238, 227, 220, 0.55)",
  selTint: "rgba(238, 227, 220, 0.95)",
  border: "rgba(238, 227, 220, 0.85)",
  selBorder: "#a04d42",
  ink: "#3a2a1c",
  selInk: "#a04d42",
};

// Ivory committed background override for the wardrobe page (not the gradient)
export const IVORY_BG = "#fbf5f0";
