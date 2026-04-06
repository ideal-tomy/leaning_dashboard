import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateMobileFlowSection, TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";

const modules = [
  { titleJa: "職場のあいさつ", titleSi: "කාර්ය ස්ථානයේ ආචාර", done: true },
  { titleJa: "安全衛生（入門）", titleSi: "ආරක්ෂාව සහ සනීපාරක්ෂාව", done: true },
  { titleJa: "日本語 N4 リスニング", titleSi: "ජපන් භාෂාව N4", done: false },
  { titleJa: "コンプライアンス第3章", titleSi: "නීතිමය අනුකූලතාව", done: false },
] as const;

export default function WorkerLearnPage() {
  return (
    <TemplatePageStack className="space-y-4">
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref="/worker"
          backLabel="マイホーム"
          pageLabel="学習モジュール"
          nextHref="/worker/progress"
          nextLabel="次へ"
        />
      </TemplateMobileFlowSection>
      <div>
        <h1 className="text-xl font-semibold text-primary-alt">学習モジュール</h1>
        <p className="mt-1 text-xs text-muted">
          ඉගෙනුම් මොඩියුල — デモ用の並びです。
        </p>
      </div>
      <NextActionCard
        className="md:hidden"
        title="次のアクション"
        reasonTag="進捗確認"
        reasonTone="warning"
        description="学習後は進捗画面で到達率を確認すると次の学習が決めやすくなります。"
        actionHref="/worker/progress"
        actionLabel="進捗へ"
      />
      <ul className="space-y-2">
        {modules.map((m) => (
          <li key={m.titleJa}>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium leading-snug">
                  {m.titleJa}
                </CardTitle>
                <Badge variant={m.done ? "secondary" : "outline"}>
                  {m.done ? "修了" : "未着手"}
                </Badge>
              </CardHeader>
              <CardContent className="text-xs text-muted">{m.titleSi}</CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </TemplatePageStack>
  );
}
