import type {
  Candidate,
  CandidatePipelineStatus,
  ClientCompany,
  DemoDataBundle,
} from "@data/types";

function avatar(seed: string) {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

function scoreOrder(j: Candidate["jlpt"]): number {
  const o: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };
  return o[j] ?? 0;
}

export const clients: ClientCompany[] = [
  {
    id: "sales-deal-a",
    legalNameJa: "株式会社 アルファ商事",
    tradeNameJa: "アルファ商事",
    industryJa: "B2B SaaS",
    prefectureJa: "東京都",
    cityJa: "港区",
    cultureJa: "提案スピード重視。意思決定が早い。",
    aiTargetProfileJa: "ヒアリングが丁寧で提案力が高い担当を優先。",
    workplaceEnvironmentJa: "オンライン商談中心。",
    currentChallengesJa: "CFO 向け ROI 試算の最終調整と multi-year 条件の確定。",
    recruitmentJa: "営業担当 2名分の案件対応。",
    operations: { currentAssignees: 4, openSlots: 2, retentionRatePct: 82, satisfactionScore: 4.2 },
    ltMonthlyProfitPerHeadJpy: 72000,
    contact: { email: "sales-a@example.jp", phone: "03-5000-0001", contactPersonJa: "営業部 田中" },
    matchingHintTags: ["提案", "B2B", "SaaS"],
    salesListDemo: {
      proposalThemeJa: "クラウド年間ライセンス更新・セキュリティ加算",
      winProbabilityJa: "高（稟議最終）",
      nextActionJa: "4/8 CFO フォロー電話",
      dealValueManYenDemo: 120,
      competitorJa: "競合Xと価格比較調整中",
    },
  },
  {
    id: "sales-deal-b",
    legalNameJa: "株式会社 ベータ物流販社",
    tradeNameJa: "ベータ物流販社",
    industryJa: "物流システム",
    prefectureJa: "大阪府",
    cityJa: "大阪市",
    cultureJa: "現場課題の解像度を重視。",
    aiTargetProfileJa: "課題整理と要件化が得意な担当。",
    workplaceEnvironmentJa: "現地訪問とWeb商談の併用。",
    currentChallengesJa: "現場ヒアリング結果の要件化と PoC スコープ確定。",
    recruitmentJa: "提案担当 1名分の案件対応。",
    operations: { currentAssignees: 3, openSlots: 1, retentionRatePct: 79, satisfactionScore: 4.0 },
    ltMonthlyProfitPerHeadJpy: 65000,
    contact: { email: "sales-b@example.jp", phone: "06-6000-0002", contactPersonJa: "部長 山本" },
    matchingHintTags: ["現場理解", "要件化", "物流"],
    salesListDemo: {
      proposalThemeJa: "配車最適化モジュール＋現場ダッシュボード",
      winProbabilityJa: "中（PoC 前提）",
      nextActionJa: "4/10 現場訪問＋要件ワークショップ",
      dealValueManYenDemo: 85,
      competitorJa: "レガシー TMS との併用案を比較",
    },
  },
  {
    id: "sales-deal-c",
    legalNameJa: "株式会社 クリア会計クラウド",
    tradeNameJa: "クリア会計クラウド",
    industryJa: "会計SaaS",
    prefectureJa: "愛知県",
    cityJa: "名古屋市",
    cultureJa: "継続提案を重視。",
    aiTargetProfileJa: "LTV観点でアップセル設計ができる担当。",
    workplaceEnvironmentJa: "インサイドセールス主体。",
    currentChallengesJa: "既存席の活用率レポートとアップセル提案の一本化。",
    recruitmentJa: "既存深耕担当 1名分の案件対応。",
    operations: { currentAssignees: 5, openSlots: 1, retentionRatePct: 86, satisfactionScore: 4.4 },
    ltMonthlyProfitPerHeadJpy: 78000,
    contact: { email: "sales-c@example.jp", phone: "052-700-0003", contactPersonJa: "責任者 加藤" },
    matchingHintTags: ["アップセル", "LTV", "会計"],
    salesListDemo: {
      proposalThemeJa: "活用率ダッシュボード＋追加モジュール見積",
      winProbabilityJa: "高（見積レビュー中）",
      nextActionJa: "4/7 追加席条件のメール確認",
      dealValueManYenDemo: 42,
    },
  },
  {
    id: "sales-deal-d",
    legalNameJa: "デルタ建設DX株式会社",
    tradeNameJa: "デルタ建設DX",
    industryJa: "建設DX",
    prefectureJa: "福岡県",
    cityJa: "福岡市",
    cultureJa: "現場導入の丁寧さを重視。",
    aiTargetProfileJa: "導入フォローと関係構築が得意な担当。",
    workplaceEnvironmentJa: "出張ありのハイブリッド。",
    currentChallengesJa: "現場責任者向け説明資料が薄く、導入ステークホルダーが増えている。",
    recruitmentJa: "導入営業 1名分の案件対応。",
    operations: { currentAssignees: 2, openSlots: 2, retentionRatePct: 75, satisfactionScore: 3.8 },
    ltMonthlyProfitPerHeadJpy: 60000,
    contact: { email: "sales-d@example.jp", phone: "092-800-0004", contactPersonJa: "課長 中島" },
    matchingHintTags: ["導入", "関係構築", "現場"],
    salesListDemo: {
      proposalThemeJa: "現場モバイル連携＋安全書類デジタル化",
      winProbabilityJa: "低〜中（資料遅延）",
      nextActionJa: "責任者向け one-pager 再送（4/9 期限）",
      dealValueManYenDemo: 55,
      competitorJa: "紙運用継続案との内部比較",
    },
  },
  {
    id: "sales-deal-e",
    legalNameJa: "エコー人事ソリューションズ株式会社",
    tradeNameJa: "エコー人事ソリューションズ",
    industryJa: "HRテック",
    prefectureJa: "北海道",
    cityJa: "札幌市",
    cultureJa: "採用KPI達成を重視。",
    aiTargetProfileJa: "データで提案できる担当。",
    workplaceEnvironmentJa: "オンライン完結中心。",
    currentChallengesJa: "決裁者追加により再商談。競合比較表の差分訴求が必要。",
    recruitmentJa: "新規開拓 2名分の案件対応。",
    operations: { currentAssignees: 3, openSlots: 2, retentionRatePct: 80, satisfactionScore: 4.1 },
    ltMonthlyProfitPerHeadJpy: 69000,
    contact: { email: "sales-e@example.jp", phone: "011-900-0005", contactPersonJa: "営業 木村" },
    matchingHintTags: ["新規開拓", "KPI", "データ提案"],
    salesListDemo: {
      proposalThemeJa: "採用ダッシュボード＋ATS 連携パッケージ",
      winProbabilityJa: "要修正（決裁者未接触）",
      nextActionJa: "4/12 役員向け短時間デモ枠の確保",
      dealValueManYenDemo: 68,
      competitorJa: "競合Zのトライアル延長中",
    },
  },
];

