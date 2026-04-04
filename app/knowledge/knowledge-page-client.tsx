"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TemplatePageHeader, TemplatePageStack } from "@/components/templates/layout-primitives";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { withIndustryQuery } from "@/lib/industry-selection";

type Props = {
  industry: EnabledIndustryKey;
};

export function KnowledgePageClient({ industry }: Props) {
  const hints = getIndustryPageHints(industry).knowledge;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);

  function send(seed?: string) {
    const text = (seed ?? input).trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: hints.staticReply },
    ]);
    setInput("");
  }

  return (
    <TemplatePageStack>
      <TemplatePageHeader title="ナレッジ AI" description={hints.pageSubtitle} />

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" asChild>
          <Link href={withIndustryQuery("/messages", industry)} className="gap-1.5">
            <MessageSquare className="size-3.5" />
            メッセージ翻訳
          </Link>
        </Button>
        <Button variant="secondary" size="sm" asChild>
          <Link href={withIndustryQuery("/matching", industry)}>マッチング理由</Link>
        </Button>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-5 text-primary" />
            擬似チャット（静的応答）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {hints.chatSeeds.map((s) => (
              <Button
                key={s}
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => send(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="max-h-48 space-y-3 overflow-y-auto rounded-lg border border-border bg-surface/40 p-3 text-sm">
            {messages.length === 0 ? (
              <p className="text-muted">質問を入力するか、上のシードをタップしてください。</p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={`${i}-${msg.role}`}
                  className={
                    msg.role === "user"
                      ? "ml-4 rounded-lg bg-primary/10 px-3 py-2"
                      : "mr-4 rounded-lg border border-border bg-card px-3 py-2 text-muted"
                  }
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="質問を入力…"
              className="min-h-11 flex-1"
              aria-label="チャット入力"
            />
            <Button type="submit" className="shrink-0 gap-1.5">
              <Send className="size-4" />
              送信
            </Button>
          </form>
        </CardContent>
      </Card>
    </TemplatePageStack>
  );
}
