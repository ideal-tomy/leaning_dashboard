import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplateMobileFlowSection,
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const demoQueues = [
  { name: "外部勤怠 → 請求承認", pending: 3, tone: "warning" as const },
  { name: "メール通知（Slack 連携）", pending: "連動", tone: "secondary" as const },
  { name: "カスタム KPI ウィジェット", pending: "2 枠", tone: "secondary" as const },
];

export default async function IntegrationsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel="連携・アラート（デモ）"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title="連携・通知ダッシュ（デモ）"
        description="外部システム・承認キュー・任意 KPI を載せる想定の画面です。数値はダミーです。"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">接続ステータス</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span>勤怠 API</span>
              <Badge variant="success">OK</Badge>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>請求 CSV</span>
              <Badge variant="warning">要確認</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">承認キュー（ダミー）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoQueues.map((q) => (
              <div
                key={q.name}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 px-3 py-2 text-sm"
              >
                <span className="font-medium">{q.name}</span>
                <Badge variant={q.tone}>{String(q.pending)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">その他メニュー</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          ショートカットや設定は{" "}
          <Link href={withDemoQuery("/more", industry, role)} className="text-primary underline">
            その他
          </Link>
          から開けます（デモ）。
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}
