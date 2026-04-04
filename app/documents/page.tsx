"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TemplatePageHeader, TemplatePageStack } from "@/components/templates/layout-primitives";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";
import { aggregateUpcomingDeadlines } from "@/lib/deadline-aggregator";
import type { DeadlineRow } from "@/lib/deadline-aggregator";
import { withDemoQuery } from "@/lib/demo-query";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const alerts = data.countDocumentAlerts();

  const highlightDeadlines = urlSearch.get("highlight") === "deadlines";
  useEffect(() => {
    if (!highlightDeadlines) return;
    const id = requestAnimationFrame(() => {
      document
        .getElementById("deadline-focus")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [highlightDeadlines]);

  function runScan() {
    setOpen(true);
    setLoading(true);
    toast.info("OCR 処理中…（デモ）");
    setTimeout(() => {
      setLoading(false);
      toast.success("抽出完了（デモ）");
    }, 1000);
  }

  const blocked = data.candidates.filter(
    (c) => c.pipelineStatus === "document_blocked"
  );

  const upcomingDeadlines = aggregateUpcomingDeadlines(industry, {
    withinDays: 14,
  });

  const milestoneDeadlines = useMemo(
    () => upcomingDeadlines.filter((r) => r.kind === "milestone"),
    [upcomingDeadlines]
  );
  const documentDeadlines = useMemo(
    () => upcomingDeadlines.filter((r) => r.kind === "document"),
    [upcomingDeadlines]
  );

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title={`${profile.labels.documents}管理`}
        description={
          docHints.pageIntentJa
            ? `${docHints.pageIntentJa} ${docHints.pageSubtitle}`
            : docHints.pageSubtitle
        }
      />

      <div className="flex flex-wrap gap-3">
        <Button onClick={runScan} className="gap-2 min-h-11">
          <ScanLine className="size-4" />
          {docHints.ocrButtonLabel}
        </Button>
        <Button variant="secondary" asChild className="min-h-11 gap-2">
          <Link
            href={withDemoQuery("/documents/visa-draft", industry, role)}
          >
            <FileText className="size-4" />
            ビザ更新・申請書類PDF（デモ）
          </Link>
        </Button>
        <Button variant="secondary" asChild className="min-h-11">
          <Link
            href={withDemoQuery("/documents/deficiencies", industry, role)}
          >
            {profile.statusLabels.document_blocked}の{profile.labels.candidate}を見る
          </Link>
        </Button>
      </div>

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

      <Card id="deadline-focus">
        <CardHeader>
          <CardTitle className="text-base">
            期限が近い手続き（14日以内・デモ）
          </CardTitle>
          <p className="text-sm text-muted">
            ミルストーンと書類チェックリストの期限を、候補者ごとに集約しています（派遣スタッフィング業種）。
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
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">
                  面接・日程・連絡（予定）
                </h3>
                {milestoneDeadlines.length === 0 ? (
                  <p className="text-sm text-muted">該当なし</p>
                ) : (
                  <DeadlineRowsList
                    rows={milestoneDeadlines}
                    industry={industry}
                    role={role}
                  />
                )}
              </div>
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
            </div>
          )}
        </CardContent>
      </Card>

      {blocked.length > 0 && (
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

      <Sheet
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setLoading(false);
        }}
      >
        <SheetContent title={docHints.sheetTitle}>
          {loading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{docHints.ocrSampleName}</p>
              <ul className="list-inside list-disc text-muted">
                {docHints.ocrSampleLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </TemplatePageStack>
  );
}
