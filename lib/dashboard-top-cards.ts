import type { DemoRole } from "@/lib/demo-role";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DashboardViewMode } from "@/lib/dashboard-view-mode";
import { withDemoQuery } from "@/lib/demo-query";

export type DashboardTopCardTone = "default" | "warning" | "danger" | "success";

export type DashboardTopCardDefinition = {
  id: string;
  title: string;
  subtitle: string;
  kpiLabel: string;
  kpiValue: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
  tone?: DashboardTopCardTone;
};

type DashboardTopCardInput = {
  totalCandidates: number;
  n3OrAbove: number;
  docAlerts: number;
  totalClients: number;
  totalOpenSlots: number;
  trainingCount: number;
  awaitingEntryCount: number;
  activeAssignments: number;
};

export function buildDashboardTopCards(
  viewMode: DashboardViewMode,
  industry: EnabledIndustryKey,
  role: DemoRole,
  input: DashboardTopCardInput
): DashboardTopCardDefinition[] {
  if (viewMode === "factory") {
    return [
      {
        id: "people",
        title: "人材管理",
        subtitle: "配属中・予定のスタッフを把握する",
        kpiLabel: "対象人数",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          `配属中（デモ）: ${input.activeAssignments}名`,
          `日本語N3以上: ${input.n3OrAbove}名`,
          input.docAlerts > 0
            ? `要フォロー（支援機関連携）: ${input.docAlerts}件`
            : "要フォロー（支援機関連携）: 0件",
        ],
        ctaLabel: "スタッフ一覧を開く",
        href: withDemoQuery("/candidates", industry, role),
      },
      {
        id: "work-status",
        title: "就労状態",
        subtitle: "入社・配属までの見通しを確認する",
        kpiLabel: "進行中",
        kpiValue: `${input.awaitingEntryCount}名`,
        highlights: [
          `配属準備中: ${input.trainingCount}名`,
          `入社待ち: ${input.awaitingEntryCount}名`,
          "詳細はパイプラインへ",
        ],
        ctaLabel: "就労状態を確認する",
        href: withDemoQuery("/candidates?view=pipeline", industry, role),
        tone: "warning",
      },
      {
        id: "work-management",
        title: "就労管理",
        subtitle: "現場運用と受け入れ状況を確認する",
        kpiLabel: "未充足枠",
        kpiValue: `${input.totalOpenSlots}名`,
        highlights: [
          `稼働中（デモ）: ${input.activeAssignments}名`,
          `受け入れ拠点: ${input.totalClients}拠点`,
          "評価・配属調整へ",
        ],
        ctaLabel: "就労管理を開く",
        href: withDemoQuery("/operations", industry, role),
      },
    ];
  }

  return [
    {
      id: "people",
      title: "人材管理",
      subtitle: "今日フォローすべき人を優先表示",
      kpiLabel: "対象人数",
      kpiValue: `${input.totalCandidates}名`,
      highlights: [
        `日本語N3以上: ${input.n3OrAbove}名`,
        input.docAlerts > 0
          ? `要フォロー（書類・期限）: ${input.docAlerts}件`
          : "要フォロー（書類・期限）: 0件",
          "評価・面談ログへ",
      ],
      ctaLabel: "人材一覧を見る",
      href: withDemoQuery("/candidates", industry, role),
    },
    {
      id: "documents",
      title: "書類管理",
      subtitle: "入国前後の手続きと期限を確認",
      kpiLabel: "要対応件数",
      kpiValue: `${input.docAlerts}件`,
      highlights: [
        "入国前（ビザ・申請）",
        "入国後（契約・更新）",
        "期限・保管を確認",
      ],
      ctaLabel: "手続きハブを開く",
      href: withDemoQuery("/documents?scope=pre-entry", industry, role),
      tone: input.docAlerts > 0 ? "danger" : "default",
    },
    {
      id: "clients",
      title: "派遣先管理",
      subtitle: "派遣先一覧と候補先の状態を把握",
      kpiLabel: "派遣先数",
      kpiValue: `${input.totalClients}社`,
      highlights: [
        `未充足枠: ${input.totalOpenSlots}名`,
        "受け入れ条件を確認",
        "候補先を比較",
      ],
      ctaLabel: "派遣先一覧を見る",
      href: withDemoQuery("/clients", industry, role),
    },
    {
      id: "learning",
      title: "学習管理",
      subtitle: "全体進捗と遅延フォローを確認",
      kpiLabel: "追跡対象",
      kpiValue: `${input.totalCandidates}名`,
      highlights: [
        "全体進捗チャートを確認",
        "コンテンツ運用へ",
        "遅延フォローを抽出",
      ],
      ctaLabel: "学習サマリーを見る",
      href: withDemoQuery("/learning-insights", industry, role),
      tone: "success",
    },
    {
      id: "employment",
      title: "就労管理",
      subtitle: "配属・定着・成長の流れを把握",
      kpiLabel: "進行中",
      kpiValue: `${input.trainingCount + input.awaitingEntryCount}名`,
      highlights: [
        `配属準備中: ${input.trainingCount}名`,
        `入社待ち: ${input.awaitingEntryCount}名`,
        "就労オペレーションへ",
      ],
      ctaLabel: "就労管理を開く",
      href: withDemoQuery("/operations", industry, role),
      tone: "warning",
    },
  ];
}

