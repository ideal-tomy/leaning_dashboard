/**
 * ダッシュボードデモ用ダミーデータの型（JSON と同一形状）。
 * Next.js 等から import して利用可能。
 */

export type Gender = "male" | "female";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export type CandidatePipelineStatus =
  | "awaiting_entry"
  | "interview_coordination"
  | "training"
  | "offer_accepted"
  | "visa_applying"
  | "document_blocked"
  | "document_prep";

/** 対面試験の状態（デモ用。本人確認・カンニング対策のストーリー用） */
export type InPersonExamStatus = "none" | "scheduled" | "passed" | "failed";

/** オンライン日本語コースの章・モジュール単位（デモ） */
export interface LearningModuleProgressDemo {
  labelJa: string;
  progressPct: number;
  /** ここで学習が止まっている想定 */
  stalled?: boolean;
}

/**
 * 候補者詳細の「オンライン進捗」と「対面認定」を分けて見せるデモ用ブロック。
 * 未設定の候補者は UI でプレースホルダ表示。
 */
export interface CandidateLearningDemo {
  online: {
    /** eラーニングのコース完了率（デモ） */
    jpCourseProgressPct: number;
    /** 例: N3 相当レッスン進行中 */
    jpTrackLabelJa: string;
    ethicsModulesCompleted: number;
    ethicsModulesTotal: number;
    /** ISO 日付（最終学習活動） */
    lastStudyAt: string;
    /** 章・ユニット別（任意） */
    jpModules?: LearningModuleProgressDemo[];
    /** 倫理コース最終クイズ（任意・0–100） */
    ethicsQuizScorePct?: number;
    /** 同バッチ平均との比較など1行（任意） */
    cohortComparisonJa?: string;
  };
  inPerson: {
    japanese: {
      status: InPersonExamStatus;
      /** 対面合格時のみ。ヘッダの JLPT バッジと整合させる想定 */
      certifiedJlptEquivalent: JlptLevel | null;
      examAt?: string;
      venueJa?: string;
      proctorJa?: string;
    };
    ethics: {
      status: InPersonExamStatus;
      standardNameJa: string;
      resultLabelJa?: string;
      examAt?: string;
      venueJa?: string;
    };
  };
  /** 工場開示・配属判断で何を優先するかなど */
  footnoteJa: string;
}

/** 候補者詳細ページ用デモブロック（管理・面談・タイムライン等） */
export type ActivityEventKind =
  | "interview"
  | "learning"
  | "document"
  | "status"
  | "other";

export interface ActivityEvent {
  /** ISO 日付または日時 */
  at: string;
  kind: ActivityEventKind;
  titleJa: string;
  detailJa?: string;
}

export type MilestoneSeverity = "info" | "warning" | "danger";

export interface Milestone {
  id: string;
  labelJa: string;
  dateIso: string;
  severity?: MilestoneSeverity;
}

export interface FollowReason {
  code: string;
  labelJa: string;
  variant?: "secondary" | "warning" | "danger";
}

export interface ContactFreshnessDemo {
  lastReplyAt: string;
  unread?: boolean;
  /** 表示用の1行（任意） */
  channelLabelJa?: string;
}

export interface InterviewLogEntry {
  monthLabelJa: string;
  summaryJa: string;
  tags: string[];
  bodyJa?: string;
}

export type DocChecklistStatus = "pending" | "submitted" | "verified" | "issue";

export interface DocChecklistItem {
  labelJa: string;
  status: DocChecklistStatus;
  dueIso?: string;
}

export interface CultureNoteDemo {
  nameSinhala?: string;
  noteJa?: string;
}

export interface InternalTaskDemo {
  titleJa: string;
  assigneeJa?: string;
  dueIso?: string;
}

/** ドキュメント保管庫の1ファイル（デモ） */
export type StoredDocumentStatusDemo = "draft" | "final" | "archived";

export interface StoredDocumentFileDemo {
  id: string;
  labelJa: string;
  categoryJa: string;
  updatedAt: string;
  status: StoredDocumentStatusDemo;
  /** admin のみフル表示。example.jp ドメイン推奨 */
  storageUrl: string;
  fileName?: string;
}

/** 派遣・配属の1期間（デモ） */
export interface DispatchHistoryEntryDemo {
  id: string;
  clientNameJa: string;
  startDate: string;
  /** null は現職 */
  endDate: string | null;
  jobTitleJa: string;
  durationDisplayJa: string;
  evaluationNoteJa?: string;
  /** 完了済み配属か予定のみか */
  kind?: "completed" | "scheduled";
}

export interface DocumentResolutionStepDemo {
  order: number;
  titleJa: string;
  detailJa: string;
  actionHintJa?: string;
  /** アプリ内パス（例: /documents） */
  linkPath?: string;
}

export interface DocumentResolutionGuideDemo {
  issueTitleJa: string;
  issueDetailJa: string;
  steps: DocumentResolutionStepDemo[];
  completionCriteriaJa: string;
}

/** 書類不備フォロー一覧（デモ）用の緊急度 */
export type DocumentDeficiencyUrgencyDemo = "high" | "medium" | "low";

