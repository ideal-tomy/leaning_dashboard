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
import { LearningComplianceBadge } from "@/components/learning-compliance-badge";
import type { LearningComplianceSummary } from "@data/types";

type Props = {
  industry: EnabledIndustryKey;
};

function ClientMatchingCard({
  industry,
  clientId,
  tradeNameJa,
  top,
  emptyState,
  collapsible,
  defaultOpen,
}: {
  industry: EnabledIndustryKey;
  clientId: string;
  tradeNameJa: string;
  top: {
    candidate: { id: string; displayName: string };
    pct: number;
    reason: string;
    learningCompliance?: LearningComplianceSummary;
  }[];
  emptyState: string;
  collapsible: boolean;
  defaultOpen: boolean;
}) {
  const { role } = useDemoRole();
  const inner = (
    <>
      {top.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted">{emptyState}</p>
      ) : (
        <ol className="space-y-3">
          {top.map(({ candidate, pct, reason, learningCompliance }) => (
            <li
              key={candidate.id}
              className="rounded-lg border border-border p-3 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link
                  href={withDemoQuery(
                    `/candidates/${candidate.id}`,
                    industry,
                    role
                  )}
                  className="font-medium text-primary"
                >
                  {candidate.displayName}
                </Link>
                <span className="flex flex-wrap items-center gap-2">
                  {learningCompliance ? (
                    <LearningComplianceBadge
                      status={learningCompliance.status}
                      labelJa={learningCompliance.labelJa}
                    />
                  ) : null}
                  <span className="font-bold text-primary">{pct}%</span>
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">{reason}</p>
            </li>
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
    <Card className="overflow-hidden">
      <Collapsible defaultOpen={defaultOpen} className="group">
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

export function MatchingSection({ industry }: Props) {
  const isMobile = useMobile();
  const data = getIndustryDemoData(industry);
  const emptyState = getIndustryPageHints(industry).matching.emptyState;

  return (
    <div className="space-y-8">
      {data.clients.map((cl, i) => {
        const top = data.getMatchesForClient(cl.id).slice(0, 3);
        return (
          <ClientMatchingCard
            key={cl.id}
            industry={industry}
            clientId={cl.id}
            tradeNameJa={cl.tradeNameJa}
            top={top}
            emptyState={emptyState}
            collapsible={isMobile}
            defaultOpen={i === 0}
          />
        );
      })}
    </div>
  );
}
