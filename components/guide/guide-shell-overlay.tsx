"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useIndustry } from "@/components/industry-context";
import { GuidePlayer } from "@/components/guide/guide-player";
import { STAFFING_GUIDE_STEPS } from "@/lib/guide-steps.staffing";

function GuideShellOverlayInner() {
  const searchParams = useSearchParams();
  const { industry } = useIndustry();

  if (searchParams.get("guide") !== "1") {
    return null;
  }

  return (
    <div
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-[45] border-t border-primary/25 bg-background/98 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-background/92 md:pb-2"
      role="region"
      aria-label="はじめてガイド"
    >
      <div className="mx-auto max-h-[min(52vh,28rem)] w-full max-w-7xl overflow-y-auto px-4 py-3 md:max-h-[min(40vh,22rem)]">
        <GuidePlayer industry={industry} steps={STAFFING_GUIDE_STEPS} />
      </div>
    </div>
  );
}

export function GuideShellOverlay() {
  return (
    <Suspense fallback={null}>
      <GuideShellOverlayInner />
    </Suspense>
  );
}
