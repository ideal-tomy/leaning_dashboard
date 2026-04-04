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
  { id: "re-prop-1", legalNameJa: "城東レジデンス株式会社", tradeNameJa: "城東レジデンス", industryJa: "賃貸仲介", prefectureJa: "東京都", cityJa: "江東区", cultureJa: "即日内見とスピード契約を重視。", aiTargetProfileJa: "成約確度が高く書類提出が早い顧客。", workplaceEnvironmentJa: "内見同行とオンライン契約説明が中心。", recruitmentJa: "2LDK中心・単身向け10件を提案中。", operations: { currentAssignees: 14, openSlots: 4, retentionRatePct: 81, satisfactionScore: 4.2 }, ltMonthlyProfitPerHeadJpy: 58000, contact: { email: "re1@example.jp", phone: "03-7000-2201", contactPersonJa: "営業 井上" }, matchingHintTags: ["駅近", "即入居", "オンライン契約"] },
  { id: "re-prop-2", legalNameJa: "みなとハウジング株式会社", tradeNameJa: "みなとハウジング", industryJa: "売買仲介", prefectureJa: "神奈川県", cityJa: "横浜市", cultureJa: "ローン事前審査の精度重視。", aiTargetProfileJa: "資金計画が明確で購入時期が近い顧客。", workplaceEnvironmentJa: "週末内見が多い。", recruitmentJa: "ファミリー向け戸建て6件を提案中。", operations: { currentAssignees: 9, openSlots: 3, retentionRatePct: 76, satisfactionScore: 4.0 }, ltMonthlyProfitPerHeadJpy: 62000, contact: { email: "re2@example.jp", phone: "045-800-2202", contactPersonJa: "店長 渡邉" }, matchingHintTags: ["住宅ローン", "ファミリー", "戸建て"] },
  { id: "re-prop-3", legalNameJa: "西東京テラス不動産株式会社", tradeNameJa: "西東京テラス不動産", industryJa: "賃貸管理", prefectureJa: "東京都", cityJa: "立川市", cultureJa: "更新率改善に注力。", aiTargetProfileJa: "長期入居志向でトラブルが少ない顧客。", workplaceEnvironmentJa: "管理物件の巡回あり。", recruitmentJa: "更新対象物件12件の改善施策中。", operations: { currentAssignees: 11, openSlots: 2, retentionRatePct: 84, satisfactionScore: 4.3 }, ltMonthlyProfitPerHeadJpy: 51000, contact: { email: "re3@example.jp", phone: "042-700-2203", contactPersonJa: "管理主任 大西" }, matchingHintTags: ["更新", "長期入居", "管理"] },
  { id: "re-prop-4", legalNameJa: "湘南リゾートプロパティ株式会社", tradeNameJa: "湘南リゾートプロパティ", industryJa: "別荘売買", prefectureJa: "神奈川県", cityJa: "藤沢市", cultureJa: "顧客体験重視の丁寧提案。", aiTargetProfileJa: "セカンドハウス需要の高い顧客。", workplaceEnvironmentJa: "現地案内中心。", recruitmentJa: "海沿い物件4件を商談中。", operations: { currentAssignees: 5, openSlots: 2, retentionRatePct: 72, satisfactionScore: 3.9 }, ltMonthlyProfitPerHeadJpy: 70000, contact: { email: "re4@example.jp", phone: "0466-90-2204", contactPersonJa: "代表 佐伯" }, matchingHintTags: ["別荘", "眺望", "現地案内"] },
  { id: "re-prop-5", legalNameJa: "名古屋アセットリンク株式会社", tradeNameJa: "名古屋アセットリンク", industryJa: "投資用不動産", prefectureJa: "愛知県", cityJa: "名古屋市", cultureJa: "収支シミュレーション重視。", aiTargetProfileJa: "投資判断が早い法人顧客。", workplaceEnvironmentJa: "オンライン商談主体。", recruitmentJa: "区分マンション投資5件を提案中。", operations: { currentAssignees: 8, openSlots: 3, retentionRatePct: 79, satisfactionScore: 4.1 }, ltMonthlyProfitPerHeadJpy: 67000, contact: { email: "re5@example.jp", phone: "052-900-2205", contactPersonJa: "営業課長 加納" }, matchingHintTags: ["利回り", "法人投資", "シミュレーション"] },
];

