/** 営業デモ iframe 内のビート同期（親ウィンドウ → postMessage） */

export const SALES_DEMO_BEAT_MESSAGE_TYPE = "sales-demo-beat" as const;

export type SalesDemoBeatMessage = {
  type: typeof SALES_DEMO_BEAT_MESSAGE_TYPE;
  slideId: string;
  /** 空文字はハイライト解除 */
  beatId: string;
  seq: number;
};

export function isSalesDemoBeatMessage(
  data: unknown
): data is SalesDemoBeatMessage {
  if (!data || typeof data !== "object") return false;
  const o = data as Record<string, unknown>;
  return (
    o.type === SALES_DEMO_BEAT_MESSAGE_TYPE &&
    typeof o.slideId === "string" &&
    typeof o.beatId === "string" &&
    typeof o.seq === "number"
  );
}
