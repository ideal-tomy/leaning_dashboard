"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import type { Candidate, JlptLevel } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TemplatePageHeader } from "@/components/templates/layout-primitives";
import { PageTagLinks } from "@/components/page-tag-links";
import { useMobile } from "@/hooks/use-mobile";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile, type EnabledIndustryKey } from "@/lib/industry-profiles";
import { getIndustryFromSearchParams } from "@/lib/industry-selection";
import { withDemoQuery } from "@/lib/demo-query";
import { useDemoRole } from "@/components/demo-role-context";
import { cn } from "@/lib/utils";
import { parsePageTag } from "@/lib/page-tag";

const jlptOptions: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

type CandidateGroupId =
  | "pre_entry"
  | "post_entry"
  | "construction_docs"
  | "construction_ops"
  | "logistics_docs"
  | "logistics_ops"
  | "medical_docs"
  | "medical_ops"
  | "professional_evidence"
  | "professional_matter";

const groupOrderStaffing: Array<{ id: CandidateGroupId; label: string; hint: string }> = [
  { id: "pre_entry", label: "入国前", hint: "ビザ・書類・入国前の準備段階" },
  { id: "post_entry", label: "入国後", hint: "研修・配属・定着フォロー段階" },
];

const groupOrderConstruction: Array<{ id: CandidateGroupId; label: string; hint: string }> = [
  {
    id: "construction_docs",
    label: "書類・安全教育",
    hint: "安全書類・入場準備・安全教育の段階",
  },
  {
    id: "construction_ops",
    label: "配員・工程",
    hint: "面談・配員確定・工程調整・手配待ち",
  },
];

const groupOrderEducation: Array<{ id: CandidateGroupId; label: string; hint: string }> = [
  {
    id: "pre_entry",
    label: "受講前・手続き",
    hint: "面談・申込・案内・教材準備・提出物の段階",
  },
  {
    id: "post_entry",
    label: "受講中・フォロー",
    hint: "受講実施と修了に向けたフォロー",
  },
];

const groupOrderLogistics: Array<{ id: CandidateGroupId; label: string; hint: string }> = [
  {
    id: "logistics_docs",
    label: "入構・資格・書類",
    hint: "入構申請・免許・誓約・配送関連で止まりやすい段階",
  },
  {
    id: "logistics_ops",
    label: "シフト・配車・稼働",
    hint: "シフト調整・配車確定・現場稼働の段階",
  },
];

const groupOrderMedical: Array<{ id: CandidateGroupId; label: string; hint: string }> = [
  {
    id: "medical_docs",
    label: "記録・研修",
    hint: "記録不備・同意・院内研修・書類準備の段階",
  },
  {
    id: "medical_ops",
    label: "配置・勤務",
    hint: "面談・配置確定・勤務調整・配属待ち",
  },
];

const groupOrderProfessional: Array<{ id: CandidateGroupId; label: string; hint: string }> = [
  {
    id: "professional_evidence",
    label: "証憑・申請準備",
    hint: "不足証憑・差戻し・申請書ドラフトの段階",
  },
  {
    id: "professional_matter",
    label: "相談・手続・受任",
    hint: "初回相談・論点整理・受任見込み・申請手続の段階",
  },
];

function statusBadgeVariant(
  s: Candidate["pipelineStatus"]
): "default" | "success" | "warning" | "danger" {
  if (s === "document_blocked") return "danger";
  if (s === "document_prep" || s === "training") return "warning";
  if (s === "offer_accepted" || s === "awaiting_entry") return "success";
  return "default";
}

function resolveGroup(
  candidate: Candidate,
  industry: EnabledIndustryKey
): CandidateGroupId {
  if (industry === "construction") {
    const docs: Candidate["pipelineStatus"][] = [
      "document_blocked",
      "document_prep",
      "training",
    ];
    return docs.includes(candidate.pipelineStatus)
      ? "construction_docs"
      : "construction_ops";
  }
  if (industry === "education") {
    return candidate.pipelineStatus === "training" ? "post_entry" : "pre_entry";
  }
  if (industry === "logistics") {
    const docs: Candidate["pipelineStatus"][] = [
      "document_blocked",
      "document_prep",
      "training",
    ];
    return docs.includes(candidate.pipelineStatus) ? "logistics_docs" : "logistics_ops";
  }
  if (industry === "medical") {
    const docs: Candidate["pipelineStatus"][] = [
      "document_blocked",
      "document_prep",
      "training",
    ];
    return docs.includes(candidate.pipelineStatus) ? "medical_docs" : "medical_ops";
  }
  if (industry === "professional") {
    if (
      candidate.pipelineStatus === "document_blocked" ||
      candidate.pipelineStatus === "document_prep"
    ) {
      return "professional_evidence";
    }
    return "professional_matter";
  }
  const preEntryStatuses: Candidate["pipelineStatus"][] = [
    "interview_coordination",
    "offer_accepted",
    "visa_applying",
    "document_prep",
    "document_blocked",
    "awaiting_entry",
  ];
  if (preEntryStatuses.includes(candidate.pipelineStatus)) return "pre_entry";
  return "post_entry";
}

