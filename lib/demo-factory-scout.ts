import type { Candidate, CandidateClientMatchScore } from "@data/types";
import type { DemoDataModule } from "@/lib/demo-data-selector";


/** 工場デモ：スカウト候補を束ねる仮想の登録支援機関 */
export type FactoryScoutAgencyDemo = {
  id: string;
  labelJa: string;
  /** この機関から「公開」されている候補者 ID（デモ） */
  candidateIds: readonly string[];
};

export const FACTORY_SCOUT_AGENCIES: FactoryScoutAgencyDemo[] = [
  {
    id: "demo-agency-a",
    labelJa: "登録支援機関 トライアルA（デモ）",
    candidateIds: [
      "cand-nuwan-kumara",
      "cand-kasun-rajapaksa",
      "cand-sanduni-fernando",
    ],
  },
  {
    id: "demo-agency-b",
    labelJa: "登録支援機関 トライアルB（デモ）",
    candidateIds: [
      "cand-dhammika-appuhamy",
      "cand-dilshan-silva",
      "cand-thilini-jayawardena",
    ],
  },
];

export type FactoryScoutRow = CandidateClientMatchScore & {
  candidate: Candidate;
};

export type FactoryScoutAgencyBlock = {
  id: string;
  labelJa: string;
  rows: FactoryScoutRow[];
};

/** 派遣先ごとにスコア・学習バッジを付けたスカウト用行を組み立てる */
export function buildFactoryScoutBlocks(
  data: Pick<
    DemoDataModule,
    "getCandidateById" | "getClientById" | "scoreCandidateForClient"
  >,
  clientId: string
): FactoryScoutAgencyBlock[] {
  const client = data.getClientById(clientId);
  if (!client) return [];

  return FACTORY_SCOUT_AGENCIES.map((ag) => {
    const rows: FactoryScoutRow[] = [];
    for (const id of ag.candidateIds) {
      const candidate = data.getCandidateById(id);
      if (!candidate) continue;
      rows.push({
        candidate,
        ...data.scoreCandidateForClient(candidate, client),
      });
    }
    return { id: ag.id, labelJa: ag.labelJa, rows };
  });
}
