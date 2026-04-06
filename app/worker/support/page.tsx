import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TemplateMobileFlowSection, TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";

export default function WorkerSupportPage() {
  return (
    <TemplatePageStack className="space-y-4">
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref="/worker/alerts"
          backLabel="期限"
          pageLabel="サポート"
          nextHref="/worker"
          nextLabel="次へ"
        />
      </TemplateMobileFlowSection>
      <div>
        <h1 className="text-xl font-semibold text-primary-alt">サポート</h1>
        <p className="mt-1 text-xs text-muted">
          සහාය — 登録支援機関への連絡イメージ（デモ・送信なし）。
        </p>
      </div>
      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="ホーム復帰"
        reasonTone="secondary"
        description="必要な確認が終わったらホームに戻って今日の状態を再確認します。"
        actionHref="/worker"
        actionLabel="マイホームへ"
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">よくある質問</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>ビザ更新の書類は「書類」タブからPDFをダウンロードできます（デモ演出）。</p>
          <p className="text-xs">
            ඔබේ ප්‍රශ්නයට පිළිතුරු මෙතනින් — シンハラ語のプレースホルダです。
          </p>
          <Button type="button" variant="secondary" className="w-full" disabled>
            チャットで問い合わせ（デモ）
          </Button>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}
