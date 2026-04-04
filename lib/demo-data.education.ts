import type { Candidate, CandidatePipelineStatus, ClientCompany, DemoDataBundle } from "@data/types";

function avatar(seed: string) { return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`; }
function scoreOrder(j: Candidate["jlpt"]): number { const o: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 }; return o[j] ?? 0; }

export const clients: ClientCompany[] = [
  { id: "edu-course-1", legalNameJa: "未来学習アカデミー株式会社", tradeNameJa: "未来学習アカデミー", industryJa: "学習塾", prefectureJa: "東京都", cityJa: "豊島区", cultureJa: "保護者連絡の早さ重視。", aiTargetProfileJa: "フォロー頻度が高い受講者。", workplaceEnvironmentJa: "対面授業+オンライン面談。", recruitmentJa: "中3受験対策クラス 2枠。", operations: { currentAssignees: 18, openSlots: 2, retentionRatePct: 86, satisfactionScore: 4.5 }, ltMonthlyProfitPerHeadJpy: 52000, contact: { email: "edu1@example.jp", phone: "03-7500-6601", contactPersonJa: "教室長 河合" }, matchingHintTags: ["受験", "保護者連絡", "継続"] },
  { id: "edu-course-2", legalNameJa: "関西キャリアスクール", tradeNameJa: "関西キャリアスクール", industryJa: "職業訓練", prefectureJa: "大阪府", cityJa: "大阪市", cultureJa: "就職率KPI重視。", aiTargetProfileJa: "課題提出率が高い受講者。", workplaceEnvironmentJa: "実習多め。", recruitmentJa: "IT基礎講座 3枠。", operations: { currentAssignees: 14, openSlots: 3, retentionRatePct: 80, satisfactionScore: 4.1 }, ltMonthlyProfitPerHeadJpy: 60000, contact: { email: "edu2@example.jp", phone: "06-960-6602", contactPersonJa: "運営 松本" }, matchingHintTags: ["課題提出", "就職", "実習"] },
  { id: "edu-course-3", legalNameJa: "中部ビジネス研修センター", tradeNameJa: "中部ビジネス研修センター", industryJa: "企業研修", prefectureJa: "愛知県", cityJa: "名古屋市", cultureJa: "進捗可視化を重視。", aiTargetProfileJa: "目標達成率が高い受講者。", workplaceEnvironmentJa: "集合研修とeラーニング。", recruitmentJa: "管理職研修 2枠。", operations: { currentAssignees: 10, openSlots: 2, retentionRatePct: 82, satisfactionScore: 4.0 }, ltMonthlyProfitPerHeadJpy: 61000, contact: { email: "edu3@example.jp", phone: "052-960-6603", contactPersonJa: "研修責任者 牧野" }, matchingHintTags: ["進捗", "達成率", "eラーニング"] },
  { id: "edu-course-4", legalNameJa: "北都語学ラボ", tradeNameJa: "北都語学ラボ", industryJa: "語学学校", prefectureJa: "北海道", cityJa: "札幌市", cultureJa: "継続学習と面談頻度重視。", aiTargetProfileJa: "復習習慣がある受講者。", workplaceEnvironmentJa: "少人数クラス。", recruitmentJa: "日本語上級クラス 1枠。", operations: { currentAssignees: 9, openSlots: 1, retentionRatePct: 78, satisfactionScore: 3.9 }, ltMonthlyProfitPerHeadJpy: 49000, contact: { email: "edu4@example.jp", phone: "011-960-6604", contactPersonJa: "主任講師 斉藤" }, matchingHintTags: ["復習", "面談", "継続"] },
  { id: "edu-course-5", legalNameJa: "九州スキルアップ研究所", tradeNameJa: "九州スキルアップ研究所", industryJa: "リスキリング", prefectureJa: "福岡県", cityJa: "福岡市", cultureJa: "短期完走率重視。", aiTargetProfileJa: "週次フォローで伸びる受講者。", workplaceEnvironmentJa: "夜間講座あり。", recruitmentJa: "DX基礎ブートキャンプ 2枠。", operations: { currentAssignees: 12, openSlots: 2, retentionRatePct: 81, satisfactionScore: 4.2 }, ltMonthlyProfitPerHeadJpy: 63000, contact: { email: "edu5@example.jp", phone: "092-960-6605", contactPersonJa: "企画責任者 今井" }, matchingHintTags: ["短期完走", "週次フォロー", "DX"] },
];

function cand(partial: Omit<Candidate, "contact" | "registeredAt"> & { contact?: Partial<Candidate["contact"]> }): Candidate {
  return { ...partial, contact: { email: "student@example.jp", phone: "03-0000-6600", ...partial.contact }, registeredAt: "2026-04-03" };
}
function statusMap(label: string): { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string } {
  const m: Record<string, { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }> = {
    受講準備: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "受講準備" },
    面談調整: { pipelineStatus: "interview_coordination", pipelineStatusLabelJa: "面談調整" },
    受講中: { pipelineStatus: "training", pipelineStatusLabelJa: "受講中" },
    受講確定: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "受講確定" },
    案内送付中: { pipelineStatus: "visa_applying", pipelineStatusLabelJa: "案内送付中" },
    提出物不備: { pipelineStatus: "document_blocked", pipelineStatusLabelJa: "提出物不備" },
    教材準備: { pipelineStatus: "document_prep", pipelineStatusLabelJa: "教材準備" },
  };
  return m[label] ?? m["面談調整"];
}

export const candidates: Candidate[] = [
  cand({ id: "edu-student-1", displayName: "渡辺 未来", legalNameFull: "渡辺 未来", nameKatakana: "ワタナベ ミライ", age: 17, gender: "female", nationality: "日本", birthDate: "2009-05-02", birthPlace: "Tokyo", residence: { country: "日本", city: "東京都" }, jlpt: "N3", backgroundSummary: "受験対策希望。週5学習可。", educationWorkHistory: "模試偏差値を半年で向上。", skillTags: ["受験", "継続", "保護者連絡"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 92, aiScoreRationale: "継続率が高く成果期待値が高い。", ...statusMap("受講確定"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "初回面談完了", plannedAssignment: { clientId: "edu-course-1", jobTitleJa: "受験対策", monthlySalaryJpy: 0 }, photoUrl: avatar("edu-student-1") }),
  cand({ id: "edu-student-2", displayName: "井上 拓海", legalNameFull: "井上 拓海", nameKatakana: "イノウエ タクミ", age: 24, gender: "male", nationality: "日本", birthDate: "2002-01-15", birthPlace: "Osaka", residence: { country: "日本", city: "大阪府" }, jlpt: "N4", backgroundSummary: "IT職への転職希望。", educationWorkHistory: "販売職3年。", skillTags: ["課題提出", "就職", "実習"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 84, aiScoreRationale: "課題提出率が高く就職支援に適合。", ...statusMap("受講中"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "中間面談予定", photoUrl: avatar("edu-student-2") }),
  cand({ id: "edu-student-3", displayName: "小林 真央", legalNameFull: "小林 真央", nameKatakana: "コバヤシ マオ", age: 29, gender: "female", nationality: "日本", birthDate: "1997-03-20", birthPlace: "Nagoya", residence: { country: "日本", city: "愛知県" }, jlpt: "N4", backgroundSummary: "管理職研修を受講予定。", educationWorkHistory: "営業チームリーダー経験。", skillTags: ["進捗", "達成率", "eラーニング"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 79, aiScoreRationale: "学習計画に沿って進められる。", ...statusMap("案内送付中"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "事前課題配布済み", photoUrl: avatar("edu-student-3") }),
  cand({ id: "edu-student-4", displayName: "加藤 蓮", legalNameFull: "加藤 蓮", nameKatakana: "カトウ レン", age: 21, gender: "male", nationality: "日本", birthDate: "2005-09-11", birthPlace: "Sapporo", residence: { country: "日本", city: "北海道" }, jlpt: "N5", backgroundSummary: "語学継続に課題。", educationWorkHistory: "独学経験あり。", skillTags: ["復習", "面談", "継続"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 69, aiScoreRationale: "定着には週次フォローが必要。", ...statusMap("教材準備"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "教材準備中", documentAlertJa: "課題提出フォーマットが未統一。", photoUrl: avatar("edu-student-4") }),
  cand({ id: "edu-student-5", displayName: "森田 海斗", legalNameFull: "森田 海斗", nameKatakana: "モリタ カイト", age: 26, gender: "male", nationality: "日本", birthDate: "2000-07-28", birthPlace: "Fukuoka", residence: { country: "日本", city: "福岡県" }, jlpt: "N3", backgroundSummary: "短期完走型講座を希望。", educationWorkHistory: "事務職からDX分野へ転向予定。", skillTags: ["短期完走", "週次フォロー", "DX"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 71, aiScoreRationale: "動機は高いが提出物の遅延が課題。", ...statusMap("提出物不備"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "再提出依頼中", documentAlertJa: "初回提出課題の記載漏れ。", photoUrl: avatar("edu-student-5") }),
];

export const demoBundle: DemoDataBundle = { meta: { version: "1.0.0", locale: "ja-JP", referenceDate: "2026-04-03", descriptionJa: "教育テンプレート用ダミーデータ（5講座・5受講者）" }, candidates, clients };
export function getClientById(id: string) { return clients.find((c) => c.id === id); }
export function getCandidateById(id: string) { return candidates.find((c) => c.id === id); }
export function getPipelineCounts(): Record<CandidatePipelineStatus, number> { const init: Record<CandidatePipelineStatus, number> = { awaiting_entry: 0, interview_coordination: 0, training: 0, offer_accepted: 0, visa_applying: 0, document_blocked: 0, document_prep: 0 }; for (const c of candidates) init[c.pipelineStatus] += 1; return init; }
export function countN3OrAbove() { return candidates.filter((c) => scoreOrder(c.jlpt) >= 3).length; }
export function getTopCandidatesByAiScore(limit: number) { return [...candidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, limit); }
export function countDocumentAlerts() { return candidates.filter((c) => c.pipelineStatus === "document_blocked" || c.pipelineStatus === "document_prep" || Boolean(c.documentAlertJa)).length; }
export function totalOpenSlots() { return clients.reduce((s, c) => s + c.operations.openSlots, 0); }
export function monthlyRevenueTrend() { return [{ month: "2025-11", amountManYen: 58 }, { month: "2025-12", amountManYen: 61 }, { month: "2026-01", amountManYen: 63 }, { month: "2026-02", amountManYen: 66 }, { month: "2026-03", amountManYen: 69 }, { month: "2026-04", amountManYen: 72 }]; }
export function scoreCandidateForClient(candidate: Candidate, client: ClientCompany) { const hit = candidate.skillTags.filter((t) => client.matchingHintTags.some((h) => h.includes(t) || t.includes(h))).length; const pct = Math.min(97, 55 + hit * 8 + Math.floor((candidate.aiScore - 60) / 3)); const reason = `${client.tradeNameJa}の重視点（${client.matchingHintTags.slice(0, 2).join("・")}）と、${candidate.displayName}の学習特性（${candidate.skillTags.slice(0, 3).join("・")}）が一致しています。`; return { pct, reason }; }
export function getMatchesForClient(clientId: string) { const client = getClientById(clientId); if (!client) return []; return [...candidates].map((c) => ({ candidate: c, ...scoreCandidateForClient(c, client) })).sort((a, b) => b.pct - a.pct).slice(0, 5); }
