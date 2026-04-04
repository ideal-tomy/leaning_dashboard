import {
  BookOpen,
  ClipboardList,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Users,
} from "lucide-react";
import type { ActivityEvent, ActivityEventKind } from "@data/types";
import { cn } from "@/lib/utils";
import {
  DEMO_REFERENCE_DATE_ISO,
  daysUntilDateIso,
  sortActivityEventsDesc,
} from "@/lib/candidate-detail-helpers";

const INITIAL_VISIBLE = 7;

function kindIcon(kind: ActivityEventKind) {
  switch (kind) {
    case "interview":
      return Users;
    case "learning":
      return BookOpen;
    case "document":
      return FileText;
    case "status":
      return RefreshCw;
    default:
      return ClipboardList;
  }
}

function kindAccent(kind: ActivityEventKind): string {
  switch (kind) {
    case "interview":
      return "border-violet-500/30 bg-violet-500/[0.06]";
    case "learning":
      return "border-sky-500/30 bg-sky-500/[0.06]";
    case "document":
      return "border-amber-500/30 bg-amber-500/[0.06]";
    case "status":
      return "border-emerald-500/30 bg-emerald-500/[0.06]";
    default:
      return "border-border bg-surface/60";
  }
}

type Props = {
  events: ActivityEvent[] | undefined;
  referenceDateIso?: string;
};

export function CandidateActivityTimeline({
  events,
  referenceDateIso = DEMO_REFERENCE_DATE_ISO,
}: Props) {
  const list = events?.length ? sortActivityEventsDesc(events) : [];
  const initial = list.slice(0, INITIAL_VISIBLE);
  const rest = list.slice(INITIAL_VISIBLE);

  return (
    <section
      id="candidate-activity-timeline"
      className="scroll-mt-4 rounded-xl border border-border bg-surface/40"
      aria-labelledby="activity-timeline-heading"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <MoreHorizontal className="size-4 text-muted" aria-hidden />
        <h2
          id="activity-timeline-heading"
          className="text-sm font-semibold text-foreground"
        >
          アクティビティ（時系列）
        </h2>
      </div>
      <div className="px-4 py-3">
        {list.length === 0 ? (
          <p className="text-sm text-muted">
            アクティビティログはまだありません（デモ）。
          </p>
        ) : (
          <ul className="space-y-0">
            {initial.map((ev, idx) => (
              <TimelineRow
                key={`${ev.at}-${idx}`}
                ev={ev}
                referenceDateIso={referenceDateIso}
                isLast={idx === initial.length - 1 && rest.length === 0}
              />
            ))}
            {rest.length > 0 ? (
              <li className="pt-2">
                <details className="group">
                  <summary className="cursor-pointer list-none text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
                    もっと見る（あと {rest.length} 件）
                  </summary>
                  <ul className="mt-2 space-y-0 border-t border-border/80 pt-2">
                    {rest.map((ev, idx) => (
                      <TimelineRow
                        key={`${ev.at}-more-${idx}`}
                        ev={ev}
                        referenceDateIso={referenceDateIso}
                        isLast={idx === rest.length - 1}
                      />
                    ))}
                  </ul>
                </details>
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </section>
  );
}

function TimelineRow({
  ev,
  referenceDateIso,
  isLast,
}: {
  ev: ActivityEvent;
  referenceDateIso: string;
  isLast: boolean;
}) {
  const Icon = kindIcon(ev.kind);
  const datePart = ev.at.slice(0, 10);
  const days = daysUntilDateIso(datePart, referenceDateIso);
  const rel =
    days == null
      ? null
      : days === 0
        ? "当日"
        : days > 0
          ? `${days}日後`
          : `${Math.abs(days)}日前`;

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast ? (
        <span
          className="absolute left-[15px] top-9 bottom-0 w-px bg-border"
          aria-hidden
        />
      ) : null}
      <div
        className={cn(
          "relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border",
          kindAccent(ev.kind)
        )}
      >
        <Icon className="size-3.5 text-foreground/80" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-medium text-foreground">{ev.titleJa}</p>
        <p className="mt-0.5 text-xs tabular-nums text-muted">
          {ev.at}
          {rel ? ` · ${rel}` : null}
        </p>
        {ev.detailJa ? (
          <p className="mt-1 text-xs text-muted">{ev.detailJa}</p>
        ) : null}
      </div>
    </li>
  );
}
