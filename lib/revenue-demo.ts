import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { defaultIndustryKey, type EnabledIndustryKey } from "@/lib/industry-profiles";

/** ポートフォリオ加重（稼働人数ベース）の継続率・1人あたり月次粗利 */
export function weightedPortfolioMetrics(industry: EnabledIndustryKey = defaultIndustryKey) {
  const { clients } = getIndustryDemoData(industry);
  let w = 0;
  let retSum = 0;
  let marginSum = 0;
  for (const c of clients) {
    const a = c.operations.currentAssignees;
    w += a;
    retSum += a * c.operations.retentionRatePct;
    marginSum += a * (c.ltMonthlyProfitPerHeadJpy ?? 0);
  }
  return {
    totalAssignees: w,
    weightedRetentionPct: w ? Math.round((retSum / w) * 10) / 10 : 0,
    avgMonthlyMarginPerHeadJpy: w ? Math.round(marginSum / w) : 0,
  };
}

export function getCacDemo() {
  return {
    avgCacJpy: 842_000,
    medianCacJpy: 798_000,
    /** 直近12ヶ月・成約ベース（デモ） */
    sampleSize: 36,
    breakdown: [
      { label: "現地採用・渡航関連", jpy: 320_000, pct: 38 },
      { label: "講習・試験・教材", jpy: 185_000, pct: 22 },
      { label: "書類・翻訳・申請手数料", jpy: 142_000, pct: 17 },
      { label: "広告・スカウト/Success", jpy: 115_000, pct: 14 },
      { label: "寮・初月立替他", jpy: 80_000, pct: 9 },
    ],
  };
}

export type RevenueTrendRow = {
  month: string;
  label: string;
  amountManYen: number;
  /** 前年同月（ダミー） */
  prevYearManYen: number;
};

export function getRevenueTrendForChart(industry: EnabledIndustryKey = defaultIndustryKey): RevenueTrendRow[] {
  const t = getIndustryDemoData(industry).monthlyRevenueTrend();
  return t.map((row, i) => ({
    ...row,
    label: formatMonthLabel(row.month),
    prevYearManYen: Math.max(
      28,
      row.amountManYen - 6 - (i % 4) + Math.floor(i / 3)
    ),
  }));
}

function formatMonthLabel(isoMonth: string) {
  const [, m] = isoMonth.split("-");
  return `${m}月`;
}

