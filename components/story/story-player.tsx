"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { StoryChrome } from "@/components/story/story-chrome";
import { StoryCloseGuard } from "@/components/story/story-close-guard";
import { StoryStage } from "@/components/story/story-stage";
import { withDemoQuery } from "@/lib/demo-query";
import type { DemoRole } from "@/lib/demo-role";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import {
  SALES_DEMO_BEAT_MESSAGE_TYPE,
  type SalesDemoBeatMessage,
} from "@/lib/sales-demo-beat-protocol";
import type { StorySlide } from "@/lib/story-slides.staffing";

type StoryPlayerProps = {
  industry: EnabledIndustryKey;
  role: DemoRole;
  slides: StorySlide[];
};

const TRANSITION_MS = 420;
/** iframe 内の React が message リスナーを張るまでの余裕（最初のビートを落とさない） */
const IFRAME_BEAT_START_DELAY_MS = 150;

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
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);
  const beatTimeoutsRef = useRef<number[]>([]);
  const beatSeqRef = useRef(0);
  /** `slideId:generation` — スライド変更で generation が進み、対応する iframe onLoad 後だけビートを張る */
  const [beatScheduleKey, setBeatScheduleKey] = useState("");
  const loadGenerationRef = useRef(0);

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

  const clearBeatTimeouts = useCallback(() => {
    beatTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    beatTimeoutsRef.current = [];
  }, []);

  const postBeatToPreview = useCallback(
    (slideId: string, beatId: string) => {
      const win = previewIframeRef.current?.contentWindow;
      if (!win) return;
      const payload: SalesDemoBeatMessage = {
        type: SALES_DEMO_BEAT_MESSAGE_TYPE,
        slideId,
        beatId,
        seq: ++beatSeqRef.current,
      };
      win.postMessage(payload, window.location.origin);
    },
    []
  );

  useEffect(() => {
    clearBeatTimeouts();
    postBeatToPreview(currentSlide?.id ?? "", "");
    /** beatScheduleKey は空にしない（onLoad が先に走った場合に上書き消しするため）。次の onLoad で更新される */
  }, [clearBeatTimeouts, currentSlide?.id, postBeatToPreview]);

  useEffect(() => {
    clearBeatTimeouts();
    if (isPaused || !currentSlide?.demoBeats?.length) {
      postBeatToPreview(currentSlide?.id ?? "", "");
      return;
    }
    const prefix = `${currentSlide.id}:`;
    if (!beatScheduleKey.startsWith(prefix)) {
      return;
    }

    let t = IFRAME_BEAT_START_DELAY_MS;
    for (const beat of currentSlide.demoBeats) {
      const delay = t;
      const { id: beatId } = beat;
      const tid = window.setTimeout(() => {
        postBeatToPreview(currentSlide.id, beatId);
      }, delay);
      beatTimeoutsRef.current.push(tid);
      t += beat.durationMs;
    }

    return () => {
      clearBeatTimeouts();
    };
  }, [
    beatScheduleKey,
    clearBeatTimeouts,
    currentSlide?.demoBeats,
    currentSlide?.id,
    isPaused,
    postBeatToPreview,
  ]);

  const handlePreviewIframeLoad = useCallback(() => {
    loadGenerationRef.current += 1;
    setBeatScheduleKey(`${currentSlide.id}:${loadGenerationRef.current}`);
  }, [currentSlide.id]);

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
        <div className="absolute inset-x-0 top-[2.85rem] px-2 pb-[min(34vh,310px)] pt-0.5 sm:px-3 md:top-16 md:bottom-28 md:pb-0 md:px-5 lg:bottom-32 lg:px-8">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
            <StoryStage
              industry={industry}
              defaultRole={previewBaseRole}
              currentSlide={currentSlide}
              previousSlide={previousSlide}
              isTransitioning={isTransitioning}
              previewIframeRef={previewIframeRef}
              onPreviewIframeLoad={handlePreviewIframeLoad}
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
