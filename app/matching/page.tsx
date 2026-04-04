import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { getIndustryFromSearchParams } from "@/lib/industry-selection";
import { MatchingSection } from "./matching-section";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MatchingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const matchIntent = getIndustryPageHints(industry).matching.pageIntentJa;
  const matchDesc = matchIntent
    ? `${matchIntent} ${profile.matchingDescription}`
    : profile.matchingDescription;

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title={profile.labels.matching}
        description={matchDesc}
      />
      <MatchingSection industry={industry} />
    </TemplatePageStack>
  );
}
