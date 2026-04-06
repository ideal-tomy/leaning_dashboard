"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Search } from "lucide-react";
import type { Candidate, JlptLevel } from "@data/types";
import {
  CANDIDATE_PIPELINE_DISPLAY_ORDER,
  CANDIDATE_PIPELINE_PHASE_GROUPS,
  STAFFING_PIPELINE_LIST_FILTER_DOCUMENT_WORK,
} from "@/lib/candidates-pipeline-order";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TemplatePageHeader } from "@/components/templates/layout-primitives";
import { PageTagLinks } from "@/components/page-tag-links";
import { useMobile } from "@/hooks/use-mobile";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { getIndustryFromSearchParams } from "@/lib/industry-selection";
import { withDemoQuery } from "@/lib/demo-query";
import { useDemoRole } from "@/components/demo-role-context";
import { cn } from "@/lib/utils";
import { parsePageTag } from "@/lib/page-tag";

const jlptOptions: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

function statusBadgeVariant(
  s: Candidate["pipelineStatus"]
): "default" | "success" | "warning" | "danger" {
  if (s === "document_blocked") return "danger";
  if (s === "document_prep" || s === "training") return "warning";
  if (s === "offer_accepted" || s === "awaiting_entry") return "success";
  return "default";
}

function isPipelineStageParam(
  value: string | null
): value is Candidate["pipelineStatus"] {
  return (
    value !== null &&
    (CANDIDATE_PIPELINE_DISPLAY_ORDER as readonly string[]).includes(value)
  );
}

type PipelineListFilter =
  | { kind: "status"; status: Candidate["pipelineStatus"] }
  | { kind: "document_work" };

function parsePipelineListFilter(
  param: string | null,
  industry: EnabledIndustryKey
): PipelineListFilter | null {
  if (!param) return null;
  if (
    industry === "staffing" &&
    param === STAFFING_PIPELINE_LIST_FILTER_DOCUMENT_WORK
  ) {
    return { kind: "document_work" };
  }
  if (isPipelineStageParam(param)) return { kind: "status", status: param };
  return null;
}

type PipelineUiSlot =
  | { kind: "single"; status: Candidate["pipelineStatus"] }
  | { kind: "document_work" };

function expandPipelinePhaseStagesToSlots(
  industry: EnabledIndustryKey,
  stages: readonly Candidate["pipelineStatus"][]
): PipelineUiSlot[] {
  const out: PipelineUiSlot[] = [];
  let staffingDocMergedEmitted = false;
  for (const s of stages) {
    if (industry === "staffing") {
      if (s === "document_blocked") continue;
      if (s === "document_prep") {
        if (!staffingDocMergedEmitted) {
          out.push({ kind: "document_work" });
          staffingDocMergedEmitted = true;
        }
        continue;
      }
    }
    out.push({ kind: "single", status: s });
  }
  return out;
}

/** パイプラインカード2行目の人数（デモ：当該ステージかつ一覧アラート文あり） */
function pipelineStageAlertCount(
  list: Candidate[],
  status: Candidate["pipelineStatus"]
): number {
  return list.filter(
    (c) =>
      c.pipelineStatus === status && Boolean(c.documentAlertJa?.trim())
  ).length;
}

const FALLBACK_PIPELINE_SUB_LABELS = ["該当", "要注意（アラート）"] as const;

function PipelineCardSubMetricsBlock({
  line1Label,
  line1Count,
  line2Label,
  line2Count,
}: {
  line1Label: string;
  line1Count: number;
  line2Label: string;
  line2Count: number;
}) {
  return (
    <div className="flex min-h-[2.75rem] shrink-0 flex-col justify-center gap-0.5 text-[11px] tabular-nums leading-snug text-muted">
      <p>
        {line1Label}：{line1Count}人
      </p>
      <p>
        {line2Label}：{line2Count}人
      </p>
    </div>
  );
}

const pipelineCardButtonClass = cn(
  "flex h-full min-h-0 flex-col text-left",
  "rounded-xl border border-border bg-card transition-all",
  "hover:border-primary/35 hover:shadow-md",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
);

const pipelineLensDlClass =
  "space-y-1 rounded-md border border-border/80 bg-muted/30 px-2.5 py-2 text-left";

