import type { Candidate } from "@data/types";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import {
  DEMO_REFERENCE_DATE_ISO,
  daysUntilDateIso,
} from "@/lib/candidate-detail-helpers";
import { candidates as staffingCandidates } from "@/lib/demo-data";

export type DeadlineRowKind = "milestone" | "document";

export type DeadlineRow = {
  dueIso: string;
  labelJa: string;
  candidateId: string;
  candidateName: string;
  kind: DeadlineRowKind;
  daysUntil: number | null;
};

function pushUnique(rows: DeadlineRow[], row: DeadlineRow) {
  const key = `${row.candidateId}-${row.kind}-${row.dueIso}-${row.labelJa}`;
  if (rows.some((r) => `${r.candidateId}-${r.kind}-${r.dueIso}-${r.labelJa}` === key)) {
    return;
  }
  rows.push(row);
}

export function aggregateUpcomingDeadlines(
  industry: EnabledIndustryKey,
  options?: {
    referenceIso?: string;
    withinDays?: number;
  }
): DeadlineRow[] {
  const referenceIso = options?.referenceIso ?? DEMO_REFERENCE_DATE_ISO;
  const withinDays = options?.withinDays ?? 14;

  const list: Candidate[] =
    industry === "staffing" ? staffingCandidates : [];

  const rows: DeadlineRow[] = [];

  for (const c of list) {
    const d = c.detailDemo;
    if (!d) continue;

    for (const m of d.milestones ?? []) {
      const days = daysUntilDateIso(m.dateIso, referenceIso);
      if (days == null) continue;
      if (days >= 0 && days <= withinDays) {
        pushUnique(rows, {
          dueIso: m.dateIso,
          labelJa: m.labelJa,
          candidateId: c.id,
          candidateName: c.displayName,
          kind: "milestone",
          daysUntil: days,
        });
      }
    }

    for (const doc of d.docChecklist ?? []) {
      if (!doc.dueIso) continue;
      const days = daysUntilDateIso(doc.dueIso, referenceIso);
      if (days == null) continue;
      if (days >= 0 && days <= withinDays) {
        pushUnique(rows, {
          dueIso: doc.dueIso,
          labelJa: doc.labelJa,
          candidateId: c.id,
          candidateName: c.displayName,
          kind: "document",
          daysUntil: days,
        });
      }
    }
  }

  return rows.sort((a, b) => {
    const da = a.dueIso.localeCompare(b.dueIso);
    if (da !== 0) return da;
    return a.candidateName.localeCompare(b.candidateName, "ja");
  });
}
