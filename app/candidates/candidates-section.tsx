"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Search } from "lucide-react";
import type { Candidate, JlptLevel } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TemplatePageHeader } from "@/components/templates/layout-primitives";
import { useMobile } from "@/hooks/use-mobile";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { getIndustryFromSearchParams, withIndustryQuery } from "@/lib/industry-selection";
import { cn } from "@/lib/utils";

const jlptOptions: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

function statusBadgeVariant(
  s: Candidate["pipelineStatus"]
): "default" | "success" | "warning" | "danger" {
  if (s === "document_blocked") return "danger";
  if (s === "document_prep" || s === "training") return "warning";
  if (s === "offer_accepted" || s === "awaiting_entry") return "success";
  return "default";
}

export function CandidatesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const industry = getIndustryFromSearchParams(searchParams);
  const pageHints = getIndustryPageHints(industry);
  const resolvedDefaultTab =
    view === "pipeline"
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
  const filtered = candidates.filter((c) => {
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

  function openCandidate(c: Candidate) {
    if (isMobile) {
      setPreview(c);
      setSheetOpen(true);
    } else {
      router.push(withIndustryQuery(`/candidates/${c.id}`, industry));
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
          <Link href={withIndustryQuery(`/candidates/${preview.id}`, industry)}>
            詳しく見る
          </Link>
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <TemplatePageHeader
        title={profile.labels.candidate}
        description={`${candidates.length} 件のデモデータ。${pageHints.candidates.pageSubtitle} スマホはタップでクイック表示。`}
      />

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "list" | "pipeline")}
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(
              Object.entries(pipeline) as [
                Candidate["pipelineStatus"],
                number,
              ][]
            ).map(([key, n]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted">{profile.statusLabels[key]}</p>
                  <p className="text-2xl font-bold tabular-nums">{n}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
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
            {filtered.map((c) => (
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
