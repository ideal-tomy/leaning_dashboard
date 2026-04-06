import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTagLinks } from "@/components/page-tag-links";
import {
  TemplatePageHeader,
  TemplateMobileFlowSection,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import {
  constructionEligibilityDemoRows,
  getConstructionSubcontractors,
} from "@/lib/demo-data.construction";
import { parsePageTag } from "@/lib/page-tag";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PersonnelHubPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);

  if (industry !== "construction") {
    redirect(withDemoQuery("/", industry, role));
  }

  const tag = parsePageTag(
    typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : null,
    ["workers", "subs", "eligibility", "documents"] as const,
    "workers"
  );

  const data = getIndustryDemoData(industry);
  const docAlerts = data.countDocumentAlerts();
  const subs = getConstructionSubcontractors();

  const tagHref = (t: string) => withDemoQuery(`/personnel-hub?tag=${t}`, industry, role);

  const headerByTag =
    tag === "subs"
      ? "登録済みの協力会社・下請を一覧し、グリーン登録と担当者を確認します。"
      : tag === "eligibility"
        ? "現場ルールに対する会社・職人の適合イメージをデモ表示します。"
        : tag === "documents"
          ? "安全書類・教育記録の期限と不備は専用画面で確認します。"
          : "作業員の一覧・フォローは候補者画面で操作します。";

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel="人員・関係企業"
          nextHref={withDemoQuery("/partners", industry, role)}
          nextLabel="取引先"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title="人員・下請・関係企業（ハブ）"
        description={`職人と協力会社を横断して確認する建設デモ専用の入口です。${headerByTag}`}
      />
      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="作業員"
        reasonTone="warning"
        description="個別の進捗・書類は作業員一覧から開きます。"
        actionHref={withDemoQuery("/candidates", industry, role)}
        actionLabel="作業員一覧へ"
      />
      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        tags={[
          { id: "workers", label: "作業員一覧", href: tagHref("workers") },
          { id: "subs", label: "関係企業（下請）", href: tagHref("subs") },
          { id: "eligibility", label: "入場・参加適合", href: tagHref("eligibility") },
          { id: "documents", label: "安全書類・教育", href: tagHref("documents") },
        ]}
      />

      {tag === "workers" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">作業員</CardTitle>
            <p className="text-sm text-muted">
              登録 {data.candidates.length} 名。要フォロー（書類・教育）: {docAlerts} 件（デモ集計）。
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={withDemoQuery("/candidates", industry, role)}>
                作業員一覧を開く
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={withDemoQuery("/candidates?focus=risk", industry, role)}>
                リスク・要フォロー
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {tag === "subs" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">関係企業（下請・協力）</CardTitle>
            <p className="text-sm text-muted">
              取引先マスタのうち、現場に投入する協力会社のサブセットです。
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {subs.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{p.tradeNameJa}</p>
                  <p className="text-xs text-muted">
                    {p.contact.contactPersonJa} · {p.contact.phone}
                  </p>
                  {p.notesJa ? <p className="mt-1 text-xs text-muted">{p.notesJa}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{p.tierLabelJa}</Badge>
                  <Badge variant={p.greenCardRegistered ? "success" : "danger"}>
                    {p.greenCardRegistered ? "グリーン登録" : "未登録"}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="secondary" asChild className="w-full sm:w-auto">
              <Link href={withDemoQuery("/partners", industry, role)}>取引先マスタへ</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {tag === "eligibility" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">入場・参加適合（デモ）</CardTitle>
            <p className="text-sm text-muted">
              現場ルール（三次可否・グリーン必須）と職人ステータスの例です。
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="px-2 py-2 font-medium">現場</th>
                  <th className="px-2 py-2 font-medium">対象</th>
                  <th className="px-2 py-2 font-medium">結果</th>
                  <th className="px-2 py-2 font-medium">理由</th>
                </tr>
              </thead>
              <tbody>
                {constructionEligibilityDemoRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="px-2 py-2">{row.siteName}</td>
                    <td className="px-2 py-2">{row.target}</td>
                    <td className="px-2 py-2">
                      <Badge
                        variant={
                          row.resultJa === "OK"
                            ? "success"
                            : row.resultJa === "NG"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {row.resultJa}
                      </Badge>
                    </td>
                    <td className="px-2 py-2 text-muted">{row.reasonJa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}

      {tag === "documents" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">安全書類・教育</CardTitle>
            <p className="text-sm text-muted">
              要対応件数: {docAlerts} 件。入場前後・期限は書類管理で確認します。
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={withDemoQuery("/documents?scope=pre-entry", industry, role)}>
                安全書類を開く
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={withDemoQuery("/documents?scope=deadlines", industry, role)}>
                期限一覧
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </TemplatePageStack>
  );
}
