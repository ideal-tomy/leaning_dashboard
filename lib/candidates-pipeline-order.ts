import type { CandidatePipelineStatus } from "@data/types";

/**
 * staffing の候補者一覧クエリ用。
 * データ上の `document_prep` / `document_blocked` の両方をまとめて絞り込む（他業種では未使用）。
 */
export const STAFFING_PIPELINE_LIST_FILTER_DOCUMENT_WORK =
  "document_work" as const;

export type StaffingPipelineListFilterDocumentWork =
  typeof STAFFING_PIPELINE_LIST_FILTER_DOCUMENT_WORK;

/**
 * 候補者パイプライン UI の表示順（ホームのパイプライン帯と揃える）
 */
export const CANDIDATE_PIPELINE_DISPLAY_ORDER: CandidatePipelineStatus[] = [
  "interview_coordination",
  "offer_accepted",
  "visa_applying",
  "awaiting_entry",
  "training",
  "document_prep",
  "document_blocked",
];

/** 候補者ページ「選考・ビザ進捗」などで、大枠の段階ごとにカードを束ねる */
export type CandidatePipelinePhaseGroup = {
  id: string;
  titleJa: string;
  stages: readonly CandidatePipelineStatus[];
};

export const CANDIDATE_PIPELINE_PHASE_GROUPS: readonly CandidatePipelinePhaseGroup[] =
  [
    {
      id: "1",
      titleJa: "段階１（ワーカー獲得～入国準備）",
      stages: ["visa_applying", "awaiting_entry"],
    },
    {
      id: "2",
      titleJa: "段階２（入国後～派遣先選定）",
      stages: [
        "training",
        "document_prep",
        "interview_coordination",
        "document_blocked",
      ],
    },
    {
      id: "3",
      titleJa: "段階３（派遣先確定～）",
      stages: ["offer_accepted"],
    },
  ] as const;
