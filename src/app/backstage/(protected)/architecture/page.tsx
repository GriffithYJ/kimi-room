import Link from "next/link";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

export const dynamic = "force-dynamic";

export default function ArchitecturePage() {
  return (
    <main className="flex-1 px-4 md:px-12 py-16 max-w-[1280px] mx-auto">
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="font-serif text-3xl tracking-widest text-muted-gold">
          architecture
        </h1>
        <Link
          href="/backstage"
          className="text-[10px] tracking-[0.3em] uppercase text-muted-grey hover:text-muted-gold"
        >
          ← backstage
        </Link>
      </div>
      <p className="text-xs tracking-[0.2em] uppercase text-muted-grey mb-6">
        kimi system map
      </p>

      <div className="rounded shadow-lg overflow-hidden border border-muted-gold/20">
        <ArchitectureDiagram />
      </div>
    </main>
  );
}
