import type { DemoRole } from "@/lib/demo-role";

export type StorySlideTransition = "crossfade" | "fade";

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
};

export const STAFFING_STORY_SLIDES: StorySlide[] = [
  {
    id: "intro-dashboard",
    chapter: "導入",
    title: "一つの画面から、仕事の流れが始まる",
    message:
      "派遣や人材紹介の現場で散らばりがちな情報を、一つの流れで見られるダッシュボードです。",
    supportingCopy:
      "まずは細かい操作ではなく、会社全体の運用が整う未来をイメージしてもらうための入口です。",
    durationMs: 15000,
    previewPath: "/",
    transition: "crossfade",
    stageLabel: "ダッシュボード全景",
  },
  {
    id: "today-priorities",
    chapter: "第1章",
    title: "今日やることが、先に見える",
    message:
      "遅れそうなことや足りないことを、探し回らずに優先順で把握できます。",
    supportingCopy:
      "後追いではなく先回りで動けるので、担当者が人に向き合う時間をつくりやすくなります。",
    durationMs: 17000,
    previewPath: "/",
    transition: "crossfade",
    ctaHint: "まずは、今日やることを見る",
    stageLabel: "優先事項の見える化",
  },
  {
    id: "document-risk",
    chapter: "第1章",
    title: "書類の抜けや遅れを、早く見つける",
    message:
      "海外人材の採用で負担になりやすい書類や手続きも、一覧で追える状態をつくります。",
    supportingCopy:
      "詰まりが早く見えることで、現場の安心と会社のリスク抑制につながります。",
    durationMs: 14000,
    previewPath: "/documents",
    transition: "crossfade",
    ctaHint: "次に、止まりやすい所を見る",
    stageLabel: "書類・手続きの見える化",
  },
  {
    id: "candidate-to-client",
    chapter: "第2章",
    title: "候補者から案件まで、判断材料がつながる",
    message:
      "誰を、どの案件に、どんな理由で進めるかを、同じ流れの中で見られます。",
    supportingCopy:
      "候補者、案件、提案理由が分断されないことで、説明しやすく納得感のある判断につながります。",
    durationMs: 15000,
    previewPath: "/matching",
    transition: "crossfade",
    ctaHint: "候補者と案件の関係を見る",
    stageLabel: "候補者と案件の接続",
  },
  {
    id: "communication-history",
    chapter: "第2章",
    title: "連絡も履歴として残り、引き継ぎしやすい",
    message:
      "書類や連絡が履歴として残るので、担当者個人の頭の中だけに運用を置かずに済みます。",
    supportingCopy:
      "属人的だった仕事が、会社として回る仕事に変わっていくことが重要です。",
    durationMs: 15000,
    previewPath: "/messages",
    transition: "crossfade",
    ctaHint: "連絡の流れを見る",
    stageLabel: "履歴が残るコミュニケーション",
  },
  {
    id: "company-operations",
    chapter: "第2章",
    title: "担当者の頑張りではなく、会社として回る運用へ",
    message:
      "候補者、案件、書類、連絡が一本でつながることで、担当が変わっても回る土台をつくれます。",
    supportingCopy:
      "日々の業務が整理されることで、増え続ける負担を抑えながら運用の質を上げやすくなります。",
    durationMs: 15000,
    previewPath: "/operations",
    transition: "crossfade",
    stageLabel: "会社として回る運用",
  },
  {
    id: "learning-and-support",
    chapter: "第3章",
    title: "人に向き合う時間を、支援の質に変えていく",
    message:
      "日本語の学習や倫理の学習を続けやすい運用は、より良い人材支援とより良い受け入れ環境につながります。",
    supportingCopy:
      "派遣元と受け入れ先の両方にとって、前向きな循環をつくることがこの仕組みの価値です。",
    durationMs: 16000,
    previewPath: "/worker/learn",
    previewRole: "worker",
    transition: "crossfade",
    ctaHint: "支援の未来を見る",
    stageLabel: "学習と支援の未来",
  },
  {
    id: "closing-future",
    chapter: "締め",
    title: "業務を整えることが、より良い雇用につながる",
    message:
      "派遣コックピットは、作業を減らすためだけでなく、より良い人材支援と受け入れ環境を無理なく続ける土台です。",
    supportingCopy:
      "まずは御社の現場に合うか、一緒に見ていくところから始められます。",
    durationMs: 13000,
    previewPath: "/",
    transition: "crossfade",
    ctaHint: "この先の可能性を見る",
    stageLabel: "未来への着地",
  },
];

export const STAFFING_STORY_TOTAL_SECONDS = Math.round(
  STAFFING_STORY_SLIDES.reduce((sum, slide) => sum + slide.durationMs, 0) / 1000
);
