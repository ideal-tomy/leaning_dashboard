export type DemoClientRequest = {
  id: string;
  clientName: string;
  channel: "email" | "message";
  receivedAt: string;
  urgency: "high" | "medium" | "low";
  subject: string;
  body: string;
  aiSummary: string;
  aiRecommendedAction: string;
};

export const demoClientRequests: DemoClientRequest[] = [
  {
    id: "req-001",
    clientName: "大和弁当センター",
    channel: "email",
    receivedAt: "2026-04-05 09:20",
    urgency: "high",
    subject: "夜勤シフト増員の相談（至急）",
    body: "来週から夜勤ラインが1枠不足する見込みです。既存スタッフで調整が難しく、追加で1名の配属候補を急ぎ確認したいです。衛生教育が完了している方を優先したいです。",
    aiSummary: "夜勤シフト欠員1名。衛生教育済み候補を優先して至急提案が必要。",
    aiRecommendedAction:
      "候補者一覧をリスクタグで確認し、夜勤可・衛生教育済み候補を2名提示。今日中に一次回答。",
  },
  {
    id: "req-002",
    clientName: "関東ベジタブル",
    channel: "message",
    receivedAt: "2026-04-05 14:05",
    urgency: "medium",
    subject: "受入初日オリエン資料の更新依頼",
    body: "新しいライン手順に合わせて初日説明資料を更新したいです。翻訳済みの資料があれば共有お願いします。今週中に現場責任者へ展開したいです。",
    aiSummary: "初日オリエン資料の更新と翻訳版共有依頼。期限は今週中。",
    aiRecommendedAction:
      "書類管理の保管ファイルから関連資料を抽出し、最新版を先方へ送付。必要なら翻訳タスクを起票。",
  },
  {
    id: "req-003",
    clientName: "彩りデリカ",
    channel: "email",
    receivedAt: "2026-04-06 08:40",
    urgency: "low",
    subject: "月次レビュー日程の調整",
    body: "4月分の月次レビューを来週実施したいです。候補日を3つほどいただけると助かります。特段のトラブルはありません。",
    aiSummary: "月次レビュー日程調整。緊急度は低い。",
    aiRecommendedAction:
      "運用カレンダーと担当者都合を確認し、候補日を3案返信。次回議題のたたき台も添付。",
  },
];

