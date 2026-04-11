"use client";

import { Globe, Lock } from "lucide-react";
import { withDemoQuery } from "@/lib/demo-query";
import type { DemoRole } from "@/lib/demo-role";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { StorySlide } from "@/lib/story-slides.staffing";
import { cn } from "@/lib/utils";

type StoryStageProps = {
  industry: EnabledIndustryKey;
  defaultRole: DemoRole;
  currentSlide: StorySlide;
  previousSlide?: StorySlide | null;
  isTransitioning: boolean;
};

function StoryPreviewFrame({
  slide,
  industry,
  defaultRole,
  className,
}: {
  slide: StorySlide;
  industry: EnabledIndustryKey;
  defaultRole: DemoRole;
  className?: string;
}) {
  const previewPath = slide.previewPath ?? "/";
  const previewRole = slide.previewRole ?? defaultRole;
  const src = withDemoQuery(previewPath, industry, previewRole, {
    storyEmbed: "1",
  });

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[1.6rem] border border-white/15 bg-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/95 px-4 py-3 text-[11px] text-white/70">
        <span className="size-2 rounded-full bg-rose-400" aria-hidden />
        <span className="size-2 rounded-full bg-amber-300" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
        <span className="ml-2 inline-flex items-center gap-1">
          <Lock className="size-3" />
          派遣コックピット
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-white/55">
          <Globe className="size-3" />
          {previewPath}
        </span>
      </div>

      <iframe
        key={src}
        src={src}
        title={slide.stageLabel ?? slide.title}
        className="h-[calc(100%-2.75rem)] w-full bg-white"
        loading="eager"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent px-4 pb-4 pt-12 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">
          {slide.chapter}
        </p>
        <p className="mt-1 text-sm font-semibold md:text-base">
          {slide.stageLabel ?? slide.title}
        </p>
      </div>
    </div>
  );
}

export function StoryStage({
  industry,
  defaultRole,
  currentSlide,
  previousSlide,
  isTransitioning,
}: StoryStageProps) {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <style>{`
        @keyframes storyPrevFade {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
      <div className="relative aspect-[10/14] w-full sm:aspect-[4/5] md:aspect-[16/10]">
        {previousSlide ? (
          <StoryPreviewFrame
            slide={previousSlide}
            industry={industry}
            defaultRole={defaultRole}
            className={cn(
              "z-[1]",
              isTransitioning &&
                "animate-[storyPrevFade_420ms_ease-out_forwards]"
            )}
          />
        ) : null}
        <StoryPreviewFrame
          slide={currentSlide}
          industry={industry}
          defaultRole={defaultRole}
          className={cn(
            "transition-all duration-[420ms] ease-out",
            previousSlide
              ? isTransitioning
                ? "opacity-100 scale-[1.01]"
                : "opacity-100 scale-100"
              : "opacity-100"
          )}
        />
      </div>
    </div>
  );
}
