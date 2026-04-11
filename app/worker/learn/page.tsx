import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileParentBackLink } from "@/components/navigation/mobile-parent-back-link";
import { StoryBeatMark } from "@/components/story-demo/sales-demo-beat-context";
import {
  isStoryEmbedFromSearchParams,
  STORY_EMBED_PAGE_STACK_CLASS,
} from "@/lib/story-embed";
import { cn } from "@/lib/utils";

const modules = [
  { titleJa: "職場のあいさつ", titleSi: "කාර්ය ස්ථානයේ ආචාර", done: true },
  { titleJa: "安全衛生（入門）", titleSi: "ආරක්ෂාව සහ සනීපාරක්ෂාව", done: true },
  { titleJa: "日本語 N4 リスニング", titleSi: "ජපන් භාෂාව N4", done: false },
  { titleJa: "コンプライアンス第3章", titleSi: "නීතිමය අනුකූලතාව", done: false },
] as const;

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WorkerLearnPage({ searchParams }: PageProps) {
  const resolved = searchParams ? await searchParams : undefined;
  const storyDemo = isStoryEmbedFromSearchParams(resolved);

  return (
    <TemplatePageStack
      className={cn("space-y-4", storyDemo && STORY_EMBED_PAGE_STACK_CLASS)}
    >
      <MobileParentBackLink href="/worker" label="マイホーム" />
      <div>
        <h1 className="text-xl font-semibold text-primary-alt">学習モジュール</h1>
        <p className="mt-1 text-xs text-muted">
          ඉගෙනුම් මොඩියුල — デモ用の並びです。
        </p>
      </div>
      <ul className="space-y-2">
        {modules.map((m, i) => (
          <li key={m.titleJa}>
            {i === 0 ? (
              <StoryBeatMark
                beatId="learning-and-support__card"
                className="block rounded-lg"
              >
                <Card
                  className={cn(
                    storyDemo &&
                      "story-demo-context-ring story-demo-tap-target ring-2 ring-primary/25"
                  )}
                >
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
              </StoryBeatMark>
            ) : (
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
            )}
          </li>
        ))}
      </ul>
    </TemplatePageStack>
  );
}
