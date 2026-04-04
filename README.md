# 業務ダッシュボード テンプレート＋参考デモ（派遣コックピット）

GitHub で **Template repository** にすると、「Use this template」から新規リポジトリを作り、**丸ごと複製 → 不要ページ削除・文言差し替え**で別デモを量産しやすくなります。

1. GitHub 上で本リポジトリを開く → **Settings** → **General** → 「**Template repository**」にチェック → Save  
2. トップの **Use this template** → **Create a new repository** でコピーを作成  
3. ローカルで `git clone` し、[`lib/app-template-config.ts`](lib/app-template-config.ts) からプロダクト名・ナビ・ダッシュ設定を変更  

参考実装として **派遣業向け営業デモ**（架空データ）が同梱されています。

---

## 収益・LTV 画面だけ別プロジェクトに取り込むとき（ファイルリスト）

`/revenue` と同じ構成を最小で持っていく場合の目安です。パスは本リポジトリからの**相対パス**です。

| 必須 | ファイル |
|------|----------|
| ✓ | [`app/revenue/page.tsx`](app/revenue/page.tsx) |
| ✓ | [`components/revenue-charts.tsx`](components/revenue-charts.tsx) |
| ✓ | [`components/client-only-chart.tsx`](components/client-only-chart.tsx) |
| ✓ | [`components/templates/layout-primitives.tsx`](components/templates/layout-primitives.tsx)（`TemplatePageStack` / `TemplatePageHeader` / `TemplateKpiGrid` / `TemplateTwoColumnGrid`） |
| ✓ | [`lib/revenue-demo.ts`](lib/revenue-demo.ts) |

| 依存（そのまま使う場合） | ファイル |
|--------------------------|----------|
| ✓ | [`lib/demo-data.ts`](lib/demo-data.ts) の **`clients`**・**`getCandidateById`**・**`monthlyRevenueTrend`**（加重継続率・返金テーブル名寄せ・月次トレンド用） |

| UI 基盤（shadcn 相当） | ファイル |
|------------------------|----------|
| ✓ | [`components/ui/card.tsx`](components/ui/card.tsx)、[`components/ui/badge.tsx`](components/ui/badge.tsx) |
| ✓ | [`lib/utils.ts`](lib/utils.ts)（`cn`） |
| ✓ | [`app/globals.css`](app/globals.css) の CSS 変数（`--primary` 等） |

**npm 依存:** `recharts`（[`package.json`](package.json) を参照）

**注意:** `revenue-demo.ts` は `demo-data` に依存します。別ドメインのデモでは **`revenue-demo.ts` を書き換え**てスタブ化するか、同等の関数だけ残すと切り離せます。`tsconfig.json` の `paths`（`@/*`）も取り込み先に合わせてください。

---

# 派遣コックピット（営業デモ）

Next.js 静的デモ — Supabase / 実 API なしでブラウザだけで動作します。

## 起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## ビルド

```bash
npm run build
npm start
```

## テンプレートとしての差し替え

再利用・別デモ量産時の主な入口:

| 用途 | ファイル |
|------|-----------|
| プロダクト名・メタデータ・ヘッダーナビ・下部ナビ・FAB/メッセージ表示 | [`lib/app-template-config.ts`](lib/app-template-config.ts) |
| ナビ用 Lucide アイコンの対応表 | [`components/template-nav-icons.tsx`](components/template-nav-icons.tsx) |
| ページの縦スタック・KPI 4列・2列グリッド・見出し | [`components/templates/layout-primitives.tsx`](components/templates/layout-primitives.tsx) |
| トップダッシュの **3列/4列**・**拡張カードの ON/OFF** | `appTemplateConfig.dashboard` 同上 |

新しいアイコン名をナビに使う場合は、`TemplateNavIconName` と `templateNavIcons` の両方に追加してください。

## データ

- 型定義: [`data/types.ts`](data/types.ts)
- シード（8 社・20 名）: `lib/demo-data.ts`
- メッセージ（翻訳デモ）: `lib/demo-messages.ts`  
  - 50 パターンに増やす場合は `demoMessages` 配列へオブジェクトを追記してください（`返答demo.md` を手で転記するのが確実です）。

## 営業デモの推しシナリオ

1. **ダッシュボード俯瞰** — トップの 3×2＋拡張枠で数値と「AI」バッジを確認 → 各カードから詳細へ。
2. **マッチング** — 「マッチング」→ 丸福惣菜など任意クライアントの「AI おすすめ候補」とパーセント理由を見せる。Nuwan Kumara は丸福と高スコア想定。
3. **書類・OCR** — 「書類」または右下 FAB（スマホ表示）で OCR 擬似フロー。Dhammika（書類不備）を候補者詳細で赤表示。
4. **メッセージ翻訳** — `/messages` でシンハラ語と「AI 翻訳を表示」トグル。要注意バッジをアピール。

## Vercel デプロイ

Next.js は **このフォルダがアプリのルート** です（`package.json` と `app/` が同じ階層）。

### プロジェクト設定（ダッシュボード）

| 項目 | 推奨値 |
|------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | リポジトリのルートに `package.json` があるなら **空** または `.`。親フォルダがリポジトリで、このプロジェクトがサブフォルダなら **そのフォルダ名**（例: `haken_dash`） |
| **Build Command** | 空欄（デフォルト）または `npm run build` |
| **Output Directory** | **空欄のまま**（`out` や `dist` を入れない。Next.js は Vercel が出力先を管理します） |
| **Install Command** | 空欄または `npm install` |
| **Node.js Version** | 20.x 以上（`package.json` の `engines` 参照） |

環境変数はこのデモでは不要です。ルートに `vercel.json` があり `framework: nextjs` を指定しています。

### `404: NOT_FOUND`（Vercel の白いエラー画面）のとき

1. **Root Directory** が古い `web` などになっていないか確認し、正しいフォルダに直す。
2. **Output Directory** に手動で値が入っていたら削除する。
3. 表示している URL が **古いプレビュー** の場合、ダッシュボードの **Deployments** から **最新の Ready** デプロイを開くか、本番ドメインを使う。
4. デプロイの **Build Logs** で `npm run build` が成功しているか確認する（失敗するとページが出ません）。

リポジトリを直したあとは **Redeploy**（「Redeploy」→ キャッシュの有無はどちらでも可）を実行してください。
