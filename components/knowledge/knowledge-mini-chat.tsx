"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { KnowledgeDualChatPair } from "@/lib/knowledge-dual-chat-seeds";
import { replyForSeed } from "@/lib/knowledge-dual-chat-seeds";

type Props = {
  title: string;
  description?: string;
  pairs: KnowledgeDualChatPair[];
  /** シードに一致しない入力時の返答 */
  fallbackReply: string;
  /** メッセージエリアの最大高さ */
  messagesMaxHeightClass?: string;
};

export function KnowledgeMiniChat({
  title,
  description,
  pairs,
  fallbackReply,
  messagesMaxHeightClass = "max-h-44",
}: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);

  function send(seed?: string) {
    const text = (seed ?? input).trim();
    if (!text) return;
    const assistant = replyForSeed(pairs, text, fallbackReply);
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: assistant },
    ]);
    setInput("");
  }

  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-5 shrink-0 text-primary" />
          {title}
        </CardTitle>
        {description ? (
          <p className="text-xs leading-relaxed text-muted">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch] overscroll-x-contain md:-mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
          role="group"
          aria-label="サンプル質問"
        >
          {pairs.map(({ seed }) => (
            <Button
              key={seed}
              type="button"
              variant="secondary"
              size="sm"
              className="h-auto min-h-8 w-max max-w-[min(85vw,20rem)] shrink-0 whitespace-normal px-2 py-1.5 text-left text-[11px] leading-snug sm:text-xs md:max-w-full md:shrink"
              onClick={() => send(seed)}
            >
              {seed}
            </Button>
          ))}
        </div>
        <div
          className={`space-y-2 overflow-y-auto rounded-lg border border-border bg-surface/40 p-3 text-sm ${messagesMaxHeightClass}`}
        >
          {messages.length === 0 ? (
            <p className="text-xs text-muted">
              質問を入力するか、上のシードをタップしてください。
            </p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={`${i}-${msg.role}`}
                className={
                  msg.role === "user"
                    ? "ml-2 rounded-lg bg-primary/10 px-2.5 py-2 text-xs sm:text-sm"
                    : "mr-2 rounded-lg border border-border bg-card px-2.5 py-2 text-xs leading-relaxed text-muted sm:text-sm"
                }
              >
                {msg.text}
              </div>
            ))
          )}
        </div>
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力…"
            className="min-h-10 flex-1 text-sm"
            aria-label={`${title} への入力`}
          />
          <Button type="submit" size="sm" className="shrink-0 gap-1.5 sm:min-w-[5rem]">
            <Send className="size-4" />
            送信
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
