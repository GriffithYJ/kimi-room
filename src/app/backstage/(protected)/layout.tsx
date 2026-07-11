import Link from "next/link";
import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Sticky top nav — back to room / backstage home */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          background: "rgba(10,5,6,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(236,226,204,0.12)",
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        <Link
          href="/room"
          style={{
            color: "rgba(196,160,96,0.7)",
            textDecoration: "none",
          }}
        >
          {"\u2190"} room
        </Link>
        <Link
          href="/backstage"
          style={{
            color: "rgba(184,176,168,0.4)",
            textDecoration: "none",
          }}
        >
          backstage
        </Link>
      </nav>
      {children}
    </div>
  );
}
