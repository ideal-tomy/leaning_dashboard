"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  ChevronDown,
  MessageSquareWarning,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { DemoRole } from "@/lib/demo-role";
import { withDemoQuery } from "@/lib/demo-query";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getDemoAlerts, getStalledWorkers } from "@/lib/demo-workers";

type Props = {
  industry: EnabledIndustryKey;
  role: DemoRole;
};

export function DashboardKillerCards({ industry, role }: Props) {
  if (role === "worker") return null;

  const stalled = getStalledWorkers();
  const alerts = getDemoAlerts().slice(0, 6);
  const clients = getIndustryDemoData(industry).clients
    .filter((c) => c.operations.openSlots > 0)
    .sort((a, b) => b.operations.openSlots - a.operations.openSlots)
    .slice(0, 3);
  const requestCount = clients.reduce((sum, c) => sum + c.operations.openSlots, 0);

  return (
    <div className="space-y-2">
      <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
        <Card className="min-w-0 border-amber-500/25 bg-amber-500/[0.04]">
          <Collapsible>
            <CardHeader className="pb-2">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between gap-2 text-left">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="size-5 text-amber-600" />
                    今日フォローする人を確認
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger" className="text-[11px]">{stalled.length}件</Badge>
                    <ChevronDown className="size-4 text-muted" />
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-2 pt-0 text-sm">
                <ul className="space-y-1.5">
                  {stalled.map((w) => (
                    <li key={w.id}>
                      <Link
                        href={withDemoQuery("/candidates?focus=risk", industry, role)}
                        className="flex items-center justify-between gap-2 rounded-md border border-border/80 bg-background/60 px-2 py-1 hover:bg-surface"
                      >
                        <span className="truncate font-medium">{w.displayNameEn}</span>
                        <Badge variant="warning" className="shrink-0">
                          {w.jpProgressPct}%
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={withDemoQuery("/candidates?focus=risk", industry, role)}
                  className="inline-flex text-xs font-semibold text-primary hover:underline"
                >
                  すべて見る
                </Link>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card className="min-w-0 border-primary/20">
          <Collapsible>
            <CardHeader className="pb-2">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between gap-2 text-left">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarClock className="size-5 text-primary" />
                    要対応手続き・書類
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger" className="text-[11px]">{alerts.length}件</Badge>
                    <ChevronDown className="size-4 text-muted" />
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-2 pt-0 text-sm">
                <ul className="max-h-40 space-y-1.5 overflow-y-auto">
                  {alerts.slice(0, 3).map((a) => (
                    <li key={a.id}>
                      <Link
                        href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                        className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                      >
                        <span className="min-w-0 truncate">
                          <span className="font-medium">{a.workerName}</span>
                          <span className="text-muted"> · {a.typeJa}</span>
                        </span>
                        <span className="shrink-0 tabular-nums text-xs text-muted">
                          残り{a.daysLeft}日
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={withDemoQuery("/documents?scope=deadlines", industry, role)}
                  className="inline-flex text-xs font-semibold text-primary hover:underline"
                >
                  すべて見る
                </Link>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <Card className="min-w-0 border-warning/35 bg-warning/[0.05]">
          <Collapsible>
            <CardHeader className="pb-2">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between gap-2 text-left">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquareWarning className="size-5 text-warning" />
                    未対応クライアント要望
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="text-[11px]">{requestCount}件</Badge>
                    <ChevronDown className="size-4 text-muted" />
                  </div>
                </button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-2 pt-0 text-sm">
                <ul className="space-y-1.5">
                  {clients.map((client) => (
                    <li key={client.id}>
                      <Link
                        href={withDemoQuery("/client-requests", industry, role)}
                        className="block rounded-md border border-border/60 px-2 py-1 hover:bg-surface"
                      >
                        <span className="font-medium">{client.tradeNameJa}</span>
                        <span className="text-muted"> — 未充足 {client.operations.openSlots}名</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={withDemoQuery("/client-requests", industry, role)}
                  className="inline-flex text-xs font-semibold text-primary hover:underline"
                >
                  すべて見る
                </Link>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
}
