/**
 * 技術デモハブの一覧（単一ソース）。ハブのグリッドと下層ルートのパスに使用。
 */
export type FeatureDemoTag = "OCR" | "PDF" | "AI" | "翻訳" | "マッチング";

export type FeatureDemoCatalogItem = {
  slug: string;
  title: string;
  summary: string;
  tags: FeatureDemoTag[];
  /** app ルート（先頭スラッシュ） */
  routePath: string;
  /** staffing + client では書類系と同様に非表示 */
  hideForStaffingClient: boolean;
};

export const FEATURE_DEMOS: FeatureDemoCatalogItem[] = [
  {
    slug: "passport-ocr",
    title: "パスポート OCR",
    summary: "画像から氏名・番号・期限を抽出するデモ（Sheet で結果表示）",
    tags: ["OCR"],
    routePath: "/feature-demos/passport-ocr",
    hideForStaffingClient: true,
  },
  {
    slug: "visa-pdf",
    title: "ビザ更新・申請書類 PDF",
    summary: "入力・プレビュー・保存までの下書きフロー（デモ）",
    tags: ["PDF"],
    routePath: "/feature-demos/visa-pdf",
    hideForStaffingClient: true,
  },
  {
    slug: "knowledge-ai",
    title: "ナレッジ AI",
    summary: "社内ルール・FAQ をチャットで参照（静的応答デモ）",
    tags: ["AI"],
    routePath: "/feature-demos/knowledge-ai",
    hideForStaffingClient: false,
  },
  {
    slug: "messages-ai",
    title: "メッセージ（AI 翻訳イメージ）",
    summary: "シンハラ語と日本語の並列表示・訳の開示（デモ）",
    tags: ["翻訳", "AI"],
    routePath: "/feature-demos/messages-ai",
    hideForStaffingClient: false,
  },
  {
    slug: "matching-ai",
    title: "マッチング（AI 理由）",
    summary: "案件と候補の提案・理由説明（デモロジック）",
    tags: ["マッチング", "AI"],
    routePath: "/feature-demos/matching-ai",
    hideForStaffingClient: false,
  },
];

export function filterFeatureDemosForRole(
  items: FeatureDemoCatalogItem[],
  industry: string,
  role: string
): FeatureDemoCatalogItem[] {
  if (industry === "staffing" && role === "client") {
    return items.filter((i) => !i.hideForStaffingClient);
  }
  return items;
}
