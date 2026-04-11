import type { DemoRole } from "@/lib/demo-role";

export type GuideDemoMedia = {
  kind: "video" | "image";
  src: string;
  poster?: string;
  caption?: string;
};

export type StaffingGuideStep = {
  id: string;
  path: string;
  role: DemoRole;
  title: string;
  instruction: string;
  note: string;
  value: string;
  durationMs: number;
  /** `data-guide-target` と一致させる（スポットライト用） */
  highlightTarget?: string;
  /** スマホ向けPCレイアウトの参照（動画または画像） */
  demoMedia?: GuideDemoMedia;
};

/**
 * 低リテラシー層向けの案内文ガイドライン:
 * - 1文を短く、操作語は固定する
 * - 専門語は避け、何が分かるかを明示する
 * - 補足は「安心して操作できる説明」を優先する
 */
const PC_DEMO_PLACEHOLDER = "/guide/placeholder.svg";

export const STAFFING_GUIDE_STEPS: StaffingGuideStep[] = [
  {
    id: "dashboard",
    path: "/",
    role: "admin",
    title: "ホーム画面を見ましょう",
    instruction: "まず、全体の数字を見てください。",
    note: "上にあるタブを押すと、くわしい画面へ進めます。",
    value: "今日の状況を1画面でつかめます。",
    durationMs: 9000,
    highlightTarget: "guide-nav-home",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PCでは横長のダッシュで一覧性が高まります（イメージ）",
    },
  },
  {
    id: "candidates",
    path: "/candidates",
    role: "admin",
    title: "候補者を確認します",
    instruction: "次に、候補者の一覧を見てください。",
    note: "名前を押すと、詳細情報が開きます。",
    value: "誰を先に対応するか判断しやすくなります。",
    durationMs: 9000,
    highlightTarget: "guide-nav-candidates",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・候補者一覧の見え方（収録予定）",
    },
  },
  {
    id: "clients",
    path: "/clients",
    role: "admin",
    title: "案件を確認します",
    instruction: "この画面で、案件の空き状況を見ます。",
    note: "案件を押すと、必要人数や条件を確認できます。",
    value: "欠員のある案件をすぐ見つけられます。",
    durationMs: 9000,
    highlightTarget: "guide-nav-clients",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・案件一覧の見え方（収録予定）",
    },
  },
  {
    id: "matching",
    path: "/matching",
    role: "admin",
    title: "提案内容を確認します",
    instruction: "ここでは、おすすめ候補を確認します。",
    note: "理由表示があるので、説明しやすくなります。",
    value: "提案の根拠を共有しやすくなります。",
    durationMs: 9000,
    highlightTarget: "guide-nav-matching",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・マッチング画面（収録予定）",
    },
  },
  {
    id: "documents",
    path: "/documents",
    role: "admin",
    title: "書類の進み具合を見ます",
    instruction: "書類の不足や期限を確認してください。",
    note: "不備がある項目から順に対応すると安心です。",
    value: "書類漏れによる遅れを減らせます。",
    durationMs: 8500,
    highlightTarget: "guide-nav-documents",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・書類管理（収録予定）",
    },
  },
  {
    id: "passport-ocr",
    path: "/feature-demos/passport-ocr",
    role: "admin",
    title: "OCRの体験です",
    instruction: "画像から文字を読み取る流れを見てください。",
    note: "実運用前のデモですが、作業短縮のイメージがつかめます。",
    value: "手入力の負担を減らす方向性を確認できます。",
    durationMs: 8500,
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・OCRデモ画面（収録予定）",
    },
  },
  {
    id: "messages",
    path: "/messages",
    role: "admin",
    title: "連絡画面を見ます",
    instruction: "この画面で、やり取りを確認します。",
    note: "翻訳イメージのデモもあり、多言語対応の説明に使えます。",
    value: "連絡ミスを減らす運用につなげられます。",
    durationMs: 9000,
    highlightTarget: "guide-messages",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・メッセージ画面（収録予定）",
    },
  },
  {
    id: "operations",
    path: "/operations",
    role: "admin",
    title: "実務メニューを見ます",
    instruction: "毎日の業務で使う入口を確認してください。",
    note: "迷ったらこの画面に戻ると次の作業を決めやすいです。",
    value: "日次オペレーションを整理できます。",
    durationMs: 8500,
    highlightTarget: "guide-nav-operations",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・実務メニュー（収録予定）",
    },
  },
  {
    id: "revenue",
    path: "/revenue",
    role: "admin",
    title: "収益の確認です",
    instruction: "見込みと実績の差を確認してください。",
    note: "数字は傾向を見るために使い、詳細は個別画面で確認します。",
    value: "経営判断に必要な変化を早めに捉えられます。",
    durationMs: 8500,
    highlightTarget: "guide-nav-revenue",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・収益ダッシュ（収録予定）",
    },
  },
  {
    id: "knowledge",
    path: "/knowledge",
    role: "admin",
    title: "ナレッジを確認します",
    instruction: "社内ルールやFAQの参照方法を見てください。",
    note: "困った時に調べる場所を先に知っておくと安心です。",
    value: "問い合わせ前に自己解決しやすくなります。",
    durationMs: 8500,
    highlightTarget: "guide-nav-knowledge",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・ナレッジ（収録予定）",
    },
  },
  {
    id: "worker-home",
    path: "/worker",
    role: "worker",
    title: "現場側の画面です",
    instruction: "ワーカー画面の見え方を確認してください。",
    note: "役割が変わると画面も変わることを把握しておきましょう。",
    value: "現場との会話がスムーズになります。",
    durationMs: 9000,
    highlightTarget: "guide-worker-home",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "PC版・ワーカー向け画面（収録予定）",
    },
  },
  {
    id: "wrap-up",
    path: "/",
    role: "admin",
    title: "ガイドはここまでです",
    instruction: "必要な画面から、もう一度操作してみましょう。",
    note: "次へ進むと、手動で好きな画面を試せます。",
    value: "基本の流れを短時間で復習できます。",
    durationMs: 8000,
    highlightTarget: "guide-nav-home",
    demoMedia: {
      kind: "image",
      src: PC_DEMO_PLACEHOLDER,
      caption: "ホームに戻り、自由に操作できます",
    },
  },
];

export const STAFFING_GUIDE_TOTAL_SECONDS = Math.round(
  STAFFING_GUIDE_STEPS.reduce((sum, step) => sum + step.durationMs, 0) / 1000
);
