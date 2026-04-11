import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardTopCardDefinition } from "@/lib/dashboard-top-cards";
import type { StoryDashboardFocus } from "@/lib/story-embed";
import { cn } from "@/lib/utils";

type Props = {
  cards: DashboardTopCardDefinition[];
  /** 営業ストーリー iframe 内：カード境界を動画でも分かりやすく */
  storyDemo?: boolean;
  storyDashboardFocus?: StoryDashboardFocus;
};

function toneClass(tone: DashboardTopCardDefinition["tone"]): string {
  if (tone === "danger") return "border-danger/30";
  if (tone === "warning") return "border-warning/35";
  if (tone === "success") return "border-success/35";
  return "";
}

function toneBadge(tone: DashboardTopCardDefinition["tone"]): string {
  if (tone === "danger") return "要対応";
  if (tone === "warning") return "注意";
  if (tone === "success") return "順調";
  return "確認";
}

export function DashboardTopCardGrid({
  cards,
  storyDemo,
  storyDashboardFocus,
}: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className={cn(
            "group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
            storyDemo && "story-demo-tap-target"
          )}
        >
          <Card
            className={cn(
              `h-full min-h-[190px] rounded-xl border-2 border-transparent shadow-sm ring-1 ring-primary/10 transition-all group-hover:border-primary/40 group-hover:shadow-md group-hover:ring-2 group-hover:ring-primary/25 ${toneClass(card.tone)}`,
              storyDemo && "border-primary/25",
              storyDemo &&
                storyDashboardFocus === "priority" &&
                "border-primary/35 shadow-md ring-2 ring-primary/25"
            )}
          >
            <CardHeader className="space-y-2 pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {toneBadge(card.tone)}
                </Badge>
              </div>
              <p className="text-sm text-muted">{card.subtitle}</p>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-2.5">
              <div className="rounded-lg bg-surface px-3 py-2">
                <p className="text-xs text-muted">{card.kpiLabel}</p>
                <p className="text-2xl font-bold tabular-nums">{card.kpiValue}</p>
              </div>
              <ul className="space-y-1 text-sm text-muted">
                {card.highlights.slice(0, 2).map((item) => (
                  <li
                    key={item}
                    className={cn(storyDemo ? "line-clamp-2 break-words" : "truncate")}
                  >
                    ・{item}
                  </li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary">
                {card.ctaLabel}
                <ArrowRight className="size-4" />
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

