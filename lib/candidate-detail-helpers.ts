import type { Milestone } from "@data/types";

/** デモバンドル meta.referenceDate と同一 */
export const DEMO_REFERENCE_DATE_ISO = "2026-04-03";

function startOfDayUtc(isoDate: string): number {
  const d = new Date(`${isoDate}T00:00:00.000Z`);
  return d.getTime();
}

/** 基準日から見た経過日数（last が reference より前なら正の整数） */
export function daysSinceDateIso(
  lastIsoDate: string,
  referenceIsoDate: string = DEMO_REFERENCE_DATE_ISO
): number | null {
  const a = startOfDayUtc(lastIsoDate.slice(0, 10));
  const b = startOfDayUtc(referenceIsoDate.slice(0, 10));
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  const diff = Math.round((b - a) / 86_400_000);
  return diff >= 0 ? diff : null;
}

/** 期限までの日数（reference が due より前なら正） */
export function daysUntilDateIso(
  dueIsoDate: string,
  referenceIsoDate: string = DEMO_REFERENCE_DATE_ISO
): number | null {
  const due = startOfDayUtc(dueIsoDate.slice(0, 10));
  const ref = startOfDayUtc(referenceIsoDate.slice(0, 10));
  if (Number.isNaN(due) || Number.isNaN(ref)) return null;
  return Math.round((due - ref) / 86_400_000);
}

export function sortMilestonesByDate(m: Milestone[]): Milestone[] {
  return [...m].sort(
    (x, y) =>
      startOfDayUtc(x.dateIso.slice(0, 10)) -
      startOfDayUtc(y.dateIso.slice(0, 10))
  );
}

export function sortActivityEventsDesc<T extends { at: string }>(
  events: T[]
): T[] {
  return [...events].sort((x, y) => {
    const tx = Date.parse(x.at);
    const ty = Date.parse(y.at);
    if (Number.isNaN(tx) || Number.isNaN(ty)) return 0;
    return ty - tx;
  });
}

/** 学習パネル用：最終学習からの経過日数表示 */
export function formatStudyIdleLabel(
  lastStudyAt: string,
  referenceIsoDate: string = DEMO_REFERENCE_DATE_ISO
): string | null {
  const days = daysSinceDateIso(lastStudyAt, referenceIsoDate);
  if (days == null) return null;
  if (days === 0) return "本日ログインあり（基準日時点）";
  if (days === 1) return "最終学習から1日経過";
  return `最終学習から${days}日経過`;
}
