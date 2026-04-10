"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileParentBackLink } from "@/components/navigation/mobile-parent-back-link";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import type { Candidate, DocumentDeficiencyUrgencyDemo } from "@data/types";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { cn } from "@/lib/utils";
import { withDemoQuery } from "@/lib/demo-query";

function urgencyOf(c: Candidate): DocumentDeficiencyUrgencyDemo {
  return c.detailDemo?.documentDeficiencyUrgency ?? "medium";
}

const URGENCY_META: Record<
  DocumentDeficiencyUrgencyDemo,
  { title: string; bar: string; dot: string }
> = {
  high: {
    title: "緊急性・高",
    bar: "border-l-4 border-l-danger bg-danger/5",
    dot: "bg-danger",
  },
  medium: {
    title: "緊急性・中",
    bar: "border-l-4 border-l-warning bg-warning/5",
    dot: "bg-warning",
  },
  low: {
    title: "緊急性・低",
    bar: "border-l-4 border-l-primary bg-primary/5",
    dot: "bg-primary",
  },
};

export default function DocumentDeficienciesPage() {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const profile = getIndustryProfile(industry);
  const data = getIndustryDemoData(industry);

  const blocked = useMemo(
    () =>
      data.candidates.filter((c) => c.pipelineStatus === "document_blocked"),
    [data.candidates]
  );

  const grouped = useMemo(() => {
    const high = blocked.filter((c) => urgencyOf(c) === "high");
    const medium = blocked.filter((c) => urgencyOf(c) === "medium");
    const low = blocked.filter((c) => urgencyOf(c) === "low");
    return { high, medium, low };
  }, [blocked]);

  const spotlight = grouped.high[0];

  const counts = {
    total: blocked.length,
    high: grouped.high.length,
    medium: grouped.medium.length,
    low: grouped.low.length,
  };

  const isStaffingDemo = industry === "staffing";

  return (
    <TemplatePageStack>
      <MobileParentBackLink
        href={withDemoQuery("/documents", industry, role)}
        label={`${profile.labels.documents}管理`}
      />

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 hidden gap-1 self-start md:inline-flex"
      >
        <Link href={withDemoQuery("/documents", industry, role)}>
          <ArrowLeft className="size-4" />
          {profile.labels.documents}管理に戻る
        </Link>
      </Button>

      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <TemplatePageHeader
            title={`${profile.statusLabels.document_blocked}フォロー（デモ）`}
            description={
              counts.total > 0
                ? `要対応 ${counts.total} 件（高 ${counts.high} / 中 ${counts.medium} / 低 ${counts.low}）`
                : "該当する候補者はいません（デモ）。"
            }
          />
        </div>
        <Badge variant="ai" className="shrink-0">
          デモ
        </Badge>
      </div>

      {!isStaffingDemo ? (
        <p className="text-sm text-muted">
          緊急度の内訳は派遣スタッフィング業種のデモデータ向けです。業種を切り替えると件数が変わります。
        </p>
      ) : null}

      {spotlight ? (
        <Card className="border-danger/30 bg-danger/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-danger">
              <AlertTriangle className="size-5 shrink-0" />
              最優先フォロー（1件）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">{spotlight.displayName}</p>
            <p className="line-clamp-2 text-muted">
              {spotlight.detailDemo?.documentDeficiencyHeadlineJa ??
                spotlight.documentAlertJa ??
                "詳細は候補者の書類タブを確認してください。"}
            </p>
            <Button size="sm" asChild>
              <Link
                href={withDemoQuery(
                  `/candidates/${spotlight.id}`,
                  industry,
                  role,
                  { tab: "docs" }
                )}
              >
                書類タブを開く
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {(["high", "medium", "low"] as const).map((tier) => {
        const list =
          tier === "high" && spotlight
            ? grouped.high.filter((c) => c.id !== spotlight.id)
            : grouped[tier];
        const totalInTier = grouped[tier].length;
        const meta = URGENCY_META[tier];
        if (totalInTier === 0) return null;
        return (
          <section key={tier} className="space-y-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span
                className={cn("size-2 shrink-0 rounded-full", meta.dot)}
                aria-hidden
              />
              {meta.title}
              <Badge variant="outline" className="font-normal tabular-nums">
                {totalInTier}
              </Badge>
            </h2>
            {list.length === 0 ? null : (
            <ul className="space-y-2">
              {list.map((c) => (
                <li key={c.id}>
                  <Link
                    href={withDemoQuery(
                      `/candidates/${c.id}`,
                      industry,
                      role,
                      { tab: "docs" }
                    )}
                    className={cn(
                      "block rounded-lg border border-border p-3 transition-colors hover:bg-surface",
                      meta.bar
                    )}
                  >
                    <span className="font-medium">{c.displayName}</span>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {c.detailDemo?.documentDeficiencyHeadlineJa ??
                        c.documentAlertJa ??
                        "書類タブで状況を確認してください。"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            )}
          </section>
        );
      })}

      <p className="text-xs text-muted">
        パイプライン全体は{" "}
        <Link
          href={withDemoQuery("/candidates?view=pipeline", industry, role)}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          候補者 › 選考・ビザ進捗
        </Link>
        からも開けます。
      </p>
    </TemplatePageStack>
  );
}
