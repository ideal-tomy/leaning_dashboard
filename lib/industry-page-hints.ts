import type {
  DashboardExtensionOverride,
  DashboardExtensionSlotId,
} from "@/lib/dashboard-extension-types";
import type { EnabledIndustryKey } from "@/lib/industry-profiles";
import { withIndustryQuery } from "@/lib/industry-selection";

export type QuickLinkPath =
  | "documents"
  | "matching"
  | "pipeline"
  | "revenue"
  | "candidates";

/** `/candidates/[id]` のタブ名・カード文言（派遣テンプレの直書きを業種ごとに差し替え） */
export type CandidateDetailHints = {
  tabBasic: string;
  tabDocs: string;
  tabHistory: string;
  tabAi: string;
  profileCardTitle: string;
  docsCardTitle: string;
  docsPrimaryLabel: string;
  docsSecondaryLabel: string;
  docsExpiryLabel: string;
  docsOcrNote: string;
  historyCardTitle: string;
  historyPlaceholder: string;
  plannedAssignmentSalaryLabel: string;
  aiCardTitle: string;
  /** 紐付けなし時の本文（リンクはページ側で追加） */
  aiEmptyAssignment: string;
  aiMatchingLinkLabel: string;
  aiFooterNote: string;
  /** ヘッダーに JLPT バッジを出す（営業・不動産などでは非表示） */
  showJlptBadge: boolean;
};

export type IndustryPageHints = {
  candidates: {
    pageSubtitle: string;
    defaultTab: "list" | "pipeline";
    /** モバイル Sheet 内の情報順 */
    sheetOrder: "statusFirst" | "alertFirst";
  };
  documents: {
    pageSubtitle: string;
    kpiComplete: number;
    kpiReview: number;
    ocrButtonLabel: string;
    sheetTitle: string;
    ocrSampleName: string;
    ocrSampleLines: string[];
  };
  matching: {
    emptyState: string;
  };
  operations: {
    csvHint: string;
    kpiTiles: { label: string; value: string; sub?: string }[];
    timeline: { title: string; time: string; badge?: string }[];
  };
  knowledge: {
    pageSubtitle: string;
    faqs: { q: string; a: string }[];
    chatSeeds: string[];
    staticReply: string;
  };
  home: {
    matchingMobileSubtitle: string;
    matchingDesktopTeaser: string;
    matchingDesktopReason: string;
    documentsMobileSubtitle: string;
  };
  clients: {
    listCardEmphasis: "region" | "openSlots" | "culture";
  };
  clientDetail: {
    quickLinks: { label: string; path: QuickLinkPath }[];
  };
  candidateDetail: CandidateDetailHints;
  /** ダッシュ拡張枠の文言・パス・非表示（未指定は app-template-config の既定） */
  dashboardExtensionOverrides?: Partial<
    Record<DashboardExtensionSlotId, DashboardExtensionOverride>
  >;
};

