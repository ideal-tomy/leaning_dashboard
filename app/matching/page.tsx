import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
} from "@/lib/industry-selection";
import { isStoryEmbedFromSearchParams } from "@/lib/story-embed";
import { MatchingExperience } from "@/components/matching-experience";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MatchingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  const storyDemo = isStoryEmbedFromSearchParams(resolvedSearchParams);

  return (
    <MatchingExperience industry={industry} role={role} storyDemo={storyDemo} />
  );
}
