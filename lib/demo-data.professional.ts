import type { Candidate, CandidatePipelineStatus, ClientCompany, DemoDataBundle } from "@data/types";

function avatar(seed: string) { return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`; }
function scoreOrder(j: Candidate["jlpt"]): number { const o: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 }; return o[j] ?? 0; }

export const clients: ClientCompany[] = [
  { id: "pro-client-1", legalNameJa: "さくら社労士法人", tradeNameJa: "さくら社労士法人", industryJa: "社労士", prefectureJa: "東京都", cityJa: "新宿区", cultureJa: "期限厳守と手続き品質を重視。", aiTargetProfileJa: "期限管理に強い案件を優先。", workplaceEnvironmentJa: "電子申請主体。", recruitmentJa: "助成金申請案件 6件。", operations: { currentAssignees: 12, openSlots: 3, retentionRatePct: 83, satisfactionScore: 4.4 }, ltMonthlyProfitPerHeadJpy: 56000, contact: { email: "pro1@example.jp", phone: "03-7100-3301", contactPersonJa: "所長 村上" }, matchingHintTags: ["期限", "助成金", "電子申請"] },
  { id: "pro-client-2", legalNameJa: "行政書士みらい総合事務所", tradeNameJa: "みらい総合事務所", industryJa: "行政書士", prefectureJa: "大阪府", cityJa: "大阪市", cultureJa: "証憑の網羅性を重視。", aiTargetProfileJa: "証憑収集が早い案件。", workplaceEnvironmentJa: "来所相談とオンライン半々。", recruitmentJa: "在留・許認可案件 8件。", operations: { currentAssignees: 10, openSlots: 4, retentionRatePct: 78, satisfactionScore: 4.1 }, ltMonthlyProfitPerHeadJpy: 59000, contact: { email: "pro2@example.jp", phone: "06-8100-3302", contactPersonJa: "代表 上田" }, matchingHintTags: ["証憑", "許認可", "在留"] },
  { id: "pro-client-3", legalNameJa: "税理士法人ブルーライン", tradeNameJa: "税理士法人ブルーライン", industryJa: "税理士", prefectureJa: "愛知県", cityJa: "名古屋市", cultureJa: "レビュー回数を最小化する正確性重視。", aiTargetProfileJa: "会計資料の整理精度が高い案件。", workplaceEnvironmentJa: "月次処理の波あり。", recruitmentJa: "決算対応案件 5件。", operations: { currentAssignees: 7, openSlots: 2, retentionRatePct: 82, satisfactionScore: 4.0 }, ltMonthlyProfitPerHeadJpy: 61000, contact: { email: "pro3@example.jp", phone: "052-910-3303", contactPersonJa: "マネージャー 松田" }, matchingHintTags: ["決算", "会計資料", "レビュー"] },
  { id: "pro-client-4", legalNameJa: "北都リーガルオフィス", tradeNameJa: "北都リーガルオフィス", industryJa: "法務支援", prefectureJa: "北海道", cityJa: "札幌市", cultureJa: "相談初動の速さ重視。", aiTargetProfileJa: "初回相談で論点整理できる案件。", workplaceEnvironmentJa: "チャット相談が多い。", recruitmentJa: "労務相談案件 7件。", operations: { currentAssignees: 6, openSlots: 3, retentionRatePct: 75, satisfactionScore: 3.9 }, ltMonthlyProfitPerHeadJpy: 53000, contact: { email: "pro4@example.jp", phone: "011-920-3304", contactPersonJa: "室長 菊池" }, matchingHintTags: ["初動", "論点整理", "労務"] },
  { id: "pro-client-5", legalNameJa: "福岡ビジネス許認可センター", tradeNameJa: "福岡許認可センター", industryJa: "許認可支援", prefectureJa: "福岡県", cityJa: "福岡市", cultureJa: "行政折衝の丁寧さを重視。", aiTargetProfileJa: "申請要件確認が正確な案件。", workplaceEnvironmentJa: "現地確認あり。", recruitmentJa: "新規許認可案件 4件。", operations: { currentAssignees: 5, openSlots: 2, retentionRatePct: 80, satisfactionScore: 4.2 }, ltMonthlyProfitPerHeadJpy: 64000, contact: { email: "pro5@example.jp", phone: "092-930-3305", contactPersonJa: "統括 野村" }, matchingHintTags: ["申請要件", "行政折衝", "現地確認"] },
];

function cand(partial: Omit<Candidate, "contact" | "registeredAt"> & { contact?: Partial<Candidate["contact"]> }): Candidate {
  return { ...partial, contact: { email: "case@example.jp", phone: "03-0000-3300", ...partial.contact }, registeredAt: "2026-04-03" };
}
function statusMap(label: string): { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string } {
  const m: Record<string, { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }> = {
    着手待ち: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "着手待ち" },
    初回相談調整: { pipelineStatus: "interview_coordination", pipelineStatusLabelJa: "初回相談調整" },
    論点整理中: { pipelineStatus: "training", pipelineStatusLabelJa: "論点整理中" },
    受任見込み: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "受任見込み" },
    申請手続中: { pipelineStatus: "visa_applying", pipelineStatusLabelJa: "申請手続中" },
    証憑不足: { pipelineStatus: "document_blocked", pipelineStatusLabelJa: "証憑不足" },
    申請書類準備: { pipelineStatus: "document_prep", pipelineStatusLabelJa: "申請書類準備" },
  };
  return m[label] ?? m["初回相談調整"];
}

export const candidates: Candidate[] = [
  cand({ id: "pro-case-1", displayName: "株式会社 東和製作所", legalNameFull: "株式会社 東和製作所", nameKatakana: "トウワセイサクショ", age: 0, gender: "male", nationality: "日本", birthDate: "2000-01-01", birthPlace: "Tokyo", residence: { country: "日本", city: "東京都" }, jlpt: "N3", backgroundSummary: "助成金活用の雇用拡大計画あり。", educationWorkHistory: "社内で申請経験は少ない。", skillTags: ["助成金", "期限", "電子申請"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 90, aiScoreRationale: "期限意識が高く受任確度が高い。", ...statusMap("受任見込み"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "申請前最終確認中", plannedAssignment: { clientId: "pro-client-1", jobTitleJa: "助成金申請", monthlySalaryJpy: 0 }, photoUrl: avatar("pro-case-1") }),
  cand({ id: "pro-case-2", displayName: "山田 真理", legalNameFull: "山田 真理", nameKatakana: "ヤマダ マリ", age: 39, gender: "female", nationality: "日本", birthDate: "1987-02-10", birthPlace: "Osaka", residence: { country: "日本", city: "大阪府" }, jlpt: "N4", backgroundSummary: "在留更新の相談。提出物が多い。", educationWorkHistory: "個人事業主として5年。", skillTags: ["在留", "証憑", "更新"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 82, aiScoreRationale: "要件適合は高いが証憑整理が課題。", ...statusMap("申請手続中"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "追加資料提出待ち", photoUrl: avatar("pro-case-2") }),
  cand({ id: "pro-case-3", displayName: "合同会社 中央物流", legalNameFull: "合同会社 中央物流", nameKatakana: "チュウオウブツリュウ", age: 0, gender: "male", nationality: "日本", birthDate: "2000-01-01", birthPlace: "Nagoya", residence: { country: "日本", city: "愛知県" }, jlpt: "N3", backgroundSummary: "決算前に会計整理を希望。", educationWorkHistory: "会計資料が部署ごとに分散。", skillTags: ["決算", "会計資料", "レビュー"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 77, aiScoreRationale: "論点は明確で短期支援に向く。", ...statusMap("論点整理中"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "資料一覧作成中", photoUrl: avatar("pro-case-3") }),
  cand({ id: "pro-case-4", displayName: "森田 翔", legalNameFull: "森田 翔", nameKatakana: "モリタ ショウ", age: 33, gender: "male", nationality: "日本", birthDate: "1993-06-08", birthPlace: "Sapporo", residence: { country: "日本", city: "北海道" }, jlpt: "N5", backgroundSummary: "労務トラブルの初回相談。", educationWorkHistory: "ベンチャー企業管理部。", skillTags: ["初動", "労務", "相談"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 70, aiScoreRationale: "緊急性は高いが証憑不足。", ...statusMap("証憑不足"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "ヒアリング中", documentAlertJa: "就業規則の最新版が未提出。", photoUrl: avatar("pro-case-4") }),
  cand({ id: "pro-case-5", displayName: "有限会社 九州フーズ", legalNameFull: "有限会社 九州フーズ", nameKatakana: "キュウシュウフーズ", age: 0, gender: "female", nationality: "日本", birthDate: "2000-01-01", birthPlace: "Fukuoka", residence: { country: "日本", city: "福岡県" }, jlpt: "N4", backgroundSummary: "新規許認可の取得を検討。", educationWorkHistory: "申請経験なし。", skillTags: ["申請要件", "行政折衝", "現地確認"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 74, aiScoreRationale: "必要要件の整理を先行すると進みやすい。", ...statusMap("申請書類準備"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "添付書類案内中", photoUrl: avatar("pro-case-5") }),
];

export const demoBundle: DemoDataBundle = { meta: { version: "1.0.0", locale: "ja-JP", referenceDate: "2026-04-03", descriptionJa: "士業テンプレート用ダミーデータ（5顧問先・5案件）" }, candidates, clients };
export function getClientById(id: string) { return clients.find((c) => c.id === id); }
export function getCandidateById(id: string) { return candidates.find((c) => c.id === id); }
export function getPipelineCounts(): Record<CandidatePipelineStatus, number> { const init: Record<CandidatePipelineStatus, number> = { awaiting_entry: 0, interview_coordination: 0, training: 0, offer_accepted: 0, visa_applying: 0, document_blocked: 0, document_prep: 0 }; for (const c of candidates) init[c.pipelineStatus] += 1; return init; }
export function countN3OrAbove() { return candidates.filter((c) => scoreOrder(c.jlpt) >= 3).length; }
export function getTopCandidatesByAiScore(limit: number) { return [...candidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, limit); }
export function countDocumentAlerts() { return candidates.filter((c) => c.pipelineStatus === "document_blocked" || c.pipelineStatus === "document_prep" || Boolean(c.documentAlertJa)).length; }
export function totalOpenSlots() { return clients.reduce((s, c) => s + c.operations.openSlots, 0); }
export function monthlyRevenueTrend() { return [{ month: "2025-11", amountManYen: 64 }, { month: "2025-12", amountManYen: 66 }, { month: "2026-01", amountManYen: 68 }, { month: "2026-02", amountManYen: 70 }, { month: "2026-03", amountManYen: 74 }, { month: "2026-04", amountManYen: 76 }]; }
export function scoreCandidateForClient(candidate: Candidate, client: ClientCompany) { const hit = candidate.skillTags.filter((t) => client.matchingHintTags.some((h) => h.includes(t) || t.includes(h))).length; const pct = Math.min(97, 56 + hit * 8 + Math.floor((candidate.aiScore - 60) / 3)); const reason = `${client.tradeNameJa}の重視点（${client.matchingHintTags.slice(0, 2).join("・")}）と、${candidate.displayName}の論点（${candidate.skillTags.slice(0, 3).join("・")}）が一致しています。`; return { pct, reason }; }
export function getMatchesForClient(clientId: string) { const client = getClientById(clientId); if (!client) return []; return [...candidates].map((c) => ({ candidate: c, ...scoreCandidateForClient(c, client) })).sort((a, b) => b.pct - a.pct).slice(0, 5); }
