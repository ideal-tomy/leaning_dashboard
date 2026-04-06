import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplatePageHeader,
  TemplateMobileFlowSection,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const demoRows = [
  {
    site: "〇〇ビル新築",
    task: "朝礼・KY 写真",
    state: "未提出" as const,
    due: "本日 7:00",
  },
  {
    site: "△△工場",
    task: "終業前パトロール",
    state: "提出済" as const,
    due: "昨日",
  },
  {
    site: "□□線工事",
    task: "仮設足場全景",
    state: "要再撮影" as const,
    due: "期限超過",
  },
];

export default async function FieldReportsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/operations", industry, role)}
          backLabel="実務へ戻る"
          pageLabel="報告・写真ハブ"
          nextHref={withDemoQuery("/documents", industry, role)}
          nextLabel="次へ"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title="報告・写真ハブ（デモ）"
        description={`${profile.labels.client}や現場単位の提出タスクと証跡を一覧する想定です。送り忘れ・探索・取り違えを減らす「公式の確認場所」として使います。`}
      />
      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="書類連携"
        reasonTone="success"
        description="提出状況を確認後、書類管理で期限・保管を続けて確認できます。"
        actionHref={withDemoQuery("/documents", industry, role)}
        actionLabel="書類管理へ"
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="danger">未提出 1</Badge>
        <Badge variant="success">提出済 1</Badge>
        <Badge variant="warning">要確認 1</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">本日の提出タスク（ダミー）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {demoRows.map((row) => (
            <div
              key={`${row.site}-${row.task}`}
              className="flex flex-col gap-1 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{row.site}</p>
                <p className="text-muted">{row.task}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    row.state === "未提出"
                      ? "danger"
                      : row.state === "提出済"
                        ? "success"
                        : "warning"
                  }
                >
                  {row.state}
                </Badge>
                <span className="text-xs text-muted">{row.due}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted">
        本番ではカメラアップロード・自動ファイル名・保存先ルール・サムネ一覧をここに集約する想定です。OCR や安全書類とは
        <Link
          href={withDemoQuery("/documents", industry, role)}
          className="mx-1 text-primary underline"
        >
          書類管理
        </Link>
        と連携できます。
      </p>

      <p className="text-xs text-muted">
        <Link
          href={withDemoQuery("/operations", industry, role)}
          className="text-primary underline"
        >
          {profile.labels.operations}
        </Link>
        へ戻るショートカット。
      </p>
    </TemplatePageStack>
  );
}
