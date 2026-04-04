import { Briefcase } from "lucide-react";
import type { DispatchHistoryEntryDemo } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PlannedAssignment = {
  tradeNameJa: string;
  jobTitleJa: string;
  monthlySalaryJpy: number;
  salaryLabel: string;
};

type Props = {
  entries: DispatchHistoryEntryDemo[] | undefined;
  planned?: PlannedAssignment | null;
};

export function CandidateDispatchHistory({ entries, planned }: Props) {
  const list = entries?.length
    ? [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate))
    : [];

  return (
    <div className="space-y-4">
      {list.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
            派遣・就労履歴
          </h3>
          <ul className="space-y-3">
            {list.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-border bg-surface/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Briefcase
                      className="mt-0.5 size-4 shrink-0 text-muted"
                      aria-hidden
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {row.clientNameJa}
                      </p>
                      <p className="text-sm text-muted">{row.jobTitleJa}</p>
                    </div>
                  </div>
                  {row.kind === "scheduled" ? (
                    <Badge variant="warning">予定</Badge>
                  ) : (
                    <Badge variant="secondary">実績</Badge>
                  )}
                </div>
                <p className="mt-2 text-xs tabular-nums text-muted">
                  {row.startDate}
                  {" 〜 "}
                  {row.endDate ?? "現職"}
                  {" · "}
                  <span className="font-medium text-foreground">
                    {row.durationDisplayJa}
                  </span>
                </p>
                {row.evaluationNoteJa ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {row.evaluationNoteJa}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {planned ? (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">配属・条件（想定）</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium text-foreground">{planned.tradeNameJa}</p>
            <p className="text-muted">{planned.jobTitleJa}</p>
            <p className="mt-2 text-muted">
              {planned.salaryLabel}{" "}
              {planned.monthlySalaryJpy.toLocaleString()} 円（想定）
            </p>
            {list.length === 0 ? (
              <p className="mt-3 text-xs text-muted">
                入国前・選考段階のため、確定した派遣履歴はまだありません（デモ）。
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted">
          派遣・配属の登録はまだありません（デモ）。
        </p>
      ) : null}
    </div>
  );
}
