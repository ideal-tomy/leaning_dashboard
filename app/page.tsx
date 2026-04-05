import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileText,
  GitBranch,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCandidateCard } from "@/components/dashboard-candidate-card";
import { DashboardKillerCards } from "@/components/dashboard-killer-cards";
import { DashboardMobileCardSlim } from "@/components/dashboard-mobile-card-slim";
import { DashboardExtensionRegion } from "@/components/dashboard-extension-region";
import { TemplateDashboardHeader } from "@/components/templates/layout-primitives";
import { dashboardGridClass, appTemplateConfig } from "@/lib/app-template-config";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";
import { getDemoFactoryClient } from "@/lib/demo-factory-client";
import { getIndustryDemoData } from "@/lib/demo-data-selector";

const pipelineOrder = [
  "interview_coordination",
  "offer_accepted",
  "visa_applying",
  "awaiting_entry",
  "training",
  "document_prep",
  "document_blocked",
] as const;

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  if (role === "worker") {
    redirect(withDemoQuery("/worker", industry, role));
  }
  const profile = getIndustryProfile(industry);
  const industryHints = getIndustryPageHints(industry);
  const homeHints = industryHints.home;
  const docKpi = industryHints.documents;
  const isFactoryStaffing = industry === "staffing" && role === "client";
  const staffingAdminGrid =
    industry === "staffing" && role === "admin"
      ? homeHints.dashboardGridCopy
      : undefined;
  const staffingClientGrid = isFactoryStaffing
    ? homeHints.clientDashboardGridCopy
    : undefined;
  const gridCopy = staffingClientGrid ?? staffingAdminGrid;
  const data = getIndustryDemoData(industry);
  const factoryClient = isFactoryStaffing
    ? getDemoFactoryClient(data.clients)
    : undefined;

  const pipeline = data.getPipelineCounts();
  const totalPipeline = Object.values(pipeline).reduce((a, b) => a + b, 0);
  const top5 = data.getTopCandidatesByAiScore(5);
  const trend = data.monthlyRevenueTrend();
  const lastRev = trend[trend.length - 1]?.amountManYen ?? 0;
  const docAlerts = data.countDocumentAlerts();
  const { dashboard } = appTemplateConfig;
  const gridCols = dashboard.gridColumns;

  const pipelineMobileSubtitle = isFactoryStaffing
    ? docAlerts > 0
      ? `支援機関フォロー中（参考）: ${docAlerts}件`
      : "支援機関側の手続きに遅延なし（デモ）"
    : `要フォロー（書類）：${docAlerts}件`;

  const matchingMobileSubtitle =
    isFactoryStaffing && homeHints.matchingClientMobileSubtitle
      ? homeHints.matchingClientMobileSubtitle
      : homeHints.matchingMobileSubtitle;
  const matchingDesktopTeaser =
    isFactoryStaffing && homeHints.matchingClientDesktopTeaser
      ? homeHints.matchingClientDesktopTeaser
      : homeHints.matchingDesktopTeaser;
  const matchingDesktopReason =
    isFactoryStaffing && homeHints.matchingClientDesktopReason
      ? homeHints.matchingClientDesktopReason
      : homeHints.matchingDesktopReason;

  return (
    <div className="space-y-6 sm:space-y-8">
      <TemplateDashboardHeader
        title={profile.dashboardTitle || dashboard.pageTitle}
        subtitle={profile.dashboardSubtitle || dashboard.pageSubtitle}
      />

      <DashboardKillerCards industry={industry} role={role} />

      {role === "admin" &&
        industry === "staffing" &&
        homeHints.adminDailyStepsJa &&
        homeHints.adminDailyStepsJa.length > 0 && (
          <Card className="border-primary/20 bg-primary/[0.04] shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold">
                今日の3ステップ（デモ）
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-foreground">
                {homeHints.adminDailyStepsJa.map((step) => (
                  <li key={step} className="leading-snug">
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

      {isFactoryStaffing &&
        homeHints.clientDailyStepsJa &&
        homeHints.clientDailyStepsJa.length > 0 && (
          <Card className="border-primary/20 bg-primary/[0.04] shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold">
                今日の3ステップ（デモ・工場）
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-foreground">
                {homeHints.clientDailyStepsJa.map((step) => (
                  <li key={step} className="leading-snug">
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

      <div className={dashboardGridClass(gridCols)}>
        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardCandidateCard
            industry={industry}
            totalCount={data.candidates.length}
            n3OrAbove={data.countN3OrAbove()}
            top5={top5}
            titleOverride={gridCopy?.candidatesCardTitleJa}
            listCtaOverride={gridCopy?.candidatesCardCtaJa}
          />
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardMobileCardSlim
            href={withDemoQuery("/candidates?view=pipeline", industry, role)}
            icon={GitBranch}
            title={gridCopy?.pipelineCardTitleJa ?? profile.labels.pipeline}
            subtitle={pipelineMobileSubtitle}
          />
          <Link
            href={withDemoQuery("/candidates?view=pipeline", industry, role)}
            className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
          >
            <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
              <CardHeader className="shrink-0 p-5 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <GitBranch className="size-5 shrink-0 text-primary" />
                  <span className="leading-tight">
                    {gridCopy?.pipelineCardTitleJa ?? profile.labels.pipeline}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5 pt-0">
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                  <div className="flex h-3 w-full shrink-0 overflow-hidden rounded-full bg-surface">
                    {pipelineOrder.map((key) => {
                      const n = pipeline[key];
                      if (n === 0) return null;
                      const w = Math.max(8, (n / totalPipeline) * 100);
                      return (
                        <div
                          key={key}
                          className="bg-primary/80 first:rounded-l-full last:rounded-r-full"
                          style={{ width: `${w}%` }}
                          title={`${profile.statusLabels[key]}: ${n}`}
                        />
                      );
                    })}
                  </div>
                  <ul className="grid min-h-0 flex-1 grid-cols-2 content-start gap-x-2 gap-y-1 text-xs leading-tight text-muted">
                    {pipelineOrder.map((key) => (
                      <li key={key} className="flex justify-between gap-1">
                        <span className="truncate">{profile.statusLabels[key]}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-foreground">
                          {pipeline[key]}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {isFactoryStaffing ? (
                    <p
                      className={
                        docAlerts > 0
                          ? "shrink-0 text-xs font-medium text-muted"
                          : "shrink-0 text-xs text-muted"
                      }
                    >
                      {docAlerts > 0
                        ? `支援機関フォロー中（参考）: ${docAlerts} 件`
                        : "支援機関側の手続き遅延の共有はありません（デモ）"}
                    </p>
                  ) : docAlerts > 0 ? (
                    <p className="shrink-0 text-xs font-medium text-danger">
                      要フォロー（書類）: {docAlerts} 件
                    </p>
                  ) : null}
                </div>
                <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                  {gridCopy?.pipelineCardCtaJa ?? "詳細へ"}{" "}
                  <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {isFactoryStaffing ? (
          <>
            <div className="flex h-full min-h-0 min-w-0 flex-col">
              <DashboardMobileCardSlim
                href={withDemoQuery("/matching", industry, role)}
                icon={ClipboardList}
                title={gridCopy?.matchingCardTitleJa ?? profile.labels.matching}
                subtitle={matchingMobileSubtitle}
              />
              <Link
                href={withDemoQuery("/matching", industry, role)}
                className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
              >
                <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
                  <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <ClipboardList className="size-5 shrink-0 text-primary" />
                      {gridCopy?.matchingCardTitleJa ?? profile.labels.matching}
                    </CardTitle>
                    <Badge variant="ai" className="shrink-0 text-xs">
                      AI
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0 text-sm">
                    <div className="flex min-h-0 flex-1 flex-col gap-3">
                      <p className="leading-snug text-muted">
                        {matchingDesktopTeaser}
                      </p>
                      <div className="rounded-lg bg-surface p-3 text-xs leading-relaxed text-foreground">
                        {matchingDesktopReason}
                      </div>
                    </div>
                    <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                      {gridCopy?.matchingCardCtaJa ?? "提案一覧へ"}{" "}
                      <ArrowRight className="size-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="flex h-full min-h-0 min-w-0 flex-col">
              <DashboardMobileCardSlim
                href={withDemoQuery(
                  factoryClient
                    ? `/clients/${factoryClient.id}`
                    : "/clients",
                  industry,
                  role
                )}
                icon={Building2}
                title={gridCopy?.clientsCardTitleJa ?? profile.labels.client}
                subtitle={factoryClient?.tradeNameJa ?? "自社（デモ）"}
              />
              <Link
                href={withDemoQuery(
                  factoryClient
                    ? `/clients/${factoryClient.id}`
                    : "/clients",
                  industry,
                  role
                )}
                className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
              >
                <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
                  <CardHeader className="shrink-0 p-5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Building2 className="size-5 shrink-0 text-primary" />
                      {gridCopy?.clientsCardTitleJa ?? profile.labels.client}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0">
                    <div className="flex min-h-0 flex-1 flex-col gap-3">
                      {factoryClient ? (
                        <>
                          <div className="text-3xl font-bold tabular-nums">
                            1
                            <span className="ml-2 text-sm font-normal text-muted">
                              拠点（デモ）
                            </span>
                          </div>
                          <p className="truncate text-sm font-medium text-foreground">
                            {factoryClient.tradeNameJa}
                          </p>
                          <p className="text-sm text-muted">
                            {profile.kpiLabels.openSlotsLabel}:{" "}
                            <span className="font-semibold text-warning">
                              {factoryClient.operations.openSlots}{" "}
                              {profile.kpiLabels.openSlotsUnit}
                            </span>
                          </p>
                          <p className="text-xs text-muted">
                            稼働 {factoryClient.operations.currentAssignees}{" "}
                            名（デモ）
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted">
                          デモ工場データが見つかりません。
                        </p>
                      )}
                    </div>
                    <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                      {gridCopy?.clientsCardCtaJa ?? "一覧へ"}{" "}
                      <ArrowRight className="size-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-full min-h-0 min-w-0 flex-col">
              <DashboardMobileCardSlim
                href={withDemoQuery("/clients", industry, role)}
                icon={Building2}
                title={gridCopy?.clientsCardTitleJa ?? profile.labels.client}
                subtitle={`${data.clients.length}社`}
              />
              <Link
                href={withDemoQuery("/clients", industry, role)}
                className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
              >
                <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
                  <CardHeader className="shrink-0 p-5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Building2 className="size-5 shrink-0 text-primary" />
                      {gridCopy?.clientsCardTitleJa ?? profile.labels.client}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0">
                    <div className="flex min-h-0 flex-1 flex-col gap-3">
                      <div className="text-3xl font-bold tabular-nums">
                        {data.clients.length}
                        <span className="ml-2 text-sm font-normal text-muted">
                          社
                        </span>
                      </div>
                      <p className="text-sm text-muted">
                        {profile.kpiLabels.openSlotsLabel}:{" "}
                        <span className="font-semibold text-warning">
                          {data.totalOpenSlots()}{" "}
                          {profile.kpiLabels.openSlotsUnit}
                        </span>
                      </p>
                      <ul className="min-h-0 flex-1 space-y-1 text-xs text-muted">
                        {data.clients.slice(0, 3).map((c) => (
                          <li key={c.id} className="truncate leading-tight">
                            {c.tradeNameJa} — 空き {c.operations.openSlots}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                      {gridCopy?.clientsCardCtaJa ?? "一覧へ"}{" "}
                      <ArrowRight className="size-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="flex h-full min-h-0 min-w-0 flex-col">
              <DashboardMobileCardSlim
                href={withDemoQuery("/matching", industry, role)}
                icon={ClipboardList}
                title={gridCopy?.matchingCardTitleJa ?? profile.labels.matching}
                subtitle={matchingMobileSubtitle}
              />
              <Link
                href={withDemoQuery("/matching", industry, role)}
                className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
              >
                <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
                  <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <ClipboardList className="size-5 shrink-0 text-primary" />
                      {gridCopy?.matchingCardTitleJa ?? profile.labels.matching}
                    </CardTitle>
                    <Badge variant="ai" className="shrink-0 text-xs">
                      AI
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0 text-sm">
                    <div className="flex min-h-0 flex-1 flex-col gap-3">
                      <p className="leading-snug text-muted">
                        {matchingDesktopTeaser}
                      </p>
                      <div className="rounded-lg bg-surface p-3 text-xs leading-relaxed text-foreground">
                        {matchingDesktopReason}
                      </div>
                    </div>
                    <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                      {gridCopy?.matchingCardCtaJa ?? "提案一覧へ"}{" "}
                      <ArrowRight className="size-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="flex h-full min-h-0 min-w-0 flex-col">
              <DashboardMobileCardSlim
                href={withDemoQuery("/documents", industry, role)}
                icon={FileText}
                title={
                  staffingAdminGrid?.documentsCardTitleJa ?? profile.labels.documents
                }
                subtitle={homeHints.documentsMobileSubtitle}
              />
              <Link
                href={withDemoQuery("/documents", industry, role)}
                className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
              >
                <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
                  <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-5 pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <FileText className="size-5 shrink-0 text-primary" />
                      {staffingAdminGrid?.documentsCardTitleJa ??
                        profile.labels.documents}
                    </CardTitle>
                    <Badge variant="ai" className="shrink-0 text-xs">
                      OCR
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0">
                    <div className="flex min-h-0 flex-1 flex-col gap-3">
                      <p className="text-sm leading-snug text-muted">
                        生成・翻訳ステータス（デモ） / 右下 FAB で OCR 擬似体験
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="success">完了 {docKpi.kpiComplete}</Badge>
                        <Badge variant="warning">要確認 {docKpi.kpiReview}</Badge>
                        <Badge variant="danger">不備 {docAlerts}</Badge>
                      </div>
                    </div>
                    <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                      {staffingAdminGrid?.documentsCardCtaJa ?? "書類管理へ"}{" "}
                      <ArrowRight className="size-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        )}

        {role !== "client" ? (
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <DashboardMobileCardSlim
              href={withDemoQuery("/revenue", industry, role)}
              icon={TrendingUp}
              title={
                staffingAdminGrid?.revenueCardTitleJa ?? profile.labels.revenue
              }
              subtitle="売上推移"
            />
            <Link
              href={withDemoQuery("/revenue", industry, role)}
              className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
            >
              <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
                <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <TrendingUp className="size-5 shrink-0 text-primary" />
                    {staffingAdminGrid?.revenueCardTitleJa ??
                      profile.labels.revenue}
                  </CardTitle>
                  <Badge variant="ai" className="shrink-0 text-xs">
                    LTV
                  </Badge>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0">
                  <div className="flex min-h-0 flex-1 flex-col gap-2">
                    <div className="text-3xl font-bold tabular-nums">
                      {lastRev}
                      <span className="ml-1 text-base font-normal text-muted">
                        万円/月
                      </span>
                    </div>
                    <p className="text-xs leading-snug text-muted">
                      直近月の売上イメージ（ダミー推移）
                    </p>
                  </div>
                  <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                    {staffingAdminGrid?.revenueCardCtaJa ?? "収益画面へ"}{" "}
                    <ArrowRight className="size-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : null}

        <DashboardExtensionRegion industry={industry} role={role} />
      </div>
    </div>
  );
}