function cand(
  partial: Omit<Candidate, "contact" | "registeredAt"> & {
    contact?: Partial<Candidate["contact"]>;
  }
): Candidate {
  return {
    ...partial,
    contact: { email: "lead@example.jp", phone: "03-0000-0000", ...partial.contact },
    registeredAt: "2026-04-03",
  };
}

function statusMap(
  label: string
): { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string } {
  const m: Record<string, { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }> = {
    契約準備: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "契約準備" },
    初回商談調整: { pipelineStatus: "interview_coordination", pipelineStatusLabelJa: "初回商談調整" },
    提案準備中: { pipelineStatus: "training", pipelineStatusLabelJa: "提案準備中" },
    受注見込み: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "受注見込み" },
    見積提出中: { pipelineStatus: "visa_applying", pipelineStatusLabelJa: "見積提出中" },
    要修正: { pipelineStatus: "document_blocked", pipelineStatusLabelJa: "要修正" },
    資料準備中: { pipelineStatus: "document_prep", pipelineStatusLabelJa: "資料準備中" },
  };
  return m[label] ?? m["初回商談調整"];
}

export const candidates: Candidate[] = [
  cand({
    id: "lead-a",
    displayName: "株式会社 北都システム",
    legalNameFull: "株式会社 北都システム",
    nameKatakana: "ホクトシステム",
    age: 0,
    gender: "male",
    nationality: "日本",
    birthDate: "2000-01-01",
    birthPlace: "Tokyo",
    residence: { country: "日本", city: "東京都" },
    jlpt: "N3",
    backgroundSummary: "既存ツール更新を検討。導入時期は今期内。",
    educationWorkHistory: "情シス部門でSaaS導入経験あり。",
    skillTags: ["SaaS", "提案", "導入"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 92,
    aiScoreRationale: "課題と予算が明確で受注確度が高い。",
    ...statusMap("受注見込み"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "次回接点: 4/8 CFO フォロー",
    plannedAssignment: { clientId: "sales-deal-a", jobTitleJa: "提案案件", monthlySalaryJpy: 0 },
    photoUrl: avatar("lead-a"),
    salesCandidateListDemo: {
      sectorJa: "IT・SaaS",
      interestJa: "高（今期内）",
      keyChallengeJa: "既存ツール更新タイミング",
    },
    detailDemo: {
      healthSummaryJa:
        "商談は最終局面。決裁者フォローと multi-year 条件の確定が次の焦点です。",
      contactFreshness: {
        channelLabelJa: "Teams",
        lastReplyAt: "2026-04-06",
        unread: true,
      },
      interviewLogs: [
        {
          monthLabelJa: "2026年4月",
          summaryJa: "部長承認済み。CFO へ ROI 資料送付とフォロー日程確定。",
          tags: ["稟議", "ROI", "決裁"],
          bodyJa:
            "デモ後の質疑は技術寄り。コスト削減シナリオは好反応。CFO は数値の感度が高いため試算表の脚注を増補予定。",
        },
        {
          monthLabelJa: "2026年3月",
          summaryJa: "初回提案・価格条件のたたき台共有。",
          tags: ["提案", "価格"],
          bodyJa: "競合Xとの差分はサポート SLA で訴求。次回までに顧客事例を 2 件追加。",
        },
      ],
      activityEvents: [
        {
          at: "2026-04-06T10:00:00",
          kind: "interview",
          titleJa: "オンラインデモ（情シス・部長）",
          detailJa: "反応良好・次は CFO",
        },
        {
          at: "2026-04-03T15:00:00",
          kind: "document",
          titleJa: "見積ドラフト v3 を送付",
        },
        {
          at: "2026-03-28T11:00:00",
          kind: "status",
          titleJa: "稟議フローに CFO ステップを追加と連絡あり",
        },
      ],
    },
  }),
  cand({
    id: "lead-b",
    displayName: "株式会社 関西ロジ",
    legalNameFull: "株式会社 関西ロジ",
    nameKatakana: "カンサイロジ",
    age: 0,
    gender: "male",
    nationality: "日本",
    birthDate: "2000-01-01",
    birthPlace: "Osaka",
    residence: { country: "日本", city: "大阪府" },
    jlpt: "N4",
    backgroundSummary: "配車最適化に課題。PoC実施を希望。",
    educationWorkHistory: "物流現場の改善PJを毎年実施。",
    skillTags: ["物流", "PoC", "改善"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 85,
    aiScoreRationale: "課題の切迫度が高く、提案が刺さりやすい。",
    ...statusMap("初回商談調整"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "次回接点: 4/5 要件ヒアリング",
    photoUrl: avatar("lead-b"),
    salesCandidateListDemo: {
      sectorJa: "物流",
      interestJa: "中（PoC 意向）",
      keyChallengeJa: "配車最適化と現場抵抗感",
    },
    detailDemo: {
      healthSummaryJa: "初回商談調整段階。現場課題の解像度向上と PoC スコープ確定が必要です。",
      contactFreshness: {
        channelLabelJa: "メール",
        lastReplyAt: "2026-04-04",
        unread: false,
      },
      interviewLogs: [
        {
          monthLabelJa: "2026年4月",
          summaryJa: "課長とオンライン。課題は共有済み、現場訪問で深掘り予定。",
          tags: ["現場", "PoC"],
        },
      ],
      activityEvents: [
        {
          at: "2026-04-04T14:00:00",
          kind: "interview",
          titleJa: "課長ヒアリング（オンライン）",
          detailJa: "配車遅延のボトルネックを特定",
        },
      ],
    },
  }),
  cand({
    id: "lead-c",
    displayName: "有限会社 東海会計",
    legalNameFull: "有限会社 東海会計",
    nameKatakana: "トウカイカイケイ",
    age: 0,
    gender: "female",
    nationality: "日本",
    birthDate: "2000-01-01",
    birthPlace: "Nagoya",
    residence: { country: "日本", city: "愛知県" },
    jlpt: "N3",
    backgroundSummary: "既存顧客の活用率向上を狙う。",
    educationWorkHistory: "会計システムの切替経験あり。",
    skillTags: ["会計", "LTV", "アップセル"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 88,
    aiScoreRationale: "既存顧客深耕で高い売上が見込める。",
    ...statusMap("見積提出中"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "次回接点: 4/7 メール確認",
    photoUrl: avatar("lead-c"),
    salesCandidateListDemo: {
      sectorJa: "会計・バックオフィス",
      interestJa: "高（アップセル）",
      keyChallengeJa: "活用率の可視化",
    },
  }),
  cand({
    id: "lead-d",
    displayName: "株式会社 西日本建設管理",
    legalNameFull: "株式会社 西日本建設管理",
    nameKatakana: "ニシニホンケンセツ",
    age: 0,
    gender: "male",
    nationality: "日本",
    birthDate: "2000-01-01",
    birthPlace: "Fukuoka",
    residence: { country: "日本", city: "福岡県" },
    jlpt: "N5",
    backgroundSummary: "現場責任者向け説明資料の改善が必要。",
    educationWorkHistory: "紙運用中心からの移行を検討。",
    skillTags: ["現場", "導入", "資料"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 74,
    aiScoreRationale: "要件は有望だが資料整備に時間が必要。",
    ...statusMap("資料準備中"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "導入フロー整理中",
    documentAlertJa: "要件ヒアリングシートの更新が必要。",
    photoUrl: avatar("lead-d"),
    salesCandidateListDemo: {
      sectorJa: "建設・DX",
      interestJa: "中（資料待ち）",
      keyChallengeJa: "現場向け説明の薄さ",
    },
    detailDemo: {
      healthSummaryJa: "資料準備中。現場責任者向け one-pager と導入ステークホルダー表が次の焦点です。",
      documentDeficiencyHeadlineJa: "現場説明資料の更新がボトルネック（デモ）",
      activityEvents: [
        {
          at: "2026-04-02T09:00:00",
          kind: "document",
          titleJa: "要件シート v1 返却（要修正コメントあり）",
        },
      ],
    },
  }),
  cand({
    id: "lead-e",
    displayName: "株式会社 北海道人事支援",
    legalNameFull: "株式会社 北海道人事支援",
    nameKatakana: "ホッカイドウジンジシエン",
    age: 0,
    gender: "female",
    nationality: "日本",
    birthDate: "2000-01-01",
    birthPlace: "Sapporo",
    residence: { country: "日本", city: "北海道" },
    jlpt: "N4",
    backgroundSummary: "競合比較段階。意思決定者追加で再商談予定。",
    educationWorkHistory: "複数ツール比較の購買プロセスを運用。",
    skillTags: ["比較検討", "新規開拓", "KPI"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 67,
    aiScoreRationale: "温度感が低くフォロー設計が必要。",
    ...statusMap("要修正"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "提案条件の見直し中",
    documentAlertJa: "決裁者向け資料が不足。",
    photoUrl: avatar("lead-e"),
    salesCandidateListDemo: {
      sectorJa: "HRテック",
      interestJa: "低〜中（比較検討）",
      keyChallengeJa: "決裁者未接触・競合トライアル",
    },
    detailDemo: {
      healthSummaryJa: "要修正ステージ。決裁者向け短資料と競合差分の再整理が必要です。",
      followReasons: [
        {
          code: "exec",
          labelJa: "決裁者未接触（再商談調整中）",
          variant: "warning",
        },
      ],
      interviewLogs: [
        {
          monthLabelJa: "2026年4月",
          summaryJa: "担当者は前向きも、役員デモ未実施。",
          tags: ["決裁", "競合"],
          bodyJa: "競合Zのトライアル延長を理由に決裁が遅延。短時間の役員向けデモ枠を提案中。",
        },
      ],
      activityEvents: [
        {
          at: "2026-04-05T16:00:00",
          kind: "status",
          titleJa: "見積条件の見直し依頼（先方）",
        },
      ],
    },
  }),
];

export const demoBundle: DemoDataBundle = {
  meta: {
    version: "1.0.0",
    locale: "ja-JP",
    referenceDate: "2026-04-03",
    descriptionJa: "営業テンプレート用ダミーデータ（5社・5件）",
  },
  candidates,
  clients,
};

export function getClientById(id: string): ClientCompany | undefined {
  return clients.find((c) => c.id === id);
}

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}

export function getPipelineCounts(): Record<CandidatePipelineStatus, number> {
  const init: Record<CandidatePipelineStatus, number> = {
    awaiting_entry: 0,
    interview_coordination: 0,
    training: 0,
    offer_accepted: 0,
    visa_applying: 0,
    document_blocked: 0,
    document_prep: 0,
  };
  for (const c of candidates) init[c.pipelineStatus] += 1;
  return init;
}

export function countN3OrAbove(): number {
  return candidates.filter((c) => scoreOrder(c.jlpt) >= 3).length;
}

export function getTopCandidatesByAiScore(limit: number): Candidate[] {
  return [...candidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, limit);
}

export function countDocumentAlerts(): number {
  return candidates.filter(
    (c) =>
      c.pipelineStatus === "document_blocked" ||
      c.pipelineStatus === "document_prep" ||
      Boolean(c.documentAlertJa)
  ).length;
}

export function totalOpenSlots(): number {
  return clients.reduce((s, c) => s + c.operations.openSlots, 0);
}

export function monthlyRevenueTrend(): { month: string; amountManYen: number }[] {
  return [
    { month: "2025-11", amountManYen: 120 },
    { month: "2025-12", amountManYen: 132 },
    { month: "2026-01", amountManYen: 140 },
    { month: "2026-02", amountManYen: 136 },
    { month: "2026-03", amountManYen: 149 },
    { month: "2026-04", amountManYen: 155 },
  ];
}

export function scoreCandidateForClient(
  candidate: Candidate,
  client: ClientCompany
): { pct: number; reason: string } {
  const hit = candidate.skillTags.filter((t) =>
    client.matchingHintTags.some((h) => h.includes(t) || t.includes(h))
  ).length;
  const pct = Math.min(97, 58 + hit * 9 + Math.floor((candidate.aiScore - 60) / 3));
  const reason = `${client.tradeNameJa}の重視点（${client.matchingHintTags.slice(0, 2).join("・")}）と、${candidate.displayName}の要素（${candidate.skillTags.slice(0, 3).join("・")}）が一致しています。`;
  return { pct, reason };
}

export function getMatchesForClient(clientId: string) {
  const client = getClientById(clientId);
  if (!client) return [];
  return [...candidates]
    .map((c) => ({ candidate: c, ...scoreCandidateForClient(c, client) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
}
