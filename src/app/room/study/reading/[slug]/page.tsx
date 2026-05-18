import { KimiPage, KimiTopNav } from "@/components/mucha/KimiPage";
import { palGold } from "@/lib/kimi-palettes";
import { getTheme } from "@/lib/day-theme";
import { BookDetailClient } from "@/components/study/BookDetailClient";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const P = palGold(await getTheme());
  const { slug } = await params;
  const bookId = decodeURIComponent(slug);

  return (
    <KimiPage P={P} vines={false}>
      <KimiTopNav title="BOOK" sub="reading" P={P} backHref="/room/study" />
      <BookDetailClient P={P} bookId={bookId} />
    </KimiPage>
  );
}
