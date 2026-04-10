"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { withDemoQuery } from "@/lib/demo-query";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { StaffingGuideStep } from "@/lib/guide-steps.staffing";

type GuidePlayerProps = {
  industry: EnabledIndustryKey;
  steps: StaffingGuideStep[];
};

export function GuidePlayer({ industry, steps }: GuidePlayerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stepStartedAt, setStepStartedAt] = useState(() => Date.now());
  const [nowMs, setNowMs] = useState(() => Date.now());

  const current = steps[index];
  const isLast = index >= steps.length - 1;

  useEffect(() => {
    if (!current) return;
    const targetHref = withDemoQuery(current.path, industry, current.role, {
      guide: "1",
    });
    if (pathname !== current.path) {
      router.push(targetHref);
    }
  }, [current, industry, pathname, router]);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setNowMs(Date.now());
    }, 200);
    return () => window.clearInterval(ticker);
  }, []);

  const remainingMs = useMemo(() => {
    if (!current) return 0;
    const runningElapsed = autoPlay ? nowMs - stepStartedAt : 0;
    return Math.max(0, current.durationMs - (elapsedMs + runningElapsed));
  }, [autoPlay, current, elapsedMs, nowMs, stepStartedAt]);

  useEffect(() => {
    if (!current || !autoPlay) return;
    if (remainingMs <= 0) return;
    const timer = window.setTimeout(() => {
      if (isLast) {
        setAutoPlay(false);
        return;
      }
      setIndex((prev) => Math.min(prev + 1, steps.length - 1));
      setElapsedMs(0);
      setStepStartedAt(Date.now());
    }, remainingMs);
    return () => window.clearTimeout(timer);
  }, [autoPlay, current, isLast, remainingMs, steps.length]);

  const progressPercent = useMemo(() => {
    if (!current || current.durationMs <= 0) return 0;
    const elapsed = current.durationMs - remainingMs;
    return Math.max(0, Math.min(100, (elapsed / current.durationMs) * 100));
  }, [current, remainingMs]);

  if (!current) {
    return null;
  }

  function moveTo(nextIndex: number) {
    setElapsedMs(0);
    setStepStartedAt(Date.now());
    setIndex(Math.max(0, Math.min(nextIndex, steps.length - 1)));
  }

  function toggleAutoPlay() {
    if (autoPlay) {
      setElapsedMs((prev) => prev + Math.max(0, Date.now() - stepStartedAt));
      setAutoPlay(false);
      return;
    }
    setStepStartedAt(Date.now());
    setAutoPlay(true);
  }

  function exitGuide() {
    const params = new URLSearchParams(window.location.search);
    params.delete("guide");
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }

  return (
    <Card className="border-primary/30 bg-background shadow-sm">
      <CardHeader className="space-y-3 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl">{current.title}</CardTitle>
          <p className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {index + 1} / {steps.length}
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-primary transition-[width] duration-200 ease-linear"
            style={{ width: `${progressPercent}%` }}
            aria-hidden
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          aria-live="polite"
          className="space-y-3 rounded-xl border border-border bg-surface/70 p-4"
        >
          <p className="text-base font-semibold leading-relaxed text-foreground sm:text-lg">
            {current.instruction}
          </p>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            補足: {current.note}
          </p>
          <p className="text-sm font-medium leading-relaxed text-primary sm:text-base">
            この画面で分かること: {current.value}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button
            type="button"
            variant="secondary"
            className="h-11 text-base"
            onClick={() => moveTo(index - 1)}
            disabled={index === 0}
          >
            前へ
          </Button>
          <Button
            type="button"
            className="h-11 text-base"
            onClick={() => moveTo(index + 1)}
            disabled={isLast}
          >
            次へ
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="col-span-2 h-11 text-base sm:col-span-1"
            onClick={toggleAutoPlay}
          >
            {autoPlay ? (
              <>
                <Pause className="size-4" />
                一時停止
              </>
            ) : (
              <>
                <Play className="size-4" />
                自動再生
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="col-span-2 h-11 text-base sm:col-span-1"
            onClick={() => {
              moveTo(0);
              setAutoPlay(false);
            }}
          >
            <RotateCcw className="size-4" />
            最初から
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="col-span-2 h-11 text-base"
            onClick={exitGuide}
          >
            ガイドを終了
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
