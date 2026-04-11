"use client";

import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMobile } from "@/hooks/use-mobile";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryPageHints } from "@/lib/industry-page-hints";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { withDemoQuery } from "@/lib/demo-query";
import { useDemoRole } from "@/components/demo-role-context";
import { cn } from "@/lib/utils";
import { MatchingCandidateRow } from "@/components/matching-candidate-row";
import type { Candidate, ClientCompany, LearningComplianceSummary } from "@data/types";

type Props = {
  industry: EnabledIndustryKey;
  /** 営業ストーリー iframe：先頭カードを強調 */
  storyDemo?: boolean;
};

function ClientMatchingCard({
  industry,
  client,
  top,
  emptyState,
  collapsible,
  demoHighlight,
  defaultOpenCollapsible,
}: {
  industry: EnabledIndustryKey;
  client: ClientCompany;
  top: {
    candidate: Candidate;
    pct: number;
    reason: string;
    learningCompliance?: LearningComplianceSummary;
  }[];
  emptyState: string;
  collapsible: boolean;
  demoHighlight?: boolean;
  /** 営業デモ iframe：先頭カードを開いた状態で見せる */
  defaultOpenCollapsible?: boolean;
}) {
  const { role } = useDemoRole();
  const { id: clientId, tradeNameJa } = client;
  const req = client.learningRequirementsDemo;

  const companyLeft = (
    <div className="space-y-1.5">
      <Link
        href={withDemoQuery(`/clients/${clientId}`, industry, role)}
        className="text-base font-semibold text-primary hover:underline"
      >
        {tradeNameJa}
      </Link>
      <p className="text-xs leading-relaxed text-muted">
        {client.industryJa} · {client.prefectureJa}
        {client.cityJa ? ` ${client.cityJa}` : ""}
      </p>
      <p className="text-xs text-muted">
        {industry === "logistics"
          ? `未配車枠（デモ）: ${client.operations.openSlots}枠`
          : `募集枠（デモ）: ${client.operations.openSlots}名`}
      </p>
      {req ? (
        <ul className="space-y-0.5 text-xs leading-relaxed text-muted">
          <li>
            <span className="text-muted">日本語（対面認定）: </span>
            <span className="font-medium text-foreground">
              {req.minCertifiedJlpt} 以上
            </span>
          </li>
          <li>
            <span className="text-muted">職場倫理: </span>
            <span className="font-medium text-foreground">
              {req.ethicsPassRequired
                ? "対面確認の合格が必須"
                : "必須なし（デモ）"}
            </span>
          </li>
          {req.standardLabelJa ? <li>{req.standardLabelJa}</li> : null}
        </ul>
      ) : industry === "logistics" ? (
        <ul className="space-y-0.5 text-xs leading-relaxed text-muted">
          <li>
            <span className="text-muted">時間帯: </span>
            <span className="font-medium text-foreground">
              {client.logisticsListDemo?.deliveryWindowJa ?? "—"}
            </span>
          </li>
          <li>
            <span className="text-muted">便・現場要件: </span>
            <span className="font-medium text-foreground">
              {client.matchingHintTags.join("・")}
            </span>
          </li>
          {client.logisticsListDemo?.loadConditionsJa ? (
            <li className="line-clamp-2">{client.logisticsListDemo.loadConditionsJa}</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );

  const inner = (
    <>
      {top.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted">{emptyState}</p>
      ) : (
        <ol className="space-y-3">
          {top.map(({ candidate, pct, reason, learningCompliance }, idx) => (
            <MatchingCandidateRow
              key={candidate.id}
              left={companyLeft}
              pct={pct}
              reason={reason}
              candidate={candidate}
              learningCompliance={learningCompliance}
              industry={industry}
              role={role}
              rowIndex={idx}
            />
          ))}
        </ol>
      )}
    </>
  );

  if (!collapsible) {
    return (
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-lg">
            <Link
              href={withDemoQuery(`/clients/${clientId}`, industry, role)}
              className="hover:text-primary hover:underline"
            >
              {tradeNameJa}
            </Link>
          </CardTitle>
          <Badge variant="ai">
            <Sparkles className="mr-1 size-3" />
            AI
          </Badge>
        </CardHeader>
        <CardContent>{inner}</CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden",
        demoHighlight &&
          "story-demo-context-ring story-demo-tap-target ring-2 ring-primary/25"
      )}
    >
      <Collapsible
        defaultOpen={defaultOpenCollapsible ?? false}
        className="group"
      >
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center justify-between gap-2 border-b border-border/80 bg-card px-6 py-4 text-left",
            "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
          )}
        >
          <span className="text-lg font-semibold leading-snug">
            <Link
              href={withDemoQuery(`/clients/${clientId}`, industry, role)}
              className="hover:text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {tradeNameJa}
            </Link>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <Badge variant="ai" className="text-xs">
              <Sparkles className="mr-1 size-3" />
              AI
            </Badge>
            <ChevronDown className="size-5 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-4">{inner}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function MatchingSection({ industry, storyDemo }: Props) {
  const isMobile = useMobile();
  const data = getIndustryDemoData(industry);
  const emptyState = getIndustryPageHints(industry).matching.emptyState;

  return (
    <div className="space-y-8">
      {data.clients.map((cl, idx) => {
        const top = data.getMatchesForClient(cl.id).slice(0, 3);
        return (
          <ClientMatchingCard
            key={cl.id}
            industry={industry}
            client={cl}
            top={top}
            emptyState={emptyState}
            collapsible={isMobile}
            demoHighlight={Boolean(storyDemo && idx === 0)}
            defaultOpenCollapsible={Boolean(storyDemo && idx === 0 && isMobile)}
          />
        );
      })}
    </div>
  );
}
