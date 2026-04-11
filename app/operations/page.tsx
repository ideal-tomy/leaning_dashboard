import Link from "next/link";
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
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";
import { StoryBeatMark } from "@/components/story-demo/sales-demo-beat-context";
import {
  isStoryEmbedFromSearchParams,
  STORY_EMBED_PAGE_STACK_CLASS,
} from "@/lib/story-embed";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function opsBadgeVariant(label?: string): "danger" | "warning" | "default" | "success" {
  if (!label) return "default";
  if (label.includes("要対応") || label.includes("調査")) return "danger";
  if (label.includes("予定") || label.includes("要確認")) return "warning";
  if (label.includes("完了")) return "success";
  return "default";
}

export default async function OperationsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const tag = parsePageTag(
    typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : null,
    ["deploy", "settle", "growth"] as const,
    "deploy"
  );
  const profile = getIndustryProfile(industry);
  const storyDemo = isStoryEmbedFromSearchParams(resolvedSearchParams);
  const hints = getIndustryPageHints(industry).operations;
  const opsDesc =
    tag === "settle"
      ? "初期定着の未対応タスクを確認し、フォロー順を決めます。"
      : tag === "growth"
        ? "成長確認に必要な運用情報と書類を中心に確認します。収益の詳細は収益ダッシュで見てください。"
        : "配属・稼働の運用状況を確認し、今日の優先対応を決めます。";

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
            demoBeatId: "company-operations__priority-0",
          },
          {
            id: "settle",
            label: "⑤-2 定着30日",
            href: withDemoQuery("/operations?tag=settle", industry, role),
            demoBeatId: "company-operations__priority-1",
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
        <StoryBeatMark
          beatId="company-operations__priority-0"
          className="inline-flex rounded-md"
        >
          <Link
            href={withDemoQuery("/candidates?focus=risk", industry, role)}
            className={cn("inline-flex", storyDemo && "story-demo-tap-target rounded-md")}
          >
            <Badge variant="danger" className="px-3 py-1">要対応人材へ</Badge>
          </Link>
        </StoryBeatMark>
        <StoryBeatMark
          beatId="company-operations__priority-1"
          className="inline-flex rounded-md"
        >
          <Link
            href={withDemoQuery("/clients?tag=conditions", industry, role)}
            className={cn("inline-flex", storyDemo && "story-demo-tap-target rounded-md")}
          >
            <Badge variant="warning" className="px-3 py-1">受入条件を確認</Badge>
          </Link>
        </StoryBeatMark>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-5 text-primary" />
            直近のオペレーション（デモ）
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
