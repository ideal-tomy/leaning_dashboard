import Link from "next/link";
import { redirect } from "next/navigation";
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
import {
  clients,
  constructionPartners,
  evaluatePartnerForSite,
} from "@/lib/demo-data.construction";
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

const REF_MS = new Date("2026-04-03").getTime();
const THIRTY_DAYS = 30 * 86400 * 1000;

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - REF_MS) / (86400 * 1000));
}

export default async function PartnersPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);

  if (industry !== "construction") {
    redirect(withDemoQuery("/", industry, role));
  }

  const tag = parsePageTag(
    typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : null,
    ["directory", "compliance", "site_rules"] as const,
    "directory"
  );

  const siteParam =
    typeof resolvedSearchParams?.site === "string" ? resolvedSearchParams.site : null;
  const selectedSiteId =
    siteParam && clients.some((c) => c.id === siteParam) ? siteParam : clients[0]!.id;
  const selectedSite = clients.find((c) => c.id === selectedSiteId)!;

  const profile = getIndustryProfile(industry);
  const tagHref = (t: string) =>
    withDemoQuery(
      `/partners?tag=${t}${t === "site_rules" ? `&site=${selectedSiteId}` : ""}`,
      industry,
      role
    );

  const complianceSorted = [...constructionPartners].sort((a, b) => {
    const score = (p: (typeof constructionPartners)[0]) => {
      if (!p.greenCardRegistered) return 0;
      if (p.greenCardValidUntilIso) {
        const d = daysUntil(p.greenCardValidUntilIso);
        if (d >= 0 && d <= 30) return 1;
      }
      return 2;
    };
    return score(a) - score(b);
  });

  const headerByTag =
    tag === "compliance"
      ? "未登録・期限接近を優先して一覧します（デモ）。"
      : tag === "site_rules"
        ? "選択した現場のルールに対する取引先の適合を表示します（デモ）。"
        : "元請から協力会社まで、取引先マスタのイメージです。";

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel="取引先"
          nextHref={withDemoQuery("/clients", industry, role)}
          nextLabel={profile.labels.client}
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title="取引先（建設デモ）"
        description={`${headerByTag} 全 ${constructionPartners.length} 社のデモデータです。`}
      />
      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="現場"
        reasonTone="ai"
        description="現場の参加条件とあわせて、欠員・配員を確認します。"
        actionHref={withDemoQuery("/clients", industry, role)}
        actionLabel={`${profile.labels.client}へ`}
      />
      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        tags={[
          { id: "directory", label: "取引先一覧", href: tagHref("directory") },
          { id: "compliance", label: "登録・適格性", href: tagHref("compliance") },
          { id: "site_rules", label: "現場条件との照合", href: tagHref("site_rules") },
        ]}
      />

      {tag === "directory" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {constructionPartners.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{p.tradeNameJa}</CardTitle>
                <p className="text-xs text-muted">
                  {p.contact.contactPersonJa} · {p.contact.phone}
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="outline">{p.tierLabelJa}</Badge>
                <Badge variant={p.isSubcontractor ? "secondary" : "default"}>
                  {p.isSubcontractor ? "協力・下請" : "元請・発注"}
                </Badge>
                <Badge variant={p.greenCardRegistered ? "success" : "danger"}>
                  {p.greenCardRegistered ? "グリーン登録" : "未登録"}
                </Badge>
                {p.notesJa ? (
                  <p className="w-full text-xs text-muted">{p.notesJa}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {tag === "compliance" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">登録・適格性</CardTitle>
            <p className="text-sm text-muted">
              グリーン未登録 → 期限30日以内 → その他の順（デモソート）。
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {complianceSorted.map((p) => {
              let note = "";
              if (!p.greenCardRegistered) note = "グリーン未登録";
              else if (p.greenCardValidUntilIso) {
                const d = daysUntil(p.greenCardValidUntilIso);
                if (d >= 0 && d <= 30) note = `有効期限まであと${d}日`;
                else note = `有効期限 ${p.greenCardValidUntilIso}`;
              }
              return (
                <div
                  key={p.id}
                  className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center"
                >
                  <span className="font-medium">{p.tradeNameJa}</span>
                  <span className="text-xs text-muted">{note}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

      {tag === "site_rules" ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">照合する現場</CardTitle>
              <p className="text-sm text-muted">
                ルール: 三次
                {selectedSite.constructionListDemo?.allowTertiarySubcontractors
                  ? "可"
                  : "不可"}
                ／ グリーン必須
                {selectedSite.constructionListDemo?.requireGreenCardOnSite ? "あり" : "なし"}
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {clients.map((c) => (
                <Link
                  key={c.id}
                  href={withDemoQuery(`/partners?tag=site_rules&site=${c.id}`, industry, role)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    c.id === selectedSiteId
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background"
                  }`}
                >
                  {c.tradeNameJa}
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">取引先 × 現場ルール</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[360px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="px-2 py-2 font-medium">取引先</th>
                    <th className="px-2 py-2 font-medium">階層</th>
                    <th className="px-2 py-2 font-medium">適合</th>
                    <th className="px-2 py-2 font-medium">詳細</th>
                  </tr>
                </thead>
                <tbody>
                  {constructionPartners.map((p) => {
                    const ev = evaluatePartnerForSite(p, selectedSite);
                    return (
                      <tr key={p.id} className="border-b border-border/60">
                        <td className="px-2 py-2 font-medium">{p.tradeNameJa}</td>
                        <td className="px-2 py-2">{p.tierLabelJa}</td>
                        <td className="px-2 py-2">
                          <Badge
                            variant={
                              ev.fit === "ok"
                                ? "success"
                                : ev.fit === "ng"
                                  ? "danger"
                                  : "warning"
                            }
                          >
                            {ev.labelJa}
                          </Badge>
                        </td>
                        <td className="px-2 py-2 text-xs text-muted">{ev.detailJa}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </TemplatePageStack>
  );
}
