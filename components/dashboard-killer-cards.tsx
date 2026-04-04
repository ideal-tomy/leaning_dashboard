"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemoRole } from "@/lib/demo-role";
import { withDemoQuery } from "@/lib/demo-query";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import {
  getIndustryPageHints,
  type DashboardKillerHintsPack,
} from "@/lib/industry-page-hints";
import {
  avgEthicsModules,
  avgJpProgress,
  getDemoAlerts,
  getStalledWorkers,
} from "@/lib/demo-workers";

type Props = {
  industry: EnabledIndustryKey;
  role: DemoRole;
};

const defaultPack: DashboardKillerHintsPack = {
  headlineAdminJa: "支援機関：フォロー優先度と期限の一望",
  headlineClientJa: "工場向け：学習・コンプライアンスの見える化",
  card1: {
    titleJa: "今日フォローする学習者を開く",
    bodyJa:
      "最終学習から間が空いている／進捗が止まっている人員を優先します（デモ）。",
    ctaJa: "フォロー対象の一覧へ",
  },
  card2: {
    titleJa: "期限が近い手続きをまとめて見る",
    bodyJa: "在留・面談など、対応が必要な期限を一覧します（デモ）。",
    ctaJa: "期限・書類ハブへ",
  },
  card3: {
    titleJa: "全体の学習効果をチャートで見る",
    bodyJa:
      "日本語到達と倫理モジュールの横断サマリー。グラフは学習サマリー画面で表示します。",
    ctaJa: "学習サマリー（チャート）へ",
  },
};

export function DashboardKillerCards({ industry, role }: Props) {
  if (role === "worker") return null;

  const pack =
    getIndustryPageHints(industry).home.killerPack ?? defaultPack;
  const headline =
    role === "client" ? pack.headlineClientJa : pack.headlineAdminJa;

  const stalled = getStalledWorkers();
  const alerts = getDemoAlerts().slice(0, 6);
  const avgJp = avgJpProgress();
  const avgEth = avgEthicsModules();

  return (
    <div className="mb-6 space-y-3">
      <p className="text-sm font-medium text-muted">{headline}</p>
      <div className="grid min-w-0 gap-3 md:grid-cols-3">
        <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-5 text-amber-600" />
              {pack.card1.titleJa}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted">{pack.card1.bodyJa}</p>
            <ul className="space-y-1.5">
              {stalled.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1"
                >
                  <span className="truncate font-medium">{w.displayNameEn}</span>
                  <Badge variant="outline" className="shrink-0 text-amber-700">
                    {w.jpProgressPct}%
                  </Badge>
                </li>
              ))}
            </ul>
            <Link
              href={withDemoQuery("/candidates", industry, role, {
                followup: "learning",
              })}
              className="inline-flex text-xs font-medium text-primary hover:underline"
            >
              {pack.card1.ctaJa}
            </Link>
          </CardContent>
        </Card>

        <Card className="min-w-0 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-5 text-primary" />
              {pack.card2.titleJa}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted">{pack.card2.bodyJa}</p>
            <ul className="max-h-40 space-y-1.5 overflow-y-auto">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2 py-1"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-medium">{a.workerName}</span>
                    <span className="text-muted"> · {a.typeJa}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-xs text-muted">
                    残り{a.daysLeft}日
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={withDemoQuery("/documents", industry, role, {
                highlight: "deadlines",
              })}
              className="inline-flex text-xs font-medium text-primary hover:underline"
            >
              {pack.card2.ctaJa}
            </Link>
          </CardContent>
        </Card>

        <Card className="min-w-0 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5 text-emerald-600" />
              {pack.card3.titleJa}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted">{pack.card3.bodyJa}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary" className="gap-1">
                <BarChart3 className="size-3.5" />
                平均日本語到達 {avgJp}%
              </Badge>
              <Badge variant="outline" className="gap-1">
                倫理モジュール平均 {avgEth} / 6
              </Badge>
            </div>
            <Link
              href={withDemoQuery("/learning-insights", industry, role)}
              className="inline-flex text-xs font-medium text-primary hover:underline"
            >
              {pack.card3.ctaJa}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
