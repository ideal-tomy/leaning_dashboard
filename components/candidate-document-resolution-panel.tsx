import Link from "next/link";
import { AlertTriangle, CheckCircle2, ListOrdered } from "lucide-react";
import type { DocumentResolutionGuideDemo } from "@data/types";
import { Button } from "@/components/ui/button";
import { withDemoQuery } from "@/lib/industry-selection";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DemoRole } from "@/lib/demo-role";

type Props = {
  guide: DocumentResolutionGuideDemo | undefined;
  documentAlertJa: string | undefined;
  industry: EnabledIndustryKey;
  role: DemoRole;
};

export function CandidateDocumentResolutionPanel({
  guide,
  documentAlertJa,
  industry,
  role,
}: Props) {
  if (!guide && !documentAlertJa) {
    return null;
  }

  const sortedSteps = guide?.steps
    ? [...guide.steps].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="space-y-4 rounded-xl border border-danger/25 bg-danger/[0.04] p-4">
      <div className="flex flex-wrap items-start gap-2">
        <AlertTriangle
          className="mt-0.5 size-5 shrink-0 text-danger"
          aria-hidden
        />
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            {guide?.issueTitleJa ?? "書類・手続きの確認が必要です"}
          </h3>
          {guide?.issueDetailJa ? (
            <p className="text-sm leading-relaxed text-muted">
              {guide.issueDetailJa}
            </p>
          ) : documentAlertJa ? (
            <p className="text-sm font-medium text-danger">{documentAlertJa}</p>
          ) : null}
        </div>
      </div>

      {sortedSteps.length > 0 ? (
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <ListOrdered className="size-3.5" aria-hidden />
            解決までのステップ（デモ・ナビ）
          </p>
          <ol className="space-y-3">
            {sortedSteps.map((step) => (
              <li
                key={step.order}
                className="flex gap-3 rounded-lg border border-border bg-background/80 p-3"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {step.order}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium text-foreground">{step.titleJa}</p>
                  <p className="text-sm text-muted">{step.detailJa}</p>
                  {step.actionHintJa ? (
                    <p className="text-xs text-muted">
                      <span className="font-medium text-foreground">次のアクション:</span>{" "}
                      {step.actionHintJa}
                    </p>
                  ) : null}
                  {step.linkPath ? (
                    <Button variant="link" className="h-auto p-0 text-primary" asChild>
                      <Link
                        href={withDemoQuery(step.linkPath, industry, role)}
                      >
                        関連画面を開く
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {guide?.completionCriteriaJa ? (
        <div className="flex gap-2 rounded-md border border-emerald-600/20 bg-emerald-600/[0.06] p-3 text-sm">
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-emerald-700"
            aria-hidden
          />
          <div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
              完了条件
            </p>
            <p className="mt-1 text-muted">{guide.completionCriteriaJa}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-border/80 pt-3">
        <Button variant="secondary" size="sm" asChild>
          <Link href={withDemoQuery("/documents", industry, role)}>
            書類ハブ・期限一覧へ
          </Link>
        </Button>
      </div>
    </div>
  );
}
