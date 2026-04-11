"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StorySlide } from "@/lib/story-slides.staffing";
import { cn } from "@/lib/utils";

type StoryChromeProps = {
  slide: StorySlide;
  index: number;
  total: number;
  progressPercent: number;
  isPaused: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  onClose: () => void;
};

export function StoryChrome({
  slide,
  index,
  total,
  progressPercent,
  isPaused,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onTogglePause,
  onClose,
}: StoryChromeProps) {
  return (
    <>
      {/* スマホ：上映用に薄く。md+：従来 */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[61] px-3 pt-[max(0.35rem,env(safe-area-inset-top))] md:px-5 md:pt-5">
        <div
          className={cn(
            "pointer-events-auto mx-auto flex w-full max-w-6xl items-start gap-2 rounded-xl border border-white/12 bg-black/45 px-2.5 py-1.5 text-white shadow-lg backdrop-blur-md",
            "md:rounded-2xl md:items-center md:gap-3 md:px-4 md:py-2.5 md:shadow-[0_12px_30px_rgba(0,0,0,0.25)]"
          )}
        >
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55 md:text-[10px] md:tracking-[0.18em] md:text-white/60">
              {slide.chapter}
            </p>
            <p className="line-clamp-2 text-xs font-semibold leading-tight md:truncate md:text-base md:leading-snug">
              {slide.title}
            </p>
          </div>
          <p className="inline-flex shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/90 sm:px-2.5 sm:py-1 sm:text-xs">
            {index + 1} / {total}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20 md:size-10"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="size-4 md:size-5" />
          </Button>
        </div>
      </div>

      {/* スマホ：下端から浮いたカード（高さを抑えプレビューを広く）。md+：従来 */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-[61]",
          "flex justify-center px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1",
          "md:flex md:px-5 md:pb-5 md:pt-2 lg:px-8"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto w-full text-white",
            "max-h-[min(32vh,300px)] max-w-[min(24rem,calc(100%-0.75rem))] overflow-y-auto overscroll-contain rounded-2xl border border-white/25 bg-slate-950/95 p-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl",
            "max-md:mx-auto max-md:mb-1",
            "md:max-h-none md:max-w-6xl md:overflow-visible md:rounded-[1.75rem] md:border-white/12 md:bg-black/35 md:p-4 md:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
          )}
        >
          <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10 md:mb-3 md:h-1.5">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-150 ease-linear"
              style={{ width: `${progressPercent}%` }}
              aria-hidden
            />
          </div>

          <div className="grid gap-2 md:grid-cols-1 md:gap-4">
            <div className="min-w-0 space-y-0.5 text-left md:space-y-1.5 md:text-center">
              <p className="text-sm font-semibold leading-snug line-clamp-4 md:line-clamp-none md:text-xl">
                {slide.message}
              </p>
              <p className="line-clamp-3 text-[11px] leading-relaxed text-white/75 md:line-clamp-none md:text-base md:text-white/78">
                {slide.supportingCopy}
              </p>
              {slide.ctaHint ? (
                <p className="pt-0.5 text-[10px] font-medium tracking-wide text-sky-200/90 md:pt-1 md:text-sm">
                  {slide.ctaHint}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-4 gap-1 md:mx-auto md:max-w-md md:gap-2">
              <Button
                type="button"
                variant="secondary"
                className="h-9 rounded-xl border-white/15 bg-white/10 text-white hover:bg-white/20 md:h-11 md:rounded-2xl"
                onClick={onPrev}
                disabled={isFirst}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">前へ</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-9 rounded-xl border-white/15 bg-white/10 text-white hover:bg-white/20 md:h-11 md:rounded-2xl"
                onClick={onTogglePause}
              >
                {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                <span className="sr-only">
                  {isPaused ? "再開" : "一時停止"}
                </span>
              </Button>
              <Button
                type="button"
                className="col-span-2 h-9 rounded-xl bg-white text-slate-950 hover:bg-white/90 md:h-11 md:rounded-2xl"
                onClick={onNext}
                disabled={isLast}
              >
                次へ
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