export function CandidatesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useDemoRole();
  const view = searchParams.get("view");
  const followupLearning = searchParams.get("followup") === "learning";
  const industry = getIndustryFromSearchParams(searchParams);
  const pipelineStageParam = searchParams.get("pipelineStage");
  const focus = parsePageTag(
    searchParams.get("focus"),
    ["overview", "evaluation", "risk"] as const,
    "overview"
  );
  const listFilter = parsePipelineListFilter(pipelineStageParam, industry);
  const stageFilterActive = listFilter !== null;
  const pageHints = getIndustryPageHints(industry);
  const resolvedDefaultTab = followupLearning
    ? "list"
    : stageFilterActive
      ? "list"
      : view === "pipeline"
        ? "pipeline"
        : view === "list"
          ? "list"
          : pageHints.candidates.defaultTab;
  const [tab, setTab] = useState(resolvedDefaultTab);
  const [q, setQ] = useState("");
  const [jlpt, setJlpt] = useState<JlptLevel | "all">("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [preview, setPreview] = useState<Candidate | null>(null);
  const isMobile = useMobile();
  const profile = getIndustryProfile(industry);

  useEffect(() => {
    setTab(resolvedDefaultTab);
  }, [resolvedDefaultTab]);
  const data = getIndustryDemoData(industry);
  const candidates = data.candidates;

  const pipeline = data.getPipelineCounts();

  const t = q.trim().toLowerCase();
  const searchFiltered = candidates.filter((c) => {
    const jlptOk = jlpt === "all" || c.jlpt === jlpt;
    if (!jlptOk) return false;
    if (!t) return true;
    const hay = [
      c.displayName,
      c.legalNameFull,
      c.backgroundSummary,
      ...c.skillTags,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(t);
  });

  const FOLLOWUP_JP_THRESHOLD = 55;
  const FOLLOWUP_FALLBACK_N = 6;

  function learningFollowupOrdered(list: Candidate[]): Candidate[] {
    const withLd = list.filter((c) => c.learningDemo);
    const low = withLd
      .filter(
        (c) =>
          (c.learningDemo?.online.jpCourseProgressPct ?? 100) <=
          FOLLOWUP_JP_THRESHOLD
      )
      .sort(
        (a, b) =>
          (a.learningDemo?.online.jpCourseProgressPct ?? 0) -
          (b.learningDemo?.online.jpCourseProgressPct ?? 0)
      );
    if (low.length > 0) return low;
    return [...withLd]
      .sort(
        (a, b) =>
          (a.learningDemo?.online.jpCourseProgressPct ?? 0) -
          (b.learningDemo?.online.jpCourseProgressPct ?? 0)
      )
      .slice(0, FOLLOWUP_FALLBACK_N);
  }

  const filtered = followupLearning
    ? learningFollowupOrdered(searchFiltered)
    : searchFiltered;

  const focusFiltered =
    focus === "risk"
      ? filtered.filter(
          (c) =>
            Boolean(c.documentAlertJa?.trim()) ||
            (c.learningDemo?.online.jpCourseProgressPct ?? 100) <=
              FOLLOWUP_JP_THRESHOLD
        )
      : filtered;

  const pipelineFiltered =
    listFilter?.kind === "document_work"
      ? focusFiltered.filter(
          (c) =>
            c.pipelineStatus === "document_prep" ||
            c.pipelineStatus === "document_blocked"
        )
      : listFilter?.kind === "status"
        ? focusFiltered.filter((c) => c.pipelineStatus === listFilter.status)
        : focusFiltered;

  function buildCandidatesHref(
    updates: Record<string, string | null | undefined>
  ) {
    const p = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === undefined || val === "") p.delete(key);
      else p.set(key, val);
    }
    p.set("industry", industry);
    p.set("role", role);
    return `/candidates?${p.toString()}`;
  }

  function openCandidate(c: Candidate) {
    if (isMobile) {
      setPreview(c);
      setSheetOpen(true);
    } else {
      router.push(withDemoQuery(`/candidates/${c.id}`, industry, role));
    }
  }

  function sheetBody(preview: Candidate) {
    const order = pageHints.candidates.sheetOrder;
    const statusBlock = (
      <div className="flex flex-wrap gap-2">
        <Badge variant="ai">AI {preview.aiScore}</Badge>
        <Badge variant={statusBadgeVariant(preview.pipelineStatus)}>
          {preview.pipelineStatusLabelJa}
        </Badge>
      </div>
    );
    const alertBlock =
      preview.documentAlertJa != null && preview.documentAlertJa !== "" ? (
        <p className="text-sm font-medium text-danger">{preview.documentAlertJa}</p>
      ) : null;
    const metaBlock = (
      <p className="text-sm text-muted">
        {preview.nationality} · {preview.jlpt}
      </p>
    );
    const summaryBlock = (
      <p className="text-sm leading-relaxed">{preview.backgroundSummary}</p>
    );

    return (
      <>
        <div className="flex gap-3">
          <Image
            src={preview.photoUrl}
            alt=""
            width={64}
            height={64}
            className="rounded-full bg-surface"
            unoptimized
          />
          <div className="min-w-0">
            <p className="text-lg font-semibold">{preview.displayName}</p>
            {order === "alertFirst" ? (
              <>
                {alertBlock}
                {metaBlock}
                {statusBlock}
                {summaryBlock}
              </>
            ) : (
              <>
                {metaBlock}
                {statusBlock}
                {alertBlock}
                {summaryBlock}
              </>
            )}
          </div>
        </div>
        <Separator />
        <Button asChild className="w-full">
          <Link href={withDemoQuery(`/candidates/${preview.id}`, industry, role)}>
            詳しく見る
          </Link>
        </Button>
      </>
    );
  }

  const pageIntentPrimary =
    industry === "staffing" &&
    role === "client" &&
    pageHints.candidates.pageIntentClientJa
      ? pageHints.candidates.pageIntentClientJa
      : pageHints.candidates.pageIntentJa;

  const headerDescription = [
    pageIntentPrimary ?? "候補者の状況を確認し、優先対応を決めます。",
    focus === "risk"
      ? "要対応対象を優先表示しています。"
      : focus === "evaluation"
        ? "評価・履歴確認向けの表示です。"
        : `${candidates.length}件の対象を表示しています。`,
  ]
    .filter(Boolean)
    .join(" ");

  const pipelineDemo = pageHints.candidates.pipelineDemo;

  return (
    <div className="space-y-6">
      <TemplatePageHeader
        title={profile.labels.candidate}
        description={headerDescription}
      />

      {followupLearning && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:border-amber-400/35 dark:bg-amber-500/15 dark:text-amber-100">
          <span>学習フォロー優先表示中（デモ）</span>
          <Button variant="ghost" size="sm" className="h-8 shrink-0" asChild>
            <Link href={withDemoQuery("/candidates", industry, role)}>
              通常表示に戻す
            </Link>
          </Button>
        </div>
      )}

      <PageTagLinks
        label="表示タグ"
        currentId={focus}
        tags={[
          {
            id: "overview",
            label: "①-1 一覧",
            href: buildCandidatesHref({ focus: "overview" }),
          },
          {
            id: "evaluation",
            label: "①-2 評価・ログ",
            href: buildCandidatesHref({ focus: "evaluation" }),
          },
          {
            id: "risk",
            label: "①-3 リスク・要フォロー",
            href: buildCandidatesHref({ focus: "risk" }),
          },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link href={withDemoQuery("/documents?scope=deadlines", industry, role)}>
            期限手続きを確認
          </Link>
        </Button>
      </div>

      {focus === "evaluation" ? (
        <p className="text-sm text-muted">
          評価・面談ログ確認向けの表示です。候補者詳細で「派遣履歴・評価」タブを確認できます。
        </p>
      ) : null}
      {focus === "risk" ? (
        <p className="text-sm font-medium text-danger">
          リスク・要フォロー表示中（書類アラートまたは学習進捗低下を優先表示）。
        </p>
      ) : null}

      <Tabs
        value={tab}
        onValueChange={(v) => {
          const next = v as "list" | "pipeline";
          setTab(next);
          if (next === "pipeline") {
            router.replace(
              buildCandidatesHref({ view: "pipeline", pipelineStage: null })
            );
          } else {
            router.replace(buildCandidatesHref({ view: "list" }));
          }
        }}
        className="w-full"
      >
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="list" className="flex-1">
            一覧
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex-1">
            <GitBranch className="mr-1 size-4" />
            <span className="truncate">{profile.labels.pipeline}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          {pipelineDemo ? (
            <p className="text-sm leading-relaxed text-muted">
              {role === "client"
                ? pipelineDemo.pipelineIntroClientJa
                : pipelineDemo.pipelineIntroAdminJa}
            </p>
          ) : null}
          <div className="space-y-6">
            {CANDIDATE_PIPELINE_PHASE_GROUPS.map((phase) => (
              <section key={phase.id} className="space-y-3">
                <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.12] via-primary/[0.05] to-card shadow-sm dark:border-primary/35 dark:from-primary/[0.18] dark:via-primary/[0.08]">
                  <div
                    className="absolute inset-y-0 left-0 w-1 bg-primary"
                    aria-hidden
                  />
                  <h3 className="px-5 py-3 pl-6 text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
                    {phase.titleJa}
                  </h3>
                </div>
                <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {expandPipelinePhaseStagesToSlots(industry, phase.stages).map(
                    (slot) => {
                      if (slot.kind === "document_work") {
                        const nPrep = pipeline.document_prep;
                        const nBlocked = pipeline.document_blocked;
                        const n = nPrep + nBlocked;
                        const preview = candidates
                          .filter(
                            (c) =>
                              c.pipelineStatus === "document_prep" ||
                              c.pipelineStatus === "document_blocked"
                          )
                          .slice(0, 2);
                        const merged =
                          pipelineDemo?.pipelineDocumentWorkMerged;
                        const hintJa =
                          merged == null
                            ? null
                            : role === "client"
                              ? merged.clientJa
                              : merged.adminJa;
                        const lens =
                          merged == null
                            ? null
                            : role === "client"
                              ? merged.lensClient
                              : merged.lensAdmin;
                        const titleJa =
                          merged?.titleJa ?? "書類（準備中・不備）";
                        return (
                          <button
                            key="document_work"
                            type="button"
                            onClick={() => {
                              router.push(
                                buildCandidatesHref({
                                  view: "list",
                                  pipelineStage:
                                    STAFFING_PIPELINE_LIST_FILTER_DOCUMENT_WORK,
                                })
                              );
                              setTab("list");
                            }}
                            className={pipelineCardButtonClass}
                          >
                            <Card className="flex h-full min-h-0 flex-1 flex-col border-0 shadow-none">
                              <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                                <div className="flex shrink-0 flex-col gap-2">
                                  <p className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-snug tracking-tight text-foreground">
                                    {titleJa}
                                  </p>
                                  <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {n}
                                    <span className="text-lg font-semibold">
                                      人
                                    </span>
                                  </p>
                                  <PipelineCardSubMetricsBlock
                                    line1Label="準備中"
                                    line1Count={nPrep}
                                    line2Label="不備"
                                    line2Count={nBlocked}
                                  />
                                </div>
                                <div className="flex min-h-0 flex-1 flex-col gap-2">
                                {lens ? (
                                  <dl className={pipelineLensDlClass}>
                                    <div>
                                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                                        状況
                                      </dt>
                                      <dd className="text-xs leading-snug text-foreground">
                                        {lens.situationJa}
                                      </dd>
                                    </div>
                                    <div>
                                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                                        与える影響
                                      </dt>
                                      <dd className="text-xs leading-snug text-foreground">
                                        {lens.impactJa}
                                      </dd>
                                    </div>
                                    <div>
                                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                                        気にする主体
                                      </dt>
                                      <dd className="text-xs leading-snug text-foreground">
                                        {lens.ownerJa}
                                      </dd>
                                    </div>
                                  </dl>
                                ) : null}
                                {hintJa ? (
                                  <p className="text-xs leading-snug text-muted">
                                    <span className="font-medium text-foreground/80">
                                      フォロー目安:{" "}
                                    </span>
                                    {hintJa}
                                  </p>
                                ) : null}
                                {preview.length > 0 ? (
                                  <ul className="border-t border-border/80 pt-2 text-xs text-foreground">
                                    {preview.map((c) => (
                                      <li key={c.id} className="truncate">
                                        {c.displayName}
                                      </li>
                                    ))}
                                    {n > 2 ? (
                                      <li className="text-muted">
                                        ほか {n - 2} 名
                                      </li>
                                    ) : null}
                                  </ul>
                                ) : null}
                                </div>
                                <p className="mt-auto shrink-0 pt-1 text-xs font-medium text-primary">
                                  押して一覧に絞り込む
                                </p>
                              </CardContent>
                            </Card>
                          </button>
                        );
                      }

                      const status = slot.status;
                      const n = pipeline[status];
                      const nAlert = pipelineStageAlertCount(candidates, status);
                      const preview = candidates
                        .filter((c) => c.pipelineStatus === status)
                        .slice(0, 2);
                      const hints = pipelineDemo?.pipelineStageHints[status];
                      const hintJa =
                        hints == null
                          ? null
                          : role === "client"
                            ? hints.clientJa
                            : hints.adminJa;
                      const lens =
                        hints == null
                          ? null
                          : role === "client"
                            ? hints.lensClient
                            : hints.lensAdmin;
                      const subLabels =
                        hints?.pipelineCardSubMetricLabelsJa ??
                        FALLBACK_PIPELINE_SUB_LABELS;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            router.push(
                              buildCandidatesHref({
                                view: "list",
                                pipelineStage: status,
                              })
                            );
                            setTab("list");
                          }}
                          className={pipelineCardButtonClass}
                        >
                          <Card className="flex h-full min-h-0 flex-1 flex-col border-0 shadow-none">
                            <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                              <div className="flex shrink-0 flex-col gap-2">
                                <p className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-snug tracking-tight text-foreground">
                                  {profile.statusLabels[status]}
                                </p>
                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                  {n}
                                  <span className="text-lg font-semibold">
                                    人
                                  </span>
                                </p>
                                <PipelineCardSubMetricsBlock
                                  line1Label={subLabels[0]}
                                  line1Count={n}
                                  line2Label={subLabels[1]}
                                  line2Count={nAlert}
                                />
                              </div>
                              <div className="flex min-h-0 flex-1 flex-col gap-2">
                              {lens ? (
                                <dl className={pipelineLensDlClass}>
                                  <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                                      状況
                                    </dt>
                                    <dd className="text-xs leading-snug text-foreground">
                                      {lens.situationJa}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                                      与える影響
                                    </dt>
                                    <dd className="text-xs leading-snug text-foreground">
                                      {lens.impactJa}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                                      気にする主体
                                    </dt>
                                    <dd className="text-xs leading-snug text-foreground">
                                      {lens.ownerJa}
                                    </dd>
                                  </div>
                                </dl>
                              ) : null}
                              {hintJa ? (
                                <p className="text-xs leading-snug text-muted">
                                  <span className="font-medium text-foreground/80">
                                    フォロー目安:{" "}
                                  </span>
                                  {hintJa}
                                </p>
                              ) : null}
                              {preview.length > 0 ? (
                                <ul className="border-t border-border/80 pt-2 text-xs text-foreground">
                                  {preview.map((c) => (
                                    <li key={c.id} className="truncate">
                                      {c.displayName}
                                    </li>
                                  ))}
                                  {n > 2 ? (
                                    <li className="text-muted">
                                      ほか {n - 2} 名
                                    </li>
                                  ) : null}
                                </ul>
                              ) : null}
                              </div>
                              <p className="mt-auto shrink-0 pt-1 text-xs font-medium text-primary">
                                押して一覧に絞り込む
                              </p>
                            </CardContent>
                          </Card>
                        </button>
                      );
                    }
                  )}
                </div>
              </section>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {stageFilterActive && listFilter ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/25 bg-primary/[0.06] px-3 py-2 text-sm">
              <span>
                {listFilter.kind === "document_work"
                  ? `「${
                      pipelineDemo?.pipelineDocumentWorkMerged?.titleJa ??
                      "書類（準備中・不備）"
                    }」（準備中・不備の合算）のみ表示中（デモ）`
                  : `ステージ「${profile.statusLabels[listFilter.status]}」のみ表示中（デモ）`}
              </span>
              <Button variant="ghost" size="sm" className="h-8 shrink-0" asChild>
                <Link href={buildCandidatesHref({ pipelineStage: null })}>
                  フィルタを解除
                </Link>
              </Button>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <Input
                placeholder="名称・タグ・キーワードで検索"
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
              value={jlpt}
              onChange={(e) =>
                setJlpt(e.target.value as JlptLevel | "all")
              }
            >
              <option value="all">JLPT すべて</option>
              {jlptOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {pipelineFiltered.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-muted">
                条件に一致する候補者がありません。
              </p>
            ) : null}
            {pipelineFiltered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openCandidate(c)}
                className={cn(
                  "min-h-[52px] text-left transition-all hover:shadow-md rounded-xl border border-border bg-card p-4",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                )}
              >
                <div className="flex gap-3">
                  <Image
                    src={c.photoUrl}
                    alt=""
                    width={56}
                    height={56}
                    className="rounded-full bg-surface shrink-0"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{c.displayName}</p>
                    <p className="text-xs text-muted">
                      {c.nationality} · {c.jlpt}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="ai">AI {c.aiScore}</Badge>
                      <Badge variant={statusBadgeVariant(c.pipelineStatus)}>
                        {c.pipelineStatusLabelJa}
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent title={`${profile.labels.candidate}サマリー`}>
          {preview && <div className="space-y-4">{sheetBody(preview)}</div>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
