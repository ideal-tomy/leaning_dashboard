import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@data/types";
import {
  DEMO_REFERENCE_DATE_ISO,
  daysSinceDateIso,
  formatStudyIdleLabel,
} from "@/lib/candidate-detail-helpers";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";
import { withDemoQuery } from "@/lib/industry-selection";

type Props = {
  candidates: Candidate[];
  industry: EnabledIndustryKey;
  role: DemoRole;
};

export function LearningCandidateSummaryTable({
  candidates,
  industry,
  role,
}: Props) {
  const rows = candidates.filter((c) => c.learningDemo);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted">
        学習デモデータのある候補者がいません。
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-border bg-surface/80 text-xs text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">候補者</th>
            <th className="px-3 py-2 font-medium">日本語（オンライン）</th>
            <th className="px-3 py-2 font-medium">倫理モジュール</th>
            <th className="px-3 py-2 font-medium">最終学習</th>
            <th className="px-3 py-2 font-medium">鮮度</th>
            <th className="px-3 py-2 font-medium">詳細</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const ld = c.learningDemo!;
            const idle = formatStudyIdleLabel(
              ld.online.lastStudyAt,
              DEMO_REFERENCE_DATE_ISO
            );
            const idleDays = daysSinceDateIso(
              ld.online.lastStudyAt,
              DEMO_REFERENCE_DATE_ISO
            );
            const stalled = idleDays != null && idleDays >= 14;
            return (
              <tr key={c.id} className="border-b border-border/80 last:border-0">
                <td className="px-3 py-2 font-medium text-foreground">
                  {c.displayName}
                </td>
                <td className="px-3 py-2 tabular-nums text-muted">
                  {ld.online.jpCourseProgressPct}%
                </td>
                <td className="px-3 py-2 tabular-nums text-muted">
                  {ld.online.ethicsModulesCompleted} /{" "}
                  {ld.online.ethicsModulesTotal}
                </td>
                <td className="px-3 py-2 tabular-nums text-muted">
                  {ld.online.lastStudyAt}
                </td>
                <td className="px-3 py-2">
                  {stalled ? (
                    <Badge variant="warning">要フォロー</Badge>
                  ) : (
                    <Badge variant="secondary">順調</Badge>
                  )}
                  {idle ? (
                    <p className="mt-1 text-xs text-muted">{idle}</p>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  <Link
                    href={withDemoQuery(`/candidates/${c.id}`, industry, role, {
                      tab: "learning",
                    })}
                    className="font-medium text-primary hover:underline"
                  >
                    学習タブへ
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
