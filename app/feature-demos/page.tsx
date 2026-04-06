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
  FEATURE_DEMOS,
  filterFeatureDemosForRole,
} from "@/lib/feature-demos-catalog";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FeatureDemosHubPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const items = filterFeatureDemosForRole(FEATURE_DEMOS, industry, role);

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/", industry, role)}
          backLabel="ダッシュボード"
          pageLabel="技術・DXデモ"
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader
        title="技術・DXデモ"
        description="OCR・PDF・AI チャット・翻訳・マッチングなど、プロダクトの技術的な見せ場を一覧から体験できます。運用の書類管理画面とは役割を分けています。"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={withDemoQuery(item.routePath, industry, role)}
            className="block transition-colors hover:text-primary"
          >
            <Card className="h-full border-border/80 transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  {item.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted">
                {item.summary}
                <p className="mt-3 text-xs font-medium text-primary">体験する →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </TemplatePageStack>
  );
}
