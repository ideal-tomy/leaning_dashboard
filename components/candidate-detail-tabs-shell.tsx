"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tabs } from "@/components/ui/tabs";

type Props = {
  defaultValue: string;
  /** TabsList（トリガー行）。枠の上段に固定表示する */
  tabList: ReactNode;
  /** TabsContent のみ。枠内で縦スクロールする */
  children: ReactNode;
};

function restoreWindowScrollY(y: number) {
  window.scrollTo({ top: y, left: 0, behavior: "auto" });
}

/**
 * 候補者詳細はタブ上に長いブロックがあり、パネル高の変化が window スクロールに効く。
 * max-height だけだと flex 子が親の「確定した高さ」を持てず、内側が伸びて文書スクロールに戻ることがある。
 * ビューポート基準の固定 height で枠を確定し、パネルだけ overflow-y-auto にする。
 * タブ操作時は window の scrollY も復元（フォーカス等の微調整対策）。
 */
export function CandidateDetailTabsShell({
  defaultValue,
  tabList,
  children,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const windowScrollLockRef = useRef<number | null>(null);
  const restoreGenRef = useRef(0);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const captureWindowScroll = useCallback(() => {
    windowScrollLockRef.current = window.scrollY;
  }, []);

  const handleValueChange = useCallback((next: string) => {
    if (windowScrollLockRef.current == null) {
      windowScrollLockRef.current = window.scrollY;
    }
    setValue(next);
  }, []);

  useLayoutEffect(() => {
    const el = panelScrollRef.current;
    if (el) el.scrollTop = 0;
  }, [value]);

  useLayoutEffect(() => {
    const y = windowScrollLockRef.current;
    if (y == null) return;
    const gen = ++restoreGenRef.current;
    const apply = () => {
      if (gen !== restoreGenRef.current) return;
      restoreWindowScrollY(y);
    };
    apply();
    requestAnimationFrame(() => {
      apply();
      requestAnimationFrame(apply);
    });
    const t = window.setTimeout(apply, 50);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <Tabs
      value={value}
      onValueChange={handleValueChange}
      className="flex w-full flex-col gap-0"
    >
      {/* 高さを dvh で確定（max-h だけにしない）→ flex-1 + min-h-0 の内側スクロールが必ず発生 */}
      <div
        className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm h-[max(16rem,calc(100dvh-14rem))] md:h-[max(16rem,calc(100dvh-9rem))]"
      >
        <div
          className="shrink-0 border-b border-border bg-surface/60 p-1"
          onPointerDownCapture={captureWindowScroll}
        >
          {tabList}
        </div>
        <div
          ref={panelScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-1 py-2 [touch-action:pan-y]"
          role="region"
          aria-label="タブの内容"
        >
          {children}
        </div>
      </div>
    </Tabs>
  );
}
