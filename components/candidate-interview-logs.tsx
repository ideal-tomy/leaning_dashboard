"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { InterviewLogEntry } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  entries: InterviewLogEntry[] | undefined;
};

export function CandidateInterviewLogs({ entries }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!entries?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted">月次面談ログ</p>
      <ul className="space-y-3">
        {entries.map((log, idx) => {
          const open = openIdx === idx;
          return (
            <li
              key={log.monthLabelJa}
              className="rounded-lg border border-border bg-surface/70 p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-foreground">{log.monthLabelJa}</p>
                {log.bodyJa ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() => setOpenIdx(open ? null : idx)}
                  >
                    {open ? (
                      <>
                        閉じる <ChevronUp className="size-3" />
                      </>
                    ) : (
                      <>
                        全文 <ChevronDown className="size-3" />
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-foreground">{log.summaryJa}</p>
              {log.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {log.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}
              {log.bodyJa && open ? (
                <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted">
                  {log.bodyJa}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
