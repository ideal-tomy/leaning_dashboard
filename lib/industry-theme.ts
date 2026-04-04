import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { defaultIndustryKey } from "@/lib/industry-profiles";

/** 業種アクセント（ボタン・リンク・チャート主系列）。白文字とのコントラストを意識した 600 前後の色味。 */
export const industryAccentHex: Record<EnabledIndustryKey, string> = {
  /** 人材派遣・紹介 — 既存デフォルトと同一 */
  staffing: "#2563eb",
  /** 不動産 — ディープティール */
  "real-estate": "#0f766e",
  /** 士業・専門 — バイオレット */
  professional: "#5b21b6",
  /** 建設 — オレンジ */
  construction: "#c2410c",
  /** 医療・介護 — スカイブルー系 */
  medical: "#0369a1",
  /** 営業・販売 — レッド */
  sales: "#b91c1c",
  /** 物流 — インディゴ */
  logistics: "#4338ca",
  /** 教育 — パープル */
  education: "#7c3aed",
};

export const defaultAccentHex = industryAccentHex[defaultIndustryKey];

export function getIndustryAccentHex(key: EnabledIndustryKey): string {
  return industryAccentHex[key] ?? defaultAccentHex;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function mixWithWhite(hex: string, t: number): string {
  const { r, g, b } = hexToRgb(hex);
  const R = Math.round(r + (255 - r) * t);
  const G = Math.round(g + (255 - g) * t);
  const B = Math.round(b + (255 - b) * t);
  return `#${[R, G, B]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}

/** 縦棒チャート等でアクセントから段階色を作る（先頭が最も濃い） */
export function getAccentBarShades(accentHex: string): [string, string, string, string, string] {
  return [
    accentHex,
    mixWithWhite(accentHex, 0.22),
    mixWithWhite(accentHex, 0.4),
    mixWithWhite(accentHex, 0.58),
    mixWithWhite(accentHex, 0.74),
  ];
}
