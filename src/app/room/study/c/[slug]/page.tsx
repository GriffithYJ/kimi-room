import { KimiPage, KimiTopNav } from "@/components/mucha/KimiPage";
import { palGold } from "@/lib/kimi-palettes";
import { getTheme } from "@/lib/day-theme";
import { CategoryClient } from "@/components/study/CategoryClient";

// V2 generic study sub-page · user-named categories (owner 0518 ack '全 custom').
// route `/room/study/c/[slug]` where slug = encoded category name.
// entries 走 pieceStore w/ tags[0] = category name.

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const P = palGold(await getTheme());
  const { slug } = await params;
  const name = decodeURIComponent(slug);

  return (
    <KimiPage P={P} vines={false}>
      <KimiTopNav title="STUDY" sub={name} P={P} />
      <CategoryClient P={P} category={name} />
    </KimiPage>
  );
}
