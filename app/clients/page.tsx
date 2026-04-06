import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
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
    ["list", "candidate", "conditions"] as const,
    "list"
  );
  if (industry === "staffing" && role === "client") {
    redirect(
      withDemoQuery(`/clients/${DEMO_FACTORY_CLIENT_ID}`, industry, role)
    );
  }
  const profile = getIndustryProfile(industry);
  const clients = getIndustryDemoData(industry).clients;
  const clientHints = getIndustryPageHints(industry).clients;
  const emphasis = clientHints.listCardEmphasis;
  const clientHeaderDesc =
    tag === "candidate"
      ? "候補先を比較し、優先提案先を決めます。"
      : tag === "conditions"
        ? "受入条件と空き枠を確認し、先方調整に進みます。"
        : "派遣先の一覧を確認し、次に対応する先を決めます。";
  const sortedClients =
    tag === "candidate"
      ? [...clients].sort((a, b) => b.operations.openSlots - a.operations.openSlots)
      : clients;

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel={profile.labels.client}
          nextHref={withDemoQuery("/matching", industry, role)}
          nextLabel="次へ"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title={profile.labels.client}
        description={`${clientHeaderDesc} ${clients.length}件のデモデータを表示しています。`}
      />
      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="提案準備"
        reasonTone="ai"
        description="候補先を見たら、マッチングで提案候補の比較に進みます。"
        actionHref={withDemoQuery("/matching", industry, role)}
        actionLabel="マッチングへ"
      />
      <PageTagLinks
        label="表示タグ"
        currentId={tag}
        tags={[
          {
            id: "list",
            label: "③-1 派遣先一覧",
            href: withDemoQuery("/clients?tag=list", industry, role),
          },
          {
            id: "candidate",
            label: "③-2 候補先",
            href: withDemoQuery("/clients?tag=candidate", industry, role),
          },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={withDemoQuery("/matching", industry, role)}>
            人材提案を確認する
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href={withDemoQuery("/operations", industry, role)}>
            クライアント要望を確認する
          </Link>
        </Button>
      </div>
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
                {emphasis === "openSlots" ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">空き {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        稼働 {c.operations.currentAssignees}
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
                      <Badge variant="outline">空き {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        稼働 {c.operations.currentAssignees}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-2 text-sm text-muted">{c.cultureJa}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">空き {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        稼働 {c.operations.currentAssignees}
                      </Badge>
                    </div>
                  </>
                )}
                {tag === "conditions" ? (
                  <p className="text-xs text-muted">
                    受入条件メモ: {c.cultureJa}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </TemplatePageStack>
  );
}
