"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useIndustry } from "@/components/industry-context";
import { GuideSessionProvider, useGuideSession } from "@/components/guide/guide-session-context";
import { GuideSpotlight } from "@/components/guide/guide-spotlight";
import { GuideExpandedPanel } from "@/components/guide/guide-expanded-panel";
import { STAFFING_GUIDE_STEPS } from "@/lib/guide-steps.staffing";
import { cn } from "@/lib/utils";

function GuideChromeMeasured() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { expanded, toggleExpanded, current, index, steps } = useGuideSession();

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const sync = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--guide-chrome-bottom",
        `${Math.ceil(h)}px`
      );
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("orientationchange", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", sync);
      document.documentElement.style.removeProperty("--guide-chrome-bottom");
    };
  }, [expanded]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-[45] border-t border-primary/25 bg-background/98 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-6px_24px_rgba(0,0,0,0.1)] backdrop-blur-md supports-[backdrop-filter]:bg-background/92"
      role="region"
      aria-label="はじめてガイド"
    >
      <div className="flex items-center gap-2 border-b border-border/70 px-3 py-2.5 md:hidden">
        <p
          className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground"
          aria-live="polite"
        >
          {current?.title ?? "ガイド"}
        </p>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
          {index + 1}/{steps.length}
        </span>
        <button
          type="button"
          onClick={toggleExpanded}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              閉じる
              <ChevronDown className="size-4" aria-hidden />
            </>
          ) : (
            <>
              詳しく
              <ChevronDown className="size-4 rotate-180" aria-hidden />
            </>
          )}
        </button>
      </div>

      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-3 pt-2 md:pt-3",
          expanded ? "block max-h-[min(40vh,20rem)] overflow-y-auto pb-2" : "hidden",
          "md:block md:max-h-[min(38vh,24rem)] md:overflow-y-auto md:pb-3"
        )}
      >
        <GuideExpandedPanel />
      </div>
    </div>
  );
}

function GuideSessionRoot() {
  const { industry } = useIndustry();
  return (
    <GuideSessionProvider industry={industry} steps={STAFFING_GUIDE_STEPS}>
      <GuideSpotlight />
      <GuideChromeMeasured />
    </GuideSessionProvider>
  );
}

function GuideShellOverlayInner() {
  const searchParams = useSearchParams();

  if (searchParams.get("guide") !== "1") {
    return null;
  }

  return <GuideSessionRoot />;
}

export function GuideShellOverlay() {
  return (
    <Suspense fallback={null}>
      <GuideShellOverlayInner />
    </Suspense>
  );
}
