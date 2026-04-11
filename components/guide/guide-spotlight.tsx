"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useGuideSession } from "@/components/guide/guide-session-context";

const PAD = 10;

export function GuideSpotlight() {
  const pathname = usePathname();
  const { current, index } = useGuideSession();
  const target = current?.highlightTarget;
  const [box, setBox] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!target || typeof document === "undefined") {
      const clearId = requestAnimationFrame(() => setBox(null));
      return () => cancelAnimationFrame(clearId);
    }

    const update = () => {
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-guide-target="${target}"]`);
        if (!el || !(el instanceof HTMLElement)) {
          setBox(null);
          return;
        }
        const r = el.getBoundingClientRect();
        if (r.width < 2 && r.height < 2) {
          setBox(null);
          return;
        }
        setBox({
          top: r.top - PAD,
          left: r.left - PAD,
          width: r.width + PAD * 2,
          height: r.height + PAD * 2,
        });
      });
    };

    update();
    const t = window.setTimeout(update, 100);

    const el = document.querySelector(`[data-guide-target="${target}"]`);
    const observed = el instanceof HTMLElement ? el : null;

    const ro = observed ? new ResizeObserver(update) : null;
    if (observed && ro) ro.observe(observed);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.clearTimeout(t);
      ro?.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [target, index, pathname]);

  if (typeof document === "undefined" || !box) {
    return null;
  }

  const { top, left, width, height } = box;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[42]" aria-hidden>
      <div
        className="pointer-events-auto absolute bg-black/60"
        style={{ top: 0, left: 0, right: 0, height: Math.max(0, top) }}
      />
      <div
        className="pointer-events-auto absolute bg-black/60"
        style={{
          top,
          left: 0,
          width: Math.max(0, left),
          height,
        }}
      />
      <div
        className="pointer-events-auto absolute bg-black/60"
        style={{
          top,
          left: left + width,
          right: 0,
          height,
        }}
      />
      <div
        className="pointer-events-auto absolute bg-black/60"
        style={{
          top: top + height,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <div
        className="pointer-events-none absolute z-[1] max-w-[min(100vw-16px,12rem)] rounded-md bg-primary px-2 py-1 text-center text-[11px] font-bold leading-tight text-primary-foreground shadow-lg ring-2 ring-white/70"
        style={{
          top: Math.max(8, top - 36),
          left: Math.max(8, left),
        }}
      >
        ここを見る
      </div>
      <div
        className="pointer-events-none absolute z-[1] rounded-xl border-4 border-primary shadow-[0_0_0_4px_rgba(255,255,255,0.55),0_0_24px_rgba(59,130,246,0.45)]"
        style={{
          top,
          left,
          width,
          height,
        }}
      />
    </div>,
    document.body
  );
}
