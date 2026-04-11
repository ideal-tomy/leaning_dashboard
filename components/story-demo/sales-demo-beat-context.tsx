"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  isSalesDemoBeatMessage,
  type SalesDemoBeatMessage,
} from "@/lib/sales-demo-beat-protocol";
import { isStoryEmbedUrlSearchParams } from "@/lib/story-embed";
import { StoryEmbedViewport } from "@/components/story-demo/story-embed-viewport";
import { cn } from "@/lib/utils";

type BeatState = {
  slideId: string | null;
  beatId: string | null;
  seq: number;
};

const SalesDemoBeatContext = createContext<BeatState>({
  slideId: null,
  beatId: null,
  seq: 0,
});

/**
 * ビート変更ごとに、対象の `[data-demo-beat-id]` が見える位置にスクロール。
 * iframe 内の React レンダーとレイアウトが完了するのを待つため、
 * 300ms 遅延 + 2 rAF の二段タイミングで実行。
 * スライド変更時は `slideId` も変わるので `key` を合わせてリトリガーする。
 */
function StoryEmbedBeatScrollIntoView() {
  const { beatId, slideId } = useSalesDemoBeatState();
  const searchParams = useSearchParams();
  const storyEmbed = isStoryEmbedUrlSearchParams(searchParams);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (!storyEmbed || !beatId) return;

    const scrollToBeat = () => {
      const selector = `[data-demo-beat-id="${CSS.escape(beatId)}"]`;
      const el = document.querySelector(selector);
      if (!el) return;
      el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    };

    timerRef.current = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => {
        requestAnimationFrame(scrollToBeat);
      });
    }, 350);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [beatId, slideId, storyEmbed]);

  return null;
}

export function SalesDemoBeatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const storyEmbed = isStoryEmbedUrlSearchParams(searchParams);
  const [state, setState] = useState<BeatState>({
    slideId: null,
    beatId: null,
    seq: 0,
  });

  /** iframe 内ドキュメントにフラグ（CSS で tap-target の青枠を制御） */
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (storyEmbed) {
      root.setAttribute("data-story-embed", "");
    } else {
      root.removeAttribute("data-story-embed");
    }
    return () => {
      root.removeAttribute("data-story-embed");
    };
  }, [storyEmbed]);

  /** 現在ビート ID（文脈用の青 ring を抑止するため CSS から参照） */
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!storyEmbed) {
      root.removeAttribute("data-active-beat-id");
      return;
    }
    if (state.beatId) {
      root.setAttribute("data-active-beat-id", state.beatId);
    } else {
      root.removeAttribute("data-active-beat-id");
    }
    return () => {
      root.removeAttribute("data-active-beat-id");
    };
  }, [storyEmbed, state.beatId]);

  /** useEffect より早く登録し、親の postMessage（0ms タイマー）に負けない */
  useLayoutEffect(() => {
    if (!storyEmbed) return;

    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (!isSalesDemoBeatMessage(e.data)) return;
      const msg = e.data as SalesDemoBeatMessage;
      setState({
        slideId: msg.slideId,
        beatId: msg.beatId === "" ? null : msg.beatId,
        seq: msg.seq,
      });
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [storyEmbed]);

  return (
    <SalesDemoBeatContext.Provider value={state}>
      <StoryEmbedBeatScrollIntoView />
      {storyEmbed ? (
        <StoryEmbedViewport>{children}</StoryEmbedViewport>
      ) : (
        children
      )}
    </SalesDemoBeatContext.Provider>
  );
}

export function useSalesDemoBeatState(): BeatState {
  return useContext(SalesDemoBeatContext);
}

export function useSalesDemoBeatIsActive(beatId: string): boolean {
  const { beatId: active } = useSalesDemoBeatState();
  return active === beatId;
}

/** アクティブ時のみ `activeClass`（既定: story-demo-beat-active） */
export function useSalesDemoBeatClass(
  beatId: string,
  activeClass = "story-demo-beat-active"
): string {
  const active = useSalesDemoBeatIsActive(beatId);
  return active ? activeClass : "";
}

export function StoryBeatMark({
  beatId,
  children,
  className,
  activeClassName = "story-demo-beat-active",
}: {
  beatId: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}) {
  const ac = useSalesDemoBeatClass(beatId, activeClassName);
  return (
    <div className={cn(className, ac)} data-demo-beat-id={beatId}>
      {children}
    </div>
  );
}