export interface CandidateDetailDemo {
  /** ヘッダー1行サマリー */
  healthSummaryJa?: string;
  followReasons?: FollowReason[];
  milestones?: Milestone[];
  contactFreshness?: ContactFreshnessDemo;
  interviewLogs?: InterviewLogEntry[];
  activityEvents?: ActivityEvent[];
  /** 書類タブと共有するチェックリスト */
  docChecklist?: DocChecklistItem[];
  cultureNote?: CultureNoteDemo;
  /** 支援機関内のみ表示 */
  internalTasks?: InternalTaskDemo[];
  linkedWorkerDemoId?: string;
  workerAppSyncNoteJa?: string;
  /** 書類保管URL一覧（Vault） */
  storedDocuments?: StoredDocumentFileDemo[];
  /** 派遣・配属履歴 */
  dispatchHistory?: DispatchHistoryEntryDemo[];
  /** 書類不備時の解決ナビ */
  documentResolution?: DocumentResolutionGuideDemo;
  /** 書類不備フォロー画面用（document_blocked 想定） */
  documentDeficiencyUrgency?: DocumentDeficiencyUrgencyDemo;
  /** 一覧用の次の一手（1行） */
  documentDeficiencyHeadlineJa?: string;
}

export interface Candidate {
  id: string;
  displayName: string;
  legalNameFull: string;
  nameKatakana: string;
  age: number;
  gender: Gender;
  /** 例: Sri Lanka */
  nationality: string;
  birthDate: string;
  birthPlace: string;
  residence: {
    country: string;
    city: string;
    note?: string;
  };
  jlpt: JlptLevel;
  jlptNote?: string;
  backgroundSummary: string;
  educationWorkHistory: string;
  skillTags: string[];
  tokuteiGinoFoodManufacturing: boolean;
  driversLicenseLk: boolean;
  aiScore: number;
  aiScoreRationale?: string;
  pipelineStatus: CandidatePipelineStatus;
  pipelineStatusLabelJa: string;
  passportNumber: string;
  passportExpiry: string;
  coeStatusJa: string;
  documentAlertJa?: string;
  plannedAssignment?: {
    clientId: string;
    jobTitleJa: string;
    monthlySalaryJpy: number;
  };
  contact: {
    email: string;
    phone: string;
  };
  photoUrl: string;
  registeredAt: string;
  /** 学習デモ（オンライン vs 対面認定）。未設定可 */
  learningDemo?: CandidateLearningDemo;
  /** 詳細ページのヘッダー・タイムライン等（デモ） */
  detailDemo?: CandidateDetailDemo;
  /** 営業デモ: 見込み顧客一覧カードの副題用（任意） */
  salesCandidateListDemo?: {
    sectorJa: string;
    interestJa: string;
    keyChallengeJa: string;
  };
}

export interface ClientCompany {
  id: string;
  legalNameJa: string;
  tradeNameJa: string;
  industryJa: string;
  prefectureJa: string;
  cityJa: string;
  addressLineJa?: string;
  cultureJa: string;
  aiTargetProfileJa: string;
  representative?: {
    nameJa: string;
    age?: number;
    noteJa: string;
  };
  workplaceEnvironmentJa: string;
  currentChallengesJa?: string;
  recruitmentJa: string;
  operations: {
    currentAssignees: number;
    openSlots: number;
    retentionRatePct: number;
    satisfactionScore: number;
  };
  ltMonthlyProfitPerHeadJpy?: number;
  contact: {
    email: string;
    phone: string;
    contactPersonJa: string;
  };
  matchingHintTags: string[];
  /** 建設デモ: 現場一覧カード用の工期・資格・入場条件（任意） */
  constructionListDemo?: {
    scheduleJa: string;
    requiredCertsJa: string;
    entryConditionsJa?: string;
    /** 三次請負の入場を許可するか（取引先照合デモ） */
    allowTertiarySubcontractors?: boolean;
    /** 協力会社のグリーンカード（建設業許可のイメージ）登録を必須にするか */
    requireGreenCardOnSite?: boolean;
  };
  /** 物流デモ: 案件一覧カード用の時間帯・積載・優先度（任意） */
  logisticsListDemo?: {
    deliveryWindowJa: string;
    loadConditionsJa: string;
    priorityJa: string;
  };
  /** 営業デモ: 提案案件一覧カード用（任意） */
  salesListDemo?: {
    proposalThemeJa: string;
    winProbabilityJa: string;
    nextActionJa: string;
    dealValueManYenDemo?: number;
    competitorJa?: string;
  };
  /** 案件が求める対面認定ベースの日本語・倫理（デモ） */
  learningRequirementsDemo?: ClientLearningRequirementsDemo;
}

/** 建設デモ: 取引先・協力会社（現場案件 ClientCompany とは別マスタ） */
export type ConstructionPartnerTier = "prime" | "primary" | "secondary" | "tertiary";

export interface ConstructionPartnerDemo {
  id: string;
  tradeNameJa: string;
  tier: ConstructionPartnerTier;
  /** 表示用（元請・一次・二次・三次） */
  tierLabelJa: string;
  /** 人員ハブ「関係企業」に出すか（下請・協力） */
  isSubcontractor: boolean;
  greenCardRegistered: boolean;
  greenCardValidUntilIso?: string;
  notesJa?: string;
  linkedSiteIds?: string[];
  contact: { email: string; phone: string; contactPersonJa: string };
}

/** クライアント側の学習・認定要件（マッチング照合用デモ） */
export interface ClientLearningRequirementsDemo {
  minCertifiedJlpt: JlptLevel;
  ethicsPassRequired: boolean;
  /** 表示用（例: 支援機関共通チェックリスト） */
  standardLabelJa?: string;
}

export type LearningComplianceStatus = "ok" | "partial" | "gap" | "unknown";

/** マッチングスコアに付ける学習照合サマリー（UI バッジ用） */
export interface LearningComplianceSummary {
  status: LearningComplianceStatus;
  labelJa: string;
}

export interface CandidateClientMatchScore {
  pct: number;
  reason: string;
  learningCompliance?: LearningComplianceSummary;
}

export interface DemoDataBundle {
  meta: {
    version: string;
    locale: string;
    referenceDate: string;
    descriptionJa: string;
  };
  candidates: Candidate[];
  clients: ClientCompany[];
}
