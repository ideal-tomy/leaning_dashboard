"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplatePageStack } from "@/components/templates/layout-primitives";
import { MobileParentBackLink } from "@/components/navigation/mobile-parent-back-link";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { withDemoQuery } from "@/lib/demo-query";
import type { DemoMessage } from "@/lib/demo-messages";
import { demoMessages } from "@/lib/demo-messages";
import { cn } from "@/lib/utils";
import {
  StoryBeatMark,
  useSalesDemoBeatState,
} from "@/components/story-demo/sales-demo-beat-context";
import {
  isStoryEmbedUrlSearchParams,
  STORY_EMBED_PAGE_STACK_CLASS,
} from "@/lib/story-embed";
import { FeatureDemoExplainSection } from "@/components/feature-demos/feature-demo-explain-section";
import { FeatureDemoSiblingGrid } from "@/components/feature-demos/feature-demo-sibling-grid";

function sentimentBadge(s?: DemoMessage["sentiment"]) {
  if (s === "danger") return <Badge variant="danger">要注意</Badge>;
  if (s === "warning") return <Badge variant="warning">確認</Badge>;
  return null;
}

type FlowBack = { href: string; label: string };

type Props = {
  flowBack?: FlowBack;
  /** 技術デモ下層（/feature-demos/messages-ai）のとき概要ブロックを表示 */
  featureDemoExplain?: boolean;
};

export function MessagesPageContent({
  flowBack,
  featureDemoExplain = false,
}: Props) {
  const { industry } = useIndustry();
  const { role } = useDemoRole();
  const urlSearch = useSearchParams();
  const storyDemo = isStoryEmbedUrlSearchParams(urlSearch);
  const { beatId: activeDemoBeatId, slideId } = useSalesDemoBeatState();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const back = flowBack ?? {
    href: withDemoQuery("/more", industry, role),
    label: "その他",
  };

  function toggle(id: string) {
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }

  const orderedMessages = useMemo(() => {
    if (!storyDemo) return demoMessages;
    const storyOrder = ["msg-2", "msg-3", "msg-4", "msg-1", "msg-5"];
    return [...demoMessages].sort(
      (a, b) => storyOrder.indexOf(a.id) - storyOrder.indexOf(b.id)
    );
  }, [storyDemo]);

  const firstStoryMessageId = orderedMessages[0]?.id;

  useEffect(() => {
    if (!storyDemo || !firstStoryMessageId) return;
    if (
      activeDemoBeatId === "communication-history__translation-open" ||
      activeDemoBeatId === "communication-history__meta"
    ) {
      setRevealed((prev) => ({ ...prev, [firstStoryMessageId]: true }));
      return;
    }
    setRevealed((prev) => ({ ...prev, [firstStoryMessageId]: false }));
  }, [activeDemoBeatId, firstStoryMessageId, slideId, storyDemo]);

  return (
    <TemplatePageStack
      className={cn(storyDemo && STORY_EMBED_PAGE_STACK_CLASS)}
    >
      <MobileParentBackLink href={back.href} label={back.label} />
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">
          ワーカーメッセージ
        </h1>
        <p className="mt-1 text-sm text-muted">
          {storyDemo
            ? "会話の履歴、翻訳、未読や要注意の印を同じ画面で確認できます。"
            : <>
                シンハラ語原文と日本語（デモ）。50 件は{" "}
                <code className="rounded bg-surface px-1 text-xs">lib/demo-messages.ts</code>{" "}
                に追記してください。
              </>}
        </p>
      </div>
      <ul
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] overscroll-x-contain md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4"
        role="list"
      >
        {orderedMessages.map((m) => {
          const isFirst = m.id === firstStoryMessageId;
          const translateBtn = (
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "mt-auto gap-2 self-start",
                storyDemo && "story-demo-tap-target"
              )}
              onClick={() => toggle(m.id)}
            >
              <Languages className="size-4" />
              {revealed[m.id] ? "訳を隠す" : "AI 翻訳を表示（デモ）"}
            </Button>
          );
          const cardInner = (
            <>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {m.category ?? "メッセージ"}
                </CardTitle>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {sentimentBadge(m.sentiment)}
                  {m.unread && <Badge variant="primary">未読</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col space-y-3">
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                  <div className="rounded-lg bg-surface p-3 text-sm">
                    <p className="text-xs text-muted">シンハラ語</p>
                    <p className="mt-1 font-medium">{m.si}</p>
                    {m.readingJa && (
                      <p className="mt-1 text-xs text-muted">
                        読み: {m.readingJa}
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border border-border p-3 text-sm">
                    <p className="text-xs text-muted">日本語</p>
                    <p
                      className={cn(
                        "mt-1",
                        !revealed[m.id] && "blur-sm select-none"
                      )}
                    >
                      {m.ja}
                    </p>
                  </div>
                </div>
                {isFirst ? (
                  <StoryBeatMark
                    beatId="communication-history__translation-open"
                    className="inline-flex rounded-md"
                  >
                    {translateBtn}
                  </StoryBeatMark>
                ) : (
                  translateBtn
                )}
              </CardContent>
            </>
          );
          return (
            <li
              key={m.id}
              className="w-[min(88vw,20rem)] shrink-0 snap-start md:w-auto md:min-w-0"
            >
              {isFirst ? (
                <StoryBeatMark
                  beatId="communication-history__thread"
                  className="block h-full rounded-lg"
                >
                  <Card
                    className={cn(
                      "flex h-full flex-col",
                      storyDemo && "story-demo-tap-target"
                    )}
                  >
                    <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
                      <CardTitle className="text-sm font-medium text-muted">
                        {m.category ?? "メッセージ"}
                      </CardTitle>
                      <StoryBeatMark
                        beatId="communication-history__meta"
                        className="inline-flex rounded-md"
                      >
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {sentimentBadge(m.sentiment)}
                          {m.unread && <Badge variant="primary">未読</Badge>}
                        </div>
                      </StoryBeatMark>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col space-y-3">
                      <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                        <div className="rounded-lg bg-surface p-3 text-sm">
                          <p className="text-xs text-muted">シンハラ語</p>
                          <p className="mt-1 font-medium">{m.si}</p>
                          {m.readingJa && (
                            <p className="mt-1 text-xs text-muted">
                              読み: {m.readingJa}
                            </p>
                          )}
                        </div>
                        <div className="rounded-lg border border-border p-3 text-sm">
                          <p className="text-xs text-muted">日本語</p>
                          <p
                            className={cn(
                              "mt-1",
                              !revealed[m.id] && "blur-sm select-none"
                            )}
                          >
                            {m.ja}
                          </p>
                        </div>
                      </div>
                      <StoryBeatMark
                        beatId="communication-history__translation-open"
                        className="inline-flex rounded-md"
                      >
                        {translateBtn}
                      </StoryBeatMark>
                    </CardContent>
                  </Card>
                </StoryBeatMark>
              ) : (
                <Card
                  className={cn(
                    "flex h-full flex-col",
                    storyDemo && "story-demo-tap-target"
                  )}
                >
                  {cardInner}
                </Card>
              )}
            </li>
          );
        })}
      </ul>

      {featureDemoExplain ? (
        <>
          <FeatureDemoExplainSection slug="messages-ai" />
          <FeatureDemoSiblingGrid currentSlug="messages-ai" />
        </>
      ) : null}
    </TemplatePageStack>
  );
}
