"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  ChevronDown,
  MessageSquareWarning,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { DemoRole } from "@/lib/demo-role";
import { withDemoQuery } from "@/lib/demo-query";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getDemoAlerts, getStalledWorkers } from "@/lib/demo-workers";
import { useSalesDemoBeatClass } from "@/components/story-demo/sales-demo-beat-context";
import type { StoryDashboardFocus } from "@/lib/story-embed";
import { cn } from "@/lib/utils";

type Props = {
  industry: EnabledIndustryKey;
  role: DemoRole;
  /** 営業ストーリー iframe 内：キラーカードの境界をはっきり */
  storyDemo?: boolean;
  /** ストーリーで同じ `/` でも見せ場を切り替える */
  storyDashboardFocus?: StoryDashboardFocus;
};

/** 折りたたみヘッダー: 操作できる領域であることが伝わるよう */
const killerCollapsibleTriggerClass =
  "flex w-full items-center justify-between gap-2 text-left rounded-lg border border-transparent transition hover:border-primary/30 hover:bg-primary/[0.04] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 active:scale-[0.995]";

function constructionFollowUpCandidates(industry: EnabledIndustryKey) {
  return getIndustryDemoData(industry).candidates.filter(
    (c) =>
      c.pipelineStatus === "document_blocked" ||
      c.pipelineStatus === "document_prep" ||
      c.pipelineStatus === "training" ||
      Boolean(c.documentAlertJa?.trim())
  );
}

function educationFollowUpCandidates() {
  return getIndustryDemoData("education").candidates.filter(
    (c) =>
      c.pipelineStatus === "document_blocked" ||
      c.pipelineStatus === "document_prep" ||
      c.pipelineStatus === "interview_coordination" ||
      c.pipelineStatus === "visa_applying" ||
      Boolean(c.documentAlertJa?.trim())
  );
}

function salesFollowUpCandidates() {
  return getIndustryDemoData("sales").candidates.filter(
    (c) =>
      c.pipelineStatus === "document_blocked" ||
      c.pipelineStatus === "document_prep" ||
      c.pipelineStatus === "interview_coordination" ||
      c.pipelineStatus === "visa_applying" ||
      Boolean(c.documentAlertJa?.trim())
  );
}

function medicalFollowUpCandidates() {
  return getIndustryDemoData("medical").candidates.filter(
    (c) =>
      c.pipelineStatus === "document_blocked" ||
      c.pipelineStatus === "document_prep" ||
      c.pipelineStatus === "training" ||
      Boolean(c.documentAlertJa?.trim())
  );
}

