# 業種別計画 md 一覧

## 目的
このディレクトリには、各業種へ現在のデモ体験を横展開するための初版計画 md を置きます。  
共通ルールは次を参照してください。

- テンプレート: [`../industry-rollout-template.md`](../industry-rollout-template.md)
- 作成ガイド: [`../industry-rollout-playbook.md`](../industry-rollout-playbook.md)
- 基準サンプル: [`./staffing-reference.md`](./staffing-reference.md)

## 配置方針
- 1業種につき1ファイル
- 実装手順書ではなく、体験設計・文言設計・導線設計の合意文書として使う
- 各ファイルは「この業種で何を魅力に見せるか」から書き始める
- 各ファイルには必ず「`staffing` を変更しない前提」と「Cursor に渡す実装PLAN材料」を含める

## 推奨着手順
1. [`real-estate-plan.md`](./real-estate-plan.md)
2. [`construction-plan.md`](./construction-plan.md)
3. [`medical-plan.md`](./medical-plan.md)
4. [`professional-plan.md`](./professional-plan.md)
5. [`sales-plan.md`](./sales-plan.md)
6. [`logistics-plan.md`](./logistics-plan.md)
7. [`education-plan.md`](./education-plan.md)

## 各業種で最低限そろえるページ群
- ダッシュ
- 候補者/顧客一覧
- クライアント/案件一覧
- マッチング
- 書類/契約/申請
- 実務/運用
- ナレッジ/FAQ
- 必要に応じて候補者詳細・クライアント詳細・収益

## 技術デモ整理の前提
- OCR と PDF は「書類・契約・申請」系のストーリーに寄せる
- ナレッジAI は FAQ / ルール参照 / 社内支援に寄せる
- メッセージ（AI 翻訳）は 多言語対応・顧客対応・現場コミュニケーションに寄せる
- マッチング（AI 理由）は 提案理由・推奨理由・優先順位づけに寄せる

## 完了条件
- 各業種 md に体験コンセプトがある
- ページ別方針と次アクションが書かれている
- 技術デモの活用位置が書かれている
- 業種担当者 / Web担当 / UI/UX デザイナーの確認観点が明記されている

## この md 群の使い方
1. [`staffing-reference.md`](./staffing-reference.md) を読み、基準として守る範囲を確認する
2. 対象業種の md を読み、画面方針・導線・技術デモの意味づけを確認する
3. その md を Cursor に渡して、実装PLANを作成する
4. 実装PLANでは「対象業種のみ変更」「`staffing` 非変更」「対象ファイル」を明記させる
5. PLAN承認後に実装へ進む
