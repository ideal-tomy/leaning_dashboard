import { DEMO_FACTORY_CLIENT_ID } from "@/lib/demo-factory-client";

/** 部署ごとの配置と OJT・現場メモ（工場デモ） */
export type FactoryPlacementWorker = {
  candidateId: string;
  roleJa: string;
  /** 現場リーダー向けの短い注意・フォロー点 */
  ojtNotesJa: string[];
};

export type FactoryDeptPlacement = {
  deptJa: string;
  workers: FactoryPlacementWorker[];
};

const MARUFUKU_PLACEMENTS: FactoryDeptPlacement[] = [
  {
    deptJa: "製造ラインA（冷食・包装）",
    workers: [
      {
        candidateId: "cand-nuwan-kumara",
        roleJa: "ライン作業・検品補助",
        ojtNotesJa: [
          "手順書の細かい日本語は同席フォロー推奨。口頭指示は短く区切ると伝わりやすい。",
          "規律・衛生意識は高い。朝礼・挨拶は問題なし。",
        ],
      },
      {
        candidateId: "cand-gayan-pathirana",
        roleJa: "ラインリーダー補佐（研修中）",
        ojtNotesJa: [
          "厨房経験があり HACCP 手順の説明は吸収が早い。",
          "他ラインとの連携報告を促すとミス予防に効く。",
        ],
      },
    ],
  },
  {
    deptJa: "製造ラインB（揚場・加熱）",
    workers: [
      {
        candidateId: "cand-kasun-rajapaksa",
        roleJa: "揚場オペレーター",
        ojtNotesJa: [
          "温度・時間の確認は自分から報告しにくい。終了前に必ず声かけ。",
          "倫理（対面）未完了のため、トラブル時は支援機関へ早めに共有。",
        ],
      },
    ],
  },
  {
    deptJa: "選別・充填",
    workers: [
      {
        candidateId: "cand-sanduni-fernando",
        roleJa: "充填・ラベル貼付",
        ojtNotesJa: [
          "作業自体は丁寧。早番集合にたまに遅れあり（家出発が遅いパターン）。",
          "忘れ物（帽子・マスク）が月1回程度。入口チェックでリマインド。",
        ],
      },
      {
        candidateId: "cand-ishani-perera",
        roleJa: "原料選別",
        ojtNotesJa: [
          "日本語指示は簡単な単語レベルが確実。長文は分割。",
          "体調不良時は本人から申告が出にくい。顔色・様子を見て声かけ。",
        ],
      },
    ],
  },
];

export function getFactoryPlacementsForClient(
  clientId: string
): FactoryDeptPlacement[] | undefined {
  if (clientId !== DEMO_FACTORY_CLIENT_ID) return undefined;
  return MARUFUKU_PLACEMENTS;
}
