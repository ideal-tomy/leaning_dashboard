import Link from "next/link";
import { GuideStartButton } from "@/components/guide/guide-start-button";
import {
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { Card, CardContent } from "@/components/ui/card";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";
import { STAFFING_GUIDE_TOTAL_SECONDS } from "@/lib/guide-steps.staffing";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function GuidePage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);

  return (
    <TemplatePageStack>
      <TemplatePageHeader
        title="はじめてガイド"
        description="画面を自動で案内します。むずかしい操作はありません。『次へ』だけでも進められます。"
      />

      <Card className="border-border/80 bg-surface/40">
        <CardContent className="space-y-3 pt-5">
          <p className="text-base font-semibold text-foreground">
            所要時間: 約 {STAFFING_GUIDE_TOTAL_SECONDS} 秒（目安）
          </p>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            見る順番はあらかじめ決まっています。途中で止めても大丈夫です。
            もう一度見たいときは「最初から」を押してください。
          </p>
          <p className="text-sm text-muted sm:text-base">
            すぐに一覧へ戻りたい場合は{" "}
            <Link
              href={withDemoQuery("/", industry, role)}
              className="font-semibold text-primary underline underline-offset-2"
            >
              こちら
            </Link>{" "}
            を押してください。
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <GuideStartButton industry={industry} role={role} />
        <p className="text-sm text-muted">
          「はじめる」を押すと、ホーム画面から順に案内が始まります。
        </p>
      </div>
    </TemplatePageStack>
  );
}
