import type {
  Candidate,
  CandidatePipelineStatus,
  ClientCompany,
  DemoDataBundle,
} from "@data/types";

function avatar(seed: string) {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

function level(j: Candidate["jlpt"]): number {
  const o: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };
  return o[j] ?? 0;
}

export const clients: ClientCompany[] = [
  {
    id: "logi-client-1",
    legalNameJa: "東都デリバリー株式会社",
    tradeNameJa: "東都デリバリー",
    industryJa: "配送センター",
    prefectureJa: "東京都",
    cityJa: "大田区",
    cultureJa: "朝便対応が多く時間厳守。",
    aiTargetProfileJa: "早朝対応と安定稼働ができる人材。",
    workplaceEnvironmentJa: "仕分け・積込・配送連携。",
    recruitmentJa: "夜間仕分け 2枠。",
    operations: { currentAssignees: 10, openSlots: 2, retentionRatePct: 83, satisfactionScore: 4.1 },
    ltMonthlyProfitPerHeadJpy: 53000,
    contact: { email: "logi1@example.jp", phone: "03-7000-0101", contactPersonJa: "運行 鈴木" },
    matchingHintTags: ["早朝", "仕分け", "規律"],
  },
  {
    id: "logi-client-2",
    legalNameJa: "関東倉庫オペレーションズ株式会社",
    tradeNameJa: "関東倉庫オペレーションズ",
    industryJa: "倉庫管理",
    prefectureJa: "千葉県",
    cityJa: "市川市",
    cultureJa: "入出庫精度と安全優先。",
    aiTargetProfileJa: "検品精度が高く改善意識のある人材。",
    workplaceEnvironmentJa: "フォークリフト連携あり。",
    recruitmentJa: "検品スタッフ 1枠。",
    operations: { currentAssignees: 8, openSlots: 1, retentionRatePct: 79, satisfactionScore: 3.9 },
    ltMonthlyProfitPerHeadJpy: 47000,
    contact: { email: "logi2@example.jp", phone: "047-800-0102", contactPersonJa: "倉庫長 田村" },
    matchingHintTags: ["検品", "安全", "改善"],
  },
  {
    id: "logi-client-3",
    legalNameJa: "中部コールドライン株式会社",
    tradeNameJa: "中部コールドライン",
    industryJa: "冷凍物流",
    prefectureJa: "愛知県",
    cityJa: "一宮市",
    cultureJa: "低温環境での連携作業。",
    aiTargetProfileJa: "体力とルール遵守を両立できる人材。",
    workplaceEnvironmentJa: "冷凍庫出入りが多い。",
    recruitmentJa: "冷凍庫ピッキング 1枠。",
    operations: { currentAssignees: 6, openSlots: 1, retentionRatePct: 77, satisfactionScore: 3.8 },
    ltMonthlyProfitPerHeadJpy: 59000,
    contact: { email: "logi3@example.jp", phone: "0586-90-0103", contactPersonJa: "主任 井上" },
    matchingHintTags: ["低温", "体力", "ルール遵守"],
  },
  {
    id: "logi-client-4",
    legalNameJa: "西日本ラストワンマイル株式会社",
    tradeNameJa: "西日本ラストワンマイル",
    industryJa: "宅配",
    prefectureJa: "大阪府",
    cityJa: "東大阪市",
    cultureJa: "顧客対応と時間厳守。",
    aiTargetProfileJa: "コミュニケーションと段取りが得意な人材。",
    workplaceEnvironmentJa: "配送補助と拠点連携。",
    recruitmentJa: "配送補助 1枠。",
    operations: { currentAssignees: 9, openSlots: 1, retentionRatePct: 81, satisfactionScore: 4.0 },
    ltMonthlyProfitPerHeadJpy: 50000,
    contact: { email: "logi4@example.jp", phone: "06-7777-0104", contactPersonJa: "拠点長 藤田" },
    matchingHintTags: ["段取り", "配送", "顧客対応"],
  },
  {
    id: "logi-client-5",
    legalNameJa: "北海ロジパートナーズ株式会社",
    tradeNameJa: "北海ロジパートナーズ",
    industryJa: "3PL",
    prefectureJa: "北海道",
    cityJa: "札幌市",
    cultureJa: "繁忙期対応の柔軟性を重視。",
    aiTargetProfileJa: "シフト柔軟性とチーム適応力が高い人材。",
    workplaceEnvironmentJa: "繁忙期は残業あり。",
    recruitmentJa: "仕分け補助 2枠。",
    operations: { currentAssignees: 7, openSlots: 2, retentionRatePct: 76, satisfactionScore: 3.7 },
    ltMonthlyProfitPerHeadJpy: 46000,
    contact: { email: "logi5@example.jp", phone: "011-777-0105", contactPersonJa: "管理 佐々木" },
    matchingHintTags: ["シフト", "仕分け", "チーム"],
  },
];

