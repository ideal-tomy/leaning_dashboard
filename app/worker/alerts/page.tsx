import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDemoAlerts } from "@/lib/demo-workers";
import { TemplateMobileFlowSection, TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";

const DEMO_WORKER_ID = "w-kasun";

export default function WorkerAlertsPage() {
  const mine = getDemoAlerts().filter((a) => a.workerId === DEMO_WORKER_ID);

  return (
    <TemplatePageStack className="space-y-4">
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref="/worker/progress"
          backLabel="進捗"
          pageLabel="お知らせ・期限"
        />
      </TemplateMobileFlowSection>
      <div>
        <h1 className="text-xl font-semibold text-primary-alt">お知らせ・期限</h1>
        <p className="mt-1 text-xs text-muted">
          දැනුම්දීම් — あなたに関係するアラートのみ表示（デモ）。
        </p>
      </div>
      {mine.length === 0 ? (
        <p className="text-sm text-muted">現在表示するアラートはありません。</p>
      ) : (
        <ul className="space-y-2">
          {mine.map((a) => (
            <li key={a.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{a.typeJa}</CardTitle>
                  <Badge variant="outline" className="tabular-nums">
                    残り{a.daysLeft}日
                  </Badge>
                </CardHeader>
                <CardContent className="text-xs text-muted">
                  期限 {a.dueDate}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </TemplatePageStack>
  );
}
