// V2 placeholder books · BOOKSHELF SVG spine renders (owner 0654 ack ·
// "书架上的书也是 可以先放着空的名字等填 但书要存在") · 用户 fork 后 edit
// this file 加 own books · or wait Phase 5 IDB BookStore wire 真 add UI.

export type Book = {
  slug: string;
  spineColor: string;
  height: number;
  spineLabel: string;
  title: string;
  titleZh?: string;
  author: string;
  status: "reading" | "shelved" | "wishlist";
  kind?: "poem" | "paper" | "novel";
  trigger?: string;
  excerpt?: string;
  fullText?: string;
  note?: string;
  source?: string;
  year?: string;
};

// 8 placeholder books · canon Mucha spine palette · empty title/spineLabel for V2
// user-fill flow. Heights varied to match canon shelf visual. Edit each entry
// w/ own book or 加 new entry · keep slug unique.
export const BOOKS: Book[] = [
  { slug: "placeholder-1", spineColor: "#8a6558", height: 110, spineLabel: "", title: "", author: "", status: "shelved" },
  { slug: "placeholder-2", spineColor: "#6a7a5c", height: 124, spineLabel: "", title: "", author: "", status: "wishlist" },
  { slug: "placeholder-3", spineColor: "#5a4a7e", height: 96, spineLabel: "", title: "", author: "", status: "shelved" },
  { slug: "placeholder-4", spineColor: "#c19a56", height: 118, spineLabel: "", title: "", author: "", status: "reading" },
  { slug: "placeholder-5", spineColor: "#a04d42", height: 132, spineLabel: "", title: "", author: "", status: "shelved" },
  { slug: "placeholder-6", spineColor: "#3a2a1c", height: 104, spineLabel: "", title: "", author: "", status: "wishlist" },
  { slug: "placeholder-7", spineColor: "#4a6a4a", height: 116, spineLabel: "", title: "", author: "", status: "shelved" },
  { slug: "placeholder-8", spineColor: "#8a7a4a", height: 128, spineLabel: "", title: "", author: "", status: "reading" },
];

export function findBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
