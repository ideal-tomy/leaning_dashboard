import type {
  Candidate,
  CandidateClientMatchScore,
  CandidatePipelineStatus,
  ClientCompany,
  DemoDataBundle,
} from "@data/types";
import { learningDemoForStaffingCandidate } from "@/lib/demo-learning-factory";
import { learningComplianceForMatch } from "@/lib/learning-compliance";

function avatar(seed: string) {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

function jlptOrder(j: Candidate["jlpt"]): number {
  const o: Record<string, number> = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5 };
  return o[j] ?? 0;
}

export const clients: ClientCompany[] = [
  {
    id: "client-marufuku",
    legalNameJa: "株式会社 丸福惣菜",
    tradeNameJa: "丸福惣菜",
    industryJa: "惣菜製造",
    prefectureJa: "千葉県",
    cityJa: "野田市",
    cultureJa: "挨拶・規律に厳しい。元職人気質の社長。HACCP 準拠で手順が細かい。",
    aiTargetProfileJa: "元軍人・警察官、体育会系。指示遵守が確実な人材。",
    representative: {
      nameJa: "田中 徳男",
      age: 62,
      noteJa: "元職人の叩き上げ。挨拶と衛生管理に非常に厳しい。",
    },
    workplaceEnvironmentJa: "ライン作業中心。早朝出勤。複雑な手洗い・消毒フロー。",
    currentChallengesJa:
      "直近3ヶ月で若手日本人が2名離職（早起き・指導の厳しさが原因）。",
    recruitmentJa: "特定技能 食品製造 3名募集。時給1,150円（深夜別）。寮完備。",
    operations: {
      currentAssignees: 12,
      openSlots: 3,
      retentionRatePct: 78,
      satisfactionScore: 4.2,
    },
    ltMonthlyProfitPerHeadJpy: 55000,
    contact: {
      email: "hr@marufuku-sozai.example.jp",
      phone: "04-7000-0001",
      contactPersonJa: "人事 佐藤",
    },
    matchingHintTags: ["規律", "軍・警察", "体力", "食品"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N4",
      ethicsPassRequired: true,
      standardLabelJa: "食品製造 職場倫理・衛生（支援機関共通・デモ）",
    },
  },
  {
    id: "client-edo-suisan",
    legalNameJa: "株式会社 江戸前水産加工",
    tradeNameJa: "江戸前水産加工",
    industryJa: "水産加工",
    prefectureJa: "東京都",
    cityJa: "江東区",
    cultureJa: "低温・立ち仕事。現場スピード重視。",
    aiTargetProfileJa: "漁業・水産経験、20代男性、低温環境に耐性。",
    workplaceEnvironmentJa: "冷蔵庫内作業が多い。重い荷物の搬送あり。",
    recruitmentJa: "特定技能 5名。夜勤シフトあり。",
    operations: {
      currentAssignees: 18,
      openSlots: 5,
      retentionRatePct: 71,
      satisfactionScore: 3.9,
    },
    ltMonthlyProfitPerHeadJpy: 48000,
    contact: {
      email: "work@edo-suisan.example.jp",
      phone: "03-6000-0002",
      contactPersonJa: "工場長 鈴木",
    },
    matchingHintTags: ["漁業", "体力", "夜勤", "低温"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N4",
      ethicsPassRequired: true,
      standardLabelJa: "水産加工 衛生・安全 対面確認（デモ）",
    },
  },
  {
    id: "client-fresh-bread",
    legalNameJa: "株式会社 フレッシュ製パン",
    tradeNameJa: "フレッシュ製パン",
    industryJa: "パン製造",
    prefectureJa: "埼玉県",
    cityJa: "川口市",
    cultureJa: "チーム作業。分量・時間管理が厳密。",
    aiTargetProfileJa: "細かい作業が得意、女性歓迎、衛生意識が高い人材。",
    workplaceEnvironmentJa: "オーブン近くは暑い。早朝シフト。",
    recruitmentJa: "製造スタッフ 4名。未経験可（研修あり）。",
    operations: {
      currentAssignees: 22,
      openSlots: 4,
      retentionRatePct: 85,
      satisfactionScore: 4.5,
    },
    ltMonthlyProfitPerHeadJpy: 42000,
    contact: {
      email: "recruit@fresh-bread.example.jp",
      phone: "048-000-0003",
      contactPersonJa: "製造部 高橋",
    },
    matchingHintTags: ["細かい作業", "チーム", "衛生", "製造"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N4",
      ethicsPassRequired: true,
      standardLabelJa: "製パン チーム作業・時間管理 倫理確認（デモ）",
    },
  },
  {
    id: "client-kanto-veg",
    legalNameJa: "関東ベジタブル株式会社",
    tradeNameJa: "関東ベジタブル",
    industryJa: "野菜カット・加工",
    prefectureJa: "神奈川県",
    cityJa: "相模原市",
    cultureJa: "スピード重視。単純作業の反復。",
    aiTargetProfileJa: "忍耐力、農業・単純作業に強い人材。",
    workplaceEnvironmentJa: "立ち仕事。ピッキングライン。",
    recruitmentJa: "カット工 6名。",
    operations: {
      currentAssignees: 14,
      openSlots: 6,
      retentionRatePct: 80,
      satisfactionScore: 4.0,
    },
    ltMonthlyProfitPerHeadJpy: 38000,
    contact: {
      email: "jobs@kanto-veg.example.jp",
      phone: "042-000-0004",
      contactPersonJa: "現場 伊藤",
    },
    matchingHintTags: ["農業", "忍耐", "スピード"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N5",
      ethicsPassRequired: false,
      standardLabelJa: "単純作業向け 最低限コミュニケーション（デモ）",
    },
  },
  {
    id: "client-johoku-meat",
    legalNameJa: "城北食肉卸株式会社",
    tradeNameJa: "城北食肉卸",
    industryJa: "精肉加工",
    prefectureJa: "栃木県",
    cityJa: "宇都宮市",
    cultureJa: "刃物・力仕事。高賃金で稼ぎたい人向け。",
    aiTargetProfileJa: "腕力のある男性、食肉・解体経験者優遇。",
    workplaceEnvironmentJa: "冷蔵・冷凍庫。安全靴・手袋必須。",
    recruitmentJa: "特定技能 2名。時給1,300円〜。",
    operations: {
      currentAssignees: 9,
      openSlots: 2,
      retentionRatePct: 74,
      satisfactionScore: 4.1,
    },
    ltMonthlyProfitPerHeadJpy: 62000,
    contact: {
      email: "hr@johoku-meat.example.jp",
      phone: "028-000-0005",
      contactPersonJa: "部長 渡辺",
    },
    matchingHintTags: ["力仕事", "男性", "経験者"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N3",
      ethicsPassRequired: true,
      standardLabelJa: "刃物・冷温 安全衛生 対面必須（デモ）",
    },
  },
  {
    id: "client-yamato-bento",
    legalNameJa: "大和弁当センター株式会社",
    tradeNameJa: "大和弁当センター",
    industryJa: "弁当盛付",
    prefectureJa: "茨城県",
    cityJa: "つくば市",
    cultureJa: "衛生徹底。外国人受入に慣れた現場。",
    aiTargetProfileJa: "若手ポテンシャル、初心者OK、学習意欲。",
    workplaceEnvironmentJa: "クリーンルームに近い環境。マニュアル整備。",
    recruitmentJa: "盛付スタッフ 8名。",
    operations: {
      currentAssignees: 28,
      openSlots: 8,
      retentionRatePct: 88,
      satisfactionScore: 4.6,
    },
    ltMonthlyProfitPerHeadJpy: 35000,
    contact: {
      email: "apply@yamato-bento.example.jp",
      phone: "029-000-0006",
      contactPersonJa: "教育担当 中村",
    },
    matchingHintTags: ["初心者", "若手", "衛生", "チーム"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N5",
      ethicsPassRequired: true,
      standardLabelJa: "弁当盛付 衛生マニュアル 対面確認（デモ）",
    },
  },
  {
    id: "client-irodori",
    legalNameJa: "彩りデリカ株式会社",
    tradeNameJa: "彩りデリカ",
    industryJa: "冷凍食品製造",
    prefectureJa: "群馬県",
    cityJa: "高崎市",
    cultureJa: "最新設備。タッチパネル・簡単なPC入力あり。",
    aiTargetProfileJa: "ITリテラシーが高い若手。パネル操作の習得が速い人。",
    workplaceEnvironmentJa: "空調良好。ラインにモニター設置。",
    recruitmentJa: "ラインオペレーター 3名。",
    operations: {
      currentAssignees: 16,
      openSlots: 3,
      retentionRatePct: 82,
      satisfactionScore: 4.3,
    },
    ltMonthlyProfitPerHeadJpy: 45000,
    contact: {
      email: "hr@irodori-delica.example.jp",
      phone: "027-000-0007",
      contactPersonJa: "製造課 小林",
    },
    matchingHintTags: ["PC", "IT", "若手", "学習"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N4",
      ethicsPassRequired: false,
      standardLabelJa: "ライン操作説明の理解度（対面 N4 相当・デモ）",
    },
  },
  {
    id: "client-sanriku-chiba",
    legalNameJa: "三陸フーズ株式会社",
    tradeNameJa: "三陸フーズ（千葉支店）",
    industryJa: "缶詰製造",
    prefectureJa: "千葉県",
    cityJa: "銚子市",
    cultureJa: "繁忙期は残業多め。しっかり稼ぎたい人向け。",
    aiTargetProfileJa: "既婚者、送金意欲が高い、残業対応可。",
    workplaceEnvironmentJa: "シーズンにより長時間勤務。手当あり。",
    recruitmentJa: "製造ライン 4名。",
    operations: {
      currentAssignees: 20,
      openSlots: 4,
      retentionRatePct: 76,
      satisfactionScore: 4.0,
    },
    ltMonthlyProfitPerHeadJpy: 52000,
    contact: {
      email: "chiba@sanriku-foods.example.jp",
      phone: "0479-00-0008",
      contactPersonJa: "支店長 吉田",
    },
    matchingHintTags: ["既婚", "送金", "残業", "体力"],
    learningRequirementsDemo: {
      minCertifiedJlpt: "N4",
      ethicsPassRequired: true,
      standardLabelJa: "缶詰ライン 残業下での安全・衛生（デモ）",
    },
  },
];

