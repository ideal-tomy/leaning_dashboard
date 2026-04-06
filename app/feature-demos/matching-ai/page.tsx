import { MatchingExperience } from "@/components/matching-experience";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MatchingAiFeatureDemoPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);

  return <MatchingExperience industry={industry} role={role} featureDemo />;
}
