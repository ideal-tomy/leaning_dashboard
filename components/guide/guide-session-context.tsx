"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { withDemoQuery } from "@/lib/demo-query";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { StaffingGuideStep } from "@/lib/guide-steps.staffing";

type GuideSessionValue = {
  industry: EnabledIndustryKey;
  steps: StaffingGuideStep[];
  index: number;
  setIndex: (n: number) => void;
  moveTo: (nextIndex: number) => void;
  autoPlay: boolean;
  setAutoPlay: (v: boolean) => void;
  toggleAutoPlay: () => void;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  toggleExpanded: () => void;
  current: StaffingGuideStep | undefined;
  isLast: boolean;
  progressPercent: number;
};

const GuideSessionContext = createContext<GuideSessionValue | null>(null);

export function useGuideSession(): GuideSessionValue {
  const v = useContext(GuideSessionContext);
  if (!v) throw new Error("useGuideSession must be used within GuideSessionProvider");
  return v;
}

export function GuideSessionProvider({
  industry,
  steps,
  children,
}: {
  industry: EnabledIndustryKey;
  steps: StaffingGuideStep[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stepStartedAt, setStepStartedAt] = useState(() => Date.now());
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      setExpanded(desktop);
      /** 手動で「次へ」が主役。自動送りはデフォルトOFF（スライド感・操作感のバランス） */
      setAutoPlay(false);
    });
    return () => cancelAnimationFrame(id);
  }, []);

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
    const ticker = window.setInterval(() => setNowMs(Date.now()), 200);
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

  const moveTo = useCallback(
    (nextIndex: number) => {
      setElapsedMs(0);
      setStepStartedAt(Date.now());
      setIndex(Math.max(0, Math.min(nextIndex, steps.length - 1)));
    },
    [steps.length]
  );

  const toggleAutoPlay = useCallback(() => {
    if (autoPlay) {
      setElapsedMs((prev) => prev + Math.max(0, Date.now() - stepStartedAt));
      setAutoPlay(false);
      return;
    }
    setStepStartedAt(Date.now());
    setAutoPlay(true);
  }, [autoPlay, stepStartedAt]);

  const toggleExpanded = useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  const progressPercent = useMemo(() => {
    if (!current || current.durationMs <= 0) return 0;
    const elapsed = current.durationMs - remainingMs;
    return Math.max(0, Math.min(100, (elapsed / current.durationMs) * 100));
  }, [current, remainingMs]);

  const value = useMemo(
    () => ({
      industry,
      steps,
      index,
      setIndex,
      moveTo,
      autoPlay,
      setAutoPlay,
      toggleAutoPlay,
      expanded,
      setExpanded,
      toggleExpanded,
      current,
      isLast,
      progressPercent,
    }),
    [
      industry,
      steps,
      index,
      moveTo,
      autoPlay,
      toggleAutoPlay,
      expanded,
      toggleExpanded,
      current,
      isLast,
      progressPercent,
    ]
  );

  return (
    <GuideSessionContext.Provider value={value}>
      {children}
    </GuideSessionContext.Provider>
  );
}
