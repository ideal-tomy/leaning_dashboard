"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StoryChrome } from "@/components/story/story-chrome";
import { StoryCloseGuard } from "@/components/story/story-close-guard";
import { StoryStage } from "@/components/story/story-stage";
import { withDemoQuery } from "@/lib/demo-query";
import type { DemoRole } from "@/lib/demo-role";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { StorySlide } from "@/lib/story-slides.staffing";

type StoryPlayerProps = {
  industry: EnabledIndustryKey;
  role: DemoRole;
  slides: StorySlide[];
};

const TRANSITION_MS = 420;

export function StoryPlayer({ industry, role, slides }: StoryPlayerProps) {
  const router = useRouter();
  const previewBaseRole: DemoRole = "admin";
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const currentSlide = slides[index] ?? slides[0];
  const previousSlide =
    previousIndex === null ? null : (slides[previousIndex] ?? null);
  const isFirst = index === 0;
  const isLast = index >= slides.length - 1;

  useEffect(() => {
    const ticker = window.setInterval(() => setNowMs(Date.now()), 100);
    return () => window.clearInterval(ticker);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const remainingMs = useMemo(() => {
    if (!currentSlide) return 0;
    const runningElapsed = isPaused ? 0 : nowMs - startedAt;
    return Math.max(0, currentSlide.durationMs - (elapsedMs + runningElapsed));
  }, [currentSlide, elapsedMs, isPaused, nowMs, startedAt]);

  const progressPercent = useMemo(() => {
    if (!currentSlide || currentSlide.durationMs <= 0) return 0;
    const elapsed = currentSlide.durationMs - remainingMs;
    return Math.max(0, Math.min(100, (elapsed / currentSlide.durationMs) * 100));
  }, [currentSlide, remainingMs]);

  const moveTo = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(nextIndex, slides.length - 1));
      if (clamped === index) return;
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      setPreviousIndex(index);
      setIsTransitioning(true);
      setElapsedMs(0);
      setStartedAt(Date.now());
      setIndex(clamped);
      transitionTimeoutRef.current = window.setTimeout(() => {
        setPreviousIndex(null);
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, TRANSITION_MS);
    },
    [index, slides.length]
  );

  useEffect(() => {
    if (!currentSlide || isPaused || isLast) return;
    const timer = window.setTimeout(() => {
      moveTo(index + 1);
    }, Math.max(remainingMs, 0));
    return () => window.clearTimeout(timer);
  }, [currentSlide, index, isLast, isPaused, moveTo, remainingMs]);

  const handleTogglePause = useCallback(() => {
    if (isPaused) {
      setStartedAt(Date.now());
      setIsPaused(false);
      return;
    }
    setElapsedMs((prev) => prev + Math.max(0, Date.now() - startedAt));
    setIsPaused(true);
  }, [isPaused, startedAt]);

  const handlePause = useCallback(() => {
    if (isPaused) return;
    setElapsedMs((prev) => prev + Math.max(0, Date.now() - startedAt));
    setIsPaused(true);
  }, [isPaused, startedAt]);

  const handleClose = useCallback(() => {
    router.replace(withDemoQuery("/guide", industry, role));
  }, [industry, role, router]);

  if (!currentSlide) {
    return null;
  }

  return (
    <StoryCloseGuard
      isPaused={isPaused}
      onPause={handlePause}
      onRequestClose={handleClose}
    >
      <div className="fixed inset-0 z-[60] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(71,85,105,0.34),transparent_30%),radial-gradient(circle_at_80%_100%,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="absolute inset-x-0 top-16 bottom-28 px-3 sm:top-20 sm:bottom-32 sm:px-5 lg:px-8">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
            <StoryStage
              industry={industry}
              defaultRole={previewBaseRole}
              currentSlide={currentSlide}
              previousSlide={previousSlide}
              isTransitioning={isTransitioning}
            />
          </div>
        </div>

        <StoryChrome
          slide={currentSlide}
          index={index}
          total={slides.length}
          progressPercent={progressPercent}
          isPaused={isPaused}
          isFirst={isFirst}
          isLast={isLast}
          onPrev={() => moveTo(index - 1)}
          onNext={() => moveTo(index + 1)}
          onTogglePause={handleTogglePause}
          onClose={handleClose}
        />
      </div>
    </StoryCloseGuard>
  );
}
