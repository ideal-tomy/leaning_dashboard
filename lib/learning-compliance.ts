import type {
  Candidate,
  ClientCompany,
  ClientLearningRequirementsDemo,
  JlptLevel,
  LearningComplianceStatus,
} from "@data/types";

const jlptRank: Record<JlptLevel, number> = {
  N5: 1,
  N4: 2,
  N3: 3,
  N2: 4,
  N1: 5,
};

export function jlptMeetsMin(
  certified: JlptLevel | null,
  min: JlptLevel
): boolean {
  if (!certified) return false;
  return jlptRank[certified] >= jlptRank[min];
}

export function describeLearningComplianceDetail(
  candidate: Candidate,
  req: ClientLearningRequirementsDemo
): {
  status: LearningComplianceStatus;
  labelJa: string;
  detailJa: string;
} {
  if (!candidate.learningDemo) {
    return {
      status: "unknown",
      labelJa: "学習デモ未設定",
      detailJa:
        "この候補者には学習・対面認定のデモデータがありません。要件照合は保留です。",
    };
  }

  const jp = candidate.learningDemo.inPerson.japanese;
  const eth = candidate.learningDemo.inPerson.ethics;

  const jpOk =
    jp.status === "passed" &&
    jlptMeetsMin(jp.certifiedJlptEquivalent, req.minCertifiedJlpt);

  const ethOk = !req.ethicsPassRequired || eth.status === "passed";

  if (jpOk && ethOk) {
    const parts = [
      `対面認定の日本語は要件（${req.minCertifiedJlpt}以上）を満たしています。`,
    ];
    if (req.ethicsPassRequired) {
      parts.push("職場倫理の対面確認もクリア済みです。");
    }
    return {
      status: "ok",
      labelJa: "教育要件 充足",
      detailJa: parts.join(""),
    };
  }

  if (!jpOk && !ethOk && req.ethicsPassRequired) {
    return {
      status: "gap",
      labelJa: "日本語・倫理 要対応",
      detailJa:
        "対面の日本語認定が要件に達しておらず、倫理の対面確認も未完了です。",
    };
  }

  if (!jpOk) {
    return {
      status: "gap",
      labelJa: "日本語（対面）未充足",
      detailJa: `要件は${req.minCertifiedJlpt}以上の対面認定です。現状の認定では不足、または未受験です。`,
    };
  }

  return {
    status: "partial",
    labelJa: "倫理（対面）未充足",
    detailJa:
      "日本語の対面認定は要件を満たしていますが、倫理の対面確認が未完了です。",
  };
}

/** クライアントに要件がある場合のみマッチング用サマリーを返す */
export function learningComplianceForMatch(
  candidate: Candidate,
  client: ClientCompany
): { status: LearningComplianceStatus; labelJa: string; detailJa: string } | null {
  const req = client.learningRequirementsDemo;
  if (!req) return null;
  return describeLearningComplianceDetail(candidate, req);
}
