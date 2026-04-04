import type {
  CandidateLearningDemo,
  InPersonExamStatus,
  JlptLevel,
  LearningModuleProgressDemo,
} from "@data/types";

const FOOTNOTE =
  "オンラインの進捗だけではランクは確定しません。対面での最終確認に合格した結果が、工場への説明や配属判断で優先される想定です（デモ）。";

const ETHICS_STD =
  "食品製造 職場倫理・衛生 チェックリスト（支援機関共通・デモ）";

const VENUE = "登録支援機関 デモ拠点";

type MakeArgs = {
  jpCourseProgressPct: number;
  jpTrackLabelJa: string;
  ethicsModulesCompleted: number;
  ethicsModulesTotal: number;
  lastStudyAt: string;
  jpInPerson: {
    status: InPersonExamStatus;
    certifiedJlptEquivalent: JlptLevel | null;
    examAt?: string;
    venueJa?: string;
    proctorJa?: string;
  };
  ethicsInPerson: {
    status: InPersonExamStatus;
    resultLabelJa?: string;
    examAt?: string;
    venueJa?: string;
  };
  footnoteJa?: string;
  jpModules?: LearningModuleProgressDemo[];
  ethicsQuizScorePct?: number;
  cohortComparisonJa?: string;
};

export function makeLearningDemo(p: MakeArgs): CandidateLearningDemo {
  return {
    online: {
      jpCourseProgressPct: p.jpCourseProgressPct,
      jpTrackLabelJa: p.jpTrackLabelJa,
      ethicsModulesCompleted: p.ethicsModulesCompleted,
      ethicsModulesTotal: p.ethicsModulesTotal,
      lastStudyAt: p.lastStudyAt,
      ...(p.jpModules != null ? { jpModules: p.jpModules } : {}),
      ...(p.ethicsQuizScorePct != null
        ? { ethicsQuizScorePct: p.ethicsQuizScorePct }
        : {}),
      ...(p.cohortComparisonJa != null
        ? { cohortComparisonJa: p.cohortComparisonJa }
        : {}),
    },
    inPerson: {
      japanese: {
        status: p.jpInPerson.status,
        certifiedJlptEquivalent: p.jpInPerson.certifiedJlptEquivalent,
        examAt: p.jpInPerson.examAt,
        venueJa: p.jpInPerson.venueJa ?? VENUE,
        proctorJa: p.jpInPerson.proctorJa,
      },
      ethics: {
        status: p.ethicsInPerson.status,
        standardNameJa: ETHICS_STD,
        resultLabelJa: p.ethicsInPerson.resultLabelJa,
        examAt: p.ethicsInPerson.examAt,
        venueJa: p.ethicsInPerson.venueJa ?? VENUE,
      },
    },
    footnoteJa: p.footnoteJa ?? FOOTNOTE,
  };
}

function defaultForJlpt(jlpt: JlptLevel): CandidateLearningDemo {
  const r = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 }[jlpt];
  return makeLearningDemo({
    jpCourseProgressPct: Math.min(94, 52 + r * 9),
    jpTrackLabelJa: `${jlpt} 相当コース（オンライン）`,
    ethicsModulesCompleted: Math.min(6, 2 + r),
    ethicsModulesTotal: 6,
    lastStudyAt: "2026-04-01",
    jpInPerson: {
      status: "passed",
      certifiedJlptEquivalent: jlpt,
      examAt: "2026-02-15",
    },
    ethicsInPerson: {
      status: "passed",
      resultLabelJa: "基準クリア",
      examAt: "2026-02-18",
    },
  });
}

