import { KnowledgePageClient } from "@/app/knowledge/knowledge-page-client";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function KnowledgeAiFeatureDemoPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);

  return (
    <KnowledgePageClient
      industry={industry}
      flowBack={{
        href: withDemoQuery("/feature-demos", industry, role),
        label: "技術デモ一覧",
      }}
      featureDemo
    />
  );
}
