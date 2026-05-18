import Link from "next/link";
import type { ReactNode } from "react";

export function RoomTile({
  href,
  roman,
  title,
  subtitle,
  count,
  icon,
}: {
  href: string;
  roman: string;
  title: string;
  subtitle: string;
  count?: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative block p-5 md:p-7 overflow-hidden border border-muted-gold/30 transition-all hover:border-muted-gold hover:-translate-y-0.5"
      style={{
        background:
          "linear-gradient(145deg, rgba(40,28,20,0.55) 0%, rgba(26,18,14,0.55) 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(196,160,96,0.18), 0 4px 18px rgba(0,0,0,0.35)",
      }}
    >
      <span className="absolute top-3 left-4 font-serif italic text-[11px] tracking-[0.3em] text-muted-gold/70">
        {roman}
      </span>
      <span className="absolute top-3 right-4 text-muted-rose/70 text-lg">
        {icon}
      </span>

      <div className="mt-6 md:mt-8">
        <h3 className="font-serif text-2xl md:text-3xl tracking-widest text-text">
          {title}
        </h3>
        <p className="mt-1 text-[10px] tracking-[0.3em] uppercase text-muted-grey font-serif italic">
          {subtitle}
        </p>
      </div>

      <div className="mt-6 md:mt-8 flex items-baseline justify-between border-t border-muted-gold/15 pt-3">
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted-grey/70">
          total
        </span>
        <span className="font-serif italic text-sm text-muted-gold group-hover:text-accent-warm transition-colors">
          {count ?? "—"}
        </span>
      </div>
    </Link>
  );
}
