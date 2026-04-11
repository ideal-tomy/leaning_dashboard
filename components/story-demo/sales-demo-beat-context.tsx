"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  isSalesDemoBeatMessage,
  type SalesDemoBeatMessage,
} from "@/lib/sales-demo-beat-protocol";
import { isStoryEmbedUrlSearchParams } from "@/lib/story-embed";
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
      {children}
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
