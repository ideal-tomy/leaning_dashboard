"use client";

import type { RefObject } from "react";
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
  /** true while the old slide is fading out */
  isTransitioning: boolean;
  /** true after the new iframe fires onLoad */
  isNewFrameReady: boolean;
  previewIframeRef?: RefObject<HTMLIFrameElement | null>;
  onPreviewIframeLoad?: () => void;
};

function BrowserChrome({ previewPath }: { previewPath: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-950/95 px-2.5 py-2 text-[10px] text-white/70 max-md:py-1.5 md:gap-2 md:px-4 md:py-3 md:text-[11px]">
      <span className="size-2 rounded-full bg-rose-400" aria-hidden />
      <span className="size-2 rounded-full bg-amber-300" aria-hidden />
      <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
      <span className="ml-2 inline-flex items-center gap-1">
        <Lock className="size-3" />
        派遣コックピット
      </span>
      <span className="ml-auto inline-flex min-w-0 max-w-[45%] items-center gap-1 truncate text-white/55 md:max-w-none">
        <Globe className="size-3 shrink-0" />
        {previewPath}
      </span>
    </div>
  );
}

function StoryPreviewFrame({
  slide,
  industry,
  defaultRole,
  className,
  iframeRef,
  onIframeLoad,
}: {
  slide: StorySlide;
  industry: EnabledIndustryKey;
  defaultRole: DemoRole;
  className?: string;
  iframeRef?: RefObject<HTMLIFrameElement | null>;
  onIframeLoad?: () => void;
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
      <BrowserChrome previewPath={previewPath} />
      <iframe
        key={src}
        ref={iframeRef}
        src={src}
        title={slide.stageLabel ?? slide.title}
        className="h-[calc(100%-2.35rem)] w-full bg-white max-md:h-[calc(100%-2rem)] md:h-[calc(100%-2.75rem)]"
        loading="eager"
        onLoad={onIframeLoad}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent px-3 pb-3 pt-10 text-white md:block md:px-4 md:pb-4 md:pt-12">
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

/**
 * Crossfade logic:
 * - Previous frame sits on top (z-[2]) and fades out over 800ms
 * - New frame sits behind (z-[1]) and fades in only after iframe onLoad (isNewFrameReady)
 * - Both frames overlap during fade → no blackout
 */
export function StoryStage({
  industry,
  defaultRole,
  currentSlide,
  previousSlide,
  isTransitioning,
  isNewFrameReady,
  previewIframeRef,
  onPreviewIframeLoad,
}: StoryStageProps) {
  return (
    <div className="relative mx-auto w-full max-w-5xl max-md:max-w-[min(100%,22.5rem)] max-md:px-0 sm:max-md:max-w-[min(100%,26rem)]">
      <div className="relative aspect-[10/16] w-full max-md:max-h-[min(62vh,560px)] sm:aspect-[4/5] sm:max-md:max-h-[min(66vh,600px)] md:aspect-[16/10] md:max-h-none">
        {/* New frame (behind) — hidden until ready, then fades in */}
        <StoryPreviewFrame
          slide={currentSlide}
          industry={industry}
          defaultRole={defaultRole}
          iframeRef={previewIframeRef}
          onIframeLoad={onPreviewIframeLoad}
          className={cn(
            "z-[1] transition-opacity duration-700 ease-in-out",
            isNewFrameReady ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Previous frame (on top) — fades out while new loads behind */}
        {previousSlide ? (
          <StoryPreviewFrame
            slide={previousSlide}
            industry={industry}
            defaultRole={defaultRole}
            className={cn(
              "z-[2] transition-opacity ease-in-out",
              isTransitioning
                ? "opacity-0 duration-800"
                : "opacity-100 duration-0"
            )}
          />
        ) : null}
      </div>
    </div>
  );
}
