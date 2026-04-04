"use client";

import { cn } from "@/lib/utils";

/** Recharts の SSR で幅高さが取れない問題を避けるため、クライアントマウント後に子を描画 */
export function ClientOnlyChart({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ready = typeof window !== "undefined";
  if (!ready) {
    return (
      <div
        className={cn(
          "w-full min-w-0 animate-pulse rounded-lg bg-slate-100",
          className
        )}
      />
    );
  }
  return <div className={cn("w-full min-w-0", className)}>{children}</div>;
}
