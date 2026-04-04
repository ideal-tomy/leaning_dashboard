import type { CandidatePipelineStatus } from "@data/types";

export type IndustryKey =
  | "staffing"
  | "real-estate"
  | "professional"
  | "construction"
  | "medical"
  | "sales"
  | "logistics"
  | "education";

export type EnabledIndustryKey =
  | "staffing"
  | "real-estate"
  | "professional"
  | "construction"
  | "medical"
  | "sales"
  | "logistics"
  | "education";

export type IndustryProfile = {
  key: IndustryKey;
  productName: string;
  badgeLabel: string | null;
  metadataTitle: string;
  metadataDescription: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  labels: {
    candidate: string;
    client: string;
    matching: string;
    documents: string;
    revenue: string;
    operations: string;
    knowledge: string;
    pipeline: string;
  };
  kpiLabels: {
    totalCountUnit: string;
    proficiencyLabel: string;
    openSlotsLabel: string;
    openSlotsUnit: string;
  };
  statusLabels: Record<CandidatePipelineStatus, string>;
  matchingDescription: string;
  operationsDescription: string;
};

export const allIndustryKeys: IndustryKey[] = [
  "staffing",
  "real-estate",
  "professional",
  "construction",
  "medical",
  "sales",
  "logistics",
  "education",
];

export const enabledIndustryKeys: EnabledIndustryKey[] = [
  "staffing",
  "real-estate",
  "professional",
  "construction",
  "medical",
  "sales",
  "logistics",
  "education",
];

export const defaultIndustryKey: EnabledIndustryKey = "staffing";

export function parseEnabledIndustryKey(
  value: string | null | undefined
): EnabledIndustryKey {
  if (value && enabledIndustryKeys.includes(value as EnabledIndustryKey)) {
    return value as EnabledIndustryKey;
  }
  return defaultIndustryKey;
}

const staffingStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "入国待ち",
  interview_coordination: "面接調整",
  training: "講習中",
  offer_accepted: "内定済",
  visa_applying: "ビザ申請中",
  document_blocked: "書類不備",
  document_prep: "書類準備中",
};

const salesStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "契約準備",
  interview_coordination: "初回商談調整",
  training: "提案準備中",
  offer_accepted: "受注見込み",
  visa_applying: "見積提出中",
  document_blocked: "要修正",
  document_prep: "資料準備中",
};

const logisticsStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "配属待ち",
  interview_coordination: "シフト調整",
  training: "現場研修中",
  offer_accepted: "配車確定",
  visa_applying: "契約調整中",
  document_blocked: "書類不備",
  document_prep: "入構書類準備",
};

const realEstateStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "契約前調整",
  interview_coordination: "内見調整",
  training: "申込審査中",
  offer_accepted: "契約見込み",
  visa_applying: "契約手続中",
  document_blocked: "書類不備",
  document_prep: "重要事項準備",
};

const professionalStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "着手待ち",
  interview_coordination: "初回相談調整",
  training: "論点整理中",
  offer_accepted: "受任見込み",
  visa_applying: "申請手続中",
  document_blocked: "証憑不足",
  document_prep: "申請書類準備",
};

const constructionStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "現場手配待ち",
  interview_coordination: "現場面談調整",
  training: "安全教育中",
  offer_accepted: "配員確定",
  visa_applying: "工程調整中",
  document_blocked: "安全書類不備",
  document_prep: "入場書類準備",
};

const medicalStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "配属待ち",
  interview_coordination: "面談調整",
  training: "院内研修中",
  offer_accepted: "配置確定",
  visa_applying: "勤務調整中",
  document_blocked: "記録不備",
  document_prep: "医療書類準備",
};

const educationStatus: Record<CandidatePipelineStatus, string> = {
  awaiting_entry: "受講準備",
  interview_coordination: "面談調整",
  training: "受講中",
  offer_accepted: "受講確定",
  visa_applying: "案内送付中",
  document_blocked: "提出物不備",
  document_prep: "教材準備",
};

