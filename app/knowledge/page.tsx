import { getIndustryFromSearchParams } from "@/lib/industry-selection";
import { KnowledgePageClient } from "./knowledge-page-client";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function KnowledgePage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  return <KnowledgePageClient industry={industry} />;
}
