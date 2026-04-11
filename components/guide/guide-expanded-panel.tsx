"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuideSession } from "@/components/guide/guide-session-context";

function GuideDemoMediaFrame({
  variant,
}: {
  variant: "mobile" | "desktop";
}) {
  const { current } = useGuideSession();
  const media = current?.demoMedia;
  if (!media) return null;

  const shell = (
    <div className="overflow-hidden rounded-lg border border-border bg-surface/80">
      <div
        className={
          variant === "mobile"
            ? "relative aspect-[16/10] max-h-[30vw] w-full min-h-[72px] bg-muted/40"
            : "relative aspect-[16/10] w-full max-h-36 min-h-[100px] bg-muted/40 md:max-h-40"
        }
      >
        {media.kind === "video" ? (
          <video
            className="h-full w-full object-cover object-top"
            src={media.src}
            poster={media.poster}
            muted
            playsInline
            loop
            controls
            preload="metadata"
          />
        ) : (
          <Image
            src={media.src}
            alt={media.caption ?? "PC画面のイメージ"}
            fill
            className="object-cover object-top"
            sizes={variant === "mobile" ? "100vw" : "(min-width: 768px) 360px, 100vw"}
            unoptimized={media.src.endsWith(".svg")}
          />
        )}
      </div>
      {media.caption ? (
        <p className="border-t border-border/80 px-2 py-1.5 text-[11px] leading-snug text-muted md:text-xs">
          {media.caption}
        </p>
      ) : null}
    </div>
  );

  if (variant === "mobile") {
    return <div className="md:hidden">{shell}</div>;
  }
  return (
    <div className="hidden md:block">
      <p className="mb-1.5 text-[11px] font-semibold text-muted">
        PC画面の見え方（参考）
      </p>
      {shell}
    </div>
  );
}

export function GuideExpandedPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    steps,
    index,
    moveTo,
    autoPlay,
    setAutoPlay,
    toggleAutoPlay,
    current,
    isLast,
    progressPercent,
  } = useGuideSession();

  if (!current) return null;

  function exitGuide() {
    const params = new URLSearchParams(window.location.search);
    params.delete("guide");
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  }

  return (
    <Card className="border-primary/25 bg-background/95 shadow-sm">
      <CardHeader className="space-y-2 pb-2 pt-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug sm:text-lg">
            {current.title}
          </CardTitle>
          <p className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary sm:text-sm">
            {index + 1} / {steps.length}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-primary transition-[width] duration-200 ease-linear"
            style={{ width: `${progressPercent}%` }}
            aria-hidden
          />
        </div>
        <GuideDemoMediaFrame variant="mobile" />
        <GuideDemoMediaFrame variant="desktop" />
      </CardHeader>

      <CardContent className="space-y-3 pb-3 pt-0">
        <div className="rounded-xl border border-border bg-surface/70 p-3 sm:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            見る
          </p>
          <p
            className="mt-0.5 text-sm font-semibold leading-relaxed text-foreground sm:text-base"
            aria-live="polite"
          >
            {current.instruction}
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
            押す・操作
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-muted sm:text-base">
            {current.note}
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
            得られること
          </p>
          <p className="mt-0.5 text-sm font-medium leading-relaxed text-primary sm:text-base">
            {current.value}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
                自動を止める
              </>
            ) : (
              <>
                <Play className="size-4" />
                自動で進める
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
