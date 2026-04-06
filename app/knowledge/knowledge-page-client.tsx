"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TemplateMobileFlowSection,
  TemplatePageHeader,
  TemplatePageStack,
} from "@/components/templates/layout-primitives";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { withDemoQuery } from "@/lib/demo-query";
import { useDemoRole } from "@/components/demo-role-context";
import { MobileFlowBar } from "@/components/navigation/mobile-flow-bar";
import { NextActionCard } from "@/components/navigation/next-action-card";
import { FeatureDemoExplainSection } from "@/components/feature-demos/feature-demo-explain-section";
import { FeatureDemoSiblingGrid } from "@/components/feature-demos/feature-demo-sibling-grid";
import { KnowledgeMiniChat } from "@/components/knowledge/knowledge-mini-chat";
import {
  KNOWLEDGE_FAQ_BOT_PAIRS,
  KNOWLEDGE_LANKA_BOT_PAIRS,
} from "@/lib/knowledge-dual-chat-seeds";

type FlowBack = { href: string; label: string };

type Props = {
  industry: EnabledIndustryKey;
  /** 未指定時はメッセージへ戻る（従来どおり） */
  flowBack?: FlowBack;
  /** 技術デモ下層: 次へ・NextActionCard を出さない */
  featureDemo?: boolean;
};

const FAQ_FALLBACK =
  "デモでは、上のよくある質問ボタンと同じ文言を入力すると詳細回答を返します。その他の内容はナレッジ登録後に検索できる想定です。";

const LANKA_FALLBACK =
  "デモでは登録済みのシード質問と同じ内容でのみ詳細応答します。Other questions: please ask your coordinator（デモ）.";

export function KnowledgePageClient({
  industry,
  flowBack,
  featureDemo = false,
}: Props) {
  const { role } = useDemoRole();
  const hints = getIndustryPageHints(industry).knowledge;
  const back = flowBack ?? {
    href: withDemoQuery("/messages", industry, role),
    label: "メッセージ",
  };

  return (
    <TemplatePageStack>
      <TemplateMobileFlowSection>
        <MobileFlowBar
          backHref={back.href}
          backLabel={back.label}
          pageLabel="ナレッジAI"
          {...(!featureDemo
            ? {
                nextHref: withDemoQuery("/matching", industry, role),
                nextLabel: "次へ",
              }
            : {})}
        />
      </TemplateMobileFlowSection>
      <TemplatePageHeader title="ナレッジ AI" description={hints.pageSubtitle} />
      {!featureDemo ? (
        <NextActionCard
          className="md:hidden"
          title="次のアクション"
          reasonTag="提案理由"
          reasonTone="ai"
          description="回答確認後はマッチング理由の確認に進み、説明を一貫させます。"
          actionHref={withDemoQuery("/matching", industry, role)}
          actionLabel="マッチングへ"
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href={withDemoQuery("/messages", industry, role)} className="gap-1.5">
            <MessageSquare className="size-3.5" />
            メッセージ翻訳
          </Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href={withDemoQuery("/matching", industry, role)}>マッチング理由</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
        <KnowledgeMiniChat
          title="社内ナレッジ・FAQ ボット（デモ）"
          description="制度・手続きを日本語で参照するイメージです。"
          pairs={KNOWLEDGE_FAQ_BOT_PAIRS}
          fallbackReply={FAQ_FALLBACK}
        />
        <KnowledgeMiniChat
          title="スリランカ人向けサポート（デモ）"
          description="シンハラ語・タミル語と日本語を組み合わせた案内のイメージです。"
          pairs={KNOWLEDGE_LANKA_BOT_PAIRS}
          fallbackReply={LANKA_FALLBACK}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">よくある質問（デモ）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hints.faqs.map((f) => (
            <div key={f.q} className="border-b border-border/80 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-foreground">{f.q}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {featureDemo ? (
        <>
          <FeatureDemoExplainSection slug="knowledge-ai" />
          <FeatureDemoSiblingGrid currentSlug="knowledge-ai" />
        </>
      ) : null}
    </TemplatePageStack>
  );
}
