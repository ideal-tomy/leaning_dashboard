"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TemplatePageHeader, TemplatePageStack } from "@/components/templates/layout-primitives";
import { useIndustry } from "@/components/industry-context";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { withIndustryQuery } from "@/lib/industry-selection";

export default function DocumentsPage() {
  const { industry } = useIndustry();
  const profile = getIndustryProfile(industry);
  const hints = getIndustryPageHints(industry);
  const docHints = hints.documents;
  const data = getIndustryDemoData(industry);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const alerts = data.countDocumentAlerts();

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

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title={`${profile.labels.documents}管理`}
        description={docHints.pageSubtitle}
      />

      <div className="flex flex-wrap gap-3">
        <Button onClick={runScan} className="gap-2 min-h-11">
          <ScanLine className="size-4" />
          {docHints.ocrButtonLabel}
        </Button>
        <Button variant="secondary" asChild className="min-h-11">
          <Link href={withIndustryQuery("/candidates?view=pipeline", industry)}>
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
            <CardTitle className="text-sm font-medium text-muted">要フォロー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-danger">{alerts}</p>
            <Badge variant="danger" className="mt-2">
              パイプライン連動
            </Badge>
          </CardContent>
        </Card>
      </div>

      {blocked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5" />
              {profile.statusLabels.document_blocked}の{profile.labels.candidate}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blocked.map((c) => (
              <Link
                key={c.id}
                href={withIndustryQuery(`/candidates/${c.id}`, industry)}
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
