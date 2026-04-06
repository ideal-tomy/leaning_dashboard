import Link from "next/link";
import { LearningCandidateSummaryTable } from "@/components/learning-candidate-summary-table";
import { LearningGrowthChart } from "@/components/learning-growth-chart";
import { LearningWeeklyActiveChart } from "@/components/learning-weekly-active-chart";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { PageTagLinks } from "@/components/page-tag-links";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { candidates as staffingCandidates } from "@/lib/demo-data";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { parsePageTag } from "@/lib/page-tag";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LearningInsightsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const tag = parsePageTag(
    typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : null,
    ["overview", "content", "followup"] as const,
    "overview"
  );
  const hints = getIndustryPageHints(industry);
  const li = hints.learningInsights;

  const title = li?.pageTitleJa ?? "学習サマリー";
  const subtitle = li?.pageSubtitleJa ?? "学習到達の分布（デモ）";
  const headerDescription =
    tag === "content"
      ? "コンテンツ利用状況を確認し、次に改善する教材を決めます。"
      : tag === "followup"
        ? "遅延フォロー対象を確認し、優先対応を決めます。"
        : `${li?.pageIntentJa ?? "学習全体の進捗を確認します。"} ${subtitle}`;

  return (
    <TemplatePageStack>
      <TemplatePageHeader title={title} description={headerDescription} />
      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        tags={[
          {
            id: "overview",
            label: "④-1 全体進捗",
            href: withDemoQuery("/learning-insights?tag=overview", industry, role),
          },
          {
            id: "content",
            label: "④-2 コンテンツ",
            href: withDemoQuery("/learning-insights?tag=content", industry, role),
          },
          {
            id: "followup",
            label: "④-3 遅延フォロー",
            href: withDemoQuery("/learning-insights?tag=followup", industry, role),
          },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link href={withDemoQuery("/candidates?focus=risk", industry, role)}>
            要フォロー人材を見る
          </Link>
        </Button>
      </div>

      {(tag === "overview" || tag === "followup") && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <LearningGrowthChart role={role} chartHeightClass="h-56" />
        </div>
      )}

      {industry === "staffing" && (tag === "overview" || tag === "content") ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">週次アクティブ率（デモ）</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningWeeklyActiveChart chartHeightClass="h-56" />
          </CardContent>
        </Card>
      ) : null}

      {industry === "staffing" && (tag === "overview" || tag === "followup") ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              候補者別・学習サマリー（一覧）
            </CardTitle>
            <p className="text-sm text-muted">
              行から「学習タブへ」で個別の学習・認定にジャンプできます（デモ）。
            </p>
          </CardHeader>
          <CardContent>
            <LearningCandidateSummaryTable
              candidates={staffingCandidates}
              industry={industry}
              role={role}
            />
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted">
          候補者別サマリーは派遣スタッフィング業種で表示します。
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link
            href={withDemoQuery("/candidates", industry, role, {
              followup: "learning",
            })}
          >
            フォロー対象の候補者へ
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href={withDemoQuery("/", industry, role)}>
            ダッシュボードへ戻る
          </Link>
        </Button>
      </div>
    </TemplatePageStack>
  );
}
