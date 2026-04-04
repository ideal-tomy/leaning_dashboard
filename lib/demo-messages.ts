/**
 * ワーカーからのシンハラ語メッセージ（翻訳デモ用）。
 * 50 件に増やす場合はこの配列に追記する（返答demo.md を手で転記推奨）。
 */
export type DemoMessageSentiment = "neutral" | "warning" | "danger";

export interface DemoMessage {
  id: string;
  si: string;
  readingJa?: string;
  ja: string;
  category?: string;
  sentiment?: DemoMessageSentiment;
  unread?: boolean;
}

export const demoMessages: DemoMessage[] = [
  {
    id: "msg-1",
    si: "Subha udayak.",
    readingJa: "スバ ウダヤッ",
    ja: "おはようございます",
    category: "挨拶",
    sentiment: "neutral",
    unread: true,
  },
  {
    id: "msg-2",
    si: "Ada mata enna baha.",
    readingJa: "アダ マタ エンナ バハ",
    ja: "今日は行けません",
    category: "勤怠",
    sentiment: "warning",
    unread: true,
  },
  {
    id: "msg-3",
    si: "Mata lankawata yanna ona.",
    readingJa: "マタ ランカワタ ヤンナ オナ",
    ja: "スリランカに帰りたいです",
    category: "相談",
    sentiment: "danger",
    unread: true,
  },
  {
    id: "msg-4",
    si: "Kauruhari mata benna.",
    readingJa: "カウルハリ マタ ベンナ",
    ja: "誰かに怒られました",
    category: "トラブル",
    sentiment: "danger",
    unread: false,
  },
  {
    id: "msg-5",
    si: "Isthuthi.",
    readingJa: "イストゥティ",
    ja: "ありがとうございます",
    category: "挨拶",
    sentiment: "neutral",
    unread: false,
  },
];

export function unreadDemoMessageCount(): number {
  return demoMessages.filter((m) => m.unread).length;
}
