import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileParentBackLink } from "@/components/navigation/mobile-parent-back-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";
import { withDemoQuery } from "@/lib/demo-query";
import { FactoryMatchingSection } from "@/components/factory-matching-section";
import { MatchingSection } from "@/app/matching/matching-section";
import { FeatureDemoExplainSection } from "@/components/feature-demos/feature-demo-explain-section";
import { FeatureDemoSiblingGrid } from "@/components/feature-demos/feature-demo-sibling-grid";
import { cn } from "@/lib/utils";
import { STORY_EMBED_PAGE_STACK_CLASS } from "@/lib/story-embed";

type Props = {
  industry: EnabledIndustryKey;
  role: DemoRole;
  featureDemo?: boolean;
  storyDemo?: boolean;
};

export function MatchingExperience({
  industry,
  role,
  featureDemo = false,
  storyDemo = false,
}: Props) {
  const profile = getIndustryProfile(industry);
  const hints = getIndustryPageHints(industry);
  const matchIntent =
    industry === "staffing" &&
    role === "client" &&
    hints.matching.clientPageIntentJa
      ? hints.matching.clientPageIntentJa
      : hints.matching.pageIntentJa;
  const matchDesc = matchIntent
    ? `${matchIntent} ${profile.matchingDescription}`
    : profile.matchingDescription;

  const backHref = featureDemo
    ? withDemoQuery("/feature-demos", industry, role)
    : withDemoQuery("/clients", industry, role);
  const backLabel = featureDemo
    ? "技術デモ一覧"
    : industry === "construction" || industry === "education"
      ? `${profile.labels.client}一覧`
      : "派遣先一覧";

  return (
    <TemplatePageStack
      className={cn(storyDemo && STORY_EMBED_PAGE_STACK_CLASS)}
    >
      {featureDemo ? (
        <MobileParentBackLink href={backHref} label={backLabel} />
      ) : null}
      <TemplatePageHeader
        title={profile.labels.matching}
        description={matchDesc}
      />
      {industry === "staffing" && role === "client" ? (
        <>
          <Card
            className={cn(
              "border-primary/20 bg-primary/[0.04] shadow-sm",
              storyDemo && "story-demo-tap-target ring-2 ring-primary/25"
            )}
          >
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold">
                条件と通知（デモ）
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4 pt-0 text-sm text-muted">
              希望条件を保存すると、登録ワーカーに合致があれば通知を受け取る想定です。閲覧範囲は支援機関のポリシーに従います（デモ・送信なし）。
            </CardContent>
          </Card>
          <FactoryMatchingSection />
        </>
      ) : (
        <MatchingSection industry={industry} storyDemo={storyDemo} />
      )}

      {featureDemo ? (
        <>
          <FeatureDemoExplainSection slug="matching-ai" />
          <FeatureDemoSiblingGrid currentSlug="matching-ai" />
        </>
      ) : null}
    </TemplatePageStack>
  );
}
