import type { DemoRole } from "@/lib/demo-role";

export type StorySlideTransition = "crossfade" | "fade";

/** 同一スライド内の強調シーケンス（sum(durationMs) ≤ durationMs） */
export type StoryDemoBeat = {
  id: string;
  durationMs: number;
};

export type StorySlide = {
  id: string;
  chapter: string;
  title: string;
  message: string;
  supportingCopy: string;
  durationMs: number;
  previewPath?: string;
  previewRole?: DemoRole;
  transition: StorySlideTransition;
  ctaHint?: string;
  stageLabel?: string;
  demoBeats?: StoryDemoBeat[];
};

/**
 * previewPath は `withDemoQuery` で industry/role/storyEmbed が付与される。
 * 同一 `/` は `storyFocus` で見せ場を切り替える。
 * 第2章は台本順: マッチング → 書類（一覧）→ メッセージ → オペレーション。
 */
export const STAFFING_STORY_SLIDES: StorySlide[] = [
  {
    id: "intro-dashboard",
    chapter: "導入",
    title: "一つの画面から、仕事の流れが始まる",
    message:
      "派遣や人材紹介の現場で散らばりがちな情報を、まず一つの入口から見渡せます。",
    supportingCopy:
      "今日の優先事項、書類、連絡、候補者の流れを同じ画面で見られることが、このデモの出発点です。",
    durationMs: 12000,
    previewPath: "/?storyFocus=overview",
    transition: "crossfade",
    stageLabel: "ダッシュボード全景",
    demoBeats: [
      { id: "intro-dashboard__header", durationMs: 4000 },
      { id: "intro-dashboard__killers", durationMs: 8000 },
    ],
  },
  {
    id: "today-priorities",
    chapter: "第1章",
    title: "今日やることが、先に見える",
    message:
      "遅れそうなことや足りないことを、探し回らずに優先順で把握できます。",
    supportingCopy:
      "後追いではなく先回りで動けるので、担当者が人に向き合う時間をつくりやすくなります。",
    durationMs: 12000,
    previewPath: "/?storyFocus=priority",
    transition: "crossfade",
    ctaHint: "まずは、今日やることを見る",
    stageLabel: "優先事項の見える化",
    demoBeats: [
      { id: "today-priorities__killer-0", durationMs: 4000 },
      { id: "today-priorities__killer-1", durationMs: 4000 },
      { id: "today-priorities__killer-2", durationMs: 4000 },
    ],
  },
  {
    id: "document-risk",
    chapter: "第1章",
    title: "書類の抜けや遅れを、早く見つける",
    message:
      "どこで止まりやすいかを、まずタブと数字で把握し、そのまま対象者まで追える状態をつくります。",
    supportingCopy:
      "気づくのが早いほど、現場の安心と会社のリスク抑制につながります。",
    durationMs: 12000,
    previewPath: "/documents?scope=pre-entry&storyFocus=risk",
    transition: "crossfade",
    ctaHint: "次に、止まりやすい所を見る",
    stageLabel: "書類・手続きの見える化",
    demoBeats: [
      { id: "document-risk__tab", durationMs: 3500 },
      { id: "document-risk__alert-kpi", durationMs: 4000 },
      { id: "document-risk__blocked-list", durationMs: 4500 },
    ],
  },
  {
    id: "candidate-to-client",
    chapter: "第2章",
    title: "候補者から案件まで、判断材料がつながる",
    message:
      "誰を、どの案件に、どんな理由で進めるかを、同じ流れの中で見られます。",
    supportingCopy:
      "候補者、案件、提案理由が分断されないことで、説明しやすく納得感のある判断につながります。",
    durationMs: 12000,
    previewPath: "/matching",
    transition: "crossfade",
    ctaHint: "候補者と案件の関係を見る",
    stageLabel: "候補者と案件の接続",
    demoBeats: [
      { id: "candidate-to-client__ai-reason", durationMs: 6000 },
      { id: "candidate-to-client__candidate-panel", durationMs: 6000 },
    ],
  },
  {
    id: "document-connected",
    chapter: "第2章",
    title: "書類の状況も、一覧で追える",
    message:
      "入国後の更新や提出状況も、一覧の一行で進捗と不足を共有できます。",
    supportingCopy:
      "候補者の判断と、就労後の書類フォローを同じ運用の流れで説明しやすくなります。",
    durationMs: 12000,
    previewPath: "/documents?scope=post-entry&storyFocus=list",
    transition: "crossfade",
    ctaHint: "書類の流れを一覧で見る",
    stageLabel: "書類状況の共有",
    demoBeats: [
      { id: "document-connected__tab", durationMs: 3000 },
      { id: "document-connected__row-0", durationMs: 5000 },
      { id: "document-connected__status", durationMs: 4000 },
    ],
  },
  {
    id: "communication-history",
    chapter: "第2章",
    title: "連絡も履歴として残り、引き継ぎしやすい",
    message:
      "連絡内容、翻訳、未読や注意の印が同じカードに残るので、担当が変わっても状況を引き継ぎやすくなります。",
    supportingCopy:
      "言語の壁があっても、履歴として残せることが属人化を減らす土台になります。",
    durationMs: 12000,
    previewPath: "/messages",
    transition: "crossfade",
    ctaHint: "連絡の流れを見る",
    stageLabel: "履歴が残るコミュニケーション",
    demoBeats: [
      { id: "communication-history__thread", durationMs: 4000 },
      { id: "communication-history__translation-open", durationMs: 4000 },
      { id: "communication-history__meta", durationMs: 4000 },
    ],
  },
  {
    id: "company-operations",
    chapter: "第2章",
    title: "配属から定着まで、今日の運用判断を迷わない",
    message:
      "配属状況と定着フォローを切り替えながら、今日どこを見るべきかを同じ画面で判断できます。",
    supportingCopy:
      "担当者の勘だけに頼らず、次の行動先まで迷わずつながることが運用の強さになります。",
    durationMs: 12000,
    previewPath: "/operations?tag=deploy",
    transition: "crossfade",
    stageLabel: "日々の運用判断",
    demoBeats: [
      { id: "company-operations__deploy", durationMs: 4000 },
      { id: "company-operations__settle", durationMs: 4000 },
      { id: "company-operations__timeline", durationMs: 4000 },
    ],
  },
  {
    id: "learning-and-support",
    chapter: "第3章",
    title: "人に向き合う時間を、支援の質に変えていく",
    message:
      "学習タブの中で、日本語の進行と倫理の確認を続けられると、支援の質を日々積み上げやすくなります。",
    supportingCopy:
      "派遣元と受け入れ先の両方にとって、学習の継続が前向きな循環をつくる土台になります。",
    durationMs: 12000,
    previewPath: "/worker/learn",
    previewRole: "worker",
    transition: "crossfade",
    ctaHint: "支援の未来を見る",
    stageLabel: "学習と支援の未来",
    demoBeats: [
      { id: "learning-and-support__tab", durationMs: 3000 },
      { id: "learning-and-support__jp-module", durationMs: 5000 },
      { id: "learning-and-support__ethics-status", durationMs: 4000 },
    ],
  },
  {
    id: "closing-future",
    chapter: "締め",
    title: "業務を整えることが、より良い雇用につながる",
    message:
      "派遣コックピットは、作業を減らすためだけでなく、より良い人材支援と受け入れ環境を無理なく続ける土台です。",
    supportingCopy:
      "まずは御社の現場に合うか、一緒に見ていくところから始められます。",
    durationMs: 10000,
    previewPath: "/?storyFocus=closing",
    transition: "crossfade",
    ctaHint: "この先の可能性を見る",
    stageLabel: "未来への着地",
    demoBeats: [{ id: "closing-future__cta", durationMs: 10000 }],
  },
];

export const STAFFING_STORY_TOTAL_SECONDS = Math.round(
  STAFFING_STORY_SLIDES.reduce((sum, slide) => sum + slide.durationMs, 0) / 1000
);
