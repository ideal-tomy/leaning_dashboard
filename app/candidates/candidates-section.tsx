"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Candidate, DispatchHistoryEntryDemo, JlptLevel } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TemplatePageHeader } from "@/components/templates/layout-primitives";
import { PageTagLinks } from "@/components/page-tag-links";
import { useMobile } from "@/hooks/use-mobile";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { getIndustryFromSearchParams } from "@/lib/industry-selection";
import { withDemoQuery } from "@/lib/demo-query";
import { useDemoRole } from "@/components/demo-role-context";
import { cn } from "@/lib/utils";
import { parsePageTag } from "@/lib/page-tag";

const jlptOptions: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

type CandidateGroupId =
  | "pre_entry"
  | "post_entry"
  | "before_contract"
  | "after_contract_90"
  | "after_contract_91";

const groupOrder: Array<{ id: CandidateGroupId; label: string; hint: string }> = [
  { id: "pre_entry", label: "入国前", hint: "ビザ・書類・入国前の準備段階" },
  { id: "post_entry", label: "入国後", hint: "研修・初期立ち上げを確認する段階" },
  { id: "before_contract", label: "派遣先契約前", hint: "配属前の契約・条件確認段階" },
  { id: "after_contract_90", label: "派遣先契約後（90日以内）", hint: "定着フォローを優先する段階" },
  { id: "after_contract_91", label: "派遣先契約後（90日以上）", hint: "安定稼働。問題時のみ重点確認" },
];

function statusBadgeVariant(
  s: Candidate["pipelineStatus"]
): "default" | "success" | "warning" | "danger" {
  if (s === "document_blocked") return "danger";
  if (s === "document_prep" || s === "training") return "warning";
  if (s === "offer_accepted" || s === "awaiting_entry") return "success";
  return "default";
}