const baseProfiles: Record<EnabledIndustryKey, IndustryProfile> = {
  staffing: {
    key: "staffing",
    productName: "派遣コックピット",
    badgeLabel: "AI デモ",
    metadataTitle: "派遣コックピット（営業デモ）",
    metadataDescription: "AI 搭載型業務管理ダッシュボード デモ",
    dashboardTitle: "ダッシュボード",
    dashboardSubtitle:
      "管理を便利に、判断をAIで - デモデータで全体像をご覧ください。",
    labels: {
      candidate: "候補者",
      client: "案件",
      matching: "マッチング",
      documents: "書類",
      revenue: "収益",
      operations: "実務・収益",
      knowledge: "ナレッジ",
      pipeline: "選考・ビザ進捗",
    },
    kpiLabels: {
      totalCountUnit: "名登録",
      proficiencyLabel: "日本語 N3 以上",
      openSlotsLabel: "欠員枠 合計",
      openSlotsUnit: "名分",
    },
    statusLabels: staffingStatus,
    matchingDescription: "案件ごとの上位候補と AI 理由（デモロジック）",
    operationsDescription: "書類・数値へのショートカット（デモ）",
  },
  "real-estate": {
    key: "real-estate",
    productName: "不動産営業テンプレート",
    badgeLabel: "AI テスト",
    metadataTitle: "不動産管理ダッシュボード（テンプレート）",
    metadataDescription: "物件・顧客・内見・契約管理のテンプレート",
    dashboardTitle: "不動産ダッシュボード",
    dashboardSubtitle:
      "物件提案から契約までの進捗を可視化するテンプレート表示です。",
    labels: {
      candidate: "顧客",
      client: "物件案件",
      matching: "物件提案",
      documents: "契約書類",
      revenue: "売上見込み",
      operations: "内見・契約実務",
      knowledge: "物件ナレッジ",
      pipeline: "内見・契約進捗",
    },
    kpiLabels: {
      totalCountUnit: "件",
      proficiencyLabel: "契約確度 高",
      openSlotsLabel: "未対応内見",
      openSlotsUnit: "件",
    },
    statusLabels: realEstateStatus,
    matchingDescription: "物件案件ごとの上位候補と AI 理由（テスト表示）",
    operationsDescription: "内見・契約に関する主要導線（テスト）",
  },
  professional: {
    key: "professional",
    productName: "士業業務テンプレート",
    badgeLabel: "AI テスト",
    metadataTitle: "士業案件管理ダッシュボード（テンプレート）",
    metadataDescription: "相談・受任・申請進捗のテンプレート",
    dashboardTitle: "士業ダッシュボード",
    dashboardSubtitle:
      "相談から受任・申請までを一元管理するテンプレート表示です。",
    labels: {
      candidate: "相談案件",
      client: "顧問先",
      matching: "案件優先度",
      documents: "申請書類",
      revenue: "報酬見込み",
      operations: "申請実務・収支",
      knowledge: "法務ナレッジ",
      pipeline: "相談・申請進捗",
    },
    kpiLabels: {
      totalCountUnit: "件",
      proficiencyLabel: "受任優先度",
      openSlotsLabel: "未着手案件",
      openSlotsUnit: "件",
    },
    statusLabels: professionalStatus,
    matchingDescription: "顧問先ごとの優先案件と AI 理由（テスト表示）",
    operationsDescription: "申請実務と報酬管理へのショートカット（テスト）",
  },
  construction: {
    key: "construction",
    productName: "現場系管理テンプレート",
    badgeLabel: "AI テスト",
    metadataTitle: "建設・設備管理ダッシュボード（テンプレート）",
    metadataDescription: "現場配員・安全書類・請求管理のテンプレート",
    dashboardTitle: "現場ダッシュボード",
    dashboardSubtitle:
      "配員・工程・安全書類を統合して確認できるテンプレート表示です。",
    labels: {
      candidate: "作業員",
      client: "現場案件",
      matching: "配員最適化",
      documents: "安全書類",
      revenue: "請求見込み",
      operations: "現場実務・請求",
      knowledge: "現場ナレッジ",
      pipeline: "現場手配進捗",
    },
    kpiLabels: {
      totalCountUnit: "名",
      proficiencyLabel: "有資格者",
      openSlotsLabel: "未充足現場",
      openSlotsUnit: "件",
    },
    statusLabels: constructionStatus,
    matchingDescription: "現場案件ごとの配員候補と AI 理由（テスト表示）",
    operationsDescription: "安全書類・請求へのショートカット（テスト）",
  },
  medical: {
    key: "medical",
    productName: "医療・介護運営テンプレート",
    badgeLabel: "AI テスト",
    metadataTitle: "医療・介護管理ダッシュボード（テンプレート）",
    metadataDescription: "配置・記録・請求管理のテンプレート",
    dashboardTitle: "医療・介護ダッシュボード",
    dashboardSubtitle:
      "スタッフ配置と記録・請求を統合管理するテンプレート表示です。",
    labels: {
      candidate: "スタッフ",
      client: "拠点案件",
      matching: "配置提案",
      documents: "記録書類",
      revenue: "請求見込み",
      operations: "運営実務・請求",
      knowledge: "ケアナレッジ",
      pipeline: "配置進捗",
    },
    kpiLabels: {
      totalCountUnit: "名",
      proficiencyLabel: "即戦力度",
      openSlotsLabel: "不足シフト",
      openSlotsUnit: "枠",
    },
    statusLabels: medicalStatus,
    matchingDescription: "拠点ごとの配置候補と AI 理由（テスト表示）",
    operationsDescription: "記録・請求へのショートカット（テスト）",
  },
  sales: {
    key: "sales",
    productName: "営業パイプライン テンプレート",
    badgeLabel: "AI テスト",
    metadataTitle: "営業管理ダッシュボード（テンプレート）",
    metadataDescription: "リード・商談・受注管理のテンプレート",
    dashboardTitle: "営業ダッシュボード",
    dashboardSubtitle:
      "リードから受注までの進捗を可視化するテンプレート表示です。",
    labels: {
      candidate: "リード",
      client: "商談",
      matching: "提案優先度",
      documents: "提案資料",
      revenue: "売上見込み",
      operations: "営業実務・売上",
      knowledge: "営業ナレッジ",
      pipeline: "商談進捗",
    },
    kpiLabels: {
      totalCountUnit: "件",
      proficiencyLabel: "優先度 A 以上",
      openSlotsLabel: "未対応商談",
      openSlotsUnit: "件",
    },
    statusLabels: salesStatus,
    matchingDescription: "商談ごとの提案優先度と AI 理由（テスト表示）",
    operationsDescription: "提案資料・売上指標へのショートカット（テスト）",
  },
  logistics: {
    key: "logistics",
    productName: "物流オペレーション テンプレート",
    badgeLabel: "AI テスト",
    metadataTitle: "物流・倉庫管理ダッシュボード（テンプレート）",
    metadataDescription: "配車・入出庫・稼働管理のテンプレート",
    dashboardTitle: "物流ダッシュボード",
    dashboardSubtitle:
      "配属・配車・稼働状況を一画面で確認できるテンプレート表示です。",
    labels: {
      candidate: "作業員",
      client: "配送案件",
      matching: "配置最適化",
      documents: "作業書類",
      revenue: "収支",
      operations: "現場実務・収支",
      knowledge: "現場ナレッジ",
      pipeline: "配属・配車進捗",
    },
    kpiLabels: {
      totalCountUnit: "名",
      proficiencyLabel: "即戦力レベル",
      openSlotsLabel: "未充足枠",
      openSlotsUnit: "枠",
    },
    statusLabels: logisticsStatus,
    matchingDescription: "案件ごとの配置候補と AI 理由（テスト表示）",
    operationsDescription: "作業書類・収支へのショートカット（テスト）",
  },
  education: {
    key: "education",
    productName: "教育運営テンプレート",
    badgeLabel: "AI テスト",
    metadataTitle: "教育事業ダッシュボード（テンプレート）",
    metadataDescription: "受講進捗・提出物・売上管理のテンプレート",
    dashboardTitle: "教育ダッシュボード",
    dashboardSubtitle:
      "受講者進捗と提出物・売上を一体で把握するテンプレート表示です。",
    labels: {
      candidate: "受講者",
      client: "講座案件",
      matching: "受講提案",
      documents: "提出書類",
      revenue: "売上",
      operations: "講座運営・収益",
      knowledge: "教材ナレッジ",
      pipeline: "受講進捗",
    },
    kpiLabels: {
      totalCountUnit: "名",
      proficiencyLabel: "到達度 高",
      openSlotsLabel: "未フォロー受講者",
      openSlotsUnit: "名",
    },
    statusLabels: educationStatus,
    matchingDescription: "講座案件ごとの推奨候補と AI 理由（テスト表示）",
    operationsDescription: "講座運営と売上確認への導線（テスト）",
  },
};

/** 隠し扉のプルダウンなどに使う短い表示名 */
export const industryOptionLabelJa: Record<EnabledIndustryKey, string> = {
  staffing: "人材紹介・派遣",
  "real-estate": "不動産",
  professional: "士業",
  construction: "建設・現場",
  medical: "医療・介護",
  sales: "営業",
  logistics: "物流",
  education: "教育",
};

export function getIndustryProfile(key: EnabledIndustryKey): IndustryProfile {
  return baseProfiles[key];
}