function cand(
  partial: Omit<Candidate, "contact" | "registeredAt"> & {
    contact?: Partial<Candidate["contact"]>;
  }
): Candidate {
  return {
    ...partial,
    contact: { email: "customer@example.jp", phone: "03-0000-2200", ...partial.contact },
    registeredAt: "2026-04-03",
  };
}

function statusMap(label: string): { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string } {
  const m: Record<string, { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }> = {
    契約前調整: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "契約前調整" },
    内見調整: { pipelineStatus: "interview_coordination", pipelineStatusLabelJa: "内見調整" },
    申込審査中: { pipelineStatus: "training", pipelineStatusLabelJa: "申込審査中" },
    契約見込み: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "契約見込み" },
    契約手続中: { pipelineStatus: "visa_applying", pipelineStatusLabelJa: "契約手続中" },
    書類不備: { pipelineStatus: "document_blocked", pipelineStatusLabelJa: "書類不備" },
    重要事項準備: { pipelineStatus: "document_prep", pipelineStatusLabelJa: "重要事項準備" },
  };
  return m[label] ?? m["内見調整"];
}

export const candidates: Candidate[] = [
  cand({ id: "re-customer-1", displayName: "山本 健太", legalNameFull: "山本 健太", nameKatakana: "ヤマモト ケンタ", age: 34, gender: "male", nationality: "日本", birthDate: "1992-04-11", birthPlace: "Tokyo", residence: { country: "日本", city: "東京都" }, jlpt: "N3", backgroundSummary: "共働き世帯。4月入居希望。", educationWorkHistory: "IT企業勤務。住宅購入は初めて。", skillTags: ["駅近", "ファミリー", "即入居"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: true, aiScore: 91, aiScoreRationale: "希望条件と予算が明確で成約確度が高い。", ...statusMap("契約見込み"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "重要事項説明の日程調整中", plannedAssignment: { clientId: "re-prop-1", jobTitleJa: "賃貸契約", monthlySalaryJpy: 0 }, photoUrl: avatar("re-customer-1") }),
  cand({ id: "re-customer-2", displayName: "佐々木 美咲", legalNameFull: "佐々木 美咲", nameKatakana: "ササキ ミサキ", age: 29, gender: "female", nationality: "日本", birthDate: "1997-09-22", birthPlace: "Yokohama", residence: { country: "日本", city: "神奈川県" }, jlpt: "N4", backgroundSummary: "購入検討中。住宅ローン仮審査前。", educationWorkHistory: "医療事務。2年以内の購入希望。", skillTags: ["住宅ローン", "戸建て", "内見"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 83, aiScoreRationale: "条件は明確だが資金計画の確認が必要。", ...statusMap("内見調整"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "銀行相談前", photoUrl: avatar("re-customer-2") }),
  cand({ id: "re-customer-3", displayName: "株式会社 東都商事", legalNameFull: "株式会社 東都商事", nameKatakana: "トウトショウジ", age: 0, gender: "male", nationality: "日本", birthDate: "2000-01-01", birthPlace: "Tokyo", residence: { country: "日本", city: "東京都" }, jlpt: "N3", backgroundSummary: "投資用区分を比較検討中。", educationWorkHistory: "不動産投資経験あり。", skillTags: ["利回り", "法人投資", "比較検討"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 78, aiScoreRationale: "意思決定者との合意形成に時間がかかる見込み。", ...statusMap("契約手続中"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "条件調整中", photoUrl: avatar("re-customer-3") }),
  cand({ id: "re-customer-4", displayName: "中村 陽菜", legalNameFull: "中村 陽菜", nameKatakana: "ナカムラ ヒナ", age: 26, gender: "female", nationality: "日本", birthDate: "2000-12-06", birthPlace: "Chiba", residence: { country: "日本", city: "千葉県" }, jlpt: "N4", backgroundSummary: "賃貸更新か住替えかを検討中。", educationWorkHistory: "販売職。更新手続きは未経験。", skillTags: ["更新", "長期入居", "管理"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: false, aiScore: 72, aiScoreRationale: "更新条件の理解不足がありフォローが必要。", ...statusMap("重要事項準備"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "必要書類の案内中", documentAlertJa: "収入証明の提出が未完了。", photoUrl: avatar("re-customer-4") }),
  cand({ id: "re-customer-5", displayName: "高橋 大輔", legalNameFull: "高橋 大輔", nameKatakana: "タカハシ ダイスケ", age: 41, gender: "male", nationality: "日本", birthDate: "1985-03-18", birthPlace: "Kanagawa", residence: { country: "日本", city: "神奈川県" }, jlpt: "N5", backgroundSummary: "別荘購入を検討。家族の合意待ち。", educationWorkHistory: "製造業管理職。", skillTags: ["別荘", "現地案内", "眺望"], tokuteiGinoFoodManufacturing: false, driversLicenseLk: true, aiScore: 66, aiScoreRationale: "検討段階が長く、書類準備の遅れリスク。", ...statusMap("書類不備"), passportNumber: "NA", passportExpiry: "NA", coeStatusJa: "本人確認書類再提出待ち", documentAlertJa: "住民票の記載不備で再取得依頼。", photoUrl: avatar("re-customer-5") }),
];

export const demoBundle: DemoDataBundle = {
  meta: { version: "1.0.0", locale: "ja-JP", referenceDate: "2026-04-03", descriptionJa: "不動産テンプレート用ダミーデータ（5案件・5顧客）" },
  candidates,
  clients,
};

export function getClientById(id: string) { return clients.find((c) => c.id === id); }
export function getCandidateById(id: string) { return candidates.find((c) => c.id === id); }
export function getPipelineCounts(): Record<CandidatePipelineStatus, number> {
  const init: Record<CandidatePipelineStatus, number> = { awaiting_entry: 0, interview_coordination: 0, training: 0, offer_accepted: 0, visa_applying: 0, document_blocked: 0, document_prep: 0 };
  for (const c of candidates) init[c.pipelineStatus] += 1;
  return init;
}
export function countN3OrAbove() { return candidates.filter((c) => scoreOrder(c.jlpt) >= 3).length; }
export function getTopCandidatesByAiScore(limit: number) { return [...candidates].sort((a, b) => b.aiScore - a.aiScore).slice(0, limit); }
export function countDocumentAlerts() { return candidates.filter((c) => c.pipelineStatus === "document_blocked" || c.pipelineStatus === "document_prep" || Boolean(c.documentAlertJa)).length; }
export function totalOpenSlots() { return clients.reduce((s, c) => s + c.operations.openSlots, 0); }
export function monthlyRevenueTrend() { return [{ month: "2025-11", amountManYen: 78 }, { month: "2025-12", amountManYen: 80 }, { month: "2026-01", amountManYen: 83 }, { month: "2026-02", amountManYen: 79 }, { month: "2026-03", amountManYen: 88 }, { month: "2026-04", amountManYen: 90 }]; }
export function scoreCandidateForClient(candidate: Candidate, client: ClientCompany) {
  const hit = candidate.skillTags.filter((t) => client.matchingHintTags.some((h) => h.includes(t) || t.includes(h))).length;
  const pct = Math.min(97, 56 + hit * 9 + Math.floor((candidate.aiScore - 60) / 3));
  const reason = `${client.tradeNameJa}の重視点（${client.matchingHintTags.slice(0, 2).join("・")}）と、${candidate.displayName}の要件（${candidate.skillTags.slice(0, 3).join("・")}）が一致しています。`;
  return { pct, reason };
}
export function getMatchesForClient(clientId: string) {
  const client = getClientById(clientId);
  if (!client) return [];
  return [...candidates].map((c) => ({ candidate: c, ...scoreCandidateForClient(c, client) })).sort((a, b) => b.pct - a.pct).slice(0, 5);
}
