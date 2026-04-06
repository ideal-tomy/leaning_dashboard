"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplateMobileFlowSection,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { useIndustry } from "@/components/industry-context";
import { useDemoRole } from "@/components/demo-role-context";
import { withDemoQuery } from "@/lib/demo-query";
import type { DemoMessage } from "@/lib/demo-messages";
import { demoMessages } from "@/lib/demo-messages";
import { cn } from "@/lib/utils";
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
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const back = flowBack ?? {
    href: withDemoQuery("/more", industry, role),
    label: "その他",
  };

  function toggle(id: string) {
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={back.href}
          backLabel={back.label}
          pageLabel="ワーカーメッセージ"
        />
      </TemplateMobileFlowSection>
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">
          ワーカーメッセージ
        </h1>
        <p className="mt-1 text-sm text-muted">
          シンハラ語原文と日本語（デモ）。50 件は{" "}
          <code className="rounded bg-surface px-1 text-xs">lib/demo-messages.ts</code>{" "}
          に追記してください。
        </p>
      </div>
      <ul
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] overscroll-x-contain md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4"
        role="list"
      >
        {demoMessages.map((m) => (
          <li
            key={m.id}
            className="w-[min(88vw,20rem)] shrink-0 snap-start md:w-auto md:min-w-0"
          >
            <Card className="flex h-full flex-col">
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
                    <p className={cn("mt-1", !revealed[m.id] && "blur-sm select-none")}>
                      {m.ja}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-auto gap-2 self-start"
                  onClick={() => toggle(m.id)}
                >
                  <Languages className="size-4" />
                  {revealed[m.id] ? "訳を隠す" : "AI 翻訳を表示（デモ）"}
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
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
