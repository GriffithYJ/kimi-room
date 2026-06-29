"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * BottomNav — persistent bottom bar with "back" and "home" buttons.
 *
 * Design:
 * - Left: ←  (back to previous page, disabled when no history)
 * - Right: ⌂ (home → /room)
 *
 * Uses useRouter().back() — if the router has no history entry the
 * button renders as disabled.  The home button always navigates to /room
 * (the iPhone-style desktop).
 *
 * Hidden on /room itself (no need to go "home" from home; no "back"
 * because there's nothing behind it in a fresh launch).
 *
 * Extensibility: the `actions` prop allows child pages to inject extra
 * slots (e.g. an "edit" pen or a "share" icon) into the nav bar.
 */

export type BottomNavAction = {
  key: string;
  label: string;
  symbol: string;           // single-character icon
  onClick: () => void;
  disabled?: boolean;
};

export function BottomNav({
  actions,
}: {
  actions?: BottomNavAction[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Lazy-resolve canGoBack on client only — avoids SSR/CSR mismatch
  // where `typeof window` produces false during server render.
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const goBack = useCallback(() => {
    if (canGoBack) router.back();
  }, [canGoBack, router]);

  const goHome = useCallback(() => {
    router.push("/room");
  }, [router]);

  // Never render on the home desktop itself — it would be redundant.
  if (pathname === "/room") return null;

  return (
    <nav
      className="kimi-bottom-nav"
      role="navigation"
      aria-label="Page navigation"
    >
      {/* —— Back —— */}
      <button
        className="kimi-nav-btn"
        onClick={goBack}
        disabled={!canGoBack}
        aria-label="Go back"
        title="Back"
      >
        ←
      </button>

      {/* —— Extra slots (injected by child pages) —— */}
      <div className="kimi-nav-extras">
        {actions?.map((a) => (
          <button
            key={a.key}
            className="kimi-nav-btn"
            onClick={a.onClick}
            disabled={a.disabled}
            aria-label={a.label}
            title={a.label}
          >
            {a.symbol}
          </button>
        ))}
      </div>

      {/* —— Home —— */}
      <button
        className="kimi-nav-btn"
        onClick={goHome}
        aria-label="Go to home screen"
        title="Home"
      >
        ⌂
      </button>
    </nav>
  );
}