const baseContact = {
  email: "demo@haken-dash.example.jp",
  phone: "+94-77-000-0000",
};

function cand(
  partial: Omit<Candidate, "contact" | "registeredAt"> & {
    contact?: Partial<Candidate["contact"]>;
    learningDemo?: Candidate["learningDemo"];
  }
): Candidate {
  const base: Candidate = {
    ...partial,
    contact: { ...baseContact, ...partial.contact },
    registeredAt: "2025-06-01",
  };
  return {
    ...base,
    learningDemo:
      partial.learningDemo ?? learningDemoForStaffingCandidate(base.id, base.jlpt),
  };
}

function statusMap(
  label: string
): { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string } {
  const m: Record<
    string,
    { pipelineStatus: CandidatePipelineStatus; pipelineStatusLabelJa: string }
  > = {
    入国待ち: { pipelineStatus: "awaiting_entry", pipelineStatusLabelJa: "入国待ち" },
    面接調整: {
      pipelineStatus: "interview_coordination",
      pipelineStatusLabelJa: "面接調整中",
    },
    講習中: { pipelineStatus: "training", pipelineStatusLabelJa: "講習中" },
    内定済: { pipelineStatus: "offer_accepted", pipelineStatusLabelJa: "内定済" },
    ビザ申請中: {
      pipelineStatus: "visa_applying",
      pipelineStatusLabelJa: "ビザ申請中",
    },
    書類不備停止: {
      pipelineStatus: "document_blocked",
      pipelineStatusLabelJa: "書類不備で停止",
    },
    書類準備中: {
      pipelineStatus: "document_prep",
      pipelineStatusLabelJa: "書類準備中",
    },
  };
  return m[label] ?? {
    pipelineStatus: "interview_coordination",
    pipelineStatusLabelJa: label,
  };
}

