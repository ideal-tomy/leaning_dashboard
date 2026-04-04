import Link from "next/link";
import { LearningCandidateSummaryTable } from "@/components/learning-candidate-summary-table";
import { LearningGrowthChart } from "@/components/learning-growth-chart";
import { LearningWeeklyActiveChart } from "@/components/learning-weekly-active-chart";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { candidates as staffingCandidates } from "@/lib/demo-data";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
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
  const hints = getIndustryPageHints(industry);
  const li = hints.learningInsights;

  const title = li?.pageTitleJa ?? "学習サマリー";
  const subtitle = li?.pageSubtitleJa ?? "学習到達の分布（デモ）";
  const intent = li?.pageIntentJa;
  const headerDescription = [intent, subtitle].filter(Boolean).join(" ");

  return (
    <TemplatePageStack>
      <TemplatePageHeader title={title} description={headerDescription} />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <LearningGrowthChart role={role} chartHeightClass="h-64" />
      </div>

      {industry === "staffing" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">週次アクティブ率（デモ）</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningWeeklyActiveChart chartHeightClass="h-56" />
          </CardContent>
        </Card>
      ) : null}

      {industry === "staffing" ? (
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
