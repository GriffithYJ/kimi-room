import Image from "next/image";

export type Photo = {
  src: string;
  alt: string;
  caption?: string;
};

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) {
    return (
      <p className="text-sm text-muted-grey italic">
        画廊还在等她上传。
      </p>
    );
  }
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
      {photos.map((p) => (
        <figure key={p.src} className="break-inside-avoid">
          <div className="relative w-full">
            <Image
              src={p.src}
              alt={p.alt}
              width={800}
              height={1000}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="w-full h-auto"
            />
          </div>
          {p.caption && (
            <figcaption className="mt-2 text-xs text-muted-grey tracking-wider">
              {p.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
