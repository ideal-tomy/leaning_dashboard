import type { Candidate, CandidatePipelineStatus, ClientCompany, DemoDataBundle } from "@data/types";

function avatar(seed: string) { return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`; }
function scoreOrder(j: Candidate["jlpt"]): number { const o: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 }; return o[j] ?? 0; }

export const clients: ClientCompany[] = [
  { id: "con-site-1", legalNameJa: "東都設備工業株式会社", tradeNameJa: "東都設備工業", industryJa: "設備工事", prefectureJa: "東京都", cityJa: "品川区", cultureJa: "安全最優先・KY徹底。", aiTargetProfileJa: "安全書類を正確に扱える作業員。", workplaceEnvironmentJa: "改修工事の夜間作業あり。", recruitmentJa: "配管工 3名手配中。", operations: { currentAssignees: 16, openSlots: 3, retentionRatePct: 80, satisfactionScore: 4.1 }, ltMonthlyProfitPerHeadJpy: 69000, contact: { email: "con1@example.jp", phone: "03-7300-4401", contactPersonJa: "工事長 服部" }, matchingHintTags: ["安全書類", "夜間", "配管"] },
  { id: "con-site-2", legalNameJa: "関西現場ソリューションズ株式会社", tradeNameJa: "関西現場ソリューションズ", industryJa: "建築現場管理", prefectureJa: "大阪府", cityJa: "堺市", cultureJa: "工程遵守と報連相重視。", aiTargetProfileJa: "段取り力と工程理解がある作業員。", workplaceEnvironmentJa: "複数現場を移動。", recruitmentJa: "多能工 2名手配中。", operations: { currentAssignees: 12, openSlots: 2, retentionRatePct: 77, satisfactionScore: 3.9 }, ltMonthlyProfitPerHeadJpy: 64000, contact: { email: "con2@example.jp", phone: "072-900-4402", contactPersonJa: "統括 田原" }, matchingHintTags: ["工程", "段取り", "報連相"] },
  { id: "con-site-3", legalNameJa: "中部土木メンテナンス株式会社", tradeNameJa: "中部土木メンテナンス", industryJa: "土木保全", prefectureJa: "愛知県", cityJa: "豊田市", cultureJa: "資格者中心の配員。", aiTargetProfileJa: "有資格者を優先。", workplaceEnvironmentJa: "屋外作業中心。", recruitmentJa: "土木補助 2名手配中。", operations: { currentAssignees: 9, openSlots: 2, retentionRatePct: 82, satisfactionScore: 4.2 }, ltMonthlyProfitPerHeadJpy: 71000, contact: { email: "con3@example.jp", phone: "0565-90-4403", contactPersonJa: "主任 安田" }, matchingHintTags: ["資格", "土木", "屋外"] },
  { id: "con-site-4", legalNameJa: "北海プラントワークス株式会社", tradeNameJa: "北海プラントワークス", industryJa: "プラント工事", prefectureJa: "北海道", cityJa: "苫小牧市", cultureJa: "品質記録の厳格運用。", aiTargetProfileJa: "検査記録に強い作業員。", workplaceEnvironmentJa: "出張現場あり。", recruitmentJa: "溶接補助 1名手配中。", operations: { currentAssignees: 7, openSlots: 1, retentionRatePct: 74, satisfactionScore: 3.8 }, ltMonthlyProfitPerHeadJpy: 76000, contact: { email: "con4@example.jp", phone: "0144-80-4404", contactPersonJa: "品質 山口" }, matchingHintTags: ["品質記録", "溶接", "出張"] },
  { id: "con-site-5", legalNameJa: "九州インフラ保守株式会社", tradeNameJa: "九州インフラ保守", industryJa: "インフラ保守", prefectureJa: "福岡県", cityJa: "北九州市", cultureJa: "緊急対応時の柔軟性重視。", aiTargetProfileJa: "突発対応が可能な作業員。", workplaceEnvironmentJa: "オンコール体制あり。", recruitmentJa: "保守員 2名手配中。", operations: { currentAssignees: 11, openSlots: 2, retentionRatePct: 79, satisfactionScore: 4.0 }, ltMonthlyProfitPerHeadJpy: 68000, contact: { email: "con5@example.jp", phone: "093-900-4405", contactPersonJa: "所長 田中" }, matchingHintTags: ["緊急対応", "保守", "オンコール"] },
];

function cand(partial: Omit<Candidate, "contact" | "registeredAt"> & { contact?: Partial<Candidate["contact"]> }): Candidate {
  return { ...partial, contact: { email: "worker@example.jp", phone: "03-0000-4400", ...partial.contact }, registeredAt: "2026-04-03" };
}
function statusMap(label: string): { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string } {
  const m: Record<string, { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }> = {
    現場手配待ち: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "現場手配待ち" },
    現場面談調整: { pipelineStatus: "interview_coordination", pipelineStatusLabelJa: "現場面談調整" },
    安全教育中: { pipelineStatus: "training", pipelineStatusLabelJa: "安全教育中" },
    配員確定: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "配員確定" },
    工程調整中: { pipelineStatus: "visa_applying", pipelineStatusLabelJa: "工程調整中" },
    安全書類不備: { pipelineStatus: "document_blocked", pipelineStatusLabelJa: "安全書類不備" },
    入場書類準備: { pipelineStatus: "document_prep", pipelineStatusLabelJa: "入場書類準備" },
  };
  return m[label] ?? m["現場面談調整"];
}

export const candidates: Candidate[] = [
  cand({ id: "con-worker-1", displayName: "鈴木 隆", legalNameFull: "鈴木 隆", nameKatakana: "スズキ タカシ", age: 38, gender: "male", nationality: "日本", birthDate: "1988-05-09", birthPlace: "Tokyo", residence: { country: "日本", city: "東京都" }, jlpt: "N3", backgroundSummary: "配管工経験10年。", educationWorkHistory: "改修現場で班長経験あり。", skillTags: ["配管", "安全書類", "夜間"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: true, aiScore: 93, aiScoreRationale: "安全品質と施工経験が高く即戦力。", ...statusMap("配員確定"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "配属決定", plannedAssignment: { clientId: "con-site-1", jobTitleJa: "配管工", monthlySalaryJpy: 0 }, photoUrl: avatar("con-worker-1") }),
  cand({ id: "con-worker-2", displayName: "高橋 彩", legalNameFull: "高橋 彩", nameKatakana: "タカハシ アヤ", age: 30, gender: "female", nationality: "日本", birthDate: "1996-10-01", birthPlace: "Osaka", residence: { country: "日本", city: "大阪府" }, jlpt: "N4", backgroundSummary: "施工管理補助5年。", educationWorkHistory: "現場日報・工程管理を担当。", skillTags: ["工程", "段取り", "報連相"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: true, aiScore: 85, aiScoreRationale: "複数現場調整の適性が高い。", ...statusMap("現場面談調整"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "現場確認中", photoUrl: avatar("con-worker-2") }),
  cand({ id: "con-worker-3", displayName: "中村 大地", legalNameFull: "中村 大地", nameKatakana: "ナカムラ ダイチ", age: 28, gender: "male", nationality: "日本", birthDate: "1998-02-23", birthPlace: "Aichi", residence: { country: "日本", city: "愛知県" }, jlpt: "N4", backgroundSummary: "土木現場で資格取得中。", educationWorkHistory: "舗装工事・保全工事を経験。", skillTags: ["土木", "資格", "屋外"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: true, aiScore: 79, aiScoreRationale: "資格要件を満たせば適性は高い。", ...statusMap("安全教育中"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "教育研修中", photoUrl: avatar("con-worker-3") }),
  cand({ id: "con-worker-4", displayName: "伊藤 修", legalNameFull: "伊藤 修", nameKatakana: "イトウ オサム", age: 42, gender: "male", nationality: "日本", birthDate: "1984-07-11", birthPlace: "Hokkaido", residence: { country: "日本", city: "北海道" }, jlpt: "N3", backgroundSummary: "溶接補助・品質記録経験あり。", educationWorkHistory: "プラント定修で記録担当。", skillTags: ["品質記録", "溶接", "出張"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: true, aiScore: 73, aiScoreRationale: "品質面は強いが書類提出遅延あり。", ...statusMap("入場書類準備"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "書類準備中", documentAlertJa: "安全衛生教育記録の再提出待ち。", photoUrl: avatar("con-worker-4") }),
  cand({ id: "con-worker-5", displayName: "山口 晃", legalNameFull: "山口 晃", nameKatakana: "ヤマグチ アキラ", age: 35, gender: "male", nationality: "日本", birthDate: "1991-01-19", birthPlace: "Fukuoka", residence: { country: "日本", city: "福岡県" }, jlpt: "N5", backgroundSummary: "保守対応経験あり。", educationWorkHistory: "インフラ点検業務を7年。", skillTags: ["保守", "緊急対応", "オンコール"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: true, aiScore: 67, aiScoreRationale: "実務経験はあるが書類不備がリスク。", ...statusMap("安全書類不備"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "再提出待ち", documentAlertJa: "特別教育修了証の期限切れ。", photoUrl: avatar("con-worker-5") }),
];

export const demoBundle: DemoDataBundle = { meta: { version: "1.0.0", locale: "ja-JP", referenceDate: "2026-04-03", descriptionJa: "建設テンプレート用ダミーデータ（5現場・5作業員）" }, candidates, clients };
export function getClientById(id: string) { return clients.find((c) => c.id === id); }
export function getCandidateById(id: string) { return candidates.find((c) => c.id === id); }
export function getPipelineCounts(): Record<CandidatePipelineStatus, number> { const init: Record<CandidatePipelineStatus, number> = { awaiting_entry: 0, interview_coordination: 0, training: 0, offer_accepted: 0, visa_applying: 0, document_blocked: 0, document_prep: 0 }; for (const c of candidates) init[c.pipelineStatus] += 1; return init; }
export function countN3OrAbove() { return candidates.filter((c) => scoreOrder(c.jlpt) >= 3).length; }
export function getTopCandidatesByAiScore(limit: number) { return [...candidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, limit); }
export function countDocumentAlerts() { return candidates.filter((c) => c.pipelineStatus === "document_blocked" || c.pipelineStatus === "document_prep" || Boolean(c.documentAlertJa)).length; }
export function totalOpenSlots() { return clients.reduce((s, c) => s + c.operations.openSlots, 0); }
export function monthlyRevenueTrend() { return [{ month: "2025-11", amountManYen: 92 }, { month: "2025-12", amountManYen: 96 }, { month: "2026-01", amountManYen: 94 }, { month: "2026-02", amountManYen: 98 }, { month: "2026-03", amountManYen: 102 }, { month: "2026-04", amountManYen: 105 }]; }
export function scoreCandidateForClient(candidate: Candidate, client: ClientCompany) { const hit = candidate.skillTags.filter((t) => client.matchingHintTags.some((h) => h.includes(t) || t.includes(h))).length; const pct = Math.min(97, 57 + hit * 8 + Math.floor((candidate.aiScore - 60) / 3)); const reason = `${client.tradeNameJa}の重視点（${client.matchingHintTags.slice(0, 2).join("・")}）と、${candidate.displayName}の技能（${candidate.skillTags.slice(0, 3).join("・")}）が一致しています。`; return { pct, reason }; }
export function getMatchesForClient(clientId: string) { const client = getClientById(clientId); if (!client) return []; return [...candidates].map((c) => ({ candidate: c, ...scoreCandidateForClient(c, client) })).sort((a, b) => b.pct - a.pct).slice(0, 5); }
