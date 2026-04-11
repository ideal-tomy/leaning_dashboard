"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * iframe 内（`?storyEmbed=1`）だけ表示されるラッパー。
 * モバイルでは `zoom` でレイアウトごと一様に縮小し、
 * 「窓だけ小さいのに中身のスケールが変わらない」状態を避ける。
 */
export function StoryEmbedViewport({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "story-embed-viewport min-h-full max-md:[zoom:0.82]",
        className
      )}
    >
      {children}
    </div>
  );
}
