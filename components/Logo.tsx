export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 font-display ${className}`}>
      <span className="inline-block size-2 rounded-full bg-[var(--color-amberlight)]" />
      <span className="tracking-tight">RAI · Reels</span>
    </span>
  );
}
