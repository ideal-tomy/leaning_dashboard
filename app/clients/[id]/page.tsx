import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { DEMO_FACTORY_CLIENT_ID } from "@/lib/demo-factory-client";
import { getFactoryPlacementsForClient } from "@/lib/demo-factory-placements";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints, quickLinkHref } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";
import { LearningComplianceBadge } from "@/components/learning-compliance-badge";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const data = getIndustryDemoData(industry);
  const client = data.getClientById(id);
  if (!client) notFound();

  const matches = data.getMatchesForClient(client.id);
  const quickLinks = getIndustryPageHints(industry).clientDetail.quickLinks;
  const isFactoryClientDetail =
    industry === "staffing" &&
    role === "client" &&
    id === DEMO_FACTORY_CLIENT_ID;
  const placements = isFactoryClientDetail
    ? getFactoryPlacementsForClient(client.id)
    : undefined;
  const quickLinksFiltered = isFactoryClientDetail
    ? quickLinks.filter((q) => q.path !== "documents")
    : quickLinks;

  const locationLine = `${client.industryJa} · ${client.prefectureJa}${
    client.cityJa ? ` ${client.cityJa}` : ""
  }`;

  return (
    <TemplatePageStack>
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 self-start">
        <Link
          href={withDemoQuery(
            isFactoryClientDetail ? "/" : "/clients",
            industry,
            role
          )}
        >
          <ArrowLeft className="size-4" />
          {isFactoryClientDetail ? "ダッシュボード" : `${profile.labels.client}一覧`}
        </Link>
      </Button>

      <TemplatePageHeader
        title={client.legalNameJa}
        description={
          isFactoryClientDetail
            ? `${locationLine} — 配置・契約サマリーと現場メモ（デモ）`
            : locationLine
        }
      />

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface/50 p-3">
        <span className="w-full text-xs font-medium text-muted">次の操作</span>
        {quickLinksFiltered.map((q) => (
          <Button key={q.path} variant="secondary" size="sm" asChild>
            <Link href={quickLinkHref(q.path, industry, role)}>{q.label}</Link>
          </Button>
        ))}
      </div>

      {isFactoryClientDetail && placements ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">契約・稼働サマリー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted">{client.recruitmentJa}</p>
                <Separator />
                <dl className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-xs text-muted">稼働中</dt>
                    <dd className="font-semibold">
                      {client.operations.currentAssignees} 名
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">欠員枠</dt>
                    <dd className="font-semibold text-warning">
                      {client.operations.openSlots} 名
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">定着率</dt>
                    <dd>{client.operations.retentionRatePct}%</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">満足度</dt>
                    <dd>{client.operations.satisfactionScore} / 5</dd>
                  </div>
                </dl>
                {client.ltMonthlyProfitPerHeadJpy != null ? (
                  <p className="text-xs text-muted">
                    参考: 1 人あたり月{" "}
                    {client.ltMonthlyProfitPerHeadJpy.toLocaleString()} 円（デモ）
                  </p>
                ) : null}
              </CardContent>
            </Card>

            {client.learningRequirementsDemo ? (
              <Card className="border-emerald-600/20 bg-emerald-600/[0.04]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    現場の採用・認定要件（デモ）
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted">日本語（対面）: </span>
                    <span className="font-semibold">
                      {client.learningRequirementsDemo.minCertifiedJlpt} 以上
                    </span>
                  </p>
                  <p>
                    <span className="text-muted">職場倫理（対面）: </span>
                    <span className="font-semibold">
                      {client.learningRequirementsDemo.ethicsPassRequired
                        ? "対面確認の合格が必須"
                        : "必須なし（デモ）"}
                    </span>
                  </p>
                  {client.learningRequirementsDemo.standardLabelJa ? (
                    <p className="text-xs text-muted">
                      {client.learningRequirementsDemo.standardLabelJa}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">現場の採用要件</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted">
                  要件データなし（デモ）
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                部署別の配置とOJT・現場メモ（デモ）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xs text-muted">
                ライン長・リーダー向けに、配属スタッフごとの注意点を共有するイメージです。詳細は候補者プロフィールから確認できます。
              </p>
              {placements.map((dept) => (
                <div key={dept.deptJa} className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    {dept.deptJa}
                  </h3>
                  <ul className="space-y-3">
                    {dept.workers.map((w) => {
                      const cand = data.getCandidateById(w.candidateId);
                      return (
                        <li
                          key={`${dept.deptJa}-${w.candidateId}`}
                          className="rounded-lg border border-border bg-surface/50 p-3 text-sm"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            {cand ? (
                              <Link
                                href={withDemoQuery(
                                  `/candidates/${cand.id}`,
                                  industry,
                                  role
                                )}
                                className="font-semibold text-primary hover:underline"
                              >
                                {cand.displayName}
                              </Link>
                            ) : (
                              <span className="font-medium text-muted">
                                （データ未紐付け）
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {w.roleJa}
                            </Badge>
                          </div>
                          {cand ? (
                            <p className="mt-1 text-xs text-muted">
                              日本語 {cand.jlpt}
                              {cand.jlptNote ? ` · ${cand.jlptNote}` : ""}
                            </p>
                          ) : null}
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted">
                            {w.ojtNotesJa.map((note) => (
                              <li key={note}>{note}</li>
                            ))}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-5 text-primary" />
                追加で検討したい候補（デモ）
              </CardTitle>
              <Badge variant="ai">マッチングへ</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted">
              <p>
                新規の採用検討は「マッチング」から登録支援機関別の候補を閲覧できます。
              </p>
              <Button variant="secondary" size="sm" asChild>
                <Link href={withDemoQuery("/matching", industry, role)}>
                  人材を探す（マッチング）へ
                </Link>
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">社風・環境</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>{client.cultureJa}</p>
                <p className="text-muted">{client.workplaceEnvironmentJa}</p>
                {client.currentChallengesJa && (
                  <p className="text-warning text-xs">{client.currentChallengesJa}</p>
                )}
                {client.representative && (
                  <p className="text-xs text-muted">
                    代表: {client.representative.nameJa}{" "}
                    {client.representative.age ? `（${client.representative.age}歳）` : ""}{" "}
                    — {client.representative.noteJa}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">募集・稼働</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{client.recruitmentJa}</p>
                <Separator />
                <dl className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-muted text-xs">稼働中</dt>
                    <dd className="font-semibold">
                      {client.operations.currentAssignees} 名
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted text-xs">欠員枠</dt>
                    <dd className="font-semibold text-warning">
                      {client.operations.openSlots} 名
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted text-xs">定着率</dt>
                    <dd>{client.operations.retentionRatePct}%</dd>
                  </div>
                  <div>
                    <dt className="text-muted text-xs">満足度</dt>
                    <dd>{client.operations.satisfactionScore} / 5</dd>
                  </div>
                </dl>
                {client.ltMonthlyProfitPerHeadJpy != null && (
                  <p className="text-xs text-muted">
                    LTV 目安: 1 人あたり月{" "}
                    {client.ltMonthlyProfitPerHeadJpy.toLocaleString()} 円（デモ値）
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {client.learningRequirementsDemo ? (
            <Card className="border-emerald-600/20 bg-emerald-600/[0.04]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">教育・認定要件（対面ベース・デモ）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted">日本語（対面認定）: </span>
                  <span className="font-semibold">
                    {client.learningRequirementsDemo.minCertifiedJlpt} 以上
                  </span>
                </p>
                <p>
                  <span className="text-muted">職場倫理（対面）: </span>
                  <span className="font-semibold">
                    {client.learningRequirementsDemo.ethicsPassRequired
                      ? "対面確認の合格が必須"
                      : "必須なし（デモ）"}
                  </span>
                </p>
                {client.learningRequirementsDemo.standardLabelJa ? (
                  <p className="text-xs text-muted">
                    基準メモ: {client.learningRequirementsDemo.standardLabelJa}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-5 text-primary" />
                AI おすすめ候補（デモ）
              </CardTitle>
              <Badge variant="ai">タグ照合</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted">
                AI推奨ターゲット: {client.aiTargetProfileJa}
              </p>
              <ul className="space-y-4">
                {matches.map(({ candidate, pct, reason, learningCompliance }, i) => (
                  <li
                    key={candidate.id}
                    className="rounded-lg border border-border bg-surface/50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={withDemoQuery(`/candidates/${candidate.id}`, industry, role)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {i + 1}. {candidate.displayName}
                      </Link>
                      <span className="flex flex-wrap items-center gap-2">
                        {learningCompliance ? (
                          <LearningComplianceBadge
                            status={learningCompliance.status}
                            labelJa={learningCompliance.labelJa}
                          />
                        ) : null}
                        <span className="text-lg font-bold tabular-nums text-primary">
                          {pct}%
                        </span>
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{reason}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </TemplatePageStack>
  );
}
