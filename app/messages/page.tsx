"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemoMessage } from "@/lib/demo-messages";
import { demoMessages } from "@/lib/demo-messages";
import { cn } from "@/lib/utils";

function sentimentBadge(s?: DemoMessage["sentiment"]) {
  if (s === "danger") return <Badge variant="danger">要注意</Badge>;
  if (s === "warning") return <Badge variant="warning">確認</Badge>;
  return null;
}

export default function MessagesPage() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }

  return (
    <div className="space-y-6">
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

      <ul className="space-y-3">
        {demoMessages.map((m) => (
          <li key={m.id}>
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {m.category ?? "メッセージ"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {sentimentBadge(m.sentiment)}
                  {m.unread && <Badge variant="primary">未読</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
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
                  className="gap-2"
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
    </div>
  );
}
