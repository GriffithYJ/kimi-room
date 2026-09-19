"use client";

import { useEffect, useState } from "react";
import { WEATHER_REFRESH_MS, weatherUrl, wmoToWord } from "@/lib/foyer";
import type { FoyerWeatherLocation } from "@/lib/foyer-prefs";
import { SunGlyph, MoonGlyph } from "./Ornaments";
import { FOYER_DAY, FOYER_NIGHT } from "./tokens";

/**
 * The weather row. Open-Meteo, no key. Fetched once on mount and every twenty
 * minutes after. Until an answer arrives it holds "· ·" and "SKY" — the line
 * neither collapses nor flickers.
 *
 * The location is filled in at /backstage/settings; with none (location = null)
 * the row does not render at all.
 */
export function FoyerWeather({
  night,
  marginTop,
  delay,
  location,
}: {
  night: boolean;
  marginTop: number;
  delay: number;
  location: FoyerWeatherLocation | null;
}) {
  const [wx, setWx] = useState<{ temp: number; code: number } | null>(null);
  const lat = location?.lat;
  const lng = location?.lng;

  useEffect(() => {
    if (lat == null || lng == null) return;
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(weatherUrl(lat, lng));
        const j = await r.json();
        if (!alive || typeof j?.current?.temperature_2m !== "number") return;
        setWx({ temp: Math.round(j.current.temperature_2m), code: j.current.weather_code });
      } catch {
        // Unreachable weather just keeps the placeholder. The front door should
        // not raise an error over this.
      }
    };
    load();
    const id = setInterval(load, WEATHER_REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [lat, lng]);

  if (!location) return null;

  const label = location.label.trim().toUpperCase();

  return (
    <div
      style={{
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        marginTop,
        animation: `foyer-fadeup .9s ease ${delay}s both`,
      }}
    >
      {night ? <MoonGlyph /> : <SunGlyph />}
      <span
        style={{
          fontSize: 8.5,
          letterSpacing: 3,
          color: night ? FOYER_NIGHT.goldBright : FOYER_DAY.muteWarm,
        }}
      >
        {label ? `${label} · ` : ""}
        {wx ? `${wx.temp}°` : "· ·"} · {wmoToWord(wx?.code ?? null)}
      </span>
    </div>
  );
}
