import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureDemoExplainSection } from "@/components/feature-demos/feature-demo-explain-section";
import { FeatureDemoSiblingGrid } from "@/components/feature-demos/feature-demo-sibling-grid";
import { PassportOcrDemo } from "@/components/feature-demos/passport-ocr-demo";
import {
  TemplateMobileFlowSection,
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import {
  getIndustryFromSearchParams,
  getRoleFromSearchParams,
  withDemoQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PassportOcrFeatureDemoPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const role = getRoleFromSearchParams(resolvedSearchParams);
  if (industry === "staffing" && role === "client") {
    redirect(withDemoQuery("/feature-demos", industry, role));
  }
  const docHints = getIndustryPageHints(industry).documents;

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={withDemoQuery("/feature-demos", industry, role)}
          backLabel="技術デモ一覧"
          pageLabel="パスポート OCR"
        />
      </TemplateMobileFlowSection>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="ai" className="shrink-0">
            技術デモ
          </Badge>
        </div>
        <TemplatePageHeader
          title="パスポート OCR（デモ）"
          description="旅券画像から氏名・番号・有効期限を読み取る想定のデモです。結果は静的サンプルです。"
        />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-muted">
            ボタンを押すと処理演出のあと、抽出結果をサイドパネルに表示します。
          </p>
          <PassportOcrDemo docHints={docHints} />
          <p className="text-xs text-muted">
            運用の書類一覧・期限管理は{" "}
            <Link
              href={withDemoQuery("/documents", industry, role)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              書類管理
            </Link>
            から。
          </p>
        </CardContent>
      </Card>

      <FeatureDemoExplainSection slug="passport-ocr" />
      <FeatureDemoSiblingGrid currentSlug="passport-ocr" />
    </TemplatePageStack>
  );
}
