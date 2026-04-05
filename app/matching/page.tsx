import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
} from "@/lib/industry-selection";
import { FactoryMatchingSection } from "@/components/factory-matching-section";
import { MatchingSection } from "./matching-section";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MatchingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
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

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title={profile.labels.matching}
        description={matchDesc}
      />
      {industry === "staffing" && role === "client" ? (
        <>
          <Card className="border-primary/20 bg-primary/[0.04] shadow-sm">
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
        <MatchingSection industry={industry} />
      )}
    </TemplatePageStack>
  );
}