/** 派遣デモの候補者 ID と JLPT（プロフィール）に応じた学習デモ */
export function learningDemoForStaffingCandidate(
  id: string,
  jlpt: JlptLevel
): CandidateLearningDemo {
  switch (id) {
    case "cand-nuwan-kumara":
      return makeLearningDemo({
        jpCourseProgressPct: 91,
        jpTrackLabelJa: "N3 相当レッスン（オンライン進行中）",
        ethicsModulesCompleted: 5,
        ethicsModulesTotal: 6,
        lastStudyAt: "2026-04-02",
        jpModules: [
          { labelJa: "あいさつ・自己紹介", progressPct: 100 },
          { labelJa: "職場指示の聞き取り", progressPct: 100 },
          { labelJa: "HACCP 基礎用語", progressPct: 88 },
          { labelJa: "製造ライン会話（N3）", progressPct: 62, stalled: true },
        ],
        ethicsQuizScorePct: 82,
        cohortComparisonJa:
          "同じ入国バッチ平均より日本語オンライン進捗がやや上（デモ指標）。",
        jpInPerson: {
          status: "passed",
          certifiedJlptEquivalent: "N4",
          examAt: "2026-03-15",
          venueJa: "登録支援機関 千葉拠点",
          proctorJa: "認定試験官 鈴木（デモ）",
        },
        ethicsInPerson: {
          status: "passed",
          resultLabelJa: "基準クリア",
          examAt: "2026-03-18",
          venueJa: "登録支援機関 千葉拠点",
        },
      });
    case "cand-dilshan-silva":
      return makeLearningDemo({
        jpCourseProgressPct: 48,
        jpTrackLabelJa: "N5 基礎コース（オンライン）",
        ethicsModulesCompleted: 2,
        ethicsModulesTotal: 6,
        lastStudyAt: "2026-03-10",
        jpInPerson: {
          status: "passed",
          certifiedJlptEquivalent: "N5",
          examAt: "2026-01-12",
        },
        ethicsInPerson: { status: "scheduled" },
      });
    case "cand-kasun-rajapaksa":
      return makeLearningDemo({
        jpCourseProgressPct: 72,
        jpTrackLabelJa: "N4 コース（オンライン）",
        ethicsModulesCompleted: 4,
        ethicsModulesTotal: 6,
        lastStudyAt: "2026-03-28",
        jpInPerson: {
          status: "passed",
          certifiedJlptEquivalent: "N4",
          examAt: "2026-01-20",
        },
        ethicsInPerson: { status: "none" },
      });
    case "cand-dhammika-appuhamy":
      return makeLearningDemo({
        jpCourseProgressPct: 62,
        jpTrackLabelJa: "N5 コース（オンライン）",
        ethicsModulesCompleted: 3,
        ethicsModulesTotal: 6,
        lastStudyAt: "2026-03-25",
        jpInPerson: { status: "scheduled", certifiedJlptEquivalent: null },
        ethicsInPerson: {
          status: "passed",
          resultLabelJa: "基準クリア",
          examAt: "2026-03-01",
        },
      });
    case "cand-harsha-abeyratne":
      return makeLearningDemo({
        jpCourseProgressPct: 88,
        jpTrackLabelJa: "N3 応用（オンライン・高進捗）",
        ethicsModulesCompleted: 6,
        ethicsModulesTotal: 6,
        lastStudyAt: "2026-04-03",
        jpInPerson: {
          status: "passed",
          certifiedJlptEquivalent: "N3",
          examAt: "2026-02-28",
        },
        ethicsInPerson: { status: "failed" },
      });
    case "cand-udara-bandara":
      return makeLearningDemo({
        jpCourseProgressPct: 55,
        jpTrackLabelJa: "N5 入門（オンライン）",
        ethicsModulesCompleted: 4,
        ethicsModulesTotal: 6,
        lastStudyAt: "2026-03-22",
        jpInPerson: { status: "passed", certifiedJlptEquivalent: "N5" },
        ethicsInPerson: { status: "none" },
      });
    case "cand-thilini-jayawardena":
      return makeLearningDemo({
        jpCourseProgressPct: 93,
        jpTrackLabelJa: "N2 対策コース（オンライン）",
        ethicsModulesCompleted: 6,
        ethicsModulesTotal: 6,
        lastStudyAt: "2026-04-03",
        jpInPerson: {
          status: "passed",
          certifiedJlptEquivalent: "N2",
          examAt: "2026-01-08",
        },
        ethicsInPerson: {
          status: "passed",
          resultLabelJa: "基準クリア",
          examAt: "2026-01-10",
        },
      });
    default:
      return defaultForJlpt(jlpt);
  }
}
