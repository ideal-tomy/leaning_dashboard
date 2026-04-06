"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Candidate, LearningComplianceSummary } from "@data/types";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";
import { withDemoQuery } from "@/lib/demo-query";
import { LearningComplianceBadge } from "@/components/learning-compliance-badge";
import { MatchingWorkerCredentials } from "@/components/matching-in-person-mini";
import { cn } from "@/lib/utils";

type Props = {
  left: ReactNode;
  pct: number;
  reason: string;
  candidate: Candidate;
  learningCompliance?: LearningComplianceSummary;
  industry: EnabledIndustryKey;
  role: DemoRole;
  /** スコア列の交互背景用（0始まり） */
  rowIndex: number;
};

export function MatchingCandidateRow({
  left,
  pct,
  reason,
  candidate,
  learningCompliance,
  industry,
  role,
  rowIndex,
}: Props) {
  const stripeEven = rowIndex % 2 === 0;

  return (
    <li className="rounded-lg border border-border bg-card/30 p-3 text-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.85fr)_minmax(0,1.05fr)] md:items-start md:gap-4">
        <div className="min-w-0 space-y-1.5 md:pr-1">{left}</div>

        <div
          className={cn(
            "flex min-w-0 flex-col gap-2 rounded-lg border border-transparent px-2 py-2 md:border-l md:border-border md:px-4 md:py-3",
            stripeEven ? "bg-primary/[0.06]" : "bg-muted/50"
          )}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-primary">
              {pct}%
            </span>
            <Badge variant="ai" className="shrink-0 gap-0.5 text-[10px]">
              AI
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-muted md:line-clamp-none line-clamp-4">
            {reason}
          </p>
        </div>

        <div className="min-w-0 space-y-2 md:border-l md:border-border md:pl-4">
          <div className="flex items-start gap-3">
            <Image
              src={candidate.photoUrl}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-full bg-surface object-cover"
              unoptimized
            />
            <div className="min-w-0 flex-1 space-y-1">
              <Link
                href={withDemoQuery(`/candidates/${candidate.id}`, industry, role)}
                className="block font-semibold text-primary hover:underline"
              >
                <span className="break-words">{candidate.displayName}</span>
              </Link>
              <p className="text-xs text-muted">
                {candidate.nationality} · {candidate.jlpt}
              </p>
            </div>
          </div>
          <div className="min-w-0 space-y-2 pl-[calc(3rem+0.75rem)]">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="tabular-nums text-[10px]">
                AI {candidate.aiScore}
              </Badge>
              {learningCompliance ? (
                <LearningComplianceBadge
                  status={learningCompliance.status}
                  labelJa={learningCompliance.labelJa}
                />
              ) : null}
            </div>
            <MatchingWorkerCredentials learningDemo={candidate.learningDemo} />
          </div>
        </div>
      </div>
    </li>
  );
}
