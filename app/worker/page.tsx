import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoWorkers } from "@/lib/demo-workers";

const DEMO_WORKER_ID = "w-kasun";

export default function WorkerHomePage() {
  const me = demoWorkers.find((w) => w.id === DEMO_WORKER_ID) ?? demoWorkers[0];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-primary-alt">マイホーム</h1>
        <p className="mt-1 text-xs text-muted">
          ආයුබෝවන් — モバイル向けワーカービュー（デモ）
        </p>
        <p className="mt-2 text-sm text-muted">
          {me.displayNameEn} さん、本日の学習と期限をここから確認できます。
        </p>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">今日のステータス</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">日本語 {me.jpProgressPct}%</Badge>
            <Badge variant="outline">倫理 {me.ethicsDoneCount}/6</Badge>
            <Badge variant={me.stalled ? "danger" : "secondary"}>
              {me.stalled ? "フォロー推奨" : "順調"}
            </Badge>
          </div>
          <p className="text-xs text-muted">
            මෙම තිරය ඩෙමෝ පමණි — 本番では通知と連動します。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
