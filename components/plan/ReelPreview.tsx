"use client";

import { useState } from "react";
import type { BrandType } from "@/lib/planComposer";

/**
 * A live Instagram Reel mockup. Everything the marketer types in the studio —
 * the scene, caption, hashtags, brand — renders here in real time, inside a
 * phone frame with the familiar Reels chrome. Tapping the heart (or the scene)
 * likes it, just like the real thing. Purely a preview: no data leaves here.
 */
export function ReelPreview({
  handle,
  brand,
  desc,
  caption,
  hashtags,
  aiParts,
  disclose = false,
  compact = false,
}: {
  handle: string;
  brand?: BrandType;
  desc: string;
  caption: string;
  hashtags: string[];
  aiParts: string[];
  disclose?: boolean;
  compact?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [saved, setSaved] = useState(false);

  const at = (handle.trim() || "yourbrand").replace(/^@/, "");
  const scene =
    brand?.scene ?? "linear-gradient(155deg,#1f3551 0%,#4f1d25 60%,#704b2c 100%)";

  const like = () => {
    setLiked(true);
    setBurstKey((k) => k + 1);
  };
  const toggleLike = () => {
    if (liked) setLiked(false);
    else like();
  };

  const aiGenerative = aiParts.some((p) => p && p !== "edit");
  const showAiLabel = disclose && aiGenerative;

  return (
    <div
      className={`relative mx-auto w-full ${compact ? "max-w-[210px]" : "max-w-[290px]"}`}
    >
      {/* phone bezel */}
      <div className="rounded-[2.3rem] bg-black p-1.5 shadow-[0_40px_80px_-30px_rgba(31,53,81,0.6)] ring-1 ring-black/50">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[1.9rem] bg-black">
          {/* the scene */}
          <button
            type="button"
            aria-label="Like this Reel"
            onDoubleClick={like}
            className="ig-scene absolute inset-0 cursor-pointer"
            style={{ background: scene }}
          >
            {/* describe-your-Reel overlay */}
            <span className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
                <svg viewBox="0 0 24 24" className="ml-0.5 size-5 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span
                className={`mt-4 text-pretty italic leading-snug text-white/90 ${compact ? "text-[11px]" : "text-[13px]"}`}
              >
                {desc.trim()
                  ? `“${desc.trim()}”`
                  : "Describe your Reel to picture the scene…"}
              </span>
            </span>

            {/* double-tap heart burst */}
            {liked && (
              <span
                key={burstKey}
                aria-hidden
                className="ig-burst pointer-events-none absolute inset-0 grid place-items-center"
              >
                <svg viewBox="0 0 24 24" className="size-24 fill-white/90 drop-shadow-lg">
                  <path d="M12 21s-7.5-4.6-10-9.3C.3 8 2 4.5 5.3 4.5c2 0 3.3 1.1 4.7 3 1.4-1.9 2.7-3 4.7-3C18 4.5 19.7 8 18 11.7 15.5 16.4 12 21 12 21z" />
                </svg>
              </span>
            )}
          </button>

          {/* readability scrims */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/65 to-transparent" />

          {/* top bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-3 text-white">
            <span className="text-[15px] font-semibold drop-shadow">Reels</span>
            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-white stroke-[1.6]">
              <rect x="3" y="6" width="13" height="12" rx="3.5" />
              <path d="M16 10.5 21 8v8l-5-2.5z" />
            </svg>
          </div>

          {/* right action rail */}
          <div className="absolute bottom-16 right-2 flex flex-col items-center gap-3.5 text-white">
            <RailButton label="like" onClick={toggleLike}>
              <svg
                viewBox="0 0 24 24"
                className={`size-6 ${liked ? "ig-pop fill-[#ff3040] stroke-[#ff3040]" : "fill-none stroke-white"} stroke-[1.7]`}
              >
                <path d="M12 21s-7.5-4.6-10-9.3C.3 8 2 4.5 5.3 4.5c2 0 3.3 1.1 4.7 3 1.4-1.9 2.7-3 4.7-3C18 4.5 19.7 8 18 11.7 15.5 16.4 12 21 12 21z" />
              </svg>
              <span className="mt-0.5 text-[10px] font-medium">
                {liked ? "12.5k" : "12.4k"}
              </span>
            </RailButton>

            <RailButton label="comment">
              <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-white stroke-[1.7]">
                <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
              </svg>
              <span className="mt-0.5 text-[10px] font-medium">318</span>
            </RailButton>

            <RailButton label="share">
              <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-white stroke-[1.7]">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              <span className="mt-0.5 text-[10px] font-medium">204</span>
            </RailButton>

            <RailButton label="save" onClick={() => setSaved((s) => !s)}>
              <svg
                viewBox="0 0 24 24"
                className={`size-6 ${saved ? "ig-pop fill-white" : "fill-none"} stroke-white stroke-[1.7]`}
              >
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
              </svg>
            </RailButton>

            <button type="button" aria-label="more" className="leading-none">
              <span className="text-xl">⋯</span>
            </button>

            {/* spinning audio thumbnail */}
            <span
              className="ig-spin mt-1 grid size-7 place-items-center rounded-md ring-2 ring-white/80"
              style={{ background: scene }}
            >
              <span className="text-[10px]">🎵</span>
            </span>
          </div>

          {/* bottom content — pr leaves room for the action rail */}
          <div className="absolute inset-x-0 bottom-0 space-y-1.5 pb-3 pl-3 pr-12 text-white">
            <div className="flex items-center gap-2">
              <span className="ig-ring grid size-8 place-items-center rounded-full p-[2px]">
                <span className="grid size-full place-items-center rounded-full bg-black text-[11px] font-bold">
                  {at.slice(0, 1).toUpperCase()}
                </span>
              </span>
              <span className="text-[13px] font-semibold drop-shadow">@{at}</span>
              <span className="rounded-md border border-white/70 px-1.5 py-0.5 text-[10px] font-semibold">
                Follow
              </span>
            </div>

            <p className="text-[10px] font-medium uppercase tracking-wide text-white/70">
              Sponsored
            </p>

            <p className="line-clamp-2 text-[12px] leading-snug text-white/95">
              {caption.trim() || (
                <span className="text-white/55">Your caption shows up here…</span>
              )}
              {hashtags.length > 0 && (
                <span className="text-[#9cc3ff]">
                  {" "}
                  {hashtags.map((h) => `#${h}`).join(" ")}
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-white/90">
              <span>🎵</span>
              <span className="truncate">@{at} · Original audio</span>
            </div>

            {showAiLabel && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                <span>✦</span> AI info
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RailButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex flex-col items-center leading-none"
    >
      {children}
    </button>
  );
}
