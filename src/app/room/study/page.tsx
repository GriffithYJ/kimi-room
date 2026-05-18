import { KimiPage, KimiTopNav } from "@/components/mucha/KimiPage";
import { palGold, type KimiPalette } from "@/lib/kimi-palettes";
import { getTheme } from "@/lib/day-theme";
import { BookShelf } from "@/components/study/BookShelf";
import { CategoryList } from "@/components/study/CategoryList";

export default async function StudyPage() {
  const P = palGold(await getTheme());

  return (
    <KimiPage P={P} vines={false}>
      <KimiTopNav title="STUDY" sub="reading" P={P} />

      <div style={{ textAlign: "center", padding: "6px 24px 0" }}>
        <div
          style={{
            fontSize: 24,
            color: P.ink,
            letterSpacing: 4,
            fontFamily: '"Cormorant Garamond", "Noto Serif SC", "Songti SC", "STSong", serif',
          }}
        >
          书桌
        </div>
        <div style={{ fontSize: 10, color: P.mute, fontStyle: "italic", marginTop: 2 }}>
          desk
        </div>
      </div>

      <Section label="READING" P={P}>
        <SubLabel P={P}>书架 · BOOKSHELF</SubLabel>
        <BookShelf P={P} />
      </Section>

      <CategoryList P={P} />
    </KimiPage>
  );
}

function Section({
  label,
  P,
  children,
}: {
  label: string;
  P: KimiPalette;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: "22px 22px 0" }}>
      <div style={{ fontSize: 9, letterSpacing: 3, color: P.accent, marginBottom: 10 }}>
        · {label}
      </div>
      {children}
    </div>
  );
}

function SubLabel({ P, children }: { P: KimiPalette; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: 2, color: P.mute, fontStyle: "italic" }}>
      {children}
    </div>
  );
}
