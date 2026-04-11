/**
 * 営業ストーリー iframe（`?storyEmbed=1`）内かどうか。
 * 埋め込み時は余白・強調枠を付け、画面端での切れを防ぐ。
 */
export function isStoryEmbedFromSearchParams(
  searchParams: Record<string, string | string[] | undefined> | undefined
): boolean {
  if (!searchParams) return false;
  const raw = searchParams.storyEmbed;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "1" || v === "true";
}

/** クライアントの `URLSearchParams` 用 */
export function isStoryEmbedUrlSearchParams(search: URLSearchParams): boolean {
  const v = search.get("storyEmbed");
  return v === "1" || v === "true";
}

/** 営業ストーリー iframe 内のダッシュボード焦点（同一URLでも見せ場を切り替える） */
export type StoryDashboardFocus = "overview" | "priority" | "closing";

export function getStoryDashboardFocusFromSearchParams(
  searchParams: Record<string, string | string[] | undefined> | undefined
): StoryDashboardFocus | undefined {
  if (!searchParams) return undefined;
  const raw = searchParams.storyFocus;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "overview" || v === "priority" || v === "closing") return v;
  return undefined;
}

/** iframe 埋め込み時のページ縦横余白（全 preview 先で統一） */
export const STORY_EMBED_PAGE_STACK_CLASS =
  "box-border px-3 pb-4 pt-3 sm:px-4 sm:pt-4";
