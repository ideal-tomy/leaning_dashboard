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
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[61] px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="pointer-events-auto mx-auto flex w-full max-w-6xl items-center gap-3 rounded-2xl border border-white/12 bg-black/30 px-3 py-2 text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-md sm:px-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {slide.chapter}
            </p>
            <p className="truncate text-sm font-semibold sm:text-base">
              {slide.title}
            </p>
          </div>
          <p className="hidden rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/85 sm:inline-flex">
            {index + 1} / {total}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[61] px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl rounded-[1.75rem] border border-white/12 bg-black/35 p-3 text-white shadow-[0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-4">
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-150 ease-linear"
              style={{ width: `${progressPercent}%` }}
              aria-hidden
            />
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="min-w-0 space-y-1">
              <p className="text-lg font-semibold leading-snug sm:text-xl">
                {slide.message}
              </p>
              <p className="text-sm leading-relaxed text-white/78 sm:text-base">
                {slide.supportingCopy}
              </p>
              {slide.ctaHint ? (
                <p className="pt-1 text-xs font-medium tracking-wide text-sky-200/90 sm:text-sm">
                  {slide.ctaHint}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/20"
                onClick={onPrev}
                disabled={isFirst}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">前へ</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/20"
                onClick={onTogglePause}
              >
                {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                <span className="sr-only">
                  {isPaused ? "再開" : "一時停止"}
                </span>
              </Button>
              <Button
                type="button"
                className="col-span-2 h-11 rounded-2xl bg-white text-slate-950 hover:bg-white/90"
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
