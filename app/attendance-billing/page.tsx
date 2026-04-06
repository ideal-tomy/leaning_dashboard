import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplateMobileFlowSection,
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { getIndustryProfile } from "@/lib/industry-profiles";
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

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel="勤怠・請求（デモ）"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title="勤怠・請求（デモ）"
        description="勤怠 CSV の取込イメージと、請求向けの集計プレビュー（ダミー）です。本番では外部システムと連携します。"
      />

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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">集計プレビュー（ダミー）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[320px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-left text-xs text-muted">
                  <th className="px-3 py-2 font-medium">スタッフ</th>
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
          <p className="text-xs text-muted">
            実務オペレーションの KPI やタスクは{" "}
            <Link
              href={withDemoQuery("/operations", industry, role)}
              className="text-primary underline"
            >
              {profile.labels.operations}
            </Link>
            から。収益の詳細は{" "}
            <Link
              href={withDemoQuery("/revenue", industry, role)}
              className="text-primary underline"
            >
              {profile.labels.revenue}
            </Link>
            へ。
          </p>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}
