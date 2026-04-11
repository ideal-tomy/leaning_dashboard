"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarClock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { PageTagLinks } from "@/components/page-tag-links";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { parsePageTag } from "@/lib/page-tag";
import { withDemoQuery } from "@/lib/demo-query";
import {
  StoryBeatMark,
  useSalesDemoBeatState,
} from "@/components/story-demo/sales-demo-beat-context";
import {
  isStoryEmbedUrlSearchParams,
  STORY_EMBED_PAGE_STACK_CLASS,
} from "@/lib/story-embed";
import { cn } from "@/lib/utils";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";

function opsBadgeVariant(label?: string): "danger" | "warning" | "default" | "success" {
  if (!label) return "default";
  if (label.includes("要対応") || label.includes("調査")) return "danger";
  if (label.includes("予定") || label.includes("要確認")) return "warning";
  if (label.includes("完了")) return "success";
  return "default";
}

export default function OperationsPage() {
  const router = useRouter();
  const urlSearch = useSearchParams();
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const { beatId: activeDemoBeatId } = useSalesDemoBeatState();
  const tag = parsePageTag(
    urlSearch.get("tag"),
    ["deploy", "settle", "growth"] as const,
    "deploy"
  );
  const profile = getIndustryProfile(industry);
  const storyDemo = isStoryEmbedUrlSearchParams(urlSearch);
  const hints = getIndustryPageHints(industry).operations;
  const opsDesc =
    tag === "settle"
      ? "定着30日に向けて、未対応タスクと次のフォロー先を確認します。"
      : tag === "growth"
        ? "成長確認に必要な運用情報と書類を中心に確認します。収益の詳細は収益ダッシュで見てください。"
        : "配属状況を見ながら、今日どこを優先して動くかを判断します。";

  const kpiTiles =
    tag === "growth"
      ? hints.kpiTiles.slice(1, 4)
      : tag === "settle"
        ? hints.kpiTiles.slice(0, 3)
        : hints.kpiTiles;
  const timelineRows =
    tag === "growth"
      ? hints.timeline.slice(1)
      : tag === "settle"
        ? hints.timeline.slice(0, 2)
        : hints.timeline;

  useEffect(() => {
    if (!storyDemo) return;
    const targetTag =
      activeDemoBeatId === "company-operations__deploy"
        ? "deploy"
        : activeDemoBeatId === "company-operations__settle" ||
            activeDemoBeatId === "company-operations__timeline"
          ? "settle"
          : null;
    if (!targetTag || targetTag === tag) return;
    router.replace(withDemoQuery(`/operations?tag=${targetTag}`, industry, role));
  }, [activeDemoBeatId, industry, role, router, storyDemo, tag]);

  return (
    <TemplatePageStack
      className={cn(storyDemo && STORY_EMBED_PAGE_STACK_CLASS)}
    >
      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        mobileScrollable
        stickyOnMobile={!storyDemo}
        mobileTopClassName={storyDemo ? "top-0" : "top-[7rem]"}
        demoLinkClassName={storyDemo ? "story-demo-tap-target rounded-md" : undefined}
        tags={[
          {
            id: "deploy",
            label: "⑤-1 配属状況",
            href: withDemoQuery("/operations?tag=deploy", industry, role),
            demoBeatId: "company-operations__deploy",
          },
          {
            id: "settle",
            label: "⑤-2 定着30日",
            href: withDemoQuery("/operations?tag=settle", industry, role),
            demoBeatId: "company-operations__settle",
          },
          {
            id: "growth",
            label: "⑤-3 成長90日",
            href: withDemoQuery("/operations?tag=growth", industry, role),
          },
        ]}
      />

      <TemplatePageHeader
        title={profile.labels.operations}
        description={opsDesc}
      />

      <div className="flex flex-wrap gap-2">
        <Link
          href={withDemoQuery("/candidates?focus=risk", industry, role)}
          className={cn("inline-flex", storyDemo && "story-demo-tap-target rounded-md")}
        >
          <Badge variant="danger" className="px-3 py-1">要対応人材へ</Badge>
        </Link>
        <Link
          href={withDemoQuery("/clients?tag=conditions", industry, role)}
          className={cn("inline-flex", storyDemo && "story-demo-tap-target rounded-md")}
        >
          <Badge variant="warning" className="px-3 py-1">受入条件を確認</Badge>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpiTiles.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted">{k.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold tabular-nums">{k.value}</p>
              {k.sub ? (
                <p className="mt-1 text-xs text-muted">{k.sub}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {(tag === "deploy" || tag === "settle") && (
      <StoryBeatMark beatId="company-operations__timeline" className="block rounded-xl">
      <Card
        className={cn(
          storyDemo &&
            "story-demo-context-ring"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-5 text-primary" />
            {tag === "settle" ? "定着フォローの優先タスク" : "直近のオペレーション（デモ）"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {timelineRows.map((row) => (
            <div
              key={row.title}
              className="flex flex-col gap-1 rounded-lg border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{row.title}</p>
                <p className="text-xs text-muted">{row.time}</p>
              </div>
              {row.badge ? (
                <Badge variant={opsBadgeVariant(row.badge)} className="w-fit shrink-0">
                  {row.badge}
                </Badge>
              ) : null}
            </div>
          ))}
          <p className="text-xs text-muted">{hints.csvHint}</p>
        </CardContent>
      </Card>
      </StoryBeatMark>
      )}

      {(tag === "settle" || tag === "growth") && (
        <div className="space-y-3">
          <Link href={withDemoQuery("/documents", industry, role)} className="block">
            <Card className="h-full min-h-[100px] transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="size-6 text-primary" />
                  {profile.labels.documents}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted">
                生成ステータス、不備候補、OCR デモへ
              </CardContent>
            </Card>
          </Link>
          <p className="flex flex-wrap items-center gap-x-1 text-sm text-muted">
            <span>収益分析・回収状況は</span>
            <Link
              href={withDemoQuery("/revenue", industry, role)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {profile.labels.revenue}ダッシュ
            </Link>
            <span>へ。</span>
          </p>
        </div>
      )}
    </TemplatePageStack>
  );
}