function cand(
  partial: Omit<Candidate, "contact" | "registeredAt"> & {
    contact?: Partial<Candidate["contact"]>;
  }
): Candidate {
  return {
    ...partial,
    contact: { email: "worker@example.jp", phone: "03-0000-1111", ...partial.contact },
    registeredAt: "2026-04-03",
  };
}

function statusMap(
  label: string
): { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string } {
  const m: Record<string, { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }> = {
    配属待ち: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "配属待ち" },
    シフト調整: { pipelineStatus: "interview_coordination", pipelineStatusLabelJa: "シフト調整" },
    現場研修中: { pipelineStatus: "training", pipelineStatusLabelJa: "現場研修中" },
    配車確定: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "配車確定" },
    契約調整中: { pipelineStatus: "visa_applying", pipelineStatusLabelJa: "契約調整中" },
    書類不備: { pipelineStatus: "document_blocked", pipelineStatusLabelJa: "書類不備" },
    入構書類準備: { pipelineStatus: "document_prep", pipelineStatusLabelJa: "入構書類準備" },
  };
  return m[label] ?? m["シフト調整"];
}

export const candidates: Candidate[] = [
  cand({
    id: "worker-a",
    displayName: "山田 一郎",
    legalNameFull: "山田 一郎",
    nameKatakana: "ヤマダ イチロウ",
    age: 31,
    gender: "male",
    nationality: "日本",
    birthDate: "1995-03-01",
    birthPlace: "Tokyo",
    residence: { country: "日本", city: "東京都" },
    jlpt: "N3",
    backgroundSummary: "夜間仕分け経験3年。欠勤が少ない。",
    educationWorkHistory: "配送センターで仕分け・積込を担当。",
    skillTags: ["仕分け", "早朝", "規律"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: true,
    aiScore: 90,
    aiScoreRationale: "繁忙シフトでも安定稼働が期待できる。",
    ...statusMap("配車確定"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "配属決定済み",
    plannedAssignment: { clientId: "logi-client-1", jobTitleJa: "仕分け担当", monthlySalaryJpy: 0 },
    photoUrl: avatar("worker-a"),
  }),
  cand({
    id: "worker-b",
    displayName: "鈴木 花",
    legalNameFull: "鈴木 花",
    nameKatakana: "スズキ ハナ",
    age: 27,
    gender: "female",
    nationality: "日本",
    birthDate: "1999-07-10",
    birthPlace: "Chiba",
    residence: { country: "日本", city: "千葉県" },
    jlpt: "N4",
    backgroundSummary: "検品・棚卸の経験が長い。",
    educationWorkHistory: "倉庫で検品リーダー補助を担当。",
    skillTags: ["検品", "安全", "改善"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 84,
    aiScoreRationale: "精度が高く、改善活動に向いている。",
    ...statusMap("シフト調整"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "配属日調整中",
    photoUrl: avatar("worker-b"),
  }),
  cand({
    id: "worker-c",
    displayName: "高橋 健",
    legalNameFull: "高橋 健",
    nameKatakana: "タカハシ ケン",
    age: 29,
    gender: "male",
    nationality: "日本",
    birthDate: "1997-02-18",
    birthPlace: "Aichi",
    residence: { country: "日本", city: "愛知県" },
    jlpt: "N5",
    backgroundSummary: "冷凍倉庫経験あり。体力に自信。",
    educationWorkHistory: "冷凍食品のピッキング担当。",
    skillTags: ["低温", "体力", "ルール遵守"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: true,
    aiScore: 81,
    aiScoreRationale: "低温現場適性が高い。",
    ...statusMap("契約調整中"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "条件確認中",
    photoUrl: avatar("worker-c"),
  }),
  cand({
    id: "worker-d",
    displayName: "佐藤 彩",
    legalNameFull: "佐藤 彩",
    nameKatakana: "サトウ アヤ",
    age: 24,
    gender: "female",
    nationality: "日本",
    birthDate: "2002-05-20",
    birthPlace: "Osaka",
    residence: { country: "日本", city: "大阪府" },
    jlpt: "N4",
    backgroundSummary: "配達補助と顧客応対の経験あり。",
    educationWorkHistory: "宅配拠点でルート補助を担当。",
    skillTags: ["段取り", "配送", "顧客対応"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 76,
    aiScoreRationale: "現場連携力は高いが資料整備が必要。",
    ...statusMap("入構書類準備"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "入構書類収集中",
    documentAlertJa: "安全教育記録の追記が必要。",
    photoUrl: avatar("worker-d"),
  }),
  cand({
    id: "worker-e",
    displayName: "伊藤 大地",
    legalNameFull: "伊藤 大地",
    nameKatakana: "イトウ ダイチ",
    age: 33,
    gender: "male",
    nationality: "日本",
    birthDate: "1993-11-03",
    birthPlace: "Sapporo",
    residence: { country: "日本", city: "北海道" },
    jlpt: "N3",
    backgroundSummary: "季節波動の大きい倉庫で勤務経験。",
    educationWorkHistory: "3PLでシフト管理補助を担当。",
    skillTags: ["シフト", "仕分け", "チーム"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: true,
    aiScore: 69,
    aiScoreRationale: "繁忙対応は強いが、書類確認が必要。",
    ...statusMap("書類不備"),
    passportNumber: "NA",
    passportExpiry: "NA",
    coeStatusJa: "再提出待ち",
    documentAlertJa: "雇用契約書の押印漏れ。",
    photoUrl: avatar("worker-e"),
  }),
];

export const demoBundle: DemoDataBundle = {
  meta: {
    version: "1.0.0",
    locale: "ja-JP",
    referenceDate: "2026-04-03",
    descriptionJa: "物流テンプレート用ダミーデータ（5社・5名）",
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
  return candidates.filter((c) => level(c.jlpt) >= 3).length;
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
    { month: "2025-11", amountManYen: 61 },
    { month: "2025-12", amountManYen: 64 },
    { month: "2026-01", amountManYen: 66 },
    { month: "2026-02", amountManYen: 63 },
    { month: "2026-03", amountManYen: 69 },
    { month: "2026-04", amountManYen: 72 },
  ];
}

export function scoreCandidateForClient(
  candidate: Candidate,
  client: ClientCompany
): { pct: number; reason: string } {
  const hit = candidate.skillTags.filter((t) =>
    client.matchingHintTags.some((h) => h.includes(t) || t.includes(h))
  ).length;
  const pct = Math.min(97, 55 + hit * 8 + Math.floor((candidate.aiScore - 60) / 3));
  const reason = `${client.tradeNameJa}の重視点（${client.matchingHintTags.slice(0, 2).join("・")}）と、${candidate.displayName}の特性（${candidate.skillTags.slice(0, 3).join("・")}）が一致しています。`;
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
