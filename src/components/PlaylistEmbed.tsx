export function PlaylistEmbed({ songId }: { songId: string }) {
  return (
    <iframe
      title={`netease-${songId}`}
      src={`https://music.163.com/outchain/player?type=2&id=${songId}&auto=0&height=66`}
      width={330}
      height={86}
      frameBorder={0}
      className="bg-deep-charcoal"
    />
  );
}
