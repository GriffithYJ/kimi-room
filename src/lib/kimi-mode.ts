// V2 build flag · NEXT_PUBLIC_KIMI_MODE = canon | kimi-room | kimi-airp
//
// canon     — owner daily prod (含 personal data: memorial-dates / publications /
//             aesthetic / cycle / wardrobe / diary / photos / backstage 等)
// kimi-room — V2a open-source GUI deploy (personal data 砍, 走 adapter)
// kimi-airp — V2b 角色扮演 fork (kimi-room + char card v2/v3 + ST iframe wrapper)
//
// Wired via apps/kimi-web/package.json scripts:
//   build:canon / build:kimi-room / build:kimi-airp

export type KimiMode = "canon" | "kimi-room" | "kimi-airp";

export const KIMI_MODE: KimiMode =
  (process.env.NEXT_PUBLIC_KIMI_MODE as KimiMode | undefined) ?? "canon";

export const isCanon = KIMI_MODE === "canon";
export const isKimiRoom = KIMI_MODE === "kimi-room";
export const isKimiAirp = KIMI_MODE === "kimi-airp";
export const isOpenV2 = isKimiRoom || isKimiAirp;
