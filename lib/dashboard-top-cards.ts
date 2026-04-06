import type { DemoRole } from "@/lib/demo-role";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import type { DashboardViewMode } from "@/lib/dashboard-view-mode";
import { withDemoQuery } from "@/lib/demo-query";
import { countConstructionPartners } from "@/lib/demo-data.construction";

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
  /** 営業ダッシュ: 受注見込みフェーズ件数（offer_accepted） */
  pipelineOfferAccepted?: number;
  /** 営業ダッシュ: 停滞・要修正（document_blocked + document_prep） */
  pipelineStalledSales?: number;
};

export function buildDashboardTopCards(
  viewMode: DashboardViewMode,
  industry: EnabledIndustryKey,
  role: DemoRole,
  input: DashboardTopCardInput
): DashboardTopCardDefinition[] {
  if (viewMode === "support_org" && industry === "construction") {
    const partnerCount = countConstructionPartners();
    return [
      {
        id: "personnel_network",
        title: "人員・下請・関係企業",
        subtitle: "職人と協力会社の資格・教育・書類を横断",
        kpiLabel: "登録",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          input.docAlerts > 0
            ? `要フォロー（安全・入場書類）: ${input.docAlerts}件`
            : "要フォロー（安全・入場書類）: 0件",
          `安全教育・工程調整中: ${input.trainingCount + input.awaitingEntryCount}名`,
          "参加適合・関係企業はハブ内タブで確認",
        ],
        ctaLabel: "人員・関係企業ハブへ",
        href: withDemoQuery("/personnel-hub", industry, role),
        tone: input.docAlerts > 0 ? "warning" : "default",
      },
      {
        id: "partners",
        title: "取引先",
        subtitle: "元請・主要協力会社の登録・適格性",
        kpiLabel: "取引先",
        kpiValue: `${partnerCount}社`,
        highlights: [
          "グリーン登録・階層タグで一覧",
          "現場条件との照合は専用タブ",
          "期限接近・未登録を優先表示",
        ],
        ctaLabel: "取引先を見る",
        href: withDemoQuery("/partners", industry, role),
        tone: "default",
      },
      {
        id: "sites",
        title: "現場",
        subtitle: "工期・欠員・現場ルール・配員",
        kpiLabel: "現場数",
        kpiValue: `${input.totalClients}件`,
        highlights: [
          `未充足枠: ${input.totalOpenSlots}名`,
          "参加条件・配員最適化は現場ハブから",
          "工期・必須資格は一覧で確認",
        ],
        ctaLabel: "現場一覧へ",
        href: withDemoQuery("/clients", industry, role),
        tone: "default",
      },
      {
        id: "reports",
        title: "報告管理",
        subtitle: "写真・KY・点検の提出と差戻し",
        kpiLabel: "要確認",
        kpiValue: "1件",
        highlights: [
          "提出タスク・未提出を一覧",
          "写真証跡の公式確認場所（デモ）",
          "安全書類管理へ連携",
        ],
        ctaLabel: "報告管理へ",
        href: withDemoQuery("/field-reports", industry, role),
        tone: "warning",
      },
      {
        id: "attendance",
        title: "勤怠",
        subtitle: "CSV・集計・請求プレビュー",
        kpiLabel: "取込",
        kpiValue: "デモ済",
        highlights: [
          "稼働時間の集計プレビュー",
          "現場実務との突合イメージ",
          "請求見込み画面へも遷移可",
        ],
        ctaLabel: "勤怠を開く",
        href: withDemoQuery("/attendance-billing", industry, role),
        tone: "success",
      },
    ];
  }

  if (viewMode === "support_org" && industry === "education") {
    return [
      {
        id: "people",
        title: "受講者",
        subtitle: "未提出・進捗遅れのフォローを優先",
        kpiLabel: "登録",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          input.docAlerts > 0
            ? `要フォロー（提出・手続き）: ${input.docAlerts}件`
            : "要フォロー（提出・手続き）: 0件",
          `受講中・案内中: ${input.trainingCount + input.awaitingEntryCount}名`,
          "リスク・要フォローへ",
        ],
        ctaLabel: "受講者一覧を見る",
        href: withDemoQuery("/candidates", industry, role),
        tone: input.docAlerts > 0 ? "warning" : "default",
      },
      {
        id: "documents",
        title: "提出書類",
        subtitle: "申込・同意・課題の期限と不備を確認",
        kpiLabel: "要対応",
        kpiValue: `${input.docAlerts}件`,
        highlights: [
          "課題・修了書類",
          "OCR 検証（デモ）",
          "期限一覧へ",
        ],
        ctaLabel: "提出書類を開く",
        href: withDemoQuery("/documents?scope=pre-entry", industry, role),
        tone: input.docAlerts > 0 ? "danger" : "default",
      },
      {
        id: "clients",
        title: "講座",
        subtitle: "開講状況と空席を把握",
        kpiLabel: "講座数",
        kpiValue: `${input.totalClients}件`,
        highlights: [
          `募集中の空席: ${input.totalOpenSlots}枠`,
          "対象者・日程は一覧で確認",
          "講座別の提案へ",
        ],
        ctaLabel: "講座一覧を見る",
        href: withDemoQuery("/clients", industry, role),
      },
      {
        id: "matching",
        title: "受講提案",
        subtitle: "講座に合う受講者を比較（デモ）",
        kpiLabel: "対象",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          "講座ごとにスコア表示",
          "学習特性と講座要件の一致",
          "提案理由を確認",
        ],
        ctaLabel: "受講提案を開く",
        href: withDemoQuery("/matching", industry, role),
        tone: "success",
      },
      {
        id: "operations",
        title: "講座運営",
        subtitle: "開講準備・提出確認・フォロー連絡",
        kpiLabel: "進行中",
        kpiValue: `${input.trainingCount + input.awaitingEntryCount}名`,
        highlights: [
          `受講中: ${input.trainingCount}名`,
          `受講準備・調整: ${input.awaitingEntryCount}名`,
          "タイムラインと KPI を確認",
        ],
        ctaLabel: "講座運営を開く",
        href: withDemoQuery("/operations", industry, role),
        tone: "warning",
      },
    ];
  }

  if (viewMode === "support_org" && industry === "professional") {
    return [
      {
        id: "people",
        title: "相談案件",
        subtitle: "未回収証憑・対応期限のある案件を最優先",
        kpiLabel: "登録",
        kpiValue: `${input.totalCandidates}件`,
        highlights: [
          input.docAlerts > 0
            ? `要フォロー（証憑・申請期限）: ${input.docAlerts}件`
            : "要フォロー（証憑・申請期限）: 0件",
          `論点整理・手続・着手待ち: ${input.trainingCount + input.awaitingEntryCount}件`,
          "リスク・要フォローへ",
        ],
        ctaLabel: "相談案件一覧を見る",
        href: withDemoQuery("/candidates", industry, role),
        tone: input.docAlerts > 0 ? "warning" : "default",
      },
      {
        id: "documents",
        title: "申請書類",
        subtitle: "証憑回収・差戻し・再提出の状況を確認",
        kpiLabel: "要対応",
        kpiValue: `${input.docAlerts}件`,
        highlights: [
          "不足証憑・申請ドラフト",
          "証憑 OCR（デモ）",
          "期限・提出先を確認",
        ],
        ctaLabel: "申請書類を開く",
        href: withDemoQuery("/documents?scope=pre-entry", industry, role),
        tone: input.docAlerts > 0 ? "danger" : "default",
      },
      {
        id: "clients",
        title: "顧問先",
        subtitle: "依頼内容と未着手枠を横断して把握",
        kpiLabel: "顧問先数",
        kpiValue: `${input.totalClients}件`,
        highlights: [
          `未着手・要アサイン枠: ${input.totalOpenSlots}件`,
          "論点・期限は一覧で比較",
          "顧問先別の案件へ",
        ],
        ctaLabel: "顧問先一覧を見る",
        href: withDemoQuery("/clients", industry, role),
      },
      {
        id: "matching",
        title: "案件優先度",
        subtitle: "顧問先ごとの優先案件と AI 理由（デモ）",
        kpiLabel: "対象",
        kpiValue: `${input.totalCandidates}件`,
        highlights: [
          "顧問先ごとにスコア表示",
          "論点・期限と担当適合",
          "アサイン理由を確認",
        ],
        ctaLabel: "案件優先度を開く",
        href: withDemoQuery("/matching", industry, role),
        tone: "success",
      },
      {
        id: "operations",
        title: "申請実務・収支",
        subtitle: "当日の返答・送付・タイムチャージのイメージ",
        kpiLabel: "進行中",
        kpiValue: `${input.trainingCount + input.awaitingEntryCount}件`,
        highlights: [
          `論点整理・手続中: ${input.trainingCount + input.awaitingEntryCount}件`,
          "期限 7 日以内は KPI で確認",
          "タイムラインと収支へ",
        ],
        ctaLabel: "申請実務を開く",
        href: withDemoQuery("/operations", industry, role),
        tone: "warning",
      },
    ];
  }

  if (viewMode === "support_org" && industry === "medical") {
    return [
      {
        id: "people",
        title: "スタッフ",
        subtitle: "記録不備・院内研修・配置調整の要フォローを優先",
        kpiLabel: "登録",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          input.docAlerts > 0
            ? `要フォロー（記録・同意・研修）: ${input.docAlerts}件`
            : "要フォロー（記録・同意・研修）: 0件",
          `研修・勤務調整中: ${input.trainingCount + input.awaitingEntryCount}名`,
          "リスク・要フォローへ",
        ],
        ctaLabel: "スタッフ一覧を見る",
        href: withDemoQuery("/candidates", industry, role),
        tone: input.docAlerts > 0 ? "warning" : "default",
      },
      {
        id: "documents",
        title: "記録書類",
        subtitle: "同意・記録様式・資格講習の期限と不備を確認",
        kpiLabel: "要対応",
        kpiValue: `${input.docAlerts}件`,
        highlights: [
          "記録・同意・研修関連",
          "OCR 検証（デモ）",
          "期限一覧へ",
        ],
        ctaLabel: "記録書類を開く",
        href: withDemoQuery("/documents?scope=pre-entry", industry, role),
        tone: input.docAlerts > 0 ? "danger" : "default",
      },
      {
        id: "clients",
        title: "拠点案件",
        subtitle: "稼働拠点と不足シフト枠を把握",
        kpiLabel: "拠点数",
        kpiValue: `${input.totalClients}件`,
        highlights: [
          `不足シフト枠: ${input.totalOpenSlots}枠`,
          "勤務条件・必要スキルは一覧で確認",
          "拠点別の配置へ",
        ],
        ctaLabel: "拠点一覧を見る",
        href: withDemoQuery("/clients", industry, role),
      },
      {
        id: "matching",
        title: "配置提案",
        subtitle: "資格・ケア特性・勤務条件に基づく比較（デモ）",
        kpiLabel: "対象",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          "拠点ごとにスコア表示",
          "スキルタグとケア要件の一致",
          "配置理由を確認",
        ],
        ctaLabel: "配置提案を開く",
        href: withDemoQuery("/matching", industry, role),
        tone: "success",
      },
      {
        id: "operations",
        title: "運営実務",
        subtitle: "当日引継ぎ・記録確認・申し送り・欠員対応",
        kpiLabel: "進行中",
        kpiValue: `${input.trainingCount + input.awaitingEntryCount}名`,
        highlights: [
          `院内研修中: ${input.trainingCount}名`,
          `配属・勤務調整: ${input.awaitingEntryCount}名`,
          "タイムラインと KPI を確認",
        ],
        ctaLabel: "運営実務を開く",
        href: withDemoQuery("/operations", industry, role),
        tone: "warning",
      },
    ];
  }

  if (viewMode === "support_org" && industry === "logistics") {
    const todayShipmentsDemo = 142;
    const delayRiskTripsDemo = 3;
    return [
      {
        id: "people",
        title: "作業員",
        subtitle: "入構・資格・シフトの要フォローを優先",
        kpiLabel: "登録",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          input.docAlerts > 0
            ? `要フォロー（入構・免許）: ${input.docAlerts}件`
            : "要フォロー（入構・免許）: 0件",
          `本日出荷（デモ）: ${todayShipmentsDemo}件 · 遅延注意: ${delayRiskTripsDemo}便`,
          "リスク・要フォローへ",
        ],
        ctaLabel: "作業員一覧を見る",
        href: withDemoQuery("/candidates", industry, role),
        tone: input.docAlerts > 0 ? "warning" : "default",
      },
      {
        id: "documents",
        title: "入構・配送書類",
        subtitle: "入構前に不足があると止まる書類を最優先",
        kpiLabel: "要対応",
        kpiValue: `${input.docAlerts}件`,
        highlights: [
          "入構申請・誓約・配送関連",
          "免許・資格の OCR（デモ）",
          "期限一覧へ",
        ],
        ctaLabel: "書類ハブを開く",
        href: withDemoQuery("/documents?scope=pre-entry", industry, role),
        tone: input.docAlerts > 0 ? "danger" : "default",
      },
      {
        id: "clients",
        title: "配送案件",
        subtitle: "拠点・便ごとの未配車枠と条件を把握",
        kpiLabel: "案件数",
        kpiValue: `${input.totalClients}件`,
        highlights: [
          `未配車枠: ${input.totalOpenSlots}枠`,
          "時間帯・積載条件は一覧で確認",
          "案件別の手配へ",
        ],
        ctaLabel: "案件一覧を見る",
        href: withDemoQuery("/clients", industry, role),
      },
      {
        id: "matching",
        title: "配置最適化",
        subtitle: "車種・資格・シフトに基づく候補比較（デモ）",
        kpiLabel: "対象",
        kpiValue: `${input.totalCandidates}名`,
        highlights: [
          "案件ごとにスコアと理由を表示",
          "技能タグと便要件の一致",
          "配車理由を確認",
        ],
        ctaLabel: "配置最適化を開く",
        href: withDemoQuery("/matching", industry, role),
        tone: "success",
      },
      {
        id: "operations",
        title: "現場実務",
        subtitle: "遅延連絡・再手配・当日運行の調整",
        kpiLabel: "調整中",
        kpiValue: `${input.trainingCount + input.awaitingEntryCount}名`,
        highlights: [
          `研修・契約調整: ${input.trainingCount + input.awaitingEntryCount}名`,
          "遅延・差し替えのタイムライン",
          "実務 KPI を確認",
        ],
        ctaLabel: "現場実務を開く",
        href: withDemoQuery("/operations", industry, role),
        tone: "warning",
      },
    ];
  }

  if (viewMode === "support_org" && industry === "sales") {
    const winLikely = input.pipelineOfferAccepted ?? 0;
    const stalled = input.pipelineStalledSales ?? 0;
    return [
      {
        id: "people",
        title: "見込み顧客",
        subtitle: "今日接触すべき先と、要修正・資料準備のボトルネックを優先",
        kpiLabel: "管轄件数",
        kpiValue: `${input.totalCandidates}件`,
        highlights: [
          `受注見込み: ${winLikely}件`,
          input.docAlerts > 0
            ? `要フォロー（資料・条件）: ${input.docAlerts}件`
            : "要フォロー（資料・条件）: 0件",
          "顧客一覧で比較",
        ],
        ctaLabel: "見込み顧客一覧を見る",
        href: withDemoQuery("/candidates", industry, role),
        tone: input.docAlerts > 0 ? "warning" : "default",
      },
      {
        id: "documents",
        title: "提案資料",
        subtitle: "見積・提案書・NDA 前後で出せる資料の進捗を確認",
        kpiLabel: "要対応",
        kpiValue: `${input.docAlerts}件`,
        highlights: [
          "見積・提案ドラフト",
          "OCR・取込デモ",
          "期限・レビューへ",
        ],
        ctaLabel: "提案資料を開く",
        href: withDemoQuery("/documents?scope=pre-entry", industry, role),
        tone: input.docAlerts > 0 ? "danger" : "default",
      },
      {
        id: "clients",
        title: "提案案件",
        subtitle: "提案テーマ・受注確度・次回アクションを一覧で比較",
        kpiLabel: "案件数",
        kpiValue: `${input.totalClients}件`,
        highlights: [
          stalled > 0
            ? `停滞・要修正に近い商談: ${stalled}件（パイプライン）`
            : "商談フェーズはパイプラインで確認",
          `未対応枠（デモ）: ${input.totalOpenSlots}件`,
          "案件比較へ",
        ],
        ctaLabel: "提案案件一覧を見る",
        href: withDemoQuery("/clients", industry, role),
        tone: stalled > 0 ? "warning" : "default",
      },
      {
        id: "matching",
        title: "提案優先度",
        subtitle: "案件ごとに優先順位と顧客課題との一致理由（デモ）",
        kpiLabel: "対象",
        kpiValue: `${input.totalCandidates}件`,
        highlights: [
          "案件別スコアと AI 理由",
          "次の商談準備に接続",
          "優先順位を確認",
        ],
        ctaLabel: "提案優先度を開く",
        href: withDemoQuery("/matching", industry, role),
        tone: "success",
      },
      {
        id: "operations",
        title: "営業実務・売上",
        subtitle: "提案期限・フォロー・売上見込みの当日ビュー",
        kpiLabel: "進行中",
        kpiValue: `${input.trainingCount + input.awaitingEntryCount}件`,
        highlights: [
          `提案準備・商談調整: ${input.trainingCount + input.awaitingEntryCount}件`,
          "タイムラインと KPI",
          "実務ショートカットへ",
        ],
        ctaLabel: "営業実務を開く",
        href: withDemoQuery("/operations", industry, role),
        tone: "warning",
      },
    ];
  }

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

