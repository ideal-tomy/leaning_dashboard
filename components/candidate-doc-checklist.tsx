import type { DocChecklistItem, DocChecklistStatus } from "@data/types";
import { Badge } from "@/components/ui/badge";
import {
  DEMO_REFERENCE_DATE_ISO,
  daysUntilDateIso,
} from "@/lib/candidate-detail-helpers";

function statusJa(s: DocChecklistStatus): { label: string; variant: "secondary" | "warning" | "success" | "danger" } {
  switch (s) {
    case "pending":
      return { label: "提出待ち", variant: "warning" };
    case "submitted":
      return { label: "提出済・確認中", variant: "secondary" };
    case "verified":
      return { label: "確認済", variant: "success" };
    case "issue":
      return { label: "不備あり", variant: "danger" };
    default: {
      const _exhaustive: never = s;
      return { label: String(_exhaustive), variant: "secondary" as const };
    }
  }
}

type Props = {
  items: DocChecklistItem[] | undefined;
  referenceDateIso?: string;
};

export function CandidateDocChecklist({
  items,
  referenceDateIso = DEMO_REFERENCE_DATE_ISO,
}: Props) {
  if (!items?.length) {
    return (
      <p className="text-sm text-muted">
        書類チェックリストは未登録です（デモ）。
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((row, i) => {
        const st = statusJa(row.status);
        const due =
          row.dueIso != null
            ? daysUntilDateIso(row.dueIso, referenceDateIso)
            : null;
        const dueLabel =
          due == null
            ? row.dueIso
              ? `期限 ${row.dueIso}`
              : null
            : due === 0
              ? `期限当日（${row.dueIso}）`
              : due > 0
                ? `期限まであと${due}日（${row.dueIso}）`
                : `期限から${Math.abs(due)}日超過（${row.dueIso}）`;
        return (
          <li
            key={`${row.labelJa}-${i}`}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm"
          >
            <span className="font-medium text-foreground">{row.labelJa}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={st.variant}>{st.label}</Badge>
              {dueLabel ? (
                <span className="text-xs tabular-nums text-muted">{dueLabel}</span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
