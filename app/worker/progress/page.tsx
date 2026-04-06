import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoWorkers } from "@/lib/demo-workers";
import { TemplateMobileFlowSection, TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-[width]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

const DEMO_WORKER_ID = "w-kasun";

export default function WorkerProgressPage() {
  const me = demoWorkers.find((w) => w.id === DEMO_WORKER_ID) ?? demoWorkers[0];
  const ethicsPct = Math.min(100, (me.ethicsDoneCount / 6) * 100);

  return (
    <TemplatePageStack className="space-y-4">
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref="/worker/learn"
          backLabel="学習"
          pageLabel="進捗"
          nextHref="/worker/alerts"
          nextLabel="次へ"
        />
      </TemplateMobileFlowSection>
      <div>
        <h1 className="text-xl font-semibold text-primary-alt">進捗</h1>
        <p className="mt-1 text-xs text-muted">
          ප්‍රගතිය — 工場向けダッシュの数値と同じデモデータです。
        </p>
      </div>
      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="期限確認"
        reasonTone="warning"
        description="進捗確認後は期限アラートを確認し、優先順位を決めます。"
        actionHref="/worker/alerts"
        actionLabel="お知らせ・期限へ"
      />
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">日本語到達</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Bar value={me.jpProgressPct} />
          <p className="text-sm tabular-nums text-muted">{me.jpProgressPct}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">倫理モジュール</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Bar value={ethicsPct} />
          <p className="text-sm text-muted">
            {me.ethicsDoneCount} / 6 完了（デモ）
          </p>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}
