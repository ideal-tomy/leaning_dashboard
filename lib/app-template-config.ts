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
        path: "/operations",
        icon: "Clock",
        title: "勤怠・請求",
        subtitle: "勤怠情報から経費計算連携",
        desktopTitle: "勤怠・請求（拡張枠）",
        desktopBody:
          "CSV 取込イメージ。今回はプレースホルダ — 実務・収益ハブへ",
        desktopCta: "開く",
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
        path: "/more",
        icon: "LayoutGrid",
        title: "連携・カスタム",
        subtitle: "外部連携と追加ウィジェット（デモ）",
        desktopTitle: "連携・アラート（拡張枠）",
        desktopBody:
          "外部システム・承認キュー・任意 KPI を載せられる想定のスロット。「その他」へのショートカット。",
        desktopCta: "その他へ",
      },
    ] satisfies DashboardExtensionSlotBase[],
  },

  /** シェル周り */
  shell: {
    topNav: [
      { href: "/", label: "ダッシュボード", icon: "LayoutDashboard" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/operations", label: "実務・収益", icon: "TrendingUp" },
      { href: "/knowledge", label: "ナレッジ", icon: "Sparkles" },
    ] satisfies TemplateNavItem[],
    bottomNav: [
      { href: "/", label: "Home", icon: "Home" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/revenue", label: "収益", icon: "TrendingUp" },
      { href: "/more", label: "その他", icon: "MoreHorizontal" },
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