const hints: Record<EnabledIndustryKey, IndustryPageHints> = {
  staffing: {
    candidates: {
      pageSubtitle:
        "面接調整から入国・講習までの進捗を一覧化。書類不備はパイプラインと連動したデモです。",
      defaultTab: "list",
      sheetOrder: "alertFirst",
    },
    documents: {
      pageSubtitle: "在留・パスポート等の生成ステータスと OCR デモ（API なし）",
      kpiComplete: 12,
      kpiReview: 3,
      ocrButtonLabel: "パスポート OCR（デモ）",
      sheetTitle: "OCR 抽出結果",
      ocrSampleName: "サンプル: Nuwan Kumara",
      ocrSampleLines: [
        "氏名: Pathirana Gamage Nuwan Kumara",
        "生年月日: 1998-04-15",
        "パスポート: N1234567 / 2030-05-10",
      ],
    },
    matching: {
      emptyState: "案件に紐づく推奨候補がまだありません（デモ）",
    },
    operations: {
      csvHint: "勤怠 CSV は次期で取込予定（デモ）",
      kpiTiles: [
        { label: "今月稼働", value: "142", sub: "名（ダミー）" },
        { label: "書類要フォロー", value: "連動", sub: "候補者画面と同期" },
        { label: "未請求工数", value: "38", sub: "h（デモ）" },
        { label: "派遣先契約更新", value: "5", sub: "件 30日以内" },
      ],
      timeline: [
        { title: "丸福惣菜 — 欠員補充の承認待ち", time: "今日 14:20", badge: "要対応" },
        { title: "書類不備フォロー SMS 送信", time: "昨日", badge: "完了" },
        { title: "請求締めデータ生成（バッチ）", time: "4/1 0:00", badge: "予定" },
      ],
    },
    knowledge: {
      pageSubtitle:
        "入管・現場トラブルの一次回答を RAG で想定。デモは静的 FAQ と擬似チャットです。",
      faqs: [
        { q: "在留期限切れ間近の候補者の見分け方は？", a: "ダッシュのパイプラインと書類アラートで色分け表示する想定です。" },
        { q: "特定技能 食品製造の添付書類は？", a: "評価試験合格証と監理支援計画書が基本です（デモ文）。" },
        { q: "派遣先からの苦情フローは？", a: "メッセージを起点に記録を残し、担当へエスカレーションする想定です。" },
      ],
      chatSeeds: ["在留期限の確認方法は？", "書類不備のテンプレ返信を出して"],
      staticReply:
        "デモ応答: 該当する監理報告のテンプレは「書類管理」から参照する想定です。本番では社内ドキュメントを RAG 検索します。",
    },
    home: {
      matchingMobileSubtitle: "案件別AI候補",
      matchingDesktopTeaser:
        "丸福惣菜 × Nuwan など、案件別の推奨候補と理由を表示します。",
      matchingDesktopReason:
        "「規律重視の現場には軍・警察経験者が適合」— 3行理由つき（デモ）",
      documentsMobileSubtitle: "画像で書類作成",
    },
    clients: { listCardEmphasis: "openSlots" },
    clientDetail: {
      quickLinks: [
        { label: "書類・OCR", path: "documents" },
        { label: "マッチング", path: "matching" },
        { label: "パイプライン", path: "pipeline" },
      ],
    },
    candidateDetail: {
      tabBasic: "基本情報",
      tabDocs: "書類",
      tabHistory: "派遣履歴・評価",
      tabAi: "AI 分析",
      profileCardTitle: "プロフィール",
      docsCardTitle: "書類・在留",
      docsPrimaryLabel: "パスポート",
      docsSecondaryLabel: "COE",
      docsExpiryLabel: "有効期限",
      docsOcrNote:
        "OCR デモ: ダッシュボード右下 FAB からサンプル抽出を表示できます。",
      historyCardTitle: "派遣履歴・評価（デモ）",
      historyPlaceholder:
        "本番では placements テーブルから表示。デモでは未配属または予定のみ表示します。",
      plannedAssignmentSalaryLabel: "月給",
      aiCardTitle: "AI マッチング示唆",
      aiEmptyAssignment:
        "配属予定クライアントが未設定です。案件別の提案は次のリンクから確認できます。",
      aiMatchingLinkLabel: "マッチング一覧を開く",
      aiFooterNote:
        "動画レジュメ解析・離職リスクは本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: true,
    },
  },
  "real-estate": {
    candidates: {
      pageSubtitle:
        "顧客の内見・契約ステージを追跡。重要事項説明と契約準備の遅延を可視化するデモです。",
      defaultTab: "pipeline",
      sheetOrder: "statusFirst",
    },
    documents: {
      pageSubtitle: "重要事項・契約書ドラフトの生成状況とスキャン検証デモ",
      kpiComplete: 9,
      kpiReview: 4,
      ocrButtonLabel: "身分証・印鑑証明 OCR（デモ）",
      sheetTitle: "スキャン結果（契約準備）",
      ocrSampleName: "サンプル: 購入者 本人確認",
      ocrSampleLines: [
        "氏名: 山田 太郎",
        "住所: 東京都世田谷区…",
        "有効期限: 2032-03-31",
      ],
    },
    matching: {
      emptyState: "物件案件に紐づく顧客提案がまだありません（デモ）",
    },
    operations: {
      csvHint: "内見ログの CSV 取込は次期対応（デモ）",
      kpiTiles: [
        { label: "今週の内見", value: "14", sub: "件" },
        { label: "契約見込み", value: "6", sub: "件" },
        { label: "書類不備", value: "連動", sub: "顧客パイプライン" },
        { label: "成約手続き中", value: "3", sub: "件" },
      ],
      timeline: [
        { title: "A マンション 302 — 内見フォロー電話", time: "今日 10:00", badge: "予定" },
        { title: "B 区画 — 重要事項説明の日程確定", time: "昨日", badge: "完了" },
        { title: "ローン事前審査結果の取込", time: "明日", badge: "要確認" },
      ],
    },
    knowledge: {
      pageSubtitle: "物件規約・過去トラブル事例をチャットで参照する想定（デモは静的）",
      faqs: [
        { q: "ペット可否の確認ポイントは？", a: "管理規約の別表と最新理事会議事録を突合する想定です。" },
        { q: "内見後のクーリングオフ説明は？", a: "宅建基準に沿った定型文を提案資料から差し込むイメージです。" },
        { q: "手付解除の典型パターンは？", a: "ローン不成立・重大事実告知からの協議など（デモ文）。" },
      ],
      chatSeeds: ["ペット飼育の可否を教えて", "内見後の次アクションは？"],
      staticReply:
        "デモ応答: 当該物件の管理規約抜粋は「契約書類」タブのテンプレにリンクする想定です。",
    },
    home: {
      matchingMobileSubtitle: "物件別の顧客提案",
      matchingDesktopTeaser: "物件案件ごとに、成約確度の高い顧客候補と理由を表示します。",
      matchingDesktopReason: "「駅近・単身向けには転勤族の顧客が適合」— スコア理由（デモ）",
      documentsMobileSubtitle: "契約書・重要事項",
    },
    clients: { listCardEmphasis: "region" },
    clientDetail: {
      quickLinks: [
        { label: "契約書類", path: "documents" },
        { label: "顧客提案", path: "matching" },
        { label: "内見・契約進捗", path: "pipeline" },
      ],
    },
    candidateDetail: {
      tabBasic: "顧客概要",
      tabDocs: "契約書類",
      tabHistory: "内見・提案履歴",
      tabAi: "AI 分析",
      profileCardTitle: "顧客プロフィール",
      docsCardTitle: "本人確認・契約準備",
      docsPrimaryLabel: "本人確認番号（デモ）",
      docsSecondaryLabel: "契約・ローン準備ステータス",
      docsExpiryLabel: "書類有効期限",
      docsOcrNote:
        "重要事項・身分証の OCR は「契約書類管理」とダッシュボード右下 FAB から（デモ）。",
      historyCardTitle: "内見・提案履歴（デモ）",
      historyPlaceholder:
        "本番では内見ログ・提案メモを時系列表示。デモでは成約見込み案件の予定のみ表示します。",
      plannedAssignmentSalaryLabel: "成約想定（価格イメージ）",
      aiCardTitle: "AI 物件提案示唆",
      aiEmptyAssignment:
        "メイン物件案件が未紐付けです。顧客別の提案は次のリンクから確認できます。",
      aiMatchingLinkLabel: "物件提案を見る",
      aiFooterNote:
        "需要予測・競合物件サマリは本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: false,
    },
  },
  professional: {
    candidates: {
      pageSubtitle:
        "相談案件の受任・申請フェーズを管理。証憑不足は優先的に浮かせるデモです。",
      defaultTab: "pipeline",
      sheetOrder: "alertFirst",
    },
    documents: {
      pageSubtitle: "申請書類・証憑のレビュー状況とスキャン検証デモ",
      kpiComplete: 15,
      kpiReview: 5,
      ocrButtonLabel: "証憑スキャン OCR（デモ）",
      sheetTitle: "証憑データ抽出",
      ocrSampleName: "サンプル: 領収書スキャン",
      ocrSampleLines: [
        "取引先: 株式会社サンプル",
        "金額: ￥82,500（税込）",
        "日付: 2026-03-28",
      ],
    },
    matching: {
      emptyState: "顧問先ごとの優先案件がまだありません（デモ）",
    },
    operations: {
      csvHint: "タイムチャージ CSV は次期で連携（デモ）",
      kpiTiles: [
        { label: "未着手案件", value: "連動", sub: "ダッシュ KPI" },
        { label: "今月請求見込", value: "428", sub: "万円（ダミー）" },
        { label: "期限 7日以内", value: "7", sub: "件" },
        { label: "証憑不足", value: "連動", sub: "書類アラート" },
      ],
      timeline: [
        { title: "顧問先 X — 株主総会議案のレビュー期限", time: "今日", badge: "要対応" },
        { title: "税務申告ドラフトの顧客送付", time: "昨日", badge: "完了" },
        { title: "登記申請書の印鑑証明取寄", time: "明日", badge: "外注" },
      ],
    },
    knowledge: {
      pageSubtitle: "法令改正・判例メモを RAG で引ける想定（デモは FAQ のみ）",
      faqs: [
        { q: "電子帳簿保存法の対象判断は？", a: "取引形態と金額規模でスキーム分岐するチェックリストを想定。" },
        { q: "顧問先への報告頻度テンプレは？", a: "四半期・月次の 2 種をナレッジから選択するイメージ。" },
        { q: "証憑不備時のクライアント文面は？", a: "不足項目を列挙した定型メールを生成する想定です。" },
      ],
      chatSeeds: ["電子帳簿の保存期間は？", "証憑不足の催促文を出して"],
      staticReply:
        "デモ応答: 関連する事務ガイドは「申請書類」画面のテンプレ集に集約する想定です。",
    },
    home: {
      matchingMobileSubtitle: "顧問先別の優先度",
      matchingDesktopTeaser: "顧問先ごとに、受任優先度の高い案件と AI 理由を表示します。",
      matchingDesktopReason: "「期限が近い申請は公認会計士レビューを先行」— ルール例（デモ）",
      documentsMobileSubtitle: "申請・証憑",
    },
    clients: { listCardEmphasis: "culture" },
    clientDetail: {
      quickLinks: [
        { label: "申請書類", path: "documents" },
        { label: "案件優先度", path: "matching" },
        { label: "相談パイプライン", path: "pipeline" },
      ],
    },
    candidateDetail: {
      tabBasic: "案件概要",
      tabDocs: "申請・証憑",
      tabHistory: "受任・手続履歴",
      tabAi: "AI 分析",
      profileCardTitle: "相談内容・プロフィール",
      docsCardTitle: "申請書・証憑一覧（デモ）",
      docsPrimaryLabel: "案件参照番号（デモ）",
      docsSecondaryLabel: "申請・審査ステータス",
      docsExpiryLabel: "期限日（デモ）",
      docsOcrNote:
        "領収書・契約書の OCR は「申請書類」とダッシュボード右下 FAB から（デモ）。",
      historyCardTitle: "受任・手続履歴（デモ）",
      historyPlaceholder:
        "本番では受任・申請タスクを時系列表示。デモでは顧問先との予定のみ表示します。",
      plannedAssignmentSalaryLabel: "報酬見込み（月額イメージ）",
      aiCardTitle: "AI 案件優先度示唆",
      aiEmptyAssignment:
        "主担当顧問先が未設定です。顧問先別の優先案件は次のリンクから確認できます。",
      aiMatchingLinkLabel: "案件優先度を見る",
      aiFooterNote:
        "判例要約・条文チェックは本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: false,
    },
  },
  construction: {
    candidates: {
      pageSubtitle:
        "現場配員・安全教育・入場書類の段階を追跡。安全書類不備を強調するデモです。",
      defaultTab: "pipeline",
      sheetOrder: "alertFirst",
    },
    documents: {
      pageSubtitle: "入場許可・安全書類のステータスと現場スキャン検証デモ",
      kpiComplete: 11,
      kpiReview: 2,
      ocrButtonLabel: "資格証・保険証 OCR（デモ）",
      sheetTitle: "安全書類スキャン結果",
      ocrSampleName: "サンプル: 高所作業 特別教育修了証",
      ocrSampleLines: [
        "氏名: 佐藤 一郎",
        "講習日: 2025-11-02",
        "有効期限: 2028-11-01",
      ],
    },
    matching: {
      emptyState: "現場案件に紐づく配員候補がまだありません（デモ）",
    },
    operations: {
      csvHint: "現場日報 CSV 取込は次期（デモ）",
      kpiTiles: [
        { label: "本日の現場数", value: "23", sub: "件" },
        { label: "入場待ち", value: "4", sub: "名" },
        { label: "安全書類不備", value: "連動", sub: "書類アラート" },
        { label: "夜勤割当未確定", value: "2", sub: "現場" },
      ],
      timeline: [
        { title: "〇〇ビル新築 — 朝礼チェックリスト未提出", time: "今日 7:00", badge: "要対応" },
        { title: "△△工場 — 入場許可証再発行", time: "昨日", badge: "完了" },
        { title: "安全教育オンライン受講リマインド", time: "明日 9:00", badge: "自動" },
      ],
    },
    knowledge: {
      pageSubtitle: "安全衛生・監理の過去事例を検索する想定（デモは静的）",
      faqs: [
        { q: "熱中症対策の必須項目は？", a: "作業計画書への休息計画と給水スポットの記載を想定。" },
        { q: "足場の点検頻度は？", a: "組立時・変更時・定期の 3 種をナレッジに紐付け。" },
        { q: "外国人技能実習生の入場手続きは？", a: "在留カードと監理報告の突合フロー（デモ文）。" },
      ],
      chatSeeds: ["足場点検の記録様式は？", "入場許可に必要な書類は？"],
      staticReply:
        "デモ応答: 該当マニュアルは「安全書類」画面のテンプレ一覧から開く想定です。",
    },
    home: {
      matchingMobileSubtitle: "現場別の配員候補",
      matchingDesktopTeaser: "現場案件ごとに、資格・経験が合う作業員候補を提示します。",
      matchingDesktopReason: "「重機オペ免許保有者を未充足現場に優先配分」— ルール例（デモ）",
      documentsMobileSubtitle: "入場・安全書類",
    },
    clients: { listCardEmphasis: "openSlots" },
    clientDetail: {
      quickLinks: [
        { label: "安全書類", path: "documents" },
        { label: "配員最適化", path: "matching" },
        { label: "手配進捗", path: "pipeline" },
      ],
    },
    candidateDetail: {
      tabBasic: "基本情報",
      tabDocs: "安全・入場書類",
      tabHistory: "現場実績・評価",
      tabAi: "AI 分析",
      profileCardTitle: "作業員プロフィール",
      docsCardTitle: "資格・保険・入場（デモ）",
      docsPrimaryLabel: "資格証番号（デモ）",
      docsSecondaryLabel: "入場・安全ステータス",
      docsExpiryLabel: "資格・保険期限",
      docsOcrNote:
        "安全書類の OCR は「書類管理」とダッシュボード右下 FAB から（デモ）。",
      historyCardTitle: "現場実績・評価（デモ）",
      historyPlaceholder:
        "本番では現場配属・安全教育履歴を表示。デモでは次現場の予定のみ表示します。",
      plannedAssignmentSalaryLabel: "現場手当（想定）",
      aiCardTitle: "AI 配員示唆",
      aiEmptyAssignment:
        "次の現場案件が未設定です。現場別の配員候補は次のリンクから確認できます。",
      aiMatchingLinkLabel: "配員最適化を見る",
      aiFooterNote:
        "ヒヤリハット要約・安全教育アラートは本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: true,
    },
    dashboardExtensionOverrides: {
      fieldReports: {
        title: "現場報告・写真",
        subtitle: "未提出と確認場所を一元化（デモ）",
        desktopTitle: "現場報告・写真ハブ（拡張枠）",
        desktopBody:
          "現場からの写真・日報をタスク単位で集約。送り忘れ・ファイル探索・取り違えを減らす想定です。アップロード時の自動命名・保存先ルールにも連携可能。",
        desktopCta: "報告一覧へ",
      },
    },
  },
  medical: {
    candidates: {
      pageSubtitle:
        "スタッフの配置・院内研修・記録不備を追跡。シフト逼迫を一覧で把握するデモです。",
      defaultTab: "pipeline",
      sheetOrder: "alertFirst",
    },
    documents: {
      pageSubtitle: "記録・同意書の整備状況とスキャン検証デモ",
      kpiComplete: 18,
      kpiReview: 2,
      ocrButtonLabel: "同意書・記録スキャン OCR（デモ）",
      sheetTitle: "記録文書の抽出",
      ocrSampleName: "サンプル: インフォームドコンセント",
      ocrSampleLines: [
        "患者ID: 匿名化済",
        "署名日: 2026-03-15",
        "施設印: 確認済（デモ）",
      ],
    },
    matching: {
      emptyState: "拠点に紐づく配置候補がまだありません（デモ）",
    },
    operations: {
      csvHint: "勤怠・シフト CSV は次期連携（デモ）",
      kpiTiles: [
        { label: "不足シフト", value: "連動", sub: "KPI と同期" },
        { label: "記録不備", value: "連動", sub: "書類アラート" },
        { label: "今週の研修", value: "5", sub: "セッション" },
        { label: "夜勤未確定", value: "3", sub: "枠" },
      ],
      timeline: [
        { title: "第一診療 — 夜勤シフト確定リマインド", time: "今日", badge: "要対応" },
        { title: "介護記録テンプレ更新の周知", time: "昨日", badge: "完了" },
        { title: "院内感染対策チェック", time: "明日", badge: "定期" },
      ],
    },
    knowledge: {
      pageSubtitle: "マニュアル・過去インシデントを RAG で参照する想定（デモは静的）",
      faqs: [
        { q: "ナイトシフトの最低人数は？", a: "施設別の基準をナレッジに保持しアラート連動する想定。" },
        { q: "記録不備の典型パターンは？", a: "時刻抜け・サイン漏れ・版数違いなど（デモ文）。" },
        { q: "新人オリエンの必須コンテンツは？", a: "感染・跌倒・緊急時連絡の 3 モジュールを想定。" },
      ],
      chatSeeds: ["夜勤の最低人数ルールは？", "記録不備のチェックリストは？"],
      staticReply:
        "デモ応答: 該当プロトコルは「記録書類」テンプレとリンクする想定です。",
    },
    home: {
      matchingMobileSubtitle: "拠点別の配置提案",
      matchingDesktopTeaser: "拠点ごとに、即戦力のスタッフ候補と配置理由を表示します。",
      matchingDesktopReason: "「夜勤枠逼迫時は経験年数長めを優先」— シフトルール例（デモ）",
      documentsMobileSubtitle: "記録・同意",
    },
    clients: { listCardEmphasis: "openSlots" },
    clientDetail: {
      quickLinks: [
        { label: "記録書類", path: "documents" },
        { label: "配置提案", path: "matching" },
        { label: "配置進捗", path: "pipeline" },
      ],
    },
    candidateDetail: {
      tabBasic: "基本情報",
      tabDocs: "記録・同意",
      tabHistory: "配置・勤務履歴",
      tabAi: "AI 分析",
      profileCardTitle: "スタッフプロフィール",
      docsCardTitle: "記録・同意（デモ）",
      docsPrimaryLabel: "職員ID（デモ）",
      docsSecondaryLabel: "記録・研修ステータス",
      docsExpiryLabel: "資格・講習期限",
      docsOcrNote:
        "同意書・記録の OCR は「記録書類」とダッシュボード右下 FAB から（デモ）。",
      historyCardTitle: "配置・勤務履歴（デモ）",
      historyPlaceholder:
        "本番ではシフト・配置履歴を表示。デモでは次勤務予定のみ表示します。",
      plannedAssignmentSalaryLabel: "時給・単価（想定）",
      aiCardTitle: "AI 配置示唆",
      aiEmptyAssignment:
        "優先配置先が未設定です。拠点別の候補は次のリンクから確認できます。",
      aiMatchingLinkLabel: "配置提案を見る",
      aiFooterNote:
        "記録不備検知・シフト最適化は本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: true,
    },
  },
  sales: {
    candidates: {
      pageSubtitle:
        "リードから受注までの商談ステージを追跡。要修正・資料準備のボトルネックを見える化。",
      defaultTab: "pipeline",
      sheetOrder: "statusFirst",
    },
    documents: {
      pageSubtitle: "提案資料・見積の生成・レビュー状況とスキャン検証デモ",
      kpiComplete: 14,
      kpiReview: 6,
      ocrButtonLabel: "見積・注文書 OCR（デモ）",
      sheetTitle: "見積データ抽出",
      ocrSampleName: "サンプル: 取引先発注書",
      ocrSampleLines: [
        "品目: クラウド年間ライセンス",
        "金額: ￥1,200,000",
        "希望納期: 2026-05-01",
      ],
    },
    matching: {
      emptyState: "商談に紐づく提案優先度がまだありません（デモ）",
    },
    operations: {
      csvHint: "SFA エクスポート取込は次期（デモ）",
      kpiTiles: [
        { label: "未対応商談", value: "連動", sub: "KPI" },
        { label: "今月受注見込", value: "892", sub: "万円（ダミー）" },
        { label: "提案期限 3日以内", value: "4", sub: "件" },
        { label: "要修正", value: "連動", sub: "パイプライン" },
      ],
      timeline: [
        { title: "A 社 — 見積再提出の承認待ち", time: "今日 16:00", badge: "要対応" },
        { title: "B 社 — デモ実施フォローメール", time: "昨日", badge: "完了" },
        { title: "四半期レビュー資料の集計", time: "金曜", badge: "予定" },
      ],
    },
    knowledge: {
      pageSubtitle: "製品仕様・競合比較を営業がチャットで引く想定（デモは静的）",
      faqs: [
        { q: "価格表の改定履歴はどこ？", a: "版管理された PDF をナレッジに取り込む想定。" },
        { q: "失注理由の典型分類は？", a: "価格・機能・タイミングの 3 軸でタグ付け。" },
        { q: "NDA 締結前に見せられる資料は？", a: "公開概要のみに限定するガイドを表示。" },
      ],
      chatSeeds: ["競合 X との差分を要約して", "NDA 前に送れる資料は？"],
      staticReply:
        "デモ応答: 公開可能な比較表は「提案資料」テンプレにあります（本番は RAG 検索）。",
    },
    home: {
      matchingMobileSubtitle: "商談別の提案優先度",
      matchingDesktopTeaser: "商談ごとに、受注に効く提案順と AI 理由を表示します。",
      matchingDesktopReason: "「決裁者が CFO の案件は ROI 試算を最優先」— 営業ルール例（デモ）",
      documentsMobileSubtitle: "提案・見積",
    },
    clients: { listCardEmphasis: "culture" },
    clientDetail: {
      quickLinks: [
        { label: "提案資料", path: "documents" },
        { label: "提案優先度", path: "matching" },
        { label: "商談進捗", path: "pipeline" },
        { label: "売上見込み", path: "revenue" },
      ],
    },
    candidateDetail: {
      tabBasic: "基本情報",
      tabDocs: "提案資料",
      tabHistory: "商談・案件履歴",
      tabAi: "AI 分析",
      profileCardTitle: "リード情報",
      docsCardTitle: "提案・法務チェック（デモ）",
      docsPrimaryLabel: "社内リードID",
      docsSecondaryLabel: "提案・見積ステータス",
      docsExpiryLabel: "次回フォロー期限（デモ）",
      docsOcrNote:
        "見積・注文書の OCR は「提案資料管理」とダッシュボード右下 FAB から（デモ）。",
      historyCardTitle: "商談・案件履歴（デモ）",
      historyPlaceholder:
        "本番では商談アクティビティを時系列表示。デモではメイン案件の予定のみ表示します。",
      plannedAssignmentSalaryLabel: "受注目標（想定粗利／月）",
      aiCardTitle: "AI 提案示唆",
      aiEmptyAssignment:
        "メイン商談の紐付けが未設定です。商談別の優先度は次のリンクから確認できます。",
      aiMatchingLinkLabel: "提案優先度を見る",
      aiFooterNote:
        "メール要約・競合ウォッチは本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: false,
    },
  },
  logistics: {
    candidates: {
      pageSubtitle:
        "配属・配車・入構書類の進捗を追跡。シフトと書類の両面でボトルネックを表示。",
      defaultTab: "list",
      sheetOrder: "statusFirst",
    },
    documents: {
      pageSubtitle: "作業・入構書類のステータスと免許証等の OCR デモ",
      kpiComplete: 10,
      kpiReview: 4,
      ocrButtonLabel: "免許・作業票 OCR（デモ）",
      sheetTitle: "作業資格の抽出",
      ocrSampleName: "サンプル: フォークリフト技能講習修了証",
      ocrSampleLines: [
        "氏名: 鈴木 次郎",
        "種別: フォークリフト",
        "有効期限: 2027-08-31",
      ],
    },
    matching: {
      emptyState: "配送案件に紐づく配置候補がまだありません（デモ）",
    },
    operations: {
      csvHint: "配車実績 CSV は次期取込（デモ）",
      kpiTiles: [
        { label: "本日の便", value: "48", sub: "本（ダミー）" },
        { label: "未充足枠", value: "連動", sub: "KPI" },
        { label: "遅延リスク", value: "3", sub: "便" },
        { label: "入構書類 NG", value: "連動", sub: "書類" },
      ],
      timeline: [
        { title: "東エリア — 午前便ドライバー差し替え", time: "今日 5:30", badge: "要対応" },
        { title: "倉庫 B — 入出庫スキャン不整合", time: "昨日", badge: "調査中" },
        { title: "車検期限アラート一斉送信", time: "明日", badge: "自動" },
      ],
    },
    knowledge: {
      pageSubtitle: "倉庫マニュアル・荷扱い注意を RAG で参照する想定（デモは静的）",
      faqs: [
        { q: "危険物 B 類の積載ルールは？", a: "車両区分と混載禁止表をナレッジに保持する想定。" },
        { q: "配送遅延の顧客向け定型文は？", a: "原因コード別にテンプレを選択。" },
        { q: "アルコールチェック記録の保存期間は？", a: "社内規程に従い 3 年保管など（デモ文）。" },
      ],
      chatSeeds: ["危険物の積載ルールは？", "遅延の顧客向けメールを出して"],
      staticReply:
        "デモ応答: 該当マニュアルは「作業書類」テンプレ集にリンクする想定です。",
    },
    home: {
      matchingMobileSubtitle: "案件別の配置候補",
      matchingDesktopTeaser: "配送案件ごとに、スキルとシフトが合う作業員候補を表示します。",
      matchingDesktopReason: "「冷凍便は衛生講習済みを優先」— オペルール例（デモ）",
      documentsMobileSubtitle: "作業・入構書類",
    },
    clients: { listCardEmphasis: "openSlots" },
    clientDetail: {
      quickLinks: [
        { label: "作業書類", path: "documents" },
        { label: "配置最適化", path: "matching" },
        { label: "配車進捗", path: "pipeline" },
      ],
    },
    candidateDetail: {
      tabBasic: "基本情報",
      tabDocs: "作業・免許書類",
      tabHistory: "配車・稼働履歴",
      tabAi: "AI 分析",
      profileCardTitle: "作業員プロフィール",
      docsCardTitle: "免許・作業票（デモ）",
      docsPrimaryLabel: "免許・資格番号（デモ）",
      docsSecondaryLabel: "配車・入構ステータス",
      docsExpiryLabel: "免許・点検期限",
      docsOcrNote:
        "ドライバー証票の OCR は「作業書類」とダッシュボード右下 FAB から（デモ）。",
      historyCardTitle: "配車・稼働履歴（デモ）",
      historyPlaceholder:
        "本番では便・倉庫別の実績を表示。デモでは次便の予定のみ表示します。",
      plannedAssignmentSalaryLabel: "便単価（想定）",
      aiCardTitle: "AI 配置・配車示唆",
      aiEmptyAssignment:
        "担当便・案件が未設定です。案件別の候補は次のリンクから確認できます。",
      aiMatchingLinkLabel: "配置最適化を見る",
      aiFooterNote:
        "遅延予測・荷量予測は本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: true,
    },
  },
  education: {
    candidates: {
      pageSubtitle:
        "受講者の進捗と提出物ステータスを一覧化。到達度と提出不備を追うデモです。",
      defaultTab: "list",
      sheetOrder: "alertFirst",
    },
    documents: {
      pageSubtitle: "提出物・教材 PDF のレビュー状況とスキャン検証デモ",
      kpiComplete: 20,
      kpiReview: 1,
      ocrButtonLabel: "提出物スキャン OCR（デモ）",
      sheetTitle: "提出物の抽出",
      ocrSampleName: "サンプル: 課題レポート表紙",
      ocrSampleLines: [
        "受講者: 田中 花子",
        "講座: データ分析基礎",
        "提出日: 2026-03-30",
      ],
    },
    matching: {
      emptyState: "講座案件に紐づく受講提案がまだありません（デモ）",
    },
    operations: {
      csvHint: "LMS 受講ログ CSV は次期（デモ）",
      kpiTiles: [
        { label: "受講中", value: "312", sub: "名（ダミー）" },
        { label: "未フォロー", value: "連動", sub: "KPI" },
        { label: "提出期限 48h 以内", value: "9", sub: "件" },
        { label: "修了率（今月）", value: "87", sub: "%（ダミー）" },
      ],
      timeline: [
        { title: "Python 入門 — 第3回課題の一斉リマインド", time: "今日 18:00", badge: "自動" },
        { title: "キャリア講座 — 面談スロット公開", time: "昨日", badge: "完了" },
        { title: "教材 PDF v2 の差し替え", time: "来週", badge: "予定" },
      ],
    },
    knowledge: {
      pageSubtitle: "FAQ・過去 Q&A を RAG で検索する想定（デモは静的）",
      faqs: [
        { q: "再受講の割引ルールは？", a: "同一講座は 12 ヶ月以内 1 回までなど（デモ文）。" },
        { q: "提出遅延のペナルティは？", a: "講座ポリシーに沿って自動メールを送る想定。" },
        { q: "法人契約の一括請求は？", a: "部門コード別に集計するフローを想定。" },
      ],
      chatSeeds: ["再受講の割引は？", "提出遅延のポリシーは？"],
      staticReply:
        "デモ応答: 該当ポリシーは「提出書類」画面のガイドにまとめる想定です。",
    },
    home: {
      matchingMobileSubtitle: "講座別の受講提案",
      matchingDesktopTeaser: "講座案件ごとに、到達度の高い受講者候補とフォロー理由を表示します。",
      matchingDesktopReason: "「脱落リスク高にはメンター割当を推奨」— 学習分析例（デモ）",
      documentsMobileSubtitle: "提出・教材",
    },
    clients: { listCardEmphasis: "culture" },
    clientDetail: {
      quickLinks: [
        { label: "提出書類", path: "documents" },
        { label: "受講提案", path: "matching" },
        { label: "受講進捗", path: "pipeline" },
      ],
    },
    candidateDetail: {
      tabBasic: "基本情報",
      tabDocs: "提出物・教材",
      tabHistory: "受講・評価履歴",
      tabAi: "AI 分析",
      profileCardTitle: "受講者プロフィール",
      docsCardTitle: "提出・進捗（デモ）",
      docsPrimaryLabel: "受講者ID（デモ）",
      docsSecondaryLabel: "課題・修了ステータス",
      docsExpiryLabel: "提出期限（デモ）",
      docsOcrNote:
        "課題レポートの OCR は「提出書類」とダッシュボード右下 FAB から（デモ）。",
      historyCardTitle: "受講・評価履歴（デモ）",
      historyPlaceholder:
        "本番では受講ログ・テスト結果を表示。デモでは受講中講座の予定のみ表示します。",
      plannedAssignmentSalaryLabel: "受講料（想定）",
      aiCardTitle: "AI 学習示唆",
      aiEmptyAssignment:
        "推奨講座が未設定です。講座別の提案は次のリンクから確認できます。",
      aiMatchingLinkLabel: "受講提案を見る",
      aiFooterNote:
        "学習脱落予測・教材推薦は本番 AI 連携で拡張予定（デモは静的テキスト）。",
      showJlptBadge: true,
    },
  },
};

export function getIndustryPageHints(
  key: EnabledIndustryKey
): IndustryPageHints {
  return hints[key];
}

export function quickLinkHref(
  path: QuickLinkPath,
  industry: EnabledIndustryKey
): string {
  const base =
    path === "pipeline"
      ? "/candidates?view=pipeline"
      : path === "documents"
        ? "/documents"
        : path === "matching"
          ? "/matching"
          : path === "revenue"
            ? "/revenue"
            : "/candidates";
  return withIndustryQuery(base, industry);
}
