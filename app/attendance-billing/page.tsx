import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTagLinks } from "@/components/page-tag-links";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { parsePageTag } from "@/lib/page-tag";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const demoPreviewRows = [
  { worker: "サンプル A", hours: "160.5", amount: "¥248,000" },
  { worker: "サンプル B", hours: "142.0", amount: "¥219,100" },
  { worker: "サンプル C", hours: "155.25", amount: "¥239,800" },
];

export default async function AttendanceBillingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const isConstruction = industry === "construction";
  const personCol = isConstruction ? "作業員" : "スタッフ";

  const tag = parsePageTag(
    typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : null,
    ["import", "summary", "billing", "ops"] as const,
    "import"
  );

  const tagHref = (t: string) => withDemoQuery(`/attendance-billing?tag=${t}`, industry, role);

  return (
    <TemplatePageStack>
      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        mobileScrollable
        stickyOnMobile
        mobileTopClassName="top-[7rem]"
        tags={[
          { id: "import", label: "CSV取込", href: tagHref("import") },
          { id: "summary", label: "稼働集計", href: tagHref("summary") },
          { id: "billing", label: "請求プレビュー", href: tagHref("billing") },
          { id: "ops", label: "実務突合", href: tagHref("ops") },
        ]}
      />

      <TemplatePageHeader
        title={isConstruction ? "勤怠（デモ）" : "勤怠・請求（デモ）"}
        description={
          isConstruction
            ? "勤怠 CSV の取込・集計・請求プレビューのイメージです。現場日報との突合は実務画面から（デモ）。"
            : "勤怠 CSV の取込イメージと、請求向けの集計プレビュー（ダミー）です。本番では外部システムと連携します。"
        }
      />

      {tag === "import" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">取込ファイル（仮）</CardTitle>
            <p className="text-xs text-muted">
              2026-04-01〜04-30_attendance.csv（デモ・未接続）
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">取込済み</Badge>
              <Badge variant="secondary">重複チェック 0 件</Badge>
            </div>
            <p className="text-sm text-muted">
              実際のファイルはアップロードされません。行数・列マッピングの確認 UI を想定したプレースホルダです。
            </p>
          </CardContent>
        </Card>
      ) : null}

      {tag === "summary" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">集計プレビュー（ダミー）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[320px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/50 text-left text-xs text-muted">
                    <th className="px-3 py-2 font-medium">{personCol}</th>
                    <th className="px-3 py-2 font-medium">稼働時間</th>
                    <th className="px-3 py-2 font-medium">請求額（概算）</th>
                  </tr>
                </thead>
                <tbody>
                  {demoPreviewRows.map((row) => (
                    <tr key={row.worker} className="border-b border-border/80 last:border-0">
                      <td className="px-3 py-2">{row.worker}</td>
                      <td className="px-3 py-2 tabular-nums">{row.hours} h</td>
                      <td className="px-3 py-2 tabular-nums">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {tag === "billing" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">請求プレビュー（ダミー）</CardTitle>
            <p className="text-sm text-muted">
              集計結果から請求書ドラフトを生成する前段の確認イメージです。
            </p>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">合計（概算）:</span>{" "}
              <span className="tabular-nums">¥706,900</span>
            </p>
            <p className="text-xs text-muted">
              内訳は「稼働集計」タブの行集計に相当（デモ固定値）。
            </p>
            <Link
              href={withDemoQuery("/revenue", industry, role)}
              className="inline-block text-sm font-medium text-primary underline"
            >
              {profile.labels.revenue}へ
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {tag === "ops" ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">実務との突合（デモ）</CardTitle>
            <p className="text-sm text-muted">
              勤怠記録と現場日報・配員の人数感を照らし合わせる想定です。
            </p>
          </CardHeader>
          <CardContent className="text-sm">
            <Link
              href={withDemoQuery("/operations", industry, role)}
              className="font-medium text-primary underline"
            >
              {profile.labels.operations}
            </Link>
            <span className="text-muted"> で当日の入場・欠員・タイムラインを確認します。</span>
          </CardContent>
        </Card>
      ) : null}
    </TemplatePageStack>
  );
}