export const candidates: Candidate[] = [
  cand({
    id: "cand-nuwan-kumara",
    displayName: "Nuwan Kumara",
    legalNameFull: "Pathirana Gamage Nuwan Kumara",
    nameKatakana: "ヌワン クマラ パティラナ ガマゲ",
    age: 28,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1998-04-15",
    birthPlace: "Kandy, Sri Lanka",
    residence: { country: "スリランカ", city: "キャンディ" },
    jlpt: "N4",
    jlptNote: "N3 勉強中。面接ではハキハキした挨拶。",
    backgroundSummary: "元陸軍。規律・体力に優れる。食品製造の学習意欲が高い。",
    educationWorkHistory:
      "ペラデニヤ大学農学部中退後、スリランカ陸軍（通信兵）3年。農業手伝い経験。",
    skillTags: ["規律", "体力", "食品", "早朝", "軍経験"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: true,
    aiScore: 94,
    aiScoreRationale:
      "指示遵守と体力のバランスが良く、規律重視の現場（丸福型）と相性が高い。",
    ...statusMap("入国待ち"),
    passportNumber: "N1234567",
    passportExpiry: "2030-05-10",
    coeStatusJa: "申請準備完了（COE 提出待ち）",
    plannedAssignment: {
      clientId: "client-marufuku",
      jobTitleJa: "食品製造（惣菜製造）",
      monthlySalaryJpy: 185000,
    },
    photoUrl: avatar("cand-nuwan-kumara"),
    detailDemo: {
      healthSummaryJa:
        "学習・対面認定は良好。COE 提出と入国前フォロー、定期面談の確定が次の焦点です。",
      workerAppSyncNoteJa:
        "ワーカーアプリの学習・期限表示と同期したイメージ（デモ）。",
      followReasons: [
        {
          code: "coe",
          labelJa: "COE 提出待ち（先方確認中）",
          variant: "warning",
        },
      ],
      milestones: [
        {
          id: "bd",
          labelJa: "誕生日（連絡・祝意）",
          dateIso: "2026-04-15",
          severity: "info",
        },
        {
          id: "monthly_iv",
          labelJa: "定期面談（月次）",
          dateIso: "2026-04-18",
          severity: "warning",
        },
        {
          id: "entry",
          labelJa: "入国・入社予定（想定）",
          dateIso: "2026-05-12",
          severity: "info",
        },
      ],
      contactFreshness: {
        channelLabelJa: "LINE（デモ）",
        lastReplyAt: "2026-04-02",
        unread: false,
      },
      cultureNote: {
        nameSinhala: "නුවන් කුමාර",
        noteJa:
          "軍隊経歴のため口調が硬め。敬語トレーニングに意欲的。長時間拘束の現場適性あり。",
      },
      internalTasks: [
        {
          titleJa: "丸福へ入国予定の共有（メール草案）",
          assigneeJa: "佐藤",
          dueIso: "2026-04-05",
        },
        {
          titleJa: "4月定期面談の日程確定",
          assigneeJa: "佐藤",
          dueIso: "2026-04-08",
        },
      ],
      interviewLogs: [
        {
          monthLabelJa: "2026年3月",
          summaryJa: "体調良好。日本語学習への意欲高。家族送金の不安なし。",
          tags: ["体調", "学習", "良好"],
          bodyJa:
            "オンライン学習の進捗を本人と確認。製造ライン用語の自主学習を継続中。工場イメージ説明に前向き。次回は入国スケジュールのたたき台を共有予定。",
        },
        {
          monthLabelJa: "2026年2月",
          summaryJa: "対面日本語・倫理試験を終了。生活面の質問のみ。",
          tags: ["認定試験", "倫理"],
          bodyJa:
            "試験後フィードバックで敬語の細部を指摘。本人はメモ取りし改善を約束。",
        },
      ],
      activityEvents: [
        {
          at: "2026-04-02T15:30:00",
          kind: "learning",
          titleJa: "eラーニング：製造ライン会話ユニットを学習",
          detailJa: "所要 28 分（デモ）",
        },
        {
          at: "2026-04-01T10:00:00",
          kind: "document",
          titleJa: "パスポートコピー（鮮明版）を再アップロード",
        },
        {
          at: "2026-03-28T14:00:00",
          kind: "interview",
          titleJa: "月次面談（オンライン）実施",
          detailJa: "要約は「履歴」タブを参照",
        },
        {
          at: "2026-03-18T11:00:00",
          kind: "status",
          titleJa: "倫理・対面確認：基準クリア",
        },
        {
          at: "2026-03-15T09:30:00",
          kind: "status",
          titleJa: "日本語対面認定：N4 相当",
        },
        {
          at: "2026-03-10T16:00:00",
          kind: "document",
          titleJa: "在留資格申請書類ドラフトを支援機関で確認",
        },
        {
          at: "2026-03-01T13:00:00",
          kind: "other",
          titleJa: "配属内定：丸福惣菜（仮）",
        },
      ],
      docChecklist: [
        {
          labelJa: "パスポート写し",
          status: "verified",
        },
        {
          labelJa: "履歴書・職務経歴（翻訳）",
          status: "verified",
        },
        {
          labelJa: "COE 申請パック（提出待ち）",
          status: "pending",
          dueIso: "2026-04-14",
        },
        {
          labelJa: "受入企業との雇用条件書（案）",
          status: "submitted",
          dueIso: "2026-04-20",
        },
      ],
      storedDocuments: [
        {
          id: "doc-nuwan-passport",
          labelJa: "パスポート写し（全ページ）",
          categoryJa: "身分・旅券",
          updatedAt: "2026-04-01",
          status: "final",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-nuwan-kumara/passport-20260401.pdf",
          fileName: "passport_nuwan_kumara_20260401.pdf",
        },
        {
          id: "doc-nuwan-coe-pack",
          labelJa: "COE 申請パック（ドラフト）",
          categoryJa: "在留・認定",
          updatedAt: "2026-03-28",
          status: "draft",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-nuwan-kumara/coe-draft-v3.zip",
          fileName: "coe_pack_draft_v3.zip",
        },
        {
          id: "doc-nuwan-resume",
          labelJa: "履歴書・職務経歴（日英）",
          categoryJa: "人事",
          updatedAt: "2026-03-20",
          status: "final",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-nuwan-kumara/resume_signed.pdf",
          fileName: "resume_signed.pdf",
        },
        {
          id: "doc-nuwan-medical",
          labelJa: "健康診断書（指定フォーム）",
          categoryJa: "健康",
          updatedAt: "2026-03-12",
          status: "final",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-nuwan-kumara/medical_202603.pdf",
          fileName: "medical_check_202603.pdf",
        },
      ],
    },
  }),
  cand({
    id: "cand-ishani-perera",
    displayName: "Ishani Perera",
    legalNameFull: "Ishani Perera",
    nameKatakana: "イシャニ ペレーラ",
    age: 24,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2002-03-12",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N3",
    backgroundSummary: "元ホテル受付。接客・日本語会話が強み。",
    educationWorkHistory: "ホテルフロント2年。接客英語・日本語トレーニング受講。",
    skillTags: ["接客", "会話", "ホテル", "チーム"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 88,
    aiScoreRationale: "コミュニケーション力が高く、外国人受入に慣れた現場向き。",
    ...statusMap("面接調整"),
    passportNumber: "N2233445",
    passportExpiry: "2032-11-20",
    coeStatusJa: "書類収集中",
    photoUrl: avatar("cand-ishani-perera"),
    detailDemo: {
      followReasons: [
        {
          code: "interview",
          labelJa: "工場との二次面接・調整中",
          variant: "secondary",
        },
      ],
      milestones: [
        {
          id: "factory_iv",
          labelJa: "オンライン面接（受入企業）",
          dateIso: "2026-04-12",
          severity: "info",
        },
      ],
    },
  }),
  cand({
    id: "cand-dilshan-silva",
    displayName: "Dilshan Silva",
    legalNameFull: "Dilshan Silva",
    nameKatakana: "ディルシャン シルヴァ",
    age: 22,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "2004-07-22",
    birthPlace: "Galle, Sri Lanka",
    residence: { country: "スリランカ", city: "ゴール" },
    jlpt: "N5",
    backgroundSummary: "農業高校卒。真面目で忍耐強い。",
    educationWorkHistory: "農業高校卒業後、家族農園で勤務。",
    skillTags: ["農業", "忍耐", "若手"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 72,
    aiScoreRationale: "日本語は伸びしろ大。単純作業・農業系現場との相性良好。",
    ...statusMap("講習中"),
    passportNumber: "N9988776",
    passportExpiry: "2031-01-15",
    coeStatusJa: "講習修了後に申請予定",
    photoUrl: avatar("cand-dilshan-silva"),
    detailDemo: {
      healthSummaryJa:
        "学習へのログインが空いており、倫理の対面日程も未確定です。フォロー優先度が高い状態です。",
      followReasons: [
        {
          code: "study_idle",
          labelJa: "学習ログインから24日経過",
          variant: "danger",
        },
        {
          code: "ethics_iv",
          labelJa: "倫理・対面の日程未確定",
          variant: "warning",
        },
      ],
      milestones: [
        {
          id: "ethics_exam",
          labelJa: "倫理・対面確認（要予約）",
          dateIso: "2026-04-25",
          severity: "warning",
        },
      ],
      activityEvents: [
        {
          at: "2026-03-10T18:20:00",
          kind: "learning",
          titleJa: "eラーニング最終ログイン",
          detailJa: "N5 基礎コース第4章まで（以降未着手）",
        },
        {
          at: "2026-03-12T10:00:00",
          kind: "other",
          titleJa: "講習担当より学習再開リマインド（メール）",
        },
        {
          at: "2026-03-18T15:30:00",
          kind: "interview",
          titleJa: "オンライン面談：学習状況ヒアリング",
          detailJa: "本人は再開意欲あり。端末トラブルで一時停止と説明。",
        },
        {
          at: "2026-03-25T09:00:00",
          kind: "status",
          titleJa: "倫理・対面：日程候補の送付待ち",
        },
        {
          at: "2026-04-01T08:00:00",
          kind: "document",
          titleJa: "講習出席証明のスキャンを受領",
        },
      ],
      storedDocuments: [
        {
          id: "doc-dilshan-passport",
          labelJa: "パスポート写し",
          categoryJa: "身分・旅券",
          updatedAt: "2026-02-01",
          status: "final",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-dilshan-silva/passport.pdf",
          fileName: "passport_dilshan.pdf",
        },
        {
          id: "doc-dilshan-enroll",
          labelJa: "講習受講登録票",
          categoryJa: "講習",
          updatedAt: "2026-03-01",
          status: "final",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-dilshan-silva/training_enroll.pdf",
          fileName: "training_enrollment.pdf",
        },
      ],
    },
  }),
  cand({
    id: "cand-thilini-jayawardena",
    displayName: "Thilini Jayawardena",
    legalNameFull: "Thilini Jayawardena",
    nameKatakana: "ティリニ ジャヤワルダナ",
    age: 26,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2000-11-05",
    birthPlace: "Kandy, Sri Lanka",
    residence: { country: "日本", city: "埼玉県", note: "国内転籍希望" },
    jlpt: "N2",
    backgroundSummary: "日本の専門学校卒。国内転籍で即戦力。",
    educationWorkHistory: "日本で調理専門学校卒業。飲食店アルバイト2年。",
    skillTags: ["日本在住", "日本語", "飲食", "即戦力"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 91,
    aiScoreRationale: "日本語と現場理解が高く、あらゆる食品現場で汎用性が高い。",
    ...statusMap("内定済"),
    passportNumber: "N5566778",
    passportExpiry: "2029-08-30",
    coeStatusJa: "変更申請なし（国内）",
    photoUrl: avatar("cand-thilini-jayawardena"),
    detailDemo: {
      dispatchHistory: [
        {
          id: "dh-thilini-1",
          clientNameJa: "株式会社サンプル飲食（デモ）",
          startDate: "2023-04-01",
          endDate: "2025-03-31",
          jobTitleJa: "調理補助・ホール",
          durationDisplayJa: "24ヶ月",
          kind: "completed",
          evaluationNoteJa: "日本語N2取得。衛生・時間遵守◎（デモ評価）",
        },
        {
          id: "dh-thilini-2",
          clientNameJa: "フードサービスA（アルバイト）",
          startDate: "2022-06-01",
          endDate: "2023-03-31",
          jobTitleJa: "キッチンスタッフ",
          durationDisplayJa: "10ヶ月",
          kind: "completed",
          evaluationNoteJa: "初の日本就労。基礎日本語習得段階。",
        },
      ],
      storedDocuments: [
        {
          id: "doc-thilini-1",
          labelJa: "在留カード写し（表面・裏面）",
          categoryJa: "在留",
          updatedAt: "2026-03-15",
          status: "final",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-thilini-jayawardena/zairyu.pdf",
          fileName: "zairyu_card.pdf",
        },
      ],
    },
  }),
  cand({
    id: "cand-kasun-rajapaksa",
    displayName: "Kasun Rajapaksa",
    legalNameFull: "Kasun Rajapaksa",
    nameKatakana: "カスン ラジャパクサ",
    age: 30,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1996-01-18",
    birthPlace: "Matara, Sri Lanka",
    residence: { country: "スリランカ", city: "マータラ" },
    jlpt: "N4",
    backgroundSummary: "元警察官。責任感と指導力。",
    educationWorkHistory: "スリランカ警察3年。その後警備会社。",
    skillTags: ["警察", "規律", "警備", "夜勤"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: true,
    aiScore: 85,
    aiScoreRationale: "規律重視のクライアントと高マッチ。リーダー候補。",
    ...statusMap("ビザ申請中"),
    passportNumber: "N1122334",
    passportExpiry: "2033-03-12",
    coeStatusJa: "入管審査中",
    photoUrl: avatar("cand-kasun-rajapaksa"),
    detailDemo: {
      followReasons: [
        {
          code: "visa",
          labelJa: "入管審査結果待ち",
          variant: "secondary",
        },
      ],
      milestones: [
        {
          id: "visa_result",
          labelJa: "在留認定・ビザ発給（想定）",
          dateIso: "2026-04-28",
          severity: "info",
        },
      ],
      workerAppSyncNoteJa:
        "配属確定後はワーカーアプリの期限・学習と同期するイメージ（デモ）。",
    },
  }),
  cand({
    id: "cand-sanduni-fernando",
    displayName: "Sanduni Fernando",
    legalNameFull: "Sanduni Fernando",
    nameKatakana: "サンドゥニ フェルナンド",
    age: 23,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2003-09-30",
    birthPlace: "Negombo, Sri Lanka",
    residence: { country: "スリランカ", city: "ネゴンボ" },
    jlpt: "N4",
    backgroundSummary: "スリランカ国内の食品工場経験あり。",
    educationWorkHistory: "国内食品工場でライン作業1年。",
    skillTags: ["食品工場", "ライン", "衛生"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 82,
    aiScoreRationale: "食品ライン経験があり研修コストが低い。",
    ...statusMap("ビザ申請中"),
    passportNumber: "N4455667",
    passportExpiry: "2031-12-05",
    coeStatusJa: "書類提出済・審査待ち",
    photoUrl: avatar("cand-sanduni-fernando"),
  }),
  cand({
    id: "cand-asanka-wickrama",
    displayName: "Asanka Wickrama",
    legalNameFull: "Asanka Wickrama",
    nameKatakana: "アサンカ ウィクラマ",
    age: 35,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1991-05-08",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N3",
    backgroundSummary: "建設現場経験。力仕事・現場リーダー気質。",
    educationWorkHistory: "建設作業員として8年。重機サポート経験。",
    skillTags: ["建設", "力仕事", "リーダー"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: true,
    aiScore: 79,
    aiScoreRationale: "食肉・水産など体力勝負の現場向き。日本語で指示理解可。",
    ...statusMap("面接調整"),
    passportNumber: "N7788990",
    passportExpiry: "2030-06-25",
    coeStatusJa: "面接後にCOE申請予定",
    photoUrl: avatar("cand-asanka-wickrama"),
  }),
  cand({
    id: "cand-madushani-cooray",
    displayName: "Madushani Cooray",
    legalNameFull: "Madushani Cooray",
    nameKatakana: "マドゥシャニ クーライ",
    age: 21,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2005-02-14",
    birthPlace: "Kandy, Sri Lanka",
    residence: { country: "スリランカ", city: "キャンディ" },
    jlpt: "N4",
    backgroundSummary: "料理好き。手先が器用で盛付適性。",
    educationWorkHistory: "専門学校で調理基礎。カフェ短期。",
    skillTags: ["料理", "器用", "若手", "女性"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 75,
    aiScoreRationale: "製パン・弁当盛付など細かい作業向き。",
    ...statusMap("講習中"),
    passportNumber: "N8899001",
    passportExpiry: "2034-02-14",
    coeStatusJa: "講習・試験対策中",
    photoUrl: avatar("cand-madushani-cooray"),
  }),
  cand({
    id: "cand-rohan-gunasekara",
    displayName: "Rohan Gunasekara",
    legalNameFull: "Rohan Gunasekara",
    nameKatakana: "ロハン グナセカラ",
    age: 27,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1999-12-01",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N4",
    backgroundSummary: "元警備員。夜勤・単独勤務に耐性。",
    educationWorkHistory: "警備会社で夜勤中心に4年。",
    skillTags: ["警備", "夜勤", "規律"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: true,
    aiScore: 83,
    aiScoreRationale: "夜勤シフトや水産の早朝シフトと相性が良い。",
    ...statusMap("入国待ち"),
    passportNumber: "N3344556",
    passportExpiry: "2032-10-10",
    coeStatusJa: "認定済・入国手配中",
    photoUrl: avatar("cand-rohan-gunasekara"),
  }),
  cand({
    id: "cand-dhammika-appuhamy",
    displayName: "Dhammika Appuhamy",
    legalNameFull: "Dhammika Appuhamy",
    nameKatakana: "ダンミカ アップハミ",
    age: 29,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1997-08-20",
    birthPlace: "Galle, Sri Lanka",
    residence: { country: "スリランカ", city: "ゴール" },
    jlpt: "N5",
    backgroundSummary: "漁業経験。過酷環境に強い。",
    educationWorkHistory: "漁船クルーとして5年。",
    skillTags: ["漁業", "低温", "体力"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 68,
    aiScoreRationale: "水産加工とは素因が合うが、書類不備要フォロー。",
    ...statusMap("書類不備停止"),
    passportNumber: "N2211009",
    passportExpiry: "2028-04-20",
    coeStatusJa: "在留申請ストップ（出生証明の追加提出必要）",
    documentAlertJa: "出生証明の翻訳が不備。再提出待ち。",
    photoUrl: avatar("cand-dhammika-appuhamy"),
    detailDemo: {
      documentDeficiencyUrgency: "high",
      documentDeficiencyHeadlineJa:
        "4/10までに修正翻訳の再アップロードが最優先です。",
      healthSummaryJa:
        "在留申請が書類不備で停止中。出生証明の翻訳修正がクリティカルパスです。",
      followReasons: [
        {
          code: "doc_block",
          labelJa: "出生証明翻訳の不備で申請ストップ",
          variant: "danger",
        },
      ],
      milestones: [
        {
          id: "dhammika_reupload",
          labelJa: "修正翻訳の再アップロード期限（目安）",
          dateIso: "2026-04-10",
          severity: "danger",
        },
      ],
      activityEvents: [
        {
          at: "2026-04-01T11:00:00",
          kind: "document",
          titleJa: "入管から補正通知（出生証明翻訳）",
          detailJa: "翻訳者資格・逐語性の記載不足（デモ）",
        },
        {
          at: "2026-03-22T14:00:00",
          kind: "document",
          titleJa: "在留申請書類一式を提出",
        },
        {
          at: "2026-03-05T10:00:00",
          kind: "learning",
          titleJa: "eラーニング：衛生入門を完了",
        },
      ],
      docChecklist: [
        {
          labelJa: "出生証明（原本）",
          status: "verified",
        },
        {
          labelJa: "出生証明（翻訳）",
          status: "issue",
          dueIso: "2026-04-10",
        },
        {
          labelJa: "翻訳者署名・資格証憑",
          status: "pending",
          dueIso: "2026-04-10",
        },
        {
          labelJa: "申請書類の再提出パック",
          status: "pending",
          dueIso: "2026-04-12",
        },
      ],
      storedDocuments: [
        {
          id: "doc-dhammika-birth-si",
          labelJa: "出生証明（シンハラ語原本）",
          categoryJa: "身分",
          updatedAt: "2026-02-20",
          status: "final",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-dhammika-appuhamy/birth_cert_orig.pdf",
          fileName: "birth_certificate_lk.pdf",
        },
        {
          id: "doc-dhammika-birth-ja-bad",
          labelJa: "出生証明（日本語訳・要修正版）",
          categoryJa: "身分",
          updatedAt: "2026-03-10",
          status: "draft",
          storageUrl:
            "https://vault.haken-dash.example.jp/candidates/cand-dhammika-appuhamy/birth_cert_ja_v1.pdf",
          fileName: "birth_cert_translation_v1_ISSUE.pdf",
        },
      ],
      documentResolution: {
        issueTitleJa: "出生証明の翻訳が不備です",
        issueDetailJa:
          "入管からの指摘：翻訳が逐語訳であること、翻訳者の氏名・資格の明記が不足しています。修正後、支援機関が再提出します（デモフロー）。",
        completionCriteriaJa:
          "修正版PDFをVaultに格納し、チェックリスト「出生証明（翻訳）」を確認済に更新したら完了（デモ）。",
        steps: [
          {
            order: 1,
            titleJa: "不備内容の確認",
            detailJa:
              "補正通知と既存の翻訳PDFを突き合わせます。対象は birth_cert_translation_v1_ISSUE.pdf です。",
            actionHintJa: "書類タブの保管庫から該当ファイルを開く",
          },
          {
            order: 2,
            titleJa: "認定翻訳者／支援機関のテンプレに沿って再翻訳",
            detailJa:
              "翻訳者資格、逐語訳である旨、原文明記をテンプレに沿って記載します。",
            actionHintJa: "テンプレは社内Wiki（デモ）を参照",
            linkPath: "/documents",
          },
          {
            order: 3,
            titleJa: "本人へ読み合わせと同意署名",
            detailJa:
              "オンライン面談で訳文の意味を本人に説明し、同意署名を取得します。",
            actionHintJa: "面談ログに要約を残す",
          },
          {
            order: 4,
            titleJa: "Vaultへ修正版をアップロード",
            detailJa:
              "ファイル名例: birth_cert_translation_v2.pdf。バージョン管理ルールに従います。",
            actionHintJa: "アップロード後、担当者へSlack通知（デモ）",
          },
          {
            order: 5,
            titleJa: "支援機関から入管へ再提出",
            detailJa:
              "チェックリストを更新し、提出履歴に記録します。",
            actionHintJa: "書類ハブの期限一覧で他の期限も確認",
            linkPath: "/documents",
          },
        ],
      },
    },
  }),
  cand({
    id: "cand-harsha-abeyratne",
    displayName: "Harsha Abeyratne",
    legalNameFull: "Harsha Abeyratne",
    nameKatakana: "ハルシャ アベイラトネ",
    age: 25,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "2001-04-03",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N3",
    backgroundSummary: "IT系学生。学習意欲とPC操作が速い。",
    educationWorkHistory: "大学でIT基礎。アルバイトで事務補助。",
    skillTags: ["PC", "IT", "学習意欲"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 86,
    aiScoreRationale: "パネル操作の多い現場（彩りデリカ型）と相性良好。",
    ...statusMap("内定済"),
    passportNumber: "N1239876",
    passportExpiry: "2033-07-07",
    coeStatusJa: "認定証明書交付済",
    plannedAssignment: {
      clientId: "client-irodori",
      jobTitleJa: "ラインオペレーター",
      monthlySalaryJpy: 200000,
    },
    photoUrl: avatar("cand-harsha-abeyratne"),
  }),
  cand({
    id: "cand-piyumi-fonseka",
    displayName: "Piyumi Fonseka",
    legalNameFull: "Piyumi Fonseka",
    nameKatakana: "ピユミ フォンセカ",
    age: 24,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2002-10-11",
    birthPlace: "Kandy, Sri Lanka",
    residence: { country: "スリランカ", city: "キャンディ" },
    jlpt: "N4",
    backgroundSummary: "カフェ勤務。チームワーク良好。",
    educationWorkHistory: "カフェでホール・バック両方経験。",
    skillTags: ["カフェ", "チーム", "接客"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 78,
    aiScoreRationale: "チーム作業の多い製造ライン向き。",
    ...statusMap("面接調整"),
    passportNumber: "N4561237",
    passportExpiry: "2031-09-18",
    coeStatusJa: "面接日程調整中",
    photoUrl: avatar("cand-piyumi-fonseka"),
  }),
  cand({
    id: "cand-saman-priyantha",
    displayName: "Saman Priyantha",
    legalNameFull: "Saman Priyantha",
    nameKatakana: "サマン プリヤンタ",
    age: 32,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1994-06-25",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N4",
    backgroundSummary: "配送業経験。地理感覚・運転希望。",
    educationWorkHistory: "配送ドライバー補助3年。",
    skillTags: ["配送", "運転", "地理"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: true,
    aiScore: 74,
    aiScoreRationale: "物流・工場間移動が多い現場で活かせる。",
    ...statusMap("ビザ申請中"),
    passportNumber: "N7894561",
    passportExpiry: "2030-11-30",
    coeStatusJa: "申請中",
    photoUrl: avatar("cand-saman-priyantha"),
  }),
  cand({
    id: "cand-nilanthi-kumari",
    displayName: "Nilanthi Kumari",
    legalNameFull: "Nilanthi Kumari",
    nameKatakana: "ニランティ クマリ",
    age: 27,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "1998-01-09",
    birthPlace: "Anuradhapura, Sri Lanka",
    residence: { country: "スリランカ", city: "アヌラーダプラ" },
    jlpt: "N3",
    backgroundSummary: "元教師。理解力が高く言語習得が速い。",
    educationWorkHistory: "中学校教師2年。その後日本語学校で学習。",
    skillTags: ["教育", "日本語", "理解力"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 89,
    aiScoreRationale: "マニュアル理解が速く、衛生教育の徹底した現場向き。",
    ...statusMap("ビザ申請中"),
    passportNumber: "N3216549",
    passportExpiry: "2032-05-22",
    coeStatusJa: "追加質問回答待ち",
    photoUrl: avatar("cand-nilanthi-kumari"),
  }),
  cand({
    id: "cand-udara-bandara",
    displayName: "Udara Bandara",
    legalNameFull: "Udara Bandara",
    nameKatakana: "ウダラ バンダラ",
    age: 22,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "2004-11-17",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N5",
    backgroundSummary: "ラグビー経験。チームスポーツで体力・協調性。",
    educationWorkHistory: "大学スポーツ部。アルバイトで倉庫作業。",
    skillTags: ["スポーツ", "体力", "若手"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 70,
    aiScoreRationale: "体力系現場のポテンシャル枠。日本語強化が鍵。",
    ...statusMap("講習中"),
    passportNumber: "N6549873",
    passportExpiry: "2034-01-10",
    coeStatusJa: "日本語・講習中",
    photoUrl: avatar("cand-udara-bandara"),
  }),
  cand({
    id: "cand-nimal-sirisena",
    displayName: "Nimal Sirisena",
    legalNameFull: "Nimal Sirisena",
    nameKatakana: "ニマル シリセナ",
    age: 33,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1993-03-28",
    birthPlace: "Kurunegala, Sri Lanka",
    residence: { country: "スリランカ", city: "クルネーガラ" },
    jlpt: "N4",
    backgroundSummary: "農家出身。朝型で無断欠勤なし。",
    educationWorkHistory: "家族農園でフルタイム10年。",
    skillTags: ["農業", "朝型", "誠実"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: true,
    aiScore: 81,
    aiScoreRationale: "野菜カット・早期シフトの現場と相性が高い。",
    ...statusMap("入国待ち"),
    passportNumber: "N9873216",
    passportExpiry: "2029-12-25",
    coeStatusJa: "ビザ交付・入国調整中",
    photoUrl: avatar("cand-nimal-sirisena"),
  }),
  cand({
    id: "cand-chathurika-silva",
    displayName: "Chathurika Silva",
    legalNameFull: "Chathurika Silva",
    nameKatakana: "チャトゥリカ シルヴァ",
    age: 25,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2001-07-07",
    birthPlace: "Galle, Sri Lanka",
    residence: { country: "スリランカ", city: "ゴール" },
    jlpt: "N4",
    backgroundSummary: "裁縫・内職経験。細かい作業に集中できる。",
    educationWorkHistory: "縫製工場で検品2年。",
    skillTags: ["細かい作業", "検品", "集中"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 84,
    aiScoreRationale: "分量管理・検品工程でミスが少ないタイプ。",
    ...statusMap("面接調整"),
    passportNumber: "N1592634",
    passportExpiry: "2033-08-01",
    coeStatusJa: "面接後申請予定",
    photoUrl: avatar("cand-chathurika-silva"),
  }),
  cand({
    id: "cand-gayan-pathirana",
    displayName: "Gayan Pathirana",
    legalNameFull: "Gayan Pathirana",
    nameKatakana: "ガヤン パティラナ",
    age: 28,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1998-09-19",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N3",
    backgroundSummary: "ホテル厨房。衛生概念が明確。",
    educationWorkHistory: "星付きホテル厨房で3年。",
    skillTags: ["厨房", "衛生", "ホテル"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: false,
    aiScore: 87,
    aiScoreRationale: "HACCP 重視の惣菜・弁当工場と高マッチ。",
    ...statusMap("内定済"),
    passportNumber: "N7531594",
    passportExpiry: "2031-03-14",
    coeStatusJa: "内定先決定・COE準備",
    plannedAssignment: {
      clientId: "client-marufuku",
      jobTitleJa: "食品製造スタッフ",
      monthlySalaryJpy: 190000,
    },
    photoUrl: avatar("cand-gayan-pathirana"),
  }),
  cand({
    id: "cand-shani-mendis",
    displayName: "Shani Mendis",
    legalNameFull: "Shani Mendis",
    nameKatakana: "シャニ メンディス",
    age: 22,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2004-04-25",
    birthPlace: "Kandy, Sri Lanka",
    residence: { country: "スリランカ", city: "キャンディ" },
    jlpt: "N5",
    backgroundSummary: "明るい性格。学習意欲は高いが経験は浅い。",
    educationWorkHistory: "専門学校在学中。小売アルバイト。",
    skillTags: ["若手", "明るい", "学習意欲"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 65,
    aiScoreRationale: "ポテンシャル枠。基礎研修とペア配属が有効。",
    ...statusMap("書類不備停止"),
    passportNumber: "N4567890",
    passportExpiry: "2032-07-20",
    coeStatusJa: "履歴書の職歴記載で補正依頼（軽微）",
    documentAlertJa:
      "職歴の期間表記が一部不明瞭。修正版の提出待ち（デモ）。",
    photoUrl: avatar("cand-shani-mendis"),
    detailDemo: {
      documentDeficiencyUrgency: "medium",
      documentDeficiencyHeadlineJa:
        "履歴書の職歴欄を本人確認のうえ修正版をアップロードしてください。",
      docChecklist: [
        {
          labelJa: "履歴書（日本語）",
          status: "issue",
          dueIso: "2026-04-18",
        },
      ],
    },
  }),
  cand({
    id: "cand-sanduni-rathnayake",
    displayName: "Sanduni Rathnayake",
    legalNameFull: "Sanduni Rathnayake",
    nameKatakana: "サンドゥニ ラトナーヤケ",
    age: 23,
    gender: "female",
    nationality: "スリランカ",
    birthDate: "2003-11-08",
    birthPlace: "Galle, Sri Lanka",
    residence: { country: "スリランカ", city: "ゴール" },
    jlpt: "N5",
    backgroundSummary: "事務補助の経験。丁寧な性格。",
    educationWorkHistory: "専門学校事務科卒。事務アルバイト1年。",
    skillTags: ["事務", "丁寧", "若手"],
    tokuteiGinoFoodManufacturing: false,
    driversLicenseLk: false,
    aiScore: 70,
    aiScoreRationale: "軽微な書類指摘のみ。フォローで申請再開見込み（デモ）。",
    ...statusMap("書類不備停止"),
    passportNumber: "N6677889",
    passportExpiry: "2033-05-12",
    coeStatusJa: "軽微な記載修正の確認中",
    documentAlertJa:
      "申請書の署名欄に日付のみの記載。フル署名の再提出を推奨（デモ・低緊急）。",
    photoUrl: avatar("cand-sanduni-rathnayake"),
    detailDemo: {
      documentDeficiencyUrgency: "low",
      documentDeficiencyHeadlineJa:
        "次回定例面談で署名を取得し、スキャンを差し替え予定。",
    },
  }),
  cand({
    id: "cand-ruwan-perera",
    displayName: "Ruwan Perera",
    legalNameFull: "Ruwan Perera",
    nameKatakana: "ルワン ペレーラ",
    age: 31,
    gender: "male",
    nationality: "スリランカ",
    birthDate: "1995-12-12",
    birthPlace: "Colombo, Sri Lanka",
    residence: { country: "スリランカ", city: "コロンボ" },
    jlpt: "N4",
    backgroundSummary: "工場保全経験。機械操作に強み。",
    educationWorkHistory: "食品工場で保全補助4年。",
    skillTags: ["保全", "機械", "工場"],
    tokuteiGinoFoodManufacturing: true,
    driversLicenseLk: true,
    aiScore: 80,
    aiScoreRationale: "設備保全ニーズのある工場で差別化できる。",
    ...statusMap("ビザ申請中"),
    passportNumber: "N8529637",
    passportExpiry: "2030-10-05",
    coeStatusJa: "審査中",
    photoUrl: avatar("cand-ruwan-perera"),
  }),
];

export const demoBundle: DemoDataBundle = {
  meta: {
    version: "1.0.0",
    locale: "ja-JP",
    referenceDate: "2026-04-03",
    descriptionJa: "営業デモ用ダミーデータ（8社・20名）",
  },
  candidates,
  clients,
};

export function getClientById(id: string): ClientCompany | undefined {
  return clients.find((c) => c.id === id);
}

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find((c) => c.id === id);
}

export function getPipelineCounts(): Record<CandidatePipelineStatus, number> {
  const init: Record<CandidatePipelineStatus, number> = {
    awaiting_entry: 0,
    interview_coordination: 0,
    training: 0,
    offer_accepted: 0,
    visa_applying: 0,
    document_blocked: 0,
    document_prep: 0,
  };
  for (const c of candidates) {
    init[c.pipelineStatus] += 1;
  }
  return init;
}

export function countN3OrAbove(): number {
  return candidates.filter((c) => jlptOrder(c.jlpt) >= 3).length;
}

export function getTopCandidatesByAiScore(limit: number): Candidate[] {
  return [...candidates]
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, limit);
}

export function countDocumentAlerts(): number {
  return candidates.filter(
    (c) =>
      c.pipelineStatus === "document_blocked" ||
      c.documentAlertJa ||
      c.pipelineStatus === "document_prep"
  ).length;
}

export function totalOpenSlots(): number {
  return clients.reduce((s, c) => s + c.operations.openSlots, 0);
}

export function monthlyRevenueTrend(): { month: string; amountManYen: number }[] {
  return [
    { month: "2025-11", amountManYen: 42 },
    { month: "2025-12", amountManYen: 45 },
    { month: "2026-01", amountManYen: 48 },
    { month: "2026-02", amountManYen: 46 },
    { month: "2026-03", amountManYen: 52 },
    { month: "2026-04", amountManYen: 51 },
  ];
}

/** 簡易マッチング: タグ重複スコア + AIスコア + 学習要件照合（デモ） */
export function scoreCandidateForClient(
  candidate: Candidate,
  client: ClientCompany
): CandidateClientMatchScore {
  const tagHits = candidate.skillTags.filter((t) =>
    client.matchingHintTags.some(
      (h) =>
        h.toLowerCase().includes(t.toLowerCase()) ||
        t.toLowerCase().includes(h.toLowerCase())
    )
  ).length;
  const base = 55 + tagHits * 8 + Math.min(20, Math.floor((candidate.aiScore - 60) / 2));
  const pct = Math.min(97, Math.max(52, base));
  let reason = `${client.tradeNameJa}が重視する「${client.matchingHintTags.slice(0, 2).join("・")}」と、${candidate.displayName}のスキルタグ（${candidate.skillTags.slice(0, 3).join("・")}）が整合しています。日本語${candidate.jlpt}で現場指示の理解度も十分見込めます。`;

  const learn = learningComplianceForMatch(candidate, client);
  let learningCompliance: CandidateClientMatchScore["learningCompliance"];
  if (learn) {
    learningCompliance = { status: learn.status, labelJa: learn.labelJa };
    reason = `${reason} ${learn.detailJa}`;
  }

  return { pct, reason, learningCompliance };
}

export function getMatchesForClient(clientId: string) {
  const client = getClientById(clientId);
  if (!client) return [];
  return [...candidates]
    .map((c) => ({ candidate: c, ...scoreCandidateForClient(c, client) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
}
