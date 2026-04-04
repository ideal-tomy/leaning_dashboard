import Link from "next/link";
import { CalendarClock, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OperationsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const hints = getIndustryPageHints(industry).operations;

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title={profile.labels.operations}
        description={profile.operationsDescription}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {hints.kpiTiles.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted">{k.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold tabular-nums">{k.value}</p>
              {k.sub ? (
                <p className="mt-1 text-xs text-muted">{k.sub}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="size-5 text-primary" />
            直近のオペレーション（デモ）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hints.timeline.map((row) => (
            <div
              key={row.title}
              className="flex flex-col gap-1 rounded-lg border border-border/80 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{row.title}</p>
                <p className="text-xs text-muted">{row.time}</p>
              </div>
              {row.badge ? (
                <Badge variant="secondary" className="w-fit shrink-0">
                  {row.badge}
                </Badge>
              ) : null}
            </div>
          ))}
          <p className="text-xs text-muted">{hints.csvHint}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={withIndustryQuery("/documents", industry)} className="block">
          <Card className="h-full min-h-[100px] transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="size-6 text-primary" />
                {profile.labels.documents}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              生成ステータス、不備候補、OCR デモへ
            </CardContent>
          </Card>
        </Link>
        <Link href={withIndustryQuery("/revenue", industry)} className="block">
          <Card className="h-full min-h-[100px] transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="size-6 text-primary" />
                {profile.labels.revenue}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              月次グラフ、回収・リスクのダミー表示へ
            </CardContent>
          </Card>
        </Link>
      </div>
    </TemplatePageStack>
  );
}
