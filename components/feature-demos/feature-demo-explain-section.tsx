"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  FEATURE_DEMO_EXPLAIN,
  type FeatureDemoExplainSlug,
} from "@/lib/feature-demos-explain";

type Props = {
  slug: FeatureDemoExplainSlug;
  className?: string;
};

export function FeatureDemoExplainSection({ slug, className }: Props) {
  const copy = FEATURE_DEMO_EXPLAIN[slug];

  return (
    <Card
      className={cn(
        "border-border/80 bg-surface/50 shadow-none",
        className
      )}
    >
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted">タイトル：</p>
          <p className="text-base font-semibold text-foreground leading-snug">
            {copy.title}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted">概要説明：</p>
          <div className="whitespace-pre-line text-sm leading-relaxed text-muted">
            {copy.overview}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
