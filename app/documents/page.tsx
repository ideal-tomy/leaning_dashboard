"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplatePageHeader, TemplatePageStack } from "@/components/templates/layout-primitives";
import { TemplateMobileFlowSection } from "@/components/templates/layout-primitives";
import { PageTagLinks } from "@/components/page-tag-links";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";
import type { Candidate } from "@data/types";
import { aggregateUpcomingDeadlines } from "@/lib/deadline-aggregator";
import type { DeadlineRow } from "@/lib/deadline-aggregator";
import { withDemoQuery } from "@/lib/demo-query";
import { parsePageTag } from "@/lib/page-tag";

function DeadlineRowsList({
  rows,
  industry,
  role,
}: {
  rows: DeadlineRow[];
  industry: EnabledIndustryKey;
  role: DemoRole;
}) {
  return (
    <ul className="space-y-2 text-sm">
      {rows.map((row, i) => (
        <li key={`${row.candidateId}-${row.kind}-${row.dueIso}-${i}`}>
          <Link
            href={withDemoQuery(
              `/candidates/${row.candidateId}`,
              industry,
              role,
              { tab: "docs" }
            )}
            className="block rounded-lg border border-border p-3 hover:bg-surface"
          >
            <span className="font-medium">{row.candidateName}</span>
            <span className="mx-2 text-muted">·</span>
            <span className="text-muted">{row.labelJa}</span>
            <span className="mt-1 block text-xs text-muted tabular-nums">
              期限 {row.dueIso}
              {row.daysUntil != null ? `（あと${row.daysUntil}日）` : ""}
              <Badge variant="outline" className="ml-2">
                {row.kind === "milestone" ? "予定" : "書類"}
              </Badge>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function DocumentsPage() {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const urlSearch = useSearchParams();
  const profile = getIndustryProfile(industry);
  const hints = getIndustryPageHints(industry);
  const docHints = hints.documents;
  const data = getIndustryDemoData(industry);
  const alerts = data.countDocumentAlerts();

  const highlightDeadlines = urlSearch.get("highlight") === "deadlines";
  const scope = parsePageTag(
    urlSearch.get("scope"),
    ["pre-entry", "post-entry", "deadlines"] as const,
    "pre-entry"
  );
  const isFactoryStaffing = industry === "staffing" && role === "client";
  useEffect(() => {
    if (!highlightDeadlines) return;
    const id = requestAnimationFrame(() => {
      document
        .getElementById("deadline-focus")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [highlightDeadlines]);

  const blocked = data.candidates.filter(
    (c) => c.pipelineStatus === "document_blocked"
  );

  const upcomingDeadlines = aggregateUpcomingDeadlines(industry, {
    withinDays: 14,
  });

  const documentDeadlines = useMemo(
    () => upcomingDeadlines.filter((r) => r.kind === "document"),
    [upcomingDeadlines]
  );
  const preEntryStatuses: Candidate["pipelineStatus"][] = [
    "interview_coordination",
    "offer_accepted",
    "visa_applying",
    "document_prep",
    "document_blocked",
  ];
  const preEntryCandidates = data.candidates.filter((c) =>
    preEntryStatuses.includes(c.pipelineStatus)
  );
  const postEntryCandidates = data.candidates.filter(
    (c) =>
      c.pipelineStatus === "training" ||
      (c.detailDemo?.dispatchHistory?.some((h) => h.kind === "completed") ?? false)
  );
  const storedDocs = data.candidates.flatMap((c) =>
    (c.detailDemo?.storedDocuments ?? []).map((doc) => ({
      candidateId: c.id,
      candidateName: c.displayName,
      ...doc,
    }))
  );

  const scopeHref = (nextScope: string) =>
    withDemoQuery(`/documents?scope=${nextScope}`, industry, role);

  if (isFactoryStaffing) {
    return (
      <TemplatePageStack>
        <TemplatePageHeader
          title="書類管理（支援機関向け）"
          description="工場表示ではトップ導線から除外されています。必要時のみ支援機関へ連携してください。"
        />
        <Card>
          <CardContent className="space-y-3 pt-6 text-sm text-muted">
            <p>この画面は支援機関向けの手続きハブです。</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href={withDemoQuery("/", industry, role)}>
                  ダッシュボードへ戻る
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={withDemoQuery("/candidates?view=pipeline", industry, role)}>
                  就労状態を確認する
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TemplatePageStack>
    );
  }

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel={`${profile.labels.documents}管理`}
          nextHref={withDemoQuery("/documents/deficiencies", industry, role)}
          nextLabel="次へ"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title={`${profile.labels.documents}管理`}
        description={
          scope === "post-entry"
            ? "入国後・就労関連書類の状態を確認し、未完了を処理します。"
            : scope === "deadlines"
              ? "期限・更新が必要な項目を確認し、優先順に対応します。"
              : "入国前手続きを確認し、差戻しや未提出を解消します。"
        }
      />

      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="不備対応"
        reasonTone="danger"
        description="書類不備フォローに進むと、緊急度順で対応対象を把握できます。"
        actionHref={withDemoQuery("/documents/deficiencies", industry, role)}
        actionLabel="書類不備フォローへ"
      />

      <PageTagLinks
        label="表示タグ"
        currentId={scope}
        tags={[
          { id: "pre-entry", label: "②-1 入国前", href: scopeHref("pre-entry") },
          { id: "post-entry", label: "②-2 入国後", href: scopeHref("post-entry") },
          { id: "deadlines", label: "②-3 期限・保管", href: scopeHref("deadlines") },
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" asChild className="min-h-11">
          <Link
            href={withDemoQuery("/documents/deficiencies", industry, role)}
          >
            {profile.statusLabels.document_blocked}の{profile.labels.candidate}を見る
          </Link>
        </Button>
      </div>
      <p className="text-xs text-muted">
        パスポート OCR・ビザ申請 PDF などの{" "}
        <Link
          href={withDemoQuery("/feature-demos", industry, role)}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          技術・DXデモ
        </Link>
        は一覧から体験できます。
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">生成完了</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{docHints.kpiComplete}</p>
            <Badge variant="success" className="mt-2">
              デモ値
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">要確認</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{docHints.kpiReview}</p>
            <Badge variant="warning" className="mt-2">
              レビュー待ち
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              期限・アラート（要フォロー）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-danger">{alerts}</p>
            <Badge variant="danger" className="mt-2">
              パイプライン連動
            </Badge>
          </CardContent>
        </Card>
      </div>

      {scope === "pre-entry" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">入国前に必要な書類（デモ）</CardTitle>
            <p className="text-sm text-muted">
              ビザ・COE・パスポートなど、入国前に整えるべき書類状況を確認します。
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {preEntryCandidates.length === 0 ? (
              <p className="text-sm text-muted">該当者はいません。</p>
            ) : (
              preEntryCandidates.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                    tab: "docs",
                  })}
                  className="block rounded-lg border border-border p-3 text-sm hover:bg-surface"
                >
                  <p className="font-medium">{c.displayName}</p>
                  <p className="text-xs text-muted">
                    {c.pipelineStatusLabelJa} / パスポート期限 {c.passportExpiry}
                  </p>
                  {c.documentAlertJa ? (
                    <p className="text-xs text-danger">{c.documentAlertJa}</p>
                  ) : null}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {scope === "post-entry" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">入国後・就労関連書類（デモ）</CardTitle>
            <p className="text-sm text-muted">
              契約・更新・監理報告など、就労後に必要な書類を確認します。
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {postEntryCandidates.length === 0 ? (
              <p className="text-sm text-muted">該当者はいません。</p>
            ) : (
              postEntryCandidates.slice(0, 8).map((c) => (
                <Link
                  key={c.id}
                  href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                    tab: "docs",
                  })}
                  className="block rounded-lg border border-border p-3 text-sm hover:bg-surface"
                >
                  <p className="font-medium">{c.displayName}</p>
                  <p className="text-xs text-muted">
                    {c.pipelineStatusLabelJa} / COE {c.coeStatusJa}
                  </p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {scope === "deadlines" && (
        <Card id="deadline-focus">
        <CardHeader>
          <CardTitle className="text-base">
            期限・保管（デモ）
          </CardTitle>
          <p className="text-sm text-muted">
            書類期限と保管ファイルを確認し、更新・差替えを進めます。
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {industry !== "staffing" ? (
            <p className="text-sm text-muted">
              本一覧は派遣スタッフィング業種のデモデータを使用します。業種を切り替えると表示が変わります。
            </p>
          ) : upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-muted">
              14日以内の期限はありません（基準日: デモバンドルに準拠）。
            </p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  書類・申請
                </h3>
                {documentDeadlines.length === 0 ? (
                  <p className="text-sm text-muted">該当なし</p>
                ) : (
                  <DeadlineRowsList
                    rows={documentDeadlines}
                    industry={industry}
                    role={role}
                  />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">保管ファイル</h3>
                {storedDocs.length === 0 ? (
                  <p className="text-sm text-muted">保管ファイルはありません。</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {storedDocs.slice(0, 8).map((doc) => (
                      <li key={doc.id} className="rounded-lg border border-border p-3">
                        <p className="font-medium">{doc.labelJa}</p>
                        <p className="text-xs text-muted">
                          {doc.candidateName} / {doc.categoryJa} / 更新 {doc.updatedAt}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </CardContent>
        </Card>
      )}

      {(scope === "post-entry" || scope === "deadlines") && blocked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5" />
              {profile.statusLabels.document_blocked}の{profile.labels.candidate}
            </CardTitle>
            <p className="text-sm text-muted">
              緊急度別の一覧は{" "}
              <Link
                href={withDemoQuery("/documents/deficiencies", industry, role)}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                書類不備フォロー（デモ）
              </Link>
              から開けます。
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {blocked.map((c) => (
              <Link
                key={c.id}
                href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                  tab: "docs",
                })}
                className="block min-h-[52px] rounded-lg border border-border p-3 text-sm hover:bg-surface"
              >
                <span className="font-medium">{c.displayName}</span>
                {c.documentAlertJa && (
                  <p className="text-xs text-danger">{c.documentAlertJa}</p>
                )}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </TemplatePageStack>
  );
}
