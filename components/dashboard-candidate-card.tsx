"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Sparkles, Users } from "lucide-react";
import type { Candidate } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { getIndustryProfile } from "@/lib/industry-profiles";
import { withDemoQuery } from "@/lib/demo-query";
import { useDemoRole } from "@/components/demo-role-context";

type Props = {
  industry: EnabledIndustryKey;
  totalCount: number;
  n3OrAbove: number;
  top5: Candidate[];
  /** 派遣ダッシュ等で Card タイトルを上書き */
  titleOverride?: string;
  /** 一覧リンクのラベル（末尾の矢印はそのまま） */
  listCtaOverride?: string;
};

export function DashboardCandidateCard({
  industry,
  totalCount,
  n3OrAbove,
  top5,
  titleOverride,
  listCtaOverride,
}: Props) {
  const [open, setOpen] = useState(false);
  const { role } = useDemoRole();
  const profile = getIndustryProfile(industry);
  const candidateHref = withDemoQuery("/candidates", industry, role);
  const cardTitle = titleOverride ?? profile.labels.candidate;
  const listCta = listCtaOverride ?? "一覧へ";

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <Link
        href={candidateHref}
        className="group block h-full min-h-0 md:hidden"
      >
        <Card className="flex h-full min-h-0 items-start gap-1.5 border-border p-2 shadow-sm transition-all group-hover:border-primary/30 group-hover:shadow-md">
          <Users
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-foreground">
              {cardTitle}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-muted">
              {totalCount}{profile.kpiLabels.totalCountUnit}
            </p>
          </div>
        </Card>
      </Link>

      <Card className="hidden h-full min-h-0 flex-1 flex-col border-border shadow-sm transition-all hover:border-primary/30 hover:shadow-md md:flex">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Users className="size-5 shrink-0 text-primary" />
            {cardTitle}
          </CardTitle>
          <Badge variant="ai" className="shrink-0 px-2 text-xs">
            <Sparkles className="mr-1 size-3" />
            AI
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 p-5 pt-0">
          <div className="text-3xl font-bold tabular-nums">
            {totalCount}
            <span className="ml-2 text-sm font-normal text-muted">
              {profile.kpiLabels.totalCountUnit}
            </span>
          </div>
          <p className="text-sm text-muted">
            {profile.kpiLabels.proficiencyLabel}:{" "}
            <span className="font-semibold text-foreground">{n3OrAbove} 名</span>
          </p>

          <Collapsible open={open} onOpenChange={setOpen} className="min-w-0">
            <CollapsibleTrigger
              type="button"
              className={cn(
                "flex w-full items-center justify-between gap-1 rounded-lg border-2 border-primary/35 px-3 py-2.5 text-left shadow-sm transition-colors",
                "bg-gradient-to-br from-primary/12 via-primary/6 to-primary/10",
                "hover:from-primary/18 hover:border-primary/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              )}
            >
              <span className="text-xs font-semibold text-primary">
                今日の推奨トップ5
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-primary transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden">
              <ul className="mt-2 space-y-2 rounded-md border border-primary/15 bg-primary/[0.04] p-2.5">
                {top5.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={withDemoQuery(`/candidates/${c.id}`, industry, role)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-background/80"
                    >
                      <Image
                        src={c.photoUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="size-7 shrink-0 rounded-full bg-border"
                        unoptimized
                      />
                      <span className="min-w-0 flex-1 truncate text-xs font-medium">
                        {c.displayName}
                      </span>
                      <span className="shrink-0 text-xs font-bold tabular-nums text-primary">
                        {c.aiScore}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>

          <Link
            href={candidateHref}
            className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary"
          >
            {listCta} <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
