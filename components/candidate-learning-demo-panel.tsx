import { Laptop, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  CandidateLearningDemo,
  InPersonExamStatus,
} from "@data/types";
import {
  DEMO_REFERENCE_DATE_ISO,
  formatStudyIdleLabel,
} from "@/lib/candidate-detail-helpers";

function ProgressBar({ value }: { value: number }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-[width]"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function statusBadgeJa(s: InPersonExamStatus): { label: string; variant: "secondary" | "warning" | "success" | "danger" } {
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

type Props = {
  data: CandidateLearningDemo;
  /** デモの「今日」。meta.referenceDate と揃える */
  referenceDateIso?: string;
};

export function CandidateLearningDemoPanel({
  data,
  referenceDateIso = DEMO_REFERENCE_DATE_ISO,
}: Props) {
  const { online, inPerson, footnoteJa } = data;
  const jpEthicsPct =
    (online.ethicsModulesCompleted / Math.max(1, online.ethicsModulesTotal)) *
    100;
  const jpStatus = statusBadgeJa(inPerson.japanese.status);
  const ethStatus = statusBadgeJa(inPerson.ethics.status);
  const idleLabel = formatStudyIdleLabel(online.lastStudyAt, referenceDateIso);

  return (
    <div className="space-y-4">
      <Card className="border-primary/15 bg-primary/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Laptop className="size-5 text-primary" />
            オンライン学習（アカウント・進捗）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted">
            eラーニング上の履歴です。進捗が高くても、それ単体では公式ランクにはなりません（デモ仕様）。
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">日本語コース</span>
              <span className="tabular-nums text-muted">
                {online.jpCourseProgressPct}%
              </span>
            </div>
            <ProgressBar value={online.jpCourseProgressPct} />
            <p className="text-xs text-muted">{online.jpTrackLabelJa}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">倫理・衛生モジュール</span>
              <span className="tabular-nums text-muted">
                {online.ethicsModulesCompleted} / {online.ethicsModulesTotal}
              </span>
            </div>
            <ProgressBar value={jpEthicsPct} />
          </div>
          {online.ethicsQuizScorePct != null ? (
            <div className="rounded-md border border-border/80 bg-background/60 px-3 py-2">
              <p className="text-xs text-muted">倫理・衛生 理解度クイズ（最新）</p>
              <p className="text-lg font-semibold tabular-nums text-foreground">
                {online.ethicsQuizScorePct}
                <span className="text-sm font-normal text-muted"> / 100</span>
              </p>
            </div>
          ) : null}
          {online.jpModules && online.jpModules.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted">
                日本語コース内訳（ユニット）
              </p>
              {online.jpModules.map((m) => (
                <div key={m.labelJa} className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{m.labelJa}</span>
                    <span className="flex items-center gap-2">
                      {m.stalled ? (
                        <Badge variant="warning">ここで停滞</Badge>
                      ) : null}
                      <span className="tabular-nums text-xs text-muted">
                        {m.progressPct}%
                      </span>
                    </span>
                  </div>
                  <ProgressBar value={m.progressPct} />
                </div>
              ))}
            </div>
          ) : null}
          {online.cohortComparisonJa ? (
            <p className="text-xs text-muted">{online.cohortComparisonJa}</p>
          ) : null}
          <p className="text-xs text-muted">
            最終学習アクティビティ: {online.lastStudyAt}
            {idleLabel ? (
              <span className="ml-2 font-medium text-foreground">
                （{idleLabel}）
              </span>
            ) : null}
          </p>
        </CardContent>
      </Card>

      <Card className="border-emerald-600/20 bg-emerald-600/[0.04]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCheck className="size-5 text-emerald-700" />
            対面での最終確認・認定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted">
            本人確認とカンニング抑止のため、ランクは対面試験の結果で更新される想定です。
          </p>
          <div className="rounded-lg border border-border bg-background/80 p-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">日本語（対面認定）</span>
              <Badge variant={jpStatus.variant}>{jpStatus.label}</Badge>
            </div>
            {inPerson.japanese.certifiedJlptEquivalent ? (
              <p>
                認定レベル:{" "}
                <span className="font-semibold text-foreground">
                  {inPerson.japanese.certifiedJlptEquivalent}
                </span>
                {inPerson.japanese.examAt
                  ? `（${inPerson.japanese.examAt}）`
                  : null}
              </p>
            ) : (
              <p className="text-muted">未認定（対面試験の合格が必要）</p>
            )}
            {inPerson.japanese.venueJa ? (
              <p className="text-xs text-muted">会場: {inPerson.japanese.venueJa}</p>
            ) : null}
            {inPerson.japanese.proctorJa ? (
              <p className="text-xs text-muted">
                試験担当: {inPerson.japanese.proctorJa}
              </p>
            ) : null}
          </div>
          <div className="rounded-lg border border-border bg-background/80 p-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">倫理（対面確認）</span>
              <Badge variant={ethStatus.variant}>{ethStatus.label}</Badge>
            </div>
            <p className="text-xs text-muted">{inPerson.ethics.standardNameJa}</p>
            {inPerson.ethics.resultLabelJa ? (
              <p>結果: {inPerson.ethics.resultLabelJa}</p>
            ) : null}
            {inPerson.ethics.examAt ? (
              <p className="text-xs text-muted">実施日: {inPerson.ethics.examAt}</p>
            ) : null}
            {inPerson.ethics.venueJa ? (
              <p className="text-xs text-muted">会場: {inPerson.ethics.venueJa}</p>
            ) : null}
          </div>
          <div className="flex gap-2 rounded-md border border-border/80 bg-surface/60 p-3 text-xs text-muted">
            <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
            <p>{footnoteJa}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
