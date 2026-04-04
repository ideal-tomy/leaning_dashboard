import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoWorkers } from "@/lib/demo-workers";

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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-primary-alt">進捗</h1>
        <p className="mt-1 text-xs text-muted">
          ප්‍රගතිය — 工場向けダッシュの数値と同じデモデータです。
        </p>
      </div>
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
    </div>
  );
}