function daysBetween(from: Date, to: Date) {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export type RefundRiskItem = {
  candidateId: string;
  displayName: string;
  clientHintJa: string;
  guaranteeEndsOn: string;
  daysLeft: number;
  risk: "high" | "medium" | "watch";
  exposureManYen: number;
  noteJa: string;
};

/** 返金・保証ウィンドウの見える化（デモ。日付は固定基準日から算出） */
export function getRefundRiskDemo(
  referenceDate = "2026-04-03",
  industry: EnabledIndustryKey = defaultIndustryKey
): RefundRiskItem[] {
  const ref = new Date(referenceDate + "T12:00:00");
  const specs: Omit<RefundRiskItem, "displayName" | "daysLeft">[] = [
    {
      candidateId: "cand-dhammika-appuhamy",
      clientHintJa: "（内定先調整中）",
      guaranteeEndsOn: "2026-04-17",
      risk: "high",
      exposureManYen: 82,
      noteJa: "書類不備で申請ストップ。保証期間内の認定取得が不透明。",
    },
    {
      candidateId: "cand-shani-mendis",
      clientHintJa: "（書類整備中）",
      guaranteeEndsOn: "2026-04-24",
      risk: "medium",
      exposureManYen: 76,
      noteJa: "パスポート・出生証明の遅延。追加コスト発生リスク。",
    },
    {
      candidateId: "cand-dilshan-silva",
      clientHintJa: "講習施設",
      guaranteeEndsOn: "2026-05-12",
      risk: "watch",
      exposureManYen: 45,
      noteJa: "講習遅延で入国スケジュールが後ろ倒しの可能性。",
    },
    {
      candidateId: "cand-udara-bandara",
      clientHintJa: "（配属未定）",
      guaranteeEndsOn: "2026-05-28",
      risk: "watch",
      exposureManYen: 38,
      noteJa: "日本語レベルと講習進度のギャップを監視。",
    },
  ];

  return specs.map((s) => {
    const cand = getIndustryDemoData(industry).getCandidateById(s.candidateId);
    const end = new Date(s.guaranteeEndsOn + "T12:00:00");
    return {
      ...s,
      displayName: cand?.displayName ?? s.candidateId,
      daysLeft: daysBetween(ref, end),
    };
  });
}

export function getReferralRecoveryDemo() {
  return {
    completed: 14,
    partial: 5,
    uncollected: 3,
    billedManYen: 186,
    collectedManYen: 142,
    partialManYen: 28,
    outstandingManYen: 16,
  };
}

export type BreakevenPoint = {
  month: number;
  cumulativeManYen: number;
  cacManYen: number;
  /** 年次継続率を月次生存率に単純換算したうえでの累積粗利（デモモデル） */
  survivalApprox: number;
};

/**
 * 1名あたり: 初月から月次粗利を積み上げ。年次継続率 R を月次生存率 R^(1/12) とみなす単純モデル。
 * 損益分岐＝累積粗利が CAC を初めて超える月。
 */
export function getBreakevenSeries(
  months = 24,
  industry: EnabledIndustryKey = defaultIndustryKey
): {
  points: BreakevenPoint[];
  breakevenMonth: number | null;
  cacManYen: number;
  avgMarginManYen: number;
  annualRetentionDecimal: number;
} {
  const { weightedRetentionPct, avgMonthlyMarginPerHeadJpy } =
    weightedPortfolioMetrics(industry);
  const R = Math.min(0.99, Math.max(0.5, weightedRetentionPct / 100));
  const monthlySurvival = Math.pow(R, 1 / 12);
  const cac = getCacDemo().avgCacJpy;
  const cacManYen = cac / 10_000;
  const marginMan = avgMonthlyMarginPerHeadJpy / 10_000;

  let cumulative = 0;
  const points: BreakevenPoint[] = [];
  let breakevenMonth: number | null = null;

  for (let m = 1; m <= months; m++) {
    const survival = Math.pow(monthlySurvival, m - 1);
    cumulative += marginMan * survival;
    if (breakevenMonth === null && cumulative >= cacManYen) {
      breakevenMonth = m;
    }
    points.push({
      month: m,
      cumulativeManYen: Math.round(cumulative * 10) / 10,
      cacManYen: Math.round(cacManYen * 10) / 10,
      survivalApprox: Math.round(survival * 1000) / 10,
    });
  }

  return {
    points,
    breakevenMonth,
    cacManYen: Math.round(cacManYen * 10) / 10,
    avgMarginManYen: Math.round(marginMan * 10) / 10,
    annualRetentionDecimal: R,
  };
}

export function getRevenueSummaryKpis(industry: EnabledIndustryKey = defaultIndustryKey) {
  const trend = getIndustryDemoData(industry).monthlyRevenueTrend();
  const last = trend[trend.length - 1];
  const prev = trend[trend.length - 2];
  const momPct =
    prev && prev.amountManYen > 0
      ? Math.round(
          ((last.amountManYen - prev.amountManYen) / prev.amountManYen) * 1000
        ) / 10
      : 0;
  const { weightedRetentionPct } = weightedPortfolioMetrics(industry);
  const { breakevenMonth } = getBreakevenSeries(36, industry);
  return {
    latestMonthLabel: formatMonthLabel(last.month),
    latestManYen: last.amountManYen,
    momPct,
    weightedRetentionPct,
    breakevenMonth,
  };
}
