import { Badge } from "@/components/ui/badge";
import type { CandidateLearningDemo, InPersonExamStatus } from "@data/types";
import { cn } from "@/lib/utils";

function statusBadgeJa(s: InPersonExamStatus): {
  label: string;
  variant: "secondary" | "warning" | "success" | "danger";
} {
  switch (s) {
    case "passed":
      return { label: "認定済", variant: "success" };
    case "scheduled":
      return { label: "予約済", variant: "warning" };
    case "failed":
      return { label: "要再受験", variant: "danger" };
    default:
      return { label: "未実施", variant: "secondary" };
  }
}

/** マッチング行用：候補者詳細の「対面認定」を圧縮表示 */
export function MatchingInPersonMini({
  inPerson,
  className,
}: {
  inPerson: CandidateLearningDemo["inPerson"];
  className?: string;
}) {
  const jpStatus = statusBadgeJa(inPerson.japanese.status);
  const ethStatus = statusBadgeJa(inPerson.ethics.status);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="rounded-md border border-border/90 bg-background/95 p-2 text-[11px] leading-snug shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="font-medium text-foreground">日本語（対面認定）</span>
          <Badge variant={jpStatus.variant} className="text-[10px]">
            {jpStatus.label}
          </Badge>
        </div>
        {inPerson.japanese.certifiedJlptEquivalent ? (
          <p className="mt-1 text-muted">
            認定レベル:{" "}
            <span className="font-semibold text-foreground">
              {inPerson.japanese.certifiedJlptEquivalent}
            </span>
            {inPerson.japanese.examAt ? `（${inPerson.japanese.examAt}）` : null}
          </p>
        ) : (
          <p className="mt-1 text-muted">未認定（対面試験の合格が必要）</p>
        )}
        {inPerson.japanese.venueJa ? (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-muted">
            会場: {inPerson.japanese.venueJa}
          </p>
        ) : null}
      </div>
      <div className="rounded-md border border-border/90 bg-background/95 p-2 text-[11px] leading-snug shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="font-medium text-foreground">倫理（対面確認）</span>
          <Badge variant={ethStatus.variant} className="text-[10px]">
            {ethStatus.label}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-[10px] text-muted">
          {inPerson.ethics.standardNameJa}
        </p>
        {inPerson.ethics.resultLabelJa ? (
          <p className="mt-0.5 text-muted">
            結果:{" "}
            <span className="font-medium text-foreground">
              {inPerson.ethics.resultLabelJa}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function MatchingWorkerCredentials({
  learningDemo,
}: {
  learningDemo?: CandidateLearningDemo;
}) {
  if (!learningDemo) {
    return (
      <p className="text-[11px] leading-snug text-muted">
        対面認定のデモデータがありません。
      </p>
    );
  }
  return <MatchingInPersonMini inPerson={learningDemo.inPerson} />;
}
