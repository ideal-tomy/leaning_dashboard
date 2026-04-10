import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTagLinks } from "@/components/page-tag-links";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { Button } from "@/components/ui/button";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { DEMO_FACTORY_CLIENT_ID } from "@/lib/demo-factory-client";
import { parsePageTag } from "@/lib/page-tag";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const tag = parsePageTag(
    typeof resolvedSearchParams?.tag === "string" ? resolvedSearchParams.tag : null,
    industry === "construction"
      ? (["list", "candidate", "rules", "staffing"] as const)
      : (["list", "candidate", "conditions"] as const),
    "list"
  );
  if (industry === "staffing" && role === "client") {
    redirect(
      withDemoQuery(`/clients/${DEMO_FACTORY_CLIENT_ID}`, industry, role)
    );
  }
  const profile = getIndustryProfile(industry);
  const demoData = getIndustryDemoData(industry);
  const clients = demoData.clients;
  const clientHints = getIndustryPageHints(industry).clients;
  const emphasis = clientHints.listCardEmphasis;
  const isConstruction = industry === "construction";
  const isEducation = industry === "education";
  const isLogistics = industry === "logistics";
  const isProfessional = industry === "professional";
  const isSales = industry === "sales";
  const clientHeaderDesc = isConstruction
    ? tag === "candidate"
      ? "不足が大きい現場から優先し、配員候補の比較に進みます。"
      : tag === "rules"
        ? "現場ごとの三次可否・グリーン必須・入場条件の要約を一覧します（デモ）。"
        : tag === "staffing"
          ? "欠員枠と配員最適化デモへの導線です。"
          : tag === "conditions"
            ? "入場条件と未充足枠を確認し、元請け・先方調整に進みます。"
            : "稼働現場の工期・必須資格・空き枠を確認し、次の手配先を決めます。"
    : isEducation
      ? tag === "candidate"
        ? "空席が多い講座から優先し、受講提案の比較に進みます。"
        : tag === "conditions"
          ? "対象者・日程と募集枠を確認し、案内調整に進みます。"
          : "講座のテーマ・空席・満足度を確認し、次に案内する講座を決めます。"
      : isLogistics
        ? tag === "candidate"
          ? "未配車枠が大きい拠点から優先し、配置候補の比較に進みます。"
          : tag === "conditions"
            ? "時間帯・積載条件と未充足枠を確認し、運行調整に進みます。"
            : "配送案件のエリア・時間帯・条件を確認し、次の配車先を決めます。"
        : isProfessional
          ? tag === "candidate"
            ? "未着手枠が多い顧問先から優先し、案件優先度の比較に進みます。"
            : tag === "conditions"
              ? "依頼の論点・必要証憑と枠を確認し、先方調整に進みます。"
              : "顧問先の重視点・並行案件を確認し、次に手を掛ける先を決めます。"
          : isSales
            ? tag === "candidate"
              ? "未対応枠が大きい案件から優先し、提案優先度の比較に進みます。"
              : tag === "conditions"
                ? "主要課題・競合・次アクションを確認し、提案資料とマッチングに進みます。"
                : "提案テーマ・受注確度・次回アクションを比較し、次の商談準備を決めます。"
            : tag === "candidate"
              ? "候補先を比較し、優先提案先を決めます。"
              : tag === "conditions"
                ? "受入条件と空き枠を確認し、先方調整に進みます。"
                : "派遣先の一覧を確認し、次に対応する先を決めます。";
  const sortedClients =
    tag === "candidate"
      ? [...clients].sort((a, b) => b.operations.openSlots - a.operations.openSlots)
      : clients;
  const openSlotBadge = (n: number) =>
    isLogistics
      ? `未配車 ${n}枠`
      : isProfessional
        ? `未着手 ${n}件`
        : isSales
          ? `フォロー ${n}枠`
          : `空き ${n}`;

  return (
    <TemplatePageStack>
      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        mobileScrollable
        stickyOnMobile
        mobileTopClassName="top-[7rem]"
        tags={[
          {
            id: "list",
            label: isConstruction
              ? "③-1 現場一覧"
              : isEducation
                ? "③-1 講座一覧"
                : isLogistics
                  ? "③-1 案件一覧"
                  : isProfessional
                    ? "③-1 顧問先一覧"
                    : isSales
                      ? "③-1 提案案件一覧"
                      : "③-1 派遣先一覧",
            href: withDemoQuery("/clients?tag=list", industry, role),
          },
          {
            id: "candidate",
            label: isConstruction
              ? "③-2 手配優先"
              : isEducation
                ? "③-2 募集優先"
                : isLogistics
                  ? "③-2 配車優先"
                  : isProfessional
                    ? "③-2 案件優先"
                    : isSales
                      ? "③-2 優先度順"
                      : "③-2 候補先",
            href: withDemoQuery("/clients?tag=candidate", industry, role),
          },
          ...(isConstruction
            ? [
                {
                  id: "rules" as const,
                  label: "③-3 参加条件",
                  href: withDemoQuery("/clients?tag=rules", industry, role),
                },
                {
                  id: "staffing" as const,
                  label: "③-4 配員",
                  href: withDemoQuery("/clients?tag=staffing", industry, role),
                },
              ]
            : []),
        ]}
      />
      <TemplatePageHeader
        title={profile.labels.client}
        description={`${clientHeaderDesc} ${clients.length}件のデモデータを表示しています。`}
      />
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={withDemoQuery("/matching", industry, role)}>
            {isConstruction
              ? "配員候補を確認する"
              : isEducation
                ? "受講提案を確認する"
                : isLogistics
                  ? "配置候補を確認する"
                  : isProfessional
                    ? "案件優先度を確認する"
                    : isSales
                      ? "提案優先度を確認する"
                      : "人材提案を確認する"}
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={withDemoQuery("/operations", industry, role)}>
            {isConstruction
              ? "現場実務・日報を見る"
              : isEducation
                ? "講座運営を見る"
                : isLogistics
                  ? "現場実務・遅延対応を見る"
                  : isProfessional
                    ? "申請実務・収支を見る"
                    : isSales
                      ? "営業実務・売上を見る"
                      : "クライアント要望を確認する"}
          </Link>
        </Button>
      </div>
      {isConstruction && tag === "rules" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">参加条件・ルール（デモ）</CardTitle>
            <p className="text-sm text-muted">
              各現場の三次請負可否・グリーン登録必須・入場メモです。取引先照合は取引先画面のタブからも確認できます。
            </p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="px-2 py-2 font-medium">現場</th>
                  <th className="px-2 py-2 font-medium">三次</th>
                  <th className="px-2 py-2 font-medium">GC必須</th>
                  <th className="px-2 py-2 font-medium">入場・条件メモ</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-border/60">
                    <td className="px-2 py-2 font-medium">{c.tradeNameJa}</td>
                    <td className="px-2 py-2">
                      {c.constructionListDemo?.allowTertiarySubcontractors ? "可" : "不可"}
                    </td>
                    <td className="px-2 py-2">
                      {c.constructionListDemo?.requireGreenCardOnSite ? "必須" : "—"}
                    </td>
                    <td className="px-2 py-2 text-muted">
                      {c.constructionListDemo?.entryConditionsJa ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <Button variant="secondary" asChild>
                <Link href={withDemoQuery("/partners?tag=site_rules", industry, role)}>
                  取引先との照合へ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isConstruction && tag === "staffing" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">配員・最適化</CardTitle>
            <p className="text-sm text-muted">
              未充足枠の合計は {demoData.totalOpenSlots()} 名分（デモ）。スキル・資格に基づく候補比較は配員最適化へ。
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={withDemoQuery("/matching", industry, role)}>
                配員最適化を開く
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={withDemoQuery("/clients?tag=candidate", industry, role)}>
                手配優先の現場一覧
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {tag === "list" || tag === "candidate" || (!isConstruction && tag === "conditions") ? (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sortedClients.map((c) => (
          <Link
            key={c.id}
            href={withDemoQuery(`/clients/${c.id}`, industry, role)}
            className="group block"
          >
            <Card className="h-full min-h-[120px] transition-all group-hover:border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start gap-2 text-base">
                  <Building2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="leading-snug">{c.tradeNameJa}</span>
                </CardTitle>
                {emphasis !== "region" ? (
                  <p className="text-xs text-muted">
                    {c.industryJa} / {c.prefectureJa}
                    {c.cityJa ? ` ${c.cityJa}` : ""}
                  </p>
                ) : null}
              </CardHeader>
              {emphasis === "region" ? (
                <div className="px-6 pb-2">
                  <p className="text-sm font-medium text-foreground">
                    {c.prefectureJa}
                    {c.cityJa ? ` ${c.cityJa}` : ""}
                  </p>
                  <p className="text-xs text-muted">{c.industryJa}</p>
                </div>
              ) : null}
              <CardContent className="space-y-3 text-sm">
                {isSales && c.salesListDemo ? (
                  <>
                    <p className="line-clamp-3 text-sm font-medium leading-snug text-foreground">
                      {c.salesListDemo.proposalThemeJa}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="max-w-full whitespace-normal text-left">
                        {c.salesListDemo.winProbabilityJa}
                      </Badge>
                      {c.salesListDemo.dealValueManYenDemo != null ? (
                        <Badge variant="outline">
                          概算 {c.salesListDemo.dealValueManYenDemo}万円
                        </Badge>
                      ) : null}
                    </div>
                    {c.salesListDemo.competitorJa ? (
                      <p className="line-clamp-2 text-xs text-muted">
                        競合: {c.salesListDemo.competitorJa}
                      </p>
                    ) : null}
                    <p className="text-xs font-medium text-foreground">
                      次回アクション: {c.salesListDemo.nextActionJa}
                    </p>
                  </>
                ) : emphasis === "openSlots" ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{openSlotBadge(c.operations.openSlots)}</Badge>
                      <Badge variant="secondary">
                        {isEducation ? "受講" : isProfessional ? "担当" : isSales ? "並行" : "稼働"}{" "}
                        {c.operations.currentAssignees}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted">{c.cultureJa}</p>
                  </>
                ) : emphasis === "culture" ? (
                  <>
                    <p className="line-clamp-3 text-sm leading-relaxed text-foreground">
                      {c.cultureJa}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{openSlotBadge(c.operations.openSlots)}</Badge>
                      <Badge variant="secondary">
                        {isEducation ? "受講" : isProfessional ? "担当" : isSales ? "並行" : "稼働"}{" "}
                        {c.operations.currentAssignees}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-2 text-sm text-muted">{c.cultureJa}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{openSlotBadge(c.operations.openSlots)}</Badge>
                      <Badge variant="secondary">
                        {isEducation ? "受講" : isProfessional ? "担当" : isSales ? "並行" : "稼働"}{" "}
                        {c.operations.currentAssignees}
                      </Badge>
                    </div>
                  </>
                )}
                {isConstruction && c.constructionListDemo ? (
                  <div className="space-y-1 rounded-md border border-border/60 bg-surface/40 px-2 py-2 text-xs">
                    <p>
                      <span className="font-medium text-foreground">工期</span>{" "}
                      <span className="text-muted">{c.constructionListDemo.scheduleJa}</span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">必須資格</span>{" "}
                      <span className="text-muted">{c.constructionListDemo.requiredCertsJa}</span>
                    </p>
                    {c.constructionListDemo.entryConditionsJa ? (
                      <p>
                        <span className="font-medium text-foreground">入場</span>{" "}
                        <span className="text-muted">
                          {c.constructionListDemo.entryConditionsJa}
                        </span>
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {isLogistics && c.logisticsListDemo ? (
                  <div className="space-y-1 rounded-md border border-border/60 bg-surface/40 px-2 py-2 text-xs">
                    <p>
                      <span className="font-medium text-foreground">時間帯</span>{" "}
                      <span className="text-muted">{c.logisticsListDemo.deliveryWindowJa}</span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">積載・条件</span>{" "}
                      <span className="text-muted">{c.logisticsListDemo.loadConditionsJa}</span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">優先度</span>{" "}
                      <span className="text-muted">{c.logisticsListDemo.priorityJa}</span>
                    </p>
                  </div>
                ) : null}
                {tag === "conditions" ? (
                  <p className="text-xs text-muted">
                    {isConstruction && c.constructionListDemo?.entryConditionsJa
                      ? `入場条件: ${c.constructionListDemo.entryConditionsJa}`
                      : isLogistics && c.logisticsListDemo?.loadConditionsJa
                        ? `積載・条件: ${c.logisticsListDemo.loadConditionsJa}`
                        : isProfessional
                          ? `論点・証憑: ${c.aiTargetProfileJa || c.cultureJa}`
                          : isSales
                            ? `主要課題: ${c.currentChallengesJa ?? c.cultureJa}`
                            : `受入条件メモ: ${c.cultureJa}`}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      ) : null}
    </TemplatePageStack>
  );
}