function daysSince(dateIso: string): number {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  if (!Number.isFinite(diffMs)) return 0;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function latestDispatch(candidate: Candidate): DispatchHistoryEntryDemo | null {
  const history = candidate.detailDemo?.dispatchHistory;
  if (!history || history.length === 0) return null;
  const completed = history
    .filter((h) => h.kind === "completed")
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  return completed[0] ?? null;
}

function resolveGroup(candidate: Candidate): CandidateGroupId {
  const preEntryStatuses: Candidate["pipelineStatus"][] = [
    "interview_coordination",
    "offer_accepted",
    "visa_applying",
    "document_prep",
    "document_blocked",
    "awaiting_entry",
  ];
  if (preEntryStatuses.includes(candidate.pipelineStatus)) return "pre_entry";
  if (candidate.pipelineStatus === "training") return "post_entry";

  const latest = latestDispatch(candidate);
  if (!latest) return "before_contract";
  const days = daysSince(latest.startDate);
  return days <= 90 ? "after_contract_90" : "after_contract_91";
}

export function CandidatesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useDemoRole();
  const industry = getIndustryFromSearchParams(searchParams);
  const focus = parsePageTag(
    searchParams.get("focus"),
    ["overview", "evaluation", "risk"] as const,
    "overview"
  );
  const followupLearning = searchParams.get("followup") === "learning";
  const [q, setQ] = useState("");
  const [jlpt, setJlpt] = useState<JlptLevel | "all">("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [preview, setPreview] = useState<Candidate | null>(null);
  const isMobile = useMobile();
  const profile = getIndustryProfile(industry);
  const data = getIndustryDemoData(industry);
  const candidates = data.candidates;

  const headerDescription =
    focus === "risk"
      ? "要対応候補者を優先表示し、すぐに対応へ進みます。"
      : focus === "evaluation"
        ? "評価・履歴の確認対象を中心に表示します。"
        : "候補者をカテゴリ別に確認し、対応優先度を判断します。";

  function buildCandidatesHref(updates: Record<string, string | null | undefined>) {
    const p = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === undefined || val === "") p.delete(key);
      else p.set(key, val);
    }
    p.set("industry", industry);
    p.set("role", role);
    return `/candidates?${p.toString()}`;
  }

  function openCandidate(candidate: Candidate) {
    if (isMobile) {
      setPreview(candidate);
      setSheetOpen(true);
      return;
    }
    router.push(withDemoQuery(`/candidates/${candidate.id}`, industry, role));
  }

  const filtered = (() => {
    const keyword = q.trim().toLowerCase();
    const followupThreshold = 55;
    let list = candidates.filter((candidate) => {
      if (jlpt !== "all" && candidate.jlpt !== jlpt) return false;
      if (!keyword) return true;
      const hay = [
        candidate.displayName,
        candidate.legalNameFull,
        candidate.backgroundSummary,
        ...candidate.skillTags,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(keyword);
    });

    if (followupLearning) {
      list = list
        .filter((candidate) => candidate.learningDemo)
        .sort(
          (a, b) =>
            (a.learningDemo?.online.jpCourseProgressPct ?? 100) -
            (b.learningDemo?.online.jpCourseProgressPct ?? 100)
        );
    }

    if (focus === "risk") {
      list = list.filter(
        (candidate) =>
          Boolean(candidate.documentAlertJa?.trim()) ||
          (candidate.learningDemo?.online.jpCourseProgressPct ?? 100) <= followupThreshold
      );
    }

    if (focus === "evaluation") {
      list = list.filter((candidate) => {
        const hasHistory = Boolean(candidate.detailDemo?.dispatchHistory?.length);
        return hasHistory || Boolean(candidate.plannedAssignment);
      });
    }
    return list;
  })();

  const grouped = (() => {
    const map = new Map<CandidateGroupId, Candidate[]>();
    for (const g of groupOrder) map.set(g.id, []);
    for (const candidate of filtered) {
      map.get(resolveGroup(candidate))?.push(candidate);
    }
    return map;
  })();

  return (
    <div className="space-y-5">
      <TemplatePageHeader title={profile.labels.candidate} description={headerDescription} />

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
          onChange={(e) => setJlpt(e.target.value as JlptLevel | "all")}
        >
          <option value="all">JLPT すべて</option>
          {jlptOptions.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
      </div>

      {groupOrder.map((group) => {
        const items = grouped.get(group.id) ?? [];
        if (items.length === 0) return null;
        return (
          <section key={group.id} className="space-y-2">
            <div className="rounded-lg border border-border/70 bg-surface/60 px-3 py-2">
              <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
              <p className="text-xs text-muted">{group.hint}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => openCandidate(candidate)}
                  className={cn(
                    "text-left rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  )}
                >
                  <div className="flex gap-3">
                    <Image
                      src={candidate.photoUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="rounded-full bg-surface shrink-0"
                      unoptimized
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{candidate.displayName}</p>
                      <p className="text-xs text-muted">
                        {candidate.nationality} · {candidate.jlpt}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="ai">AI {candidate.aiScore}</Badge>
                        <Badge variant={statusBadgeVariant(candidate.pipelineStatus)}>
                          {candidate.pipelineStatusLabelJa}
                        </Badge>
                      </div>
                      {candidate.documentAlertJa ? (
                        <p className="mt-2 text-xs text-danger">{candidate.documentAlertJa}</p>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">条件に一致する候補者がありません。</p>
      ) : null}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent title={`${profile.labels.candidate}サマリー`}>
          {preview ? (
            <div className="space-y-4">
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
                  <p className="text-sm text-muted">
                    {preview.nationality} · {preview.jlpt}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="ai">AI {preview.aiScore}</Badge>
                    <Badge variant={statusBadgeVariant(preview.pipelineStatus)}>
                      {preview.pipelineStatusLabelJa}
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <Link
                href={withDemoQuery(`/candidates/${preview.id}`, industry, role)}
                className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                詳しく見る
              </Link>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
