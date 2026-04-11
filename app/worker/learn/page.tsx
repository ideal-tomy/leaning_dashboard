"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileParentBackLink } from "@/components/navigation/mobile-parent-back-link";
import { WorkerSubnav } from "@/components/worker-subnav";
import { StoryBeatMark } from "@/components/story-demo/sales-demo-beat-context";
import {
  isStoryEmbedUrlSearchParams,
  STORY_EMBED_PAGE_STACK_CLASS,
} from "@/lib/story-embed";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

type LearnModule = {
  titleJa: string;
  titleSi: string;
  status: "修了" | "受講中" | "未着手";
  summary: string;
};

const defaultModules: LearnModule[] = [
  {
    titleJa: "職場のあいさつ",
    titleSi: "කාර්ය ස්ථානයේ ආචාර",
    status: "修了",
    summary: "最初の声かけや自己紹介を学び、現場の不安を減らします。",
  },
  {
    titleJa: "安全衛生（入門）",
    titleSi: "ආරක්ෂාව සහ සනීපාරක්ෂාව",
    status: "修了",
    summary: "現場ルールと事故防止の基礎を確認済みです。",
  },
  {
    titleJa: "日本語 N4 リスニング",
    titleSi: "ජපන් භාෂාව N4",
    status: "受講中",
    summary: "現場会話に必要な聞き取りを継続しています。",
  },
  {
    titleJa: "コンプライアンス第3章",
    titleSi: "නීතිමය අනුකූලතාව",
    status: "未着手",
    summary: "就業ルールと相談フローを次回の重点項目として残しています。",
  },
];

function badgeVariant(status: LearnModule["status"]) {
  if (status === "修了") return "secondary" as const;
  if (status === "受講中") return "warning" as const;
  return "outline" as const;
}

export default function WorkerLearnPage() {
  const urlSearch = useSearchParams();
  const storyDemo = isStoryEmbedUrlSearchParams(urlSearch);
  const modules = storyDemo
    ? [
        defaultModules[2]!,
        defaultModules[3]!,
        defaultModules[1]!,
        defaultModules[0]!,
      ]
    : defaultModules;

  return (
    <TemplatePageStack
      className={cn("space-y-4", storyDemo && STORY_EMBED_PAGE_STACK_CLASS)}
    >
      <MobileParentBackLink href="/worker" label="マイホーム" />

      <StoryBeatMark beatId="learning-and-support__tab" className="block rounded-lg">
        <div className="space-y-3">
          <WorkerSubnav />
          <div>
            <h1 className="text-xl font-semibold text-primary-alt">学習モジュール</h1>
            <p className="mt-1 text-xs text-muted">
              {storyDemo
                ? "日本語と倫理の進み具合を、同じ一覧で継続的に確認できます。"
                : "ඉගෙනුම් මොඩියුල — デモ用の並びです。"}
            </p>
          </div>
        </div>
      </StoryBeatMark>

      <ul className="space-y-2">
        {modules.map((m) => {
          const isJapanese = m.titleJa.includes("日本語");
          const isEthics = m.titleJa.includes("コンプライアンス");
          const card = (
            <Card
              className={cn(
                storyDemo &&
                  isJapanese &&
                  "story-demo-context-ring story-demo-tap-target ring-2 ring-primary/25"
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium leading-snug">
                  {m.titleJa}
                </CardTitle>
                {storyDemo && isEthics ? (
                  <StoryBeatMark
                    beatId="learning-and-support__ethics-status"
                    className="inline-flex rounded-md"
                  >
                    <Badge variant={badgeVariant(m.status)}>{m.status}</Badge>
                  </StoryBeatMark>
                ) : (
                  <Badge variant={badgeVariant(m.status)}>{m.status}</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted">
                <p>{m.titleSi}</p>
                <p>{m.summary}</p>
              </CardContent>
            </Card>
          );

          return (
            <li key={m.titleJa}>
              {storyDemo && isJapanese ? (
                <StoryBeatMark
                  beatId="learning-and-support__jp-module"
                  className="block rounded-lg"
                >
                  {card}
                </StoryBeatMark>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </TemplatePageStack>
  );
}
