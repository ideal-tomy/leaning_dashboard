import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTagLinks } from "@/components/page-tag-links";
import {
  TemplatePageHeader,
  TemplateMobileFlowSection,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";
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

const photoPlaceholders = [
  { site: "〇〇ビル新築", label: "KY 板前", status: "未提出" as const },
  { site: "△△工場", label: "パトロール 1", status: "提出済" as const },
  { site: "□□線工事", label: "足場全景", status: "要再撮影" as const },
];

export default async function FieldReportsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const isConstruction = industry === "construction";

  const tag = parsePageTag(
    typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : null,
    ["tasks", "photos", "rework", "link_docs"] as const,
    "tasks"
  );

  const tagHref = (t: string) => withDemoQuery(`/field-reports?tag=${t}`, industry, role);

  const reworkRows = demoRows.filter((r) => r.state === "要再撮影");

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery(isConstruction ? "/" : "/operations", industry, role)}
          backLabel={isConstruction ? "ダッシュボード" : "実務へ戻る"}
          pageLabel={isConstruction ? "報告管理" : "報告・写真ハブ"}
          nextHref={withDemoQuery("/documents", industry, role)}
          nextLabel="次へ"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title={isConstruction ? "報告管理（デモ）" : "報告・写真ハブ（デモ）"}
        description={
          isConstruction
            ? `${profile.labels.client}単位の写真・KY・点検の提出状況を一覧する公式の確認場所（デモ）。`
            : `${profile.labels.client}や現場単位の提出タスクと証跡を一覧する想定です。送り忘れ・探索・取り違えを減らす「公式の確認場所」として使います。`
        }
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

      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        tags={[
          { id: "tasks", label: "提出タスク", href: tagHref("tasks") },
          { id: "photos", label: "写真・証跡", href: tagHref("photos") },
          { id: "rework", label: "差戻し・再提出", href: tagHref("rework") },
          { id: "link_docs", label: "書類連携", href: tagHref("link_docs") },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="danger">未提出 1</Badge>
        <Badge variant="success">提出済 1</Badge>
        <Badge variant="warning">要確認 1</Badge>
      </div>

      {tag === "tasks" ? (
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
      ) : null}

      {tag === "photos" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">写真・証跡（プレースホルダ）</CardTitle>
            <p className="text-sm text-muted">
              サムネ・撮影日時・紐づけ現場を一覧する想定です（デモ）。
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {photoPlaceholders.map((p) => (
              <div
                key={p.label}
                className="rounded-lg border border-border bg-surface/40 p-3 text-sm"
              >
                <div className="mb-2 aspect-video rounded-md bg-muted/50" aria-hidden />
                <p className="font-medium">{p.site}</p>
                <p className="text-xs text-muted">{p.label}</p>
                <Badge
                  className="mt-2"
                  variant={
                    p.status === "未提出"
                      ? "danger"
                      : p.status === "提出済"
                        ? "success"
                        : "warning"
                  }
                >
                  {p.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {tag === "rework" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">差戻し・再提出</CardTitle>
            <p className="text-sm text-muted">要再撮影・差戻しタスクのみ表示（デモ）。</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {reworkRows.length === 0 ? (
              <p className="text-sm text-muted">該当なし</p>
            ) : (
              reworkRows.map((row) => (
                <div
                  key={`${row.site}-${row.task}`}
                  className="rounded-lg border border-border p-3 text-sm"
                >
                  <p className="font-medium">{row.site}</p>
                  <p className="text-muted">{row.task}</p>
                  <Badge className="mt-2" variant="warning">
                    {row.state}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : null}

      {tag === "link_docs" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">書類連携</CardTitle>
            <p className="text-sm text-muted">
              報告で検知した不備は、安全書類・入場手続きの画面と突合する想定です。
            </p>
          </CardHeader>
          <CardContent>
            <Link
              href={withDemoQuery("/documents", industry, role)}
              className="text-sm font-medium text-primary underline"
            >
              書類管理へ
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <p className="text-xs text-muted">
        本番ではカメラアップロード・自動ファイル名・保存先ルール・サムネ一覧をここに集約する想定です。
        {!isConstruction ? (
          <>
            {" "}
            <Link
              href={withDemoQuery("/operations", industry, role)}
              className="text-primary underline"
            >
              {profile.labels.operations}
            </Link>
            へ戻るショートカット。
          </>
        ) : null}
      </p>
    </TemplatePageStack>
  );
}
