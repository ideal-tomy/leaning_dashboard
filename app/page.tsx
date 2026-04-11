import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CircleHelp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardKillerCards } from "@/components/dashboard-killer-cards";
import { DashboardTopCardGrid } from "@/components/dashboard-top-card-grid";
import { DashboardExtensionRegion } from "@/components/dashboard-extension-region";
import { TemplateDashboardHeader } from "@/components/templates/layout-primitives";
import { appTemplateConfig } from "@/lib/app-template-config";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";
import { getDemoFactoryClient } from "@/lib/demo-factory-client";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { buildDashboardTopCards } from "@/lib/dashboard-top-cards";
import { resolveDashboardViewMode } from "@/lib/dashboard-view-mode";
import { StoryBeatMark } from "@/components/story-demo/sales-demo-beat-context";
import {
  getStoryDashboardFocusFromSearchParams,
  isStoryEmbedFromSearchParams,
  STORY_EMBED_PAGE_STACK_CLASS,
} from "@/lib/story-embed";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function guideQueryExtra(
  resolved: Record<string, string | string[] | undefined> | undefined
): { guide: string } | undefined {
  if (!resolved) return undefined;
  const raw = resolved.guide;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "1") return { guide: "1" };
  return undefined;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  if (role === "worker") {
    redirect(
      withDemoQuery(
        "/worker",
        industry,
        role,
        guideQueryExtra(resolvedSearchParams)
      )
    );
  }
  const profile = getIndustryProfile(industry);
  const isFactoryStaffing = industry === "staffing" && role === "client";
  const data = getIndustryDemoData(industry);
  const factoryClient = isFactoryStaffing
    ? getDemoFactoryClient(data.clients)
    : undefined;
  const pipeline = data.getPipelineCounts();
  const docAlerts = data.countDocumentAlerts();
  const openSlotCount = data.totalOpenSlots();
  const viewMode = resolveDashboardViewMode(industry, role);
  const topCards = buildDashboardTopCards(viewMode, industry, role, {
    totalCandidates: data.candidates.length,
    n3OrAbove: data.countN3OrAbove(),
    docAlerts,
    totalClients: data.clients.length,
    totalOpenSlots: data.totalOpenSlots(),
    trainingCount: pipeline.training,
    awaitingEntryCount: pipeline.awaiting_entry,
    activeAssignments: factoryClient?.operations.currentAssignees ?? 0,
    pipelineOfferAccepted: pipeline.offer_accepted,
    pipelineStalledSales: pipeline.document_blocked + pipeline.document_prep,
  });
  const { dashboard } = appTemplateConfig;
  const storyDemo = isStoryEmbedFromSearchParams(resolvedSearchParams);
  const storyDashboardFocus = getStoryDashboardFocusFromSearchParams(
    resolvedSearchParams
  );

  return (
    <div
      data-story-demo={storyDemo ? "true" : undefined}
      className={cn(
        "space-y-6 sm:space-y-8",
        storyDemo && STORY_EMBED_PAGE_STACK_CLASS
      )}
    >
      <StoryBeatMark beatId="intro-dashboard__header" className="block rounded-lg">
        <TemplateDashboardHeader
          title={profile.dashboardTitle || dashboard.pageTitle}
          subtitle={profile.dashboardSubtitle || dashboard.pageSubtitle}
        />
      </StoryBeatMark>

      <div className="md:hidden space-y-4">
        <div
          className={cn(
            "overflow-x-auto pb-1",
            storyDemo ? "px-0" : "-mx-1",
            storyDemo &&
              storyDashboardFocus === "priority" &&
              "story-demo-context-ring rounded-lg ring-2 ring-primary/35 ring-offset-2 ring-offset-background"
          )}
        >
          <div className={cn("flex min-w-max gap-2", storyDemo ? "px-0" : "px-1")}>
            {topCards.map((card) => (
              <Link
                key={card.id}
                href={withDemoQuery(card.href, industry, role)}
                className={cn(
                  "rounded-full border-2 border-primary/25 bg-background px-3 py-1.5 text-xs font-medium text-foreground whitespace-nowrap shadow-sm ring-1 ring-primary/15 transition hover:border-primary/45 hover:bg-primary/[0.04] hover:ring-2 hover:ring-primary/25 active:scale-[0.98]",
                  storyDemo && "story-demo-tap-target"
                )}
              >
                {card.title}
              </Link>
            ))}
            <Link
              href={withDemoQuery("/feature-demos", industry, role)}
              data-guide-target="guide-tech-dx-demo"
              className={cn(
                "rounded-full border-2 border-primary/40 bg-primary/[0.08] px-3 py-1.5 text-xs font-medium text-primary whitespace-nowrap shadow-sm ring-1 ring-primary/25 transition hover:border-primary/55 hover:bg-primary/[0.12] hover:ring-2 hover:ring-primary/35 active:scale-[0.98]",
                storyDemo && "story-demo-tap-target"
              )}
            >
              技術・DXデモ
            </Link>
            <StoryBeatMark beatId="closing-future__cta" className="inline-flex rounded-full">
              <Link
                href={withDemoQuery("/guide", industry, role)}
                className={cn(
                  "rounded-full border-2 border-primary/45 bg-primary/12 px-3 py-1.5 text-xs font-semibold text-primary whitespace-nowrap shadow-sm ring-1 ring-primary/30 transition hover:border-primary/60 hover:bg-primary/18 hover:ring-2 hover:ring-primary/40 active:scale-[0.98]",
                  storyDemo && "story-demo-tap-target",
                  storyDemo &&
                    storyDashboardFocus === "closing" &&
                    "story-demo-context-ring ring-2 ring-primary/45 ring-offset-2 ring-offset-background"
                )}
              >
                営業デモ
              </Link>
            </StoryBeatMark>
          </div>
        </div>

        <StoryBeatMark beatId="intro-dashboard__killers" className="block rounded-xl">
          <DashboardKillerCards
            industry={industry}
            role={role}
            storyDemo={storyDemo}
            storyDashboardFocus={storyDashboardFocus}
          />
        </StoryBeatMark>

        <Link
          href={withDemoQuery("/feature-demos", industry, role)}
          data-guide-target="guide-tech-dx-demo"
          className={cn(
            "group block rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/[0.09] to-background p-4 shadow-md ring-1 ring-primary/20 transition-all hover:border-primary/60 hover:shadow-lg hover:ring-2 hover:ring-primary/30 active:scale-[0.99]",
            storyDemo && "story-demo-tap-target"
          )}
        >
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-bold text-foreground">技術・DXデモ</p>
              <p className="text-xs leading-relaxed text-muted">
                OCR・AI・翻訳などを一覧から体験。タップで開きます。
              </p>
              <p className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-primary">
                一覧へ
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </p>
            </div>
          </div>
        </Link>

        <Card className="border-dashed border-border/80 bg-background/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              今日のサマリー
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted">
            {industry === "logistics" ? (
              <>
                本日出荷（デモ）142件 / 遅延注意 3便 / 入構・要対応書類 {docAlerts}
                件 / 未配車枠 {openSlotCount}枠
              </>
            ) : industry === "medical" ? (
              <>
                不足シフト {openSlotCount}枠 / 記録・同意の要確認 {docAlerts}件 / 院内研修中{" "}
                {pipeline.training}名
              </>
            ) : (
              <>
                要対応書類 {docAlerts}件 / 未充足枠 {openSlotCount}名 / 研修中{" "}
                {pipeline.training}名
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="hidden space-y-4 md:block">
        <StoryBeatMark beatId="intro-dashboard__killers" className="block rounded-xl">
          <DashboardKillerCards
            industry={industry}
            role={role}
            storyDemo={storyDemo}
            storyDashboardFocus={storyDashboardFocus}
          />
        </StoryBeatMark>
        <Separator />
        <div
          className={cn(
            "space-y-4",
            storyDemo &&
              storyDashboardFocus === "priority" &&
              "story-demo-context-ring rounded-xl p-1 ring-2 ring-primary/35 ring-offset-2 ring-offset-background"
          )}
        >
          <DashboardTopCardGrid
            cards={topCards}
            storyDemo={storyDemo}
            storyDashboardFocus={storyDashboardFocus}
          />
        </div>

        <StoryBeatMark beatId="closing-future__cta" className="relative z-10 block rounded-xl">
          <Link
            href={withDemoQuery("/guide", industry, role)}
            className={cn(
              "group block rounded-xl border-2 border-primary/35 bg-card p-5 shadow-sm ring-1 ring-primary/15 transition-all hover:border-primary/55 hover:bg-surface hover:shadow-md hover:ring-2 hover:ring-primary/25",
              storyDemo &&
                storyDashboardFocus === "closing" &&
                "story-demo-context-ring story-demo-tap-target ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-bold text-foreground">営業デモ</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  120秒で、業務が整った先にある未来を伝える専用ストーリーを再生します。
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                <CircleHelp className="size-4" aria-hidden />
                開く
              </span>
            </div>
          </Link>
        </StoryBeatMark>

        <section
          className="relative z-10 mt-10 border-t border-border pt-8"
          aria-labelledby="tech-dx-demo-heading"
        >
          <Link
            href={withDemoQuery("/feature-demos", industry, role)}
            data-guide-target="guide-tech-dx-demo"
            className="group block rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/[0.09] via-background to-primary/[0.04] p-5 shadow-md ring-1 ring-primary/20 transition-all hover:border-primary/60 hover:shadow-lg hover:ring-2 hover:ring-primary/30 md:p-6"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Sparkles className="size-5" aria-hidden />
                  </span>
                  <h2
                    id="tech-dx-demo-heading"
                    className="text-lg font-bold tracking-tight text-foreground md:text-xl"
                  >
                    技術・DXデモ
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-muted">
                  OCR・PDF・ナレッジ AI・翻訳・マッチングなど、プロダクトの「技術の見せ場」を一覧から体験できます。運用画面とは切り分けたデモ専用の入口です。
                </p>
              </div>
              <span className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90 md:w-auto md:min-w-[12rem]">
                デモ一覧を見る
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </Link>
        </section>

        <section
          className="space-y-5 pt-2 md:pt-4"
          aria-labelledby="optional-extensions-heading"
        >
          <div className="flex gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/[0.08] via-surface to-background p-5 shadow-sm sm:gap-5 sm:p-6 md:p-8">
            <div
              className="w-1 shrink-0 rounded-full bg-primary/45 sm:w-1.5"
              aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
              <p className="text-sm font-semibold leading-snug text-primary md:text-base">
                ここから下は、メイン導線に加える追加機能です
              </p>
              <h2
                id="optional-extensions-heading"
                className="text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl"
              >
                オプション機能（必要時に追加）
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                トップは主要導線のみ表示しています。下記の拡張枠から、運用や説明に合わせて機能を追加できます。
              </p>
            </div>
          </div>
          <DashboardExtensionRegion industry={industry} role={role} />
        </section>
      </div>
    </div>
  );
}