export function DashboardKillerCards({
  industry,
  role,
  storyDemo,
  storyDashboardFocus,
}: Props) {
  const beatK0 = useSalesDemoBeatClass("today-priorities__killer-0");
  const beatK1 = useSalesDemoBeatClass("today-priorities__killer-1");
  const beatK2 = useSalesDemoBeatClass("today-priorities__killer-2");

  if (role === "worker") return null;

  if (industry === "construction") {
    const data = getIndustryDemoData("construction");
    const followUp = constructionFollowUpCandidates("construction");
    const clients = data.clients
      .filter((c) => c.operations.openSlots > 0)
      .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
      .slice(0, 3);
    const requestCount = clients.reduce((sum, c) => sum + c.operations.openSlots, 0);
    const docUrgent = followUp.slice(0, 6);

    return (
      <div className="space-y-2">
        <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
          <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="size-5 text-amber-600" />
                      要フォロー作業員
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {followUp.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {followUp.slice(0, 5).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="truncate font-medium">{c.displayName}</span>
                          <Badge variant="warning" className="shrink-0 text-[10px]">
                            {c.pipelineStatusLabelJa}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/candidates?focus=risk", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    すべて見る
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-primary/20">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="size-5 text-primary" />
                      安全書類・入場確認
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {docUrgent.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {docUrgent.slice(0, 3).map((c) => (
                      <li key={`doc-${c.id}`}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-start justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{c.displayName}</span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {c.documentAlertJa?.trim() || "入場・安全書類の確認（デモ）"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    書類ハブへ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-warning/35 bg-warning/[0.05]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquareWarning className="size-5 text-warning" />
                      未充足現場
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[11px]">
                        {requestCount}名枠
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {clients.map((client) => (
                      <li key={client.id}>
                        <Link
                          href={withDemoQuery(`/clients/${client.id}`, industry, role)}
                          className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="font-medium">{client.tradeNameJa}</span>
                          <span className="text-muted"> — 不足 {client.operations.openSlots}名</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/clients", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    現場一覧へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    );
  }

  if (industry === "medical") {
    const data = getIndustryDemoData("medical");
    const followUp = medicalFollowUpCandidates();
    const clients = data.clients
      .filter((c) => c.operations.openSlots > 0)
      .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
      .slice(0, 3);
    const requestCount = clients.reduce((sum, c) => sum + c.operations.openSlots, 0);
    const docUrgent = followUp.slice(0, 6);

    return (
      <div className="space-y-2">
        <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
          <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="size-5 text-amber-600" />
                      要フォロースタッフ
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {followUp.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {followUp.slice(0, 5).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="truncate font-medium">{c.displayName}</span>
                          <Badge variant="warning" className="shrink-0 text-[10px]">
                            {c.pipelineStatusLabelJa}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/candidates?focus=risk", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    すべて見る
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-primary/20">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="size-5 text-primary" />
                      記録・同意の要確認
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {docUrgent.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {docUrgent.slice(0, 3).map((c) => (
                      <li key={`med-doc-${c.id}`}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-start justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{c.displayName}</span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {c.documentAlertJa?.trim() || "記録・同意の確認（デモ）"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    記録書類へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-warning/35 bg-warning/[0.05]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquareWarning className="size-5 text-warning" />
                      不足シフトの拠点
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[11px]">
                        {requestCount}枠
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {clients.map((client) => (
                      <li key={client.id}>
                        <Link
                          href={withDemoQuery(`/clients/${client.id}`, industry, role)}
                          className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="font-medium">{client.tradeNameJa}</span>
                          <span className="text-muted"> — 不足 {client.operations.openSlots}枠</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/clients", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    拠点一覧へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    );
  }

  if (industry === "education") {
    const data = getIndustryDemoData("education");
    const followUp = educationFollowUpCandidates();
    const clients = data.clients
      .filter((c) => c.operations.openSlots > 0)
      .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
      .slice(0, 3);
    const openSlotTotal = clients.reduce((sum, c) => sum + c.operations.openSlots, 0);
    const submissionUrgent = followUp.slice(0, 6);
    const inquiryDemoCount = 4;

    return (
      <div className="space-y-2">
        <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
          <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="size-5 text-amber-600" />
                      本日フォロー対象
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {followUp.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {followUp.slice(0, 5).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="truncate font-medium">{c.displayName}</span>
                          <Badge variant="warning" className="shrink-0 text-[10px]">
                            {c.pipelineStatusLabelJa}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/candidates?focus=risk", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    すべて見る
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-primary/20">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="size-5 text-primary" />
                      未提出・要確認
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {submissionUrgent.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {submissionUrgent.slice(0, 3).map((c) => (
                      <li key={`sub-${c.id}`}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-start justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{c.displayName}</span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {c.documentAlertJa?.trim() || "提出物・教材の確認（デモ）"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    提出書類へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-warning/35 bg-warning/[0.05]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquareWarning className="size-5 text-warning" />
                      空席のある講座 / 問い合わせ
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[11px]">
                        {openSlotTotal}枠
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <p className="text-xs text-muted">
                    問い合わせ（デモ）: 未対応 {inquiryDemoCount} 件
                  </p>
                  <ul className="space-y-1.5">
                    {clients.map((client) => (
                      <li key={client.id}>
                        <Link
                          href={withDemoQuery(`/clients/${client.id}`, industry, role)}
                          className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="font-medium">{client.tradeNameJa}</span>
                          <span className="text-muted"> — 空席 {client.operations.openSlots}枠</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/clients", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    講座一覧へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    );
  }

  if (industry === "logistics") {
    const data = getIndustryDemoData("logistics");
    const followUp = constructionFollowUpCandidates("logistics");
    const clients = data.clients
      .filter((c) => c.operations.openSlots > 0)
      .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
      .slice(0, 3);
    const requestCount = clients.reduce((sum, c) => sum + c.operations.openSlots, 0);
    const docUrgent = followUp.slice(0, 6);

    return (
      <div className="space-y-2">
        <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
          <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="size-5 text-amber-600" />
                      要フォロー作業員
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {followUp.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {followUp.slice(0, 5).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="truncate font-medium">{c.displayName}</span>
                          <Badge variant="warning" className="shrink-0 text-[10px]">
                            {c.pipelineStatusLabelJa}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/candidates?focus=risk", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    すべて見る
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-primary/20">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="size-5 text-primary" />
                      入構・配送書類
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {docUrgent.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {docUrgent.slice(0, 3).map((c) => (
                      <li key={`doc-${c.id}`}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-start justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{c.displayName}</span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {c.documentAlertJa?.trim() || "入構・免許・配送書類の確認（デモ）"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    書類ハブへ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-warning/35 bg-warning/[0.05]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquareWarning className="size-5 text-warning" />
                      未配車枠・拠点
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[11px]">
                        {requestCount}枠
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {clients.map((client) => (
                      <li key={client.id}>
                        <Link
                          href={withDemoQuery(`/clients/${client.id}`, industry, role)}
                          className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="font-medium">{client.tradeNameJa}</span>
                          <span className="text-muted"> — 未配車 {client.operations.openSlots}枠</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/clients", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    案件一覧へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    );
  }

  if (industry === "professional") {
    const data = getIndustryDemoData("professional");
    const followUp = constructionFollowUpCandidates("professional");
    const deadlineCases = [...data.candidates]
      .filter(
        (c) =>
          c.pipelineStatus === "visa_applying" ||
          c.pipelineStatus === "document_prep" ||
          c.pipelineStatus === "document_blocked" ||
          c.pipelineStatus === "interview_coordination"
      )
      .slice(0, 6);
    const clients = data.clients
      .filter((c) => c.operations.openSlots > 0)
      .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
      .slice(0, 3);
    const openSlotTotal = clients.reduce((sum, c) => sum + c.operations.openSlots, 0);

    return (
      <div className="space-y-2">
        <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
          <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="size-5 text-amber-600" />
                      証憑不足・要フォロー案件
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {followUp.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {followUp.slice(0, 5).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="truncate font-medium">{c.displayName}</span>
                          <Badge variant="warning" className="shrink-0 text-[10px]">
                            {c.pipelineStatusLabelJa}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/candidates?focus=risk", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    すべて見る
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-primary/20">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="size-5 text-primary" />
                      対応期限・手続ステータス
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {deadlineCases.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {deadlineCases.slice(0, 3).map((c) => (
                      <li key={`pro-dl-${c.id}`}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role)}
                          className="flex items-start justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{c.displayName}</span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {c.coeStatusJa?.trim() || "期限・提出先の確認（デモ）"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    申請書類・期限へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-warning/35 bg-warning/[0.05]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquareWarning className="size-5 text-warning" />
                      顧問先の未着手枠
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[11px]">
                        {openSlotTotal}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {clients.map((client) => (
                      <li key={client.id}>
                        <Link
                          href={withDemoQuery(`/clients/${client.id}`, industry, role)}
                          className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="font-medium">{client.tradeNameJa}</span>
                          <span className="text-muted"> — 未着手 {client.operations.openSlots}件</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/clients", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    顧問先一覧へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    );
  }

  if (industry === "sales") {
    const data = getIndustryDemoData("sales");
    const followUp = salesFollowUpCandidates();
    const docUrgent = data.candidates.filter(
      (c) =>
        c.pipelineStatus === "document_blocked" ||
        c.pipelineStatus === "document_prep" ||
        Boolean(c.documentAlertJa?.trim())
    );
    const stalledDeals = [...data.clients]
      .filter(
        (c) =>
          c.operations.retentionRatePct <= 79 ||
          c.operations.openSlots >= 2 ||
          (c.salesListDemo?.winProbabilityJa?.includes("低") ?? false) ||
          (c.salesListDemo?.winProbabilityJa?.includes("要修正") ?? false)
      )
      .sort((a, b) => a.operations.retentionRatePct - b.operations.retentionRatePct)
      .slice(0, 4);

    return (
      <div className="space-y-2">
        <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
          <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <AlertTriangle className="size-5 text-amber-600" />
                      今日接触すべき顧客
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {followUp.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {followUp.slice(0, 5).map((c) => (
                      <li key={c.id}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role)}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="truncate font-medium">{c.displayName}</span>
                          <Badge variant="warning" className="shrink-0 text-[10px]">
                            {c.pipelineStatusLabelJa}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/candidates?focus=risk", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    見込み顧客一覧へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-primary/20">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CalendarClock className="size-5 text-primary" />
                      提案資料・要確認
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" className="text-[11px]">
                        {docUrgent.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                    {docUrgent.slice(0, 4).map((c) => (
                      <li key={`doc-${c.id}`}>
                        <Link
                          href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                            tab: "docs",
                          })}
                          className="flex items-start justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{c.displayName}</span>
                            <span className="mt-0.5 block text-xs text-muted">
                              {c.documentAlertJa?.trim() || "見積・提案ドラフトの確認（デモ）"}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    提案資料へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <Card className="min-w-0 border-warning/35 bg-warning/[0.05]">
            <Collapsible>
              <CardHeader className="pb-2">
                <CollapsibleTrigger asChild>
                  <button className={killerCollapsibleTriggerClass}>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <MessageSquareWarning className="size-5 text-warning" />
                      停滞・要フォロー案件
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[11px]">
                        {stalledDeals.length}件
                      </Badge>
                      <ChevronDown className="size-4 text-muted" />
                    </div>
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-2 pt-0 text-sm">
                  <ul className="space-y-1.5">
                    {stalledDeals.map((client) => (
                      <li key={client.id}>
                        <Link
                          href={withDemoQuery(`/clients/${client.id}`, industry, role)}
                          className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                        >
                          <span className="font-medium">{client.tradeNameJa}</span>
                          <span className="text-muted">
                            {" "}
                            — {client.salesListDemo?.nextActionJa ?? "次アクションを確認"}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={withDemoQuery("/clients", industry, role)}
                    className="inline-flex text-xs font-semibold text-primary hover:underline"
                  >
                    提案案件一覧へ
                  </Link>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    );
  }

  const stalled = getStalledWorkers();
  const alerts = getDemoAlerts().slice(0, 6);
  const clients = getIndustryDemoData(industry).clients
    .filter((c) => c.operations.openSlots > 0)
    .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
    .slice(0, 3);
  const requestCount = clients.reduce((sum, c) => sum + c.operations.openSlots, 0);

  const ringStandard =
    "story-demo-context-ring ring-2 ring-primary/35 ring-offset-2 ring-offset-background";
  const ringPriorityFirst =
    "story-demo-context-ring ring-2 ring-primary/45 ring-offset-2 ring-offset-background";
  const killerCardRing = (i: 0 | 1 | 2) => {
    if (!storyDemo) return "";
    if (storyDashboardFocus === "overview") return "";
    if (storyDashboardFocus === "closing") return "";
    if (storyDashboardFocus === "priority") return i === 0 ? ringPriorityFirst : "";
    return ringStandard;
  };
  const closingMute =
    storyDemo && storyDashboardFocus === "closing" ? "opacity-[0.55]" : "";
  const overviewShell =
    storyDemo && storyDashboardFocus === "overview"
      ? "story-demo-context-ring rounded-xl p-1 ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
      : "";

  return (
    <div className={cn("space-y-2", closingMute, overviewShell)}>
      <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
        <Card
          className={cn(
            "min-w-0 border-amber-500/25 bg-amber-500/[0.04]",
            killerCardRing(0),
            storyDemo && storyDashboardFocus === "priority" && beatK0
          )}
        >
          <Collapsible>
            <CardHeader className="pb-2">
              <CollapsibleTrigger asChild>
                <button className={killerCollapsibleTriggerClass}>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="size-5 text-amber-600" />
                    今日フォローする人を確認
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger" className="text-[11px]">{stalled.length}件</Badge>
                    <ChevronDown className="size-4 text-muted" />
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-2 pt-0 text-sm">
                <ul className="space-y-1.5">
                  {stalled.map((w) => (
                    <li key={w.id}>
                      <Link
                        href={withDemoQuery("/candidates?focus=risk", industry, role)}
                        className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                      >
                        <span className="truncate font-medium">{w.displayNameEn}</span>
                        <Badge variant="warning" className="shrink-0">
                          {w.jpProgressPct}%
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={withDemoQuery("/candidates?focus=risk", industry, role)}
                  className="inline-flex text-xs font-semibold text-primary hover:underline"
                >
                  すべて見る
                </Link>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card
          className={cn(
            "min-w-0 border-primary/20",
            killerCardRing(1),
            storyDemo && storyDashboardFocus === "priority" && beatK1
          )}
        >
          <Collapsible>
            <CardHeader className="pb-2">
              <CollapsibleTrigger asChild>
                <button className={killerCollapsibleTriggerClass}>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarClock className="size-5 text-primary" />
                    要対応手続き・書類
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger" className="text-[11px]">{alerts.length}件</Badge>
                    <ChevronDown className="size-4 text-muted" />
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-2 pt-0 text-sm">
                <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                  {alerts.slice(0, 3).map((a) => (
                    <li key={a.id}>
                      <Link
                        href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                        className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                      >
                        <span className="min-w-0 truncate">
                          <span className="font-medium">{a.workerName}</span>
                          <span className="text-muted"> · {a.typeJa}</span>
                        </span>
                        <span className="shrink-0 tabular-nums text-xs text-muted">
                          残り{a.daysLeft}日
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                  className="inline-flex text-xs font-semibold text-primary hover:underline"
                >
                  すべて見る
                </Link>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card
          className={cn(
            "min-w-0 border-warning/35 bg-warning/[0.05]",
            killerCardRing(2),
            storyDemo && storyDashboardFocus === "priority" && beatK2
          )}
        >
          <Collapsible>
            <CardHeader className="pb-2">
              <CollapsibleTrigger asChild>
                <button className={killerCollapsibleTriggerClass}>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquareWarning className="size-5 text-warning" />
                    未対応クライアント要望
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="text-[11px]">{requestCount}件</Badge>
                    <ChevronDown className="size-4 text-muted" />
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-2 pt-0 text-sm">
                <ul className="space-y-1.5">
                  {clients.map((client) => (
                    <li key={client.id}>
                      <Link
                        href={withDemoQuery("/client-requests", industry, role)}
                        className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                      >
                        <span className="font-medium">{client.tradeNameJa}</span>
                        <span className="text-muted"> — 未充足 {client.operations.openSlots}名</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={withDemoQuery("/client-requests", industry, role)}
                  className="inline-flex text-xs font-semibold text-primary hover:underline"
                >
                  すべて見る
                </Link>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
}
