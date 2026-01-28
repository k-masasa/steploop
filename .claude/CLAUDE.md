# Claude 開発ガイドライン

## 概要

- 基本的にはよく考えて ultrathink で処理すること。

## 技術スタック

- **Next.js** (App Router)
- **TypeScript**
- **Prisma** + **Turso** (SQLite 互換)
- **Tailwind CSS**
- **shadcn/ui**
- 認証: **NextAuth.js** (Google ログイン)
- デプロイ: **Vercel** (予定)

## 実装完了時の必須チェック

実装やコード変更を完了したら、**必ず**以下のコマンドを実行して問題がないことを確認すること：

### 1. TypeScript タイプチェック

```bash
npm run type-check
```

### 2. ビルドチェック

```bash
npm run build
```

### 3. Lint チェック

```bash
npm run lint
```

### 注意事項

- **npm 系のコマンド実行時は確認不要**: `npm run *` コマンドを実行する際、ユーザーへの確認は不要。自動的に実行して問題ない。

## チェックが失敗した場合

- エラーメッセージを確認し、該当箇所を修正
- 今回の変更に関連するエラーは必ず修正
- 既存のエラー (変更前から存在) は修正不要だが、新たに追加しないこと

## コミットメッセージのルール

このプロジェクトでは **Conventional Commits** を採用しています。

### フォーマット

ブランチ名に応じて、以下のフォーマットを使用します：

#### feature/数字, bugfix/数字, hotfix/数字 などのブランチ

```
#<issue番号> <type>: <subject>

[optional body]

[optional footer]
```

例: `feature/123` ブランチなら `#123 feat: 新機能追加`

#### main, develop などのブランチ

```
<type>: <subject>

[optional body]

[optional footer]
```

Issue 番号なしで OK。ドキュメント更新や緊急修正など気軽にコミット可能。

### 基本ルール

1. **ブランチ名に数字がある場合は Issue 番号を先頭につける** (`feature/123` → `#123`)
2. **main/develop ブランチでは Issue 番号は不要**
3. **Conventional Commits の type を使う**
4. **subject は簡潔に (50 文字以内推奨)**
5. **日本語で OK**

### Type 一覧

| Type       | 説明                                                      | 使用例                                                 |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------ |
| `feat`     | 新機能追加                                                | `#9 feat: ユーザー登録機能を追加`                      |
| `fix`      | バグ修正                                                  | `#9 fix: ログイン時のバリデーションエラーを修正`       |
| `docs`     | ドキュメントのみの変更                                    | `#9 docs: README にセットアップ手順を追加`             |
| `style`    | コードの意味に影響しない変更 (フォーマット、セミコロン等) | `#9 style: Prettier でコードフォーマットを統一`        |
| `refactor` | リファクタリング (機能追加でもバグ修正でもない)           | `#9 refactor: 認証ロジックをカスタムフックに分離`      |
| `perf`     | パフォーマンス改善                                        | `#9 perf: 画像の遅延読み込みを実装`                    |
| `test`     | テストの追加・修正                                        | `#9 test: ユーザー登録の E2E テストを追加`             |
| `chore`    | ビルドプロセスやツールの変更                              | `#9 chore: ESLint 設定を更新`                          |
| `ci`       | CI 設定ファイルやスクリプトの変更                         | `#9 ci: GitHub Actions に Prisma 生成を追加`           |
| `build`    | ビルドシステムや外部依存関係の変更                        | `#9 build: Next.js 16 にアップグレード`                |
| `revert`   | 以前のコミットを取り消す                                  | `#9 revert: "feat: ユーザー登録機能を追加" を取り消し` |

### Scope (オプション)

特定の範囲を明示したい場合に使用：

```bash
#9 feat(auth): ログイン機能を追加
#9 fix(api): トランザクション取得のバグ修正
#9 docs(readme): セットアップ手順を更新
```

### 破壊的変更 (Breaking Changes)

後方互換性がない変更の場合は `!` を追加：

```bash
#9 feat!: API レスポンス形式を変更

BREAKING CHANGE: レスポンスがネストされた形式に変更されました
```

### コミット前の必須チェック

コミット前に以下のコマンドが**自動実行**されます (pre-commit hook)：

```bash
npm run format:check  # Prettierフォーマットチェック
npm run lint          # ESLintチェック
npm run type-check    # TypeScriptタイプチェック
```

これらは **GitHub Actions と完全に一致** しています。

### 注意事項

- **コミット前に手動でチェックを実行することを推奨**
  ```bash
  npm run format:check && npm run lint && npm run type-check
  ```
- pre-commit hook で失敗した場合、コミットは中止されます
- GitHub Actions でも同じチェックが走るため、ローカルで通らないものは CI でも必ず落ちます

### 良い例

**feature/9 ブランチの場合:**

```bash
#9 feat: 支払い予定一覧機能を追加
#9 fix: ダッシュボードの集計ロジックを修正
#9 refactor: API 型定義を統一
#9 chore: ESLint エラーを解消
#9 ci: GitHub Actions に Prisma 生成ステップを追加
#9 docs: 開発環境セットアップ手順を追加
```

**main ブランチの場合:**

```bash
docs: トラブルシューティングセクションを追加
fix: 本番環境でのビルドエラーを緊急修正
chore: 依存関係のセキュリティアップデート
```

### 悪い例

```bash
# feature/9 ブランチなのにIssue番号がない
fix: バグ修正                    # ❌ Issue番号がない

# typeがない
#9 修正                          # ❌ typeがない

# 具体性がない
#9 fix: めっちゃいろいろ直した    # ❌ 具体性がない

# mainブランチなのにIssue番号がついている（つけてもいいけど不要）
#9 docs: READMEを更新            # ⚠️ mainブランチではIssue番号不要
```

## トラブルシューティング

### 画面が 500 エラーになる、モジュールが見つからないエラー

**症状:**

```
Error: Cannot find module '../chunks/ssr/[turbopack]_runtime.js'
ENOENT: no such file or directory, open '.next/dev/routes-manifest.json'
```

**原因:**

`.next` のビルドキャッシュが壊れている、または古いキャッシュと新しいコードが混在している。

**対処法:**

```bash
rm -rf .next
npm run dev
```

## 日本語表記ルール

- 括弧は全角 `（）` ではなく半角 `()` を使用する
- 全角文字と半角文字の間には半角スペースを入れる
  - 良い例: `カテゴリー (収入 / 支出)`
  - 悪い例: `カテゴリー（収入/支出）`

## その他の注意事項

- 変更後は必ずブラウザで動作確認を行う
- 口調は呪術廻戦の伏黒甚爾っぽい感じでお願いします。
- 顔文字をよく使ってください。
- あまり Yes マンにならないでください。
- 肯定もいいけど反対意見もたまには欲しい。
- docs/claude/ 配下に YYYYMMDD.md のファイルを作成し、そのファイルに作業内容を記録しつつ作業すること。(セッションが切れた場合に以前の対応内容をすぐに見返せるように)
- 起動時は docs/claude/ 配下 YYYYMMDD.md のファイルを可能な限り参照し、直近で行っていた対応を理解すること。
- docs/user/ 配下にある YYYYMMDD.md のファイルは、ユーザー (私) が作業メモをするためのものである。
  - ユーザーが何をどこまで理解しているのか、コマンドラインでやり取りしていること以外で何を考えているのか等を知るため、時々参照してほしい
  - ただしユーザーはこのファイルに常に状況を記述し続けるとは限らない
