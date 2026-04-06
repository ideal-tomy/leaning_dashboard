import Link from "next/link";
import { Building2, CalendarClock, HeartPulse, MessageCircle } from "lucide-react";
import type { Candidate, ClientCompany } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DemoRole } from "@/lib/demo-role";
import {
  DEMO_REFERENCE_DATE_ISO,
  daysUntilDateIso,
  sortMilestonesByDate,
} from "@/lib/candidate-detail-helpers";

type Props = {
  candidate: Candidate;
  assigned?: ClientCompany;
  role: DemoRole;
  referenceDateIso?: string;
};

function followVariant(
  v: "secondary" | "warning" | "danger" | undefined
): "secondary" | "warning" | "danger" | "default" {
  return v ?? "default";
}

export function CandidateDetailHeroStrip({
  candidate: c,
  assigned,
  role,
  referenceDateIso = DEMO_REFERENCE_DATE_ISO,
}: Props) {
  const d = c.detailDemo;
  const showAdmin = role === "admin";

  if (!d && !c.plannedAssignment) {
    return null;
  }

  const milestones = d?.milestones?.length
    ? sortMilestonesByDate(d.milestones).slice(0, 3)
    : [];
  const follow = (d?.followReasons ?? []).slice(0, 5);

  return (
    <Card className="border-primary/20 bg-primary/[0.02]">
      <CardContent className="space-y-4 pt-5">
        {d ? (
          <div className="flex flex-wrap items-start gap-3">
            <HeartPulse
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                ステータスサマリー
              </p>
              {d.healthSummaryJa ? (
                <p className="text-sm leading-relaxed text-foreground">
                  {d.healthSummaryJa}
                </p>
              ) : (
                <p className="text-sm text-muted">
                  ヘルスサマリーは未登録です。タブから詳細を確認してください。
                </p>
              )}
              {follow.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {follow.map((f) => (
                    <Badge key={f.code} variant={followVariant(f.variant)}>
                      {f.labelJa}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {c.plannedAssignment && assigned ? (
          <div className="flex flex-wrap items-start gap-2 rounded-lg border border-border bg-surface/80 px-3 py-2 text-sm">
            <Building2 className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <div>
              <p className="font-medium text-foreground">{assigned.tradeNameJa}</p>
              <p className="text-muted">{c.plannedAssignment.jobTitleJa}</p>
            </div>
          </div>
        ) : null}

        {d?.workerAppSyncNoteJa ? (
          <p className="text-xs text-muted">{d.workerAppSyncNoteJa}</p>
        ) : null}

        {milestones.length > 0 ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <CalendarClock className="size-3.5" aria-hidden />
                次の予定・期限（直近3件）
              </p>
              <Link
                href="#candidate-activity-timeline"
                className="text-xs font-medium text-primary hover:underline"
              >
                活動ログへ
              </Link>
            </div>
            <ul className="space-y-1.5 text-sm">
              {milestones.map((m) => {
                const days = daysUntilDateIso(m.dateIso, referenceDateIso);
                const dayLabel =
                  days == null
                    ? m.dateIso
                    : days === 0
                      ? "今日"
                      : days > 0
                        ? `あと${days}日（${m.dateIso}）`
                        : `${Math.abs(days)}日前（${m.dateIso}）`;
                return (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-1.5 last:border-0 last:pb-0"
                  >
                    <span className="text-foreground">{m.labelJa}</span>
                    <span className="tabular-nums text-xs text-muted">{dayLabel}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {showAdmin && d?.contactFreshness ? (
          <div className="flex flex-wrap items-start gap-2 rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-sm">
            <MessageCircle className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <div>
              <p className="font-medium text-foreground">
                {d.contactFreshness.channelLabelJa ?? "連絡チャネル（デモ）"}
              </p>
              <p className="text-muted">
                最終返信: {d.contactFreshness.lastReplyAt}
                {d.contactFreshness.unread ? (
                  <Badge variant="warning" className="ml-2">
                    未読あり
                  </Badge>
                ) : (
                  <span className="ml-2 text-xs">（既読想定）</span>
                )}
              </p>
            </div>
          </div>
        ) : !showAdmin && d?.contactFreshness ? (
          <p className="text-xs text-muted">
            個別連絡の詳細は支援機関側で管理しています（工場向けデモ表示）。
          </p>
        ) : null}

        {d?.cultureNote ? (
          <div className="rounded-lg border border-emerald-700/15 bg-emerald-700/[0.04] px-3 py-2 text-sm">
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
              文化・コミュニケーション
            </p>
            {d.cultureNote.nameSinhala ? (
              <p className="mt-1 font-medium text-foreground" lang="si">
                {d.cultureNote.nameSinhala}
              </p>
            ) : null}
            {d.cultureNote.noteJa ? (
              <p className="mt-1 text-muted">{d.cultureNote.noteJa}</p>
            ) : null}
          </div>
        ) : null}

        {showAdmin && d?.internalTasks && d.internalTasks.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted">社内 ToDo（支援機関）</p>
            <ul className="space-y-1 text-sm">
              {d.internalTasks.map((t, i) => (
                <li
                  key={`${t.titleJa}-${i}`}
                  className="flex flex-wrap gap-2 border-l-2 border-primary/30 pl-2"
                >
                  <span className="text-foreground">{t.titleJa}</span>
                  {t.assigneeJa ? (
                    <span className="text-xs text-muted">担当: {t.assigneeJa}</span>
                  ) : null}
                  {t.dueIso ? (
                    <span className="text-xs tabular-nums text-muted">
                      期限 {t.dueIso}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
