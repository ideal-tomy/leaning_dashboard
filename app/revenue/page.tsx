import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Percent,
  Scale,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientOnlyChart } from "@/components/client-only-chart";
import {
  RevenueBreakevenChart,
  RevenueCacBreakdownChart,
  RevenueMonthlyChart,
} from "@/components/revenue-charts";
import {
  TemplateKpiGrid,
  TemplatePageHeader,
  TemplatePageStack,
  TemplateTwoColumnGrid,
} from "@/components/templates/layout-primitives";
import { getCacDemo, getBreakevenSeries, getReferralRecoveryDemo, getRefundRiskDemo, getRevenueSummaryKpis, getRevenueTrendForChart } from "@/lib/revenue-demo";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { getIndustryAccentHex } from "@/lib/industry-theme";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

function formatManYen(n: number) {
  return `${n.toLocaleString("ja-JP")} 万円`;
}

function formatYen(n: number) {
  return `${n.toLocaleString("ja-JP")} 円`;
}

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RevenuePage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const accentHex = getIndustryAccentHex(industry);
  const profile = getIndustryProfile(industry);
  const trend = getRevenueTrendForChart(industry);
  const kpis = getRevenueSummaryKpis(industry);
  const cac = getCacDemo();
  const recovery = getReferralRecoveryDemo();
  const refundItems = getRefundRiskDemo("2026-04-03", industry);
  const be = getBreakevenSeries(24, industry);

  const collectedPct = Math.round(
    (recovery.collectedManYen / recovery.billedManYen) * 100
  );

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title={profile.labels.revenue}
        description="月次売上・紹介料回収・返金リスク・CAC・損益分岐のデモダッシュボード（数値はダミー／クライアント加重は実データ連動）"
      />

      <TemplateKpiGrid>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs font-medium">
              <TrendingUp className="size-3.5 text-primary" />
              {kpis.latestMonthLabel} 売上（紹介料ベース）
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {formatManYen(kpis.latestManYen)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted">
            <span
              className={
                kpis.momPct >= 0
                  ? "inline-flex items-center gap-0.5 font-medium text-success"
                  : "inline-flex items-center gap-0.5 font-medium text-danger"
              }
            >
              {kpis.momPct >= 0 ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              前月比 {kpis.momPct >= 0 ? "+" : ""}
              {kpis.momPct}%
            </span>
            <span className="ml-2">（ダミー推移）</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs font-medium">
              <CircleDollarSign className="size-3.5 text-primary" />
              人材獲得コスト（CAC・平均）
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {formatYen(cac.avgCacJpy)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted">
            中央値 {formatYen(cac.medianCacJpy)} ・ 直近12ヶ月ベース n=
            {cac.sampleSize}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs font-medium">
              <Percent className="size-3.5 text-primary" />
              加重平均継続率（稼働人数）
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {kpis.weightedRetentionPct}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted">
            8社ポートフォリオの稼働人数で加重。損益分岐モデルに反映。
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs font-medium">
              <Scale className="size-3.5 text-primary" />
              損益分岐（1名あたり・デモ）
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {be.breakevenMonth != null
                ? `約 ${be.breakevenMonth} ヶ月`
                : "24ヶ月超"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted">
            累積粗利が平均CAC（{be.cacManYen} 万円）を超える月。下図参照。
          </CardContent>
        </Card>
      </TemplateKpiGrid>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-5 text-primary" />
            月次売上推移（万円）
          </CardTitle>
          <CardDescription>
            当月と前年同月の比較。ツールチップで数値確認できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientOnlyChart className="h-[280px] min-h-[240px]">
            <RevenueMonthlyChart data={trend} accentHex={accentHex} />
          </ClientOnlyChart>
        </CardContent>
      </Card>

      <TemplateTwoColumnGrid>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-5 text-primary" />
              紹介料回収ステータス
            </CardTitle>
            <CardDescription>
              請求 {recovery.billedManYen} 万円に対する回収イメージ（デモ）
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="success">完了 {recovery.completed} 件</Badge>
              <Badge variant="warning">一部 {recovery.partial} 件</Badge>
              <Badge variant="secondary">未回収 {recovery.uncollected} 件</Badge>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>回収済</span>
                <span className="tabular-nums font-medium text-foreground">
                  {recovery.collectedManYen} 万 / {recovery.billedManYen} 万（
                  {collectedPct}%）
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{ width: `${collectedPct}%` }}
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
                <p>
                  一部入金:{" "}
                  <span className="font-medium text-foreground">
                    {recovery.partialManYen} 万円
                  </span>
                </p>
                <p>
                  未入金残:{" "}
                  <span className="font-medium text-foreground">
                    {recovery.outstandingManYen} 万円
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-5 text-danger" />
              返金・保証ウィンドウ
            </CardTitle>
            <CardDescription>
              保証終了日までの残日数と想定エクスポージャ（ダミー）
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="py-2 pr-3 font-medium">候補者</th>
                  <th className="py-2 pr-3 font-medium">リスク</th>
                  <th className="py-2 pr-3 font-medium">残日数</th>
                  <th className="py-2 pr-3 font-medium">想定返金額</th>
                  <th className="py-2 font-medium">メモ</th>
                </tr>
              </thead>
              <tbody>
                {refundItems.map((r) => (
                  <tr key={r.candidateId} className="border-b border-border/80">
                    <td className="py-2.5 pr-3 align-top">
                      <Link
                        href={withIndustryQuery(`/candidates/${r.candidateId}`, industry)}
                        className="font-medium text-primary underline-offset-2 hover:underline"
                      >
                        {r.displayName}
                      </Link>
                      <p className="text-xs text-muted">{r.clientHintJa}</p>
                    </td>
                    <td className="py-2.5 pr-3 align-top">
                      <Badge
                        variant={
                          r.risk === "high"
                            ? "danger"
                            : r.risk === "medium"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {r.risk === "high"
                          ? "高"
                          : r.risk === "medium"
                            ? "中"
                            : "監視"}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-3 align-top tabular-nums">
                      {r.daysLeft} 日
                      <p className="text-xs text-muted">{r.guaranteeEndsOn}</p>
                    </td>
                    <td className="py-2.5 pr-3 align-top tabular-nums">
                      最大 {r.exposureManYen} 万円
                    </td>
                    <td className="py-2.5 align-top text-xs text-muted">
                      {r.noteJa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted">
              詳細は{" "}
              <Link
                href={withIndustryQuery("/candidates", industry)}
                className="text-primary underline"
              >
                {profile.labels.candidate}
              </Link>{" "}
              の書類・パイプラインと連携想定。
            </p>
          </CardContent>
        </Card>
      </TemplateTwoColumnGrid>

      <TemplateTwoColumnGrid>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CAC 内訳（1名あたり・デモ）</CardTitle>
            <CardDescription>
              成約に至るまでのコスト構造のイメージ。内訳はサンプル配分です。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnlyChart className="h-[220px] min-h-[200px]">
              <RevenueCacBreakdownChart rows={cac.breakdown} accentHex={accentHex} />
            </ClientOnlyChart>
            <ul className="mt-2 space-y-1.5 border-t border-border pt-3 text-xs text-muted">
              {cac.breakdown.map((row) => (
                <li key={row.label} className="flex justify-between gap-2">
                  <span>{row.label}</span>
                  <span className="shrink-0 tabular-nums text-foreground">
                    {formatYen(row.jpy)}（{row.pct}%）
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              継続率を織り込んだ損益分岐（1名あたり）
            </CardTitle>
            <CardDescription>
              月次粗利を、年次継続率から単純換算した月次生存率で逓減させた累積と、平均CAC の交点。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnlyChart className="min-h-[320px]">
              <RevenueBreakevenChart
                points={be.points}
                breakevenMonth={be.breakevenMonth}
                cacManYen={be.cacManYen}
                avgMarginManYen={be.avgMarginManYen}
                annualRetentionDecimal={be.annualRetentionDecimal}
                accentHex={accentHex}
              />
            </ClientOnlyChart>
          </CardContent>
        </Card>
      </TemplateTwoColumnGrid>
    </TemplatePageStack>
  );
}
