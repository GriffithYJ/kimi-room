// The foyer's palettes — gathered into two objects so the components name a
// token and never carry a loose hex.
//
// Day is art nouveau: cream paper, rose, olive line. Night is baroque: a warm
// black and gilt. The deepest step of night is #050403 rather than pure black —
// nothing on this screen is drawn on absolute black.

export const FOYER_DAY = {
  bg: "radial-gradient(130% 90% at 50% 0%, #F7F0E6 0%, #F0E8DB 55%, #EAE0D2 100%)",
  bgSolid: "#F7F0E6",
  edge: "#EAE0D2",
  ink: "#3A2D24",
  inkBody: "#4A3A2E",
  inkQuote: "#5C4A3C",
  mute: "#A08D7A",
  muteWarm: "#8C6A50",
  rose: "#B23A6E",
  roseLight: "#C77A9B",
  rosePetal: "#C98BA5",
  roseFlower: "#8C5A70",
  olive: "#A8927E",
  card: "#FBF5EA",
  cardLine: "rgba(150,110,90,.35)",
  frameLine: "rgba(150,110,90,.6)",
  frameLineInner: "rgba(150,110,90,.26)",
  sill: "rgba(150,110,90,.55)",
  cardShadow: "0 6px 16px rgba(90,60,40,.1)",
} as const;

export const FOYER_NIGHT = {
  bg: "radial-gradient(120% 70% at 50% 0%, #12100B 0%, #0A0806 50%, #050403 100%)",
  bgSolid: "#050403",
  edge: "#050403",
  panel: "#0A0806",
  paper: "#F5EBD5",
  paperSoft: "#F0E5C9",
  paperQuote: "#E3D8C0",
  paperMute: "#CDBFA0",
  gold: "#C9A768",
  goldBright: "#E6CD96",
  goldDim: "#A89877",
  frameLine: "rgba(201,167,104,.6)",
  frameLineInner: "rgba(201,167,104,.26)",
  sill: "rgba(201,167,104,.6)",
  avatarBg: "rgba(10,8,6,.75)",
  lancetBg: "rgba(10,8,6,.62)",
  noteBg: "rgba(16,13,8,.72)",
  noteLine: "rgba(201,167,104,.4)",
  /** Night text sits on top of the glass; without this it goes muddy. */
  textShadow: "0 1px 14px rgba(0,0,0,.85)",
} as const;

/** The reference viewport the stage is drawn against; every pixel value in
 *  these components lives in that space. */
export const STAGE_W = 402;
export const STAGE_H = 874;
