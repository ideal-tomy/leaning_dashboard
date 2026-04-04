import Link from "next/link";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ClientsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const clients = getIndustryDemoData(industry).clients;
  const emphasis = getIndustryPageHints(industry).clients.listCardEmphasis;

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title={profile.labels.client}
        description={`${clients.length} 件のデモデータ。一覧から詳細・AI 候補へ進めます。`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {clients.map((c) => (
          <Link
            key={c.id}
            href={withIndustryQuery(`/clients/${c.id}`, industry)}
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
                      <Badge variant="warning">空き {c.operations.openSlots}</Badge>
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
                      <Badge variant="warning">空き {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        稼働 {c.operations.currentAssignees}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="line-clamp-2 text-sm text-muted">{c.cultureJa}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="warning">空き {c.operations.openSlots}</Badge>
                      <Badge variant="secondary">
                        稼働 {c.operations.currentAssignees}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </TemplatePageStack>
  );
}
