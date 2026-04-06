import {
  defaultIndustryKey,
  getIndustryProfile,
} from "@/lib/industry-profiles";
import type { DashboardExtensionSlotBase } from "@/lib/dashboard-extension-types";

const defaultProfile = getIndustryProfile(defaultIndustryKey);

/**
 * アプリ全体の「テンプレート設定」— 別デモ・別業種に差し替える主入口。
 * 派遣デモの文言・ナビはここを編集するか、別ファイルにコピーして import を差し替える。
 */

/**
 * トップ導線の対応（監査用・PC/スマホ同一ルート）:
 * - KPI カード: lib/dashboard-top-cards.ts の href（人材→候補者、就労状態→pipeline、就労管理→/operations）
 * - 拡張枠: 下記 extensionSlots の path（勤怠→/attendance-billing、連携→/integrations など）
 */

/** ナビで使う Lucide アイコン名（components/template-nav-icons.tsx と一致させる） */
export type TemplateNavIconName =
  | "LayoutDashboard"
  | "Users"
  | "Building2"
  | "TrendingUp"
  | "Sparkles"
  | "Home"
  | "MoreHorizontal"
  | "ClipboardList"
  | "FileText"
  | "GitBranch"
  | "Clock"
  | "MessageSquare";

export type TemplateNavItem = {
  href: string;
  label: string;
  icon: TemplateNavIconName;
};

export const appTemplateConfig = {
  branding: {
    productName: defaultProfile.productName,
    /** ヘッダー横バッジ。不要なら null */
    badgeLabel: defaultProfile.badgeLabel as string | null,
    metadata: {
      title: defaultProfile.metadataTitle,
      description: defaultProfile.metadataDescription,
    },
  },

  /** トップダッシュ（/）のコピー */
  dashboard: {
    pageTitle: defaultProfile.dashboardTitle,
    pageSubtitle: defaultProfile.dashboardSubtitle,
    /**
     * メインカード群の列数（PC 想定）。3 = 従来の 3×2＋拡張行、4 = 1行4枚を優先。
     */
    gridColumns: 3 as 3 | 4,
    /**
     * 拡張枠（下段フル幅内で 2×2 / 4 列）。enabled で個別に消せる。
     * 業種別の文言差し替えは `industry-page-hints` の `dashboardExtensionOverrides`。
     */
    extensionSlots: [
      {
        id: "attendanceBilling",
        enabled: true,
        path: "/attendance-billing",
        icon: "Clock",
        title: "勤怠・請求",
        subtitle: "勤怠情報から経費計算連携",
        desktopTitle: "勤怠・請求（拡張枠）",
        desktopBody:
          "CSV 取込と集計プレビューのダミー（デモ）。実務オペレーションとは別画面で扱います。",
        desktopCta: "勤怠・請求デモへ",
      },
      {
        id: "knowledgeAi",
        enabled: true,
        path: "/knowledge",
        icon: "Sparkles",
        title: "社内ナレッジ",
        subtitle: "社内情報管理と共有",
        desktopTitle: "社内ナレッジ AI（拡張枠）",
        desktopBody:
          "入管トラブル FAQ をチャットで — デモでは概要のみ表示",
        desktopCta: "ナレッジへ",
      },
      {
        id: "fieldReports",
        enabled: true,
        path: "/field-reports",
        icon: "Camera",
        title: "データ登録・報告",
        subtitle: "テンプレで追加可能な枠（デモ）",
        desktopTitle: "報告・登録ハブ（拡張枠）",
        desktopBody:
          "現場や支店からの報告・写真を一元化する想定のプレースホルダです。業種ごとに文言を差し替えられます。",
        desktopCta: "開く",
      },
      {
        id: "customInsight",
        enabled: true,
        path: "/integrations",
        icon: "LayoutGrid",
        title: "連携・カスタム",
        subtitle: "外部連携と追加ウィジェット（デモ）",
        desktopTitle: "連携・アラート（拡張枠）",
        desktopBody:
          "外部システム・承認キュー・任意 KPI を載せる想定の連携ダッシュ（デモ）。設定やその他メニューは本文内から。",
        desktopCta: "連携ダッシュへ",
      },
    ] satisfies DashboardExtensionSlotBase[],
  },

  /** シェル周り */
  shell: {
    topNav: [
      { href: "/", label: "ダッシュボード", icon: "LayoutDashboard" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/operations", label: "実務", icon: "ClipboardList" },
      { href: "/revenue", label: "収益", icon: "TrendingUp" },
      { href: "/knowledge", label: "ナレッジ", icon: "Sparkles" },
    ] satisfies TemplateNavItem[],
    /**
     * スマホ下部タブ（md 未満）。PC の topNav と同一の並びに、
     * 「その他」にあったメッセージ・マッチング・書類を続けて並べる（横スクロール）。
     */
    bottomNav: [
      { href: "/", label: "Home", icon: "Home" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/operations", label: "実務", icon: "ClipboardList" },
      { href: "/revenue", label: "収益", icon: "TrendingUp" },
      { href: "/knowledge", label: "ナレッジ", icon: "Sparkles" },
      { href: "/messages", label: "メッセージ", icon: "MessageSquare" },
      { href: "/matching", label: "マッチング", icon: "GitBranch" },
      { href: "/documents", label: "書類", icon: "FileText" },
    ] satisfies TemplateNavItem[],
    /** メッセージ（ベル）リンク */
    showMessagesLink: true,
    /** 右下 FAB（OCR デモ等） */
    showDemoFab: true,
  },
} as const;

export type AppTemplateConfig = typeof appTemplateConfig;

/** ダッシュボードグリッド用 Tailwindクラス */
export function dashboardGridClass(columns: 3 | 4): string {
  if (columns === 3) {
    return "grid min-w-0 grid-cols-3 items-stretch gap-1.5 md:gap-4 xl:gap-6";
  }
  return "grid min-w-0 grid-cols-3 md:grid-cols-4 items-stretch gap-1.5 md:gap-4 xl:gap-6";
}
