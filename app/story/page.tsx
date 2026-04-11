import { StoryPlayer } from "@/components/story/story-player";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
} from "@/lib/industry-selection";
import { STAFFING_STORY_SLIDES } from "@/lib/story-slides.staffing";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StoryPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);

  return (
    <StoryPlayer
      industry={industry}
      role={role}
      slides={STAFFING_STORY_SLIDES}
    />
  );
}