function candidateJobLine(candidate: Candidate): string {
  const job = candidate.plannedAssignment?.jobTitleJa?.trim();
  if (job) return job;
  const tags = candidate.skillTags.slice(0, 2).join("・");
  return tags || "工種未設定";
}

function candidateListSubtitle(
  candidate: Candidate,
  industry: EnabledIndustryKey
): string {
  if (industry === "construction") {
    return `${candidateJobLine(candidate)} · ${candidate.jlpt}`;
  }
  if (industry === "education") {
    const tags = candidate.skillTags.slice(0, 3).join("・");
    if (tags) return tags;
    const sum = candidate.backgroundSummary.trim();
    return sum.length > 42 ? `${sum.slice(0, 42)}…` : sum || "—";
  }
  if (industry === "logistics") {
    const tags = candidate.skillTags.slice(0, 2).join("・") || "—";
    const lic = candidate.driversLicenseLk ? "免許·可" : "免許·要確認";
    const job = candidate.plannedAssignment?.jobTitleJa?.trim();
    return job ? `${tags} · ${lic} · ${job}` : `${tags} · ${lic}`;
  }
  if (industry === "medical") {
    const job = candidate.plannedAssignment?.jobTitleJa?.trim();
    const tags = candidate.skillTags.slice(0, 3).join("・");
    const sum = candidate.backgroundSummary.trim();
    const core =
      [job, tags].filter(Boolean).join(" · ") ||
      (sum.length > 48 ? `${sum.slice(0, 48)}…` : sum) ||
      "—";
    return `${core} · ${candidate.jlpt}`;
  }
  if (industry === "professional") {
    const job = candidate.plannedAssignment?.jobTitleJa?.trim();
    const tags = candidate.skillTags.slice(0, 3).join("・");
    const status = candidate.coeStatusJa?.trim();
    const alert = candidate.documentAlertJa?.trim();
    const parts = [
      job,
      tags,
      status && (status.length > 36 ? `${status.slice(0, 36)}…` : status),
      alert && (alert.length > 32 ? `${alert.slice(0, 32)}…` : alert),
    ].filter(Boolean);
    if (parts.length) return parts.join(" · ");
    const sum = candidate.backgroundSummary.trim();
    return sum.length > 52 ? `${sum.slice(0, 52)}…` : sum || "—";
  }
  if (industry === "sales") {
    const d = candidate.salesCandidateListDemo;
    if (d) {
      const ch =
        d.keyChallengeJa.length > 32
          ? `${d.keyChallengeJa.slice(0, 32)}…`
          : d.keyChallengeJa;
      return `${d.sectorJa} · ${d.interestJa} · ${ch}`;
    }
    const sum = candidate.backgroundSummary.trim();
    const stage = candidate.pipelineStatusLabelJa;
    return sum
      ? `${stage} · ${sum.length > 36 ? `${sum.slice(0, 36)}…` : sum}`
      : stage;
  }
  return `${candidate.nationality} · ${candidate.jlpt}`;
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
  const [groupOpen, setGroupOpen] = useState<Record<CandidateGroupId, boolean>>({
    pre_entry: false,
    post_entry: false,
    construction_docs: false,
    construction_ops: false,
    logistics_docs: false,
    logistics_ops: false,
    medical_docs: false,
    medical_ops: false,
    professional_evidence: false,
    professional_matter: false,
  });
  const isMobile = useMobile();
  const profile = getIndustryProfile(industry);
  const data = getIndustryDemoData(industry);
  const candidates = data.candidates;
  const isConstruction = industry === "construction";
  const isEducation = industry === "education";
  const isLogistics = industry === "logistics";
  const isMedical = industry === "medical";
  const isProfessional = industry === "professional";
  const pageHints = getIndustryPageHints(industry);
  const candHints = pageHints.candidates;
  const showJlptFilter = pageHints.candidateDetail.showJlptBadge;
  const groupOrder = isConstruction
    ? groupOrderConstruction
    : isEducation
      ? groupOrderEducation
      : isLogistics
        ? groupOrderLogistics
        : isMedical
          ? groupOrderMedical
          : isProfessional
            ? groupOrderProfessional
            : groupOrderStaffing;

  const headerDescription = isConstruction
    ? focus === "risk"
      ? "安全書類不備・入場リスクを優先表示し、すぐに対応へ進みます。"
      : focus === "evaluation"
        ? "現場実績・配属予定がある作業員を中心に表示します。"
        : "工種と安全教育・書類の段階で優先度を判断します。"
    : isEducation
      ? focus === "risk"
        ? "提出物不備・学習遅れを優先表示し、すぐにフォローへ進みます。"
        : focus === "evaluation"
          ? "受講履歴・割当講座がある受講者を中心に表示します。"
          : candHints.pageSubtitle
      : isLogistics
        ? focus === "risk"
          ? "入構・免許・書類の不備を優先表示し、配車前の止まりどころを潰します。"
          : focus === "evaluation"
            ? "配車実績・担当便のある作業員を中心に表示します。"
            : candHints.pageSubtitle
        : isMedical
          ? focus === "risk"
            ? "記録不備・同意漏れを優先表示し、すぐに記録書類へ進みます。"
            : focus === "evaluation"
              ? "配置予定・勤務履歴のあるスタッフを中心に表示します。"
              : candHints.pageSubtitle
          : isProfessional
            ? focus === "risk"
              ? "証憑不足・申請期限を優先表示し、書類・次対応へ進みます。"
              : focus === "evaluation"
                ? "受任見込み・申請中の案件を中心に表示します。"
                : candHints.pageSubtitle
            : focus === "risk"
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
      if (showJlptFilter && jlpt !== "all" && candidate.jlpt !== jlpt) return false;
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
      if (isConstruction || isLogistics || isMedical) {
        list = list
          .filter(
            (candidate) =>
              candidate.pipelineStatus === "training" ||
              candidate.pipelineStatus === "document_prep" ||
              Boolean(candidate.documentAlertJa?.trim())
          )
          .sort((a, b) => a.aiScore - b.aiScore);
      } else {
        list = list
          .filter((candidate) => candidate.learningDemo)
          .sort(
            (a, b) =>
              (a.learningDemo?.online.jpCourseProgressPct ?? 100) -
              (b.learningDemo?.online.jpCourseProgressPct ?? 100)
          );
      }
    }

    if (focus === "risk") {
      if (isConstruction || isLogistics || isMedical || isProfessional) {
        list = list.filter(
          (candidate) =>
            Boolean(candidate.documentAlertJa?.trim()) ||
            candidate.pipelineStatus === "document_blocked" ||
            candidate.pipelineStatus === "document_prep"
        );
      } else if (isEducation) {
        list = list.filter(
          (candidate) =>
            Boolean(candidate.documentAlertJa?.trim()) ||
            candidate.pipelineStatus === "document_blocked" ||
            candidate.pipelineStatus === "document_prep" ||
            (candidate.learningDemo?.online.jpCourseProgressPct ?? 100) <= followupThreshold
        );
      } else {
        list = list.filter(
          (candidate) =>
            Boolean(candidate.documentAlertJa?.trim()) ||
            (candidate.learningDemo?.online.jpCourseProgressPct ?? 100) <= followupThreshold
        );
      }
    }

    if (focus === "evaluation") {
      list = list.filter((candidate) => {
        const hasHistory = Boolean(candidate.detailDemo?.dispatchHistory?.length);
        return hasHistory || Boolean(candidate.plannedAssignment);
      });
    }

    if (isProfessional) {
      const rank = (c: Candidate) =>
        c.pipelineStatus === "document_blocked"
          ? 0
          : Boolean(c.documentAlertJa?.trim())
            ? 1
            : c.pipelineStatus === "document_prep"
              ? 2
              : c.pipelineStatus === "visa_applying"
                ? 3
                : 4;
      list = [...list].sort((a, b) => rank(a) - rank(b) || b.aiScore - a.aiScore);
    }

    return list;
  })();

  const grouped = (() => {
    const map = new Map<CandidateGroupId, Candidate[]>();
    for (const g of groupOrder) map.set(g.id, []);
    for (const candidate of filtered) {
      map.get(resolveGroup(candidate, industry))?.push(candidate);
    }
    return map;
  })();

  return (
    <div className="space-y-5">
      <PageTagLinks
        label="表示タグ"
        currentId={focus}
        mobileScrollable
        stickyOnMobile
        mobileTopClassName="top-[7rem]"
        tags={[
          {
            id: "overview",
            label: isConstruction
              ? "①-1 現場手配一覧"
              : isEducation
                ? "①-1 受講者一覧"
                : isLogistics
                  ? "①-1 手配一覧"
                  : isMedical
                    ? "①-1 スタッフ一覧"
                    : isProfessional
                      ? "①-1 相談案件一覧"
                      : "①-1 一覧",
            href: buildCandidatesHref({ focus: "overview" }),
          },
          {
            id: "evaluation",
            label: isConstruction
              ? "①-2 実績・配属"
              : isEducation
                ? "①-2 受講・割当"
                : isLogistics
                  ? "①-2 稼働・配車"
                  : isMedical
                    ? "①-2 配置・実績"
                    : isProfessional
                      ? "①-2 申請・受任"
                      : "①-2 評価・ログ",
            href: buildCandidatesHref({ focus: "evaluation" }),
          },
          {
            id: "risk",
            label: isConstruction
              ? "①-3 書類・リスク"
              : isEducation
                ? "①-3 提出・遅延"
                : isLogistics
                  ? "①-3 書類・リスク"
                  : isMedical
                    ? "①-3 記録・リスク"
                    : isProfessional
                      ? "①-3 証憑・期限"
                      : "①-3 リスク・要フォロー",
            href: buildCandidatesHref({ focus: "risk" }),
          },
        ]}
      />

      <TemplatePageHeader title={profile.labels.candidate} description={headerDescription} />

      <div className="sticky top-[9.25rem] z-20 -mx-1 rounded-lg bg-surface/95 px-1 py-2 backdrop-blur sm:static sm:top-auto sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0">
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
        {showJlptFilter ? (
          <select
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
            value={jlpt}
            onChange={(e) => setJlpt(e.target.value as JlptLevel | "all")}
          >
            <option value="all">
              {isConstruction
                ? "JLPT（参考）すべて"
                : isLogistics
                  ? "JLPT（参考）すべて"
                  : isMedical
                    ? "JLPT（参考）すべて"
                    : "JLPT すべて"}
            </option>
            {jlptOptions.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        ) : null}
        </div>
      </div>

      {groupOrder.map((group) => {
        const items = grouped.get(group.id) ?? [];
        if (items.length === 0) return null;
        const open = groupOpen[group.id] ?? false;
        return (
          <section key={group.id} className="space-y-2">
            {isMobile ? (
              <Collapsible
                open={open}
                onOpenChange={(next) =>
                  setGroupOpen((prev) => ({ ...prev, [group.id]: next }))
                }
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border/70 bg-surface/60 px-3 py-2 text-left"
                  >
                    <span>
                      <span className="text-sm font-semibold text-foreground">
                        {group.label}
                      </span>
                      <span className="ml-2 text-xs text-muted">{items.length}件</span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted transition-transform",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-2">
                    {items.map((candidate) => (
                      <button
                        key={candidate.id}
                        type="button"
                        onClick={() => openCandidate(candidate)}
                        className={cn(
                          "w-full text-left rounded-xl border border-border bg-card p-3 transition-all hover:shadow-md",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Image
                            src={candidate.photoUrl}
                            alt=""
                            width={44}
                            height={44}
                            className="rounded-full bg-surface shrink-0"
                            unoptimized
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {candidate.displayName}
                            </p>
                            <p className="mt-0.5 text-xs text-muted">
                              {candidateListSubtitle(candidate, industry)}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant={statusBadgeVariant(candidate.pipelineStatus)}>
                                {candidate.pipelineStatusLabelJa}
                              </Badge>
                              <span className="text-xs text-muted">
                                AI {candidate.aiScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <>
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
                            {candidateListSubtitle(candidate, industry)}
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
              </>
            )}
          </section>
        );
      })}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          {isConstruction || isLogistics
            ? "条件に一致する作業員がありません。"
            : isEducation
              ? "条件に一致する受講者がありません。"
              : isMedical
                ? "条件に一致するスタッフがありません。"
                : "条件に一致する候補者がありません。"}
        </p>
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
                    {candidateListSubtitle(preview, industry)}
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
