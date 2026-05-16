# Drizzle ORM実装計画 (Supabase + Cloudflare Workers)

## Objective

Drizzle ORM を用いて Supabase PostgreSQL のスキーマ管理・マイグレーション機能のセットアップを行い、Cloudflare Workers (Hono) から Supabase のコネクションプーラー経由でデータベースに接続する環境を構築します。

## Key Files & Context

- `db/schema.ts`: `docs/database-design.md` に基づいたデータベーススキーマ定義
- `drizzle.config.ts`: Drizzle Kit 用の設定ファイル (マイグレーションと生成用)
- `src/api/db.ts` (新規): Honoアプリ内でデータベース接続を行うためのクライアント定義
- `src/api/index.ts`: DBクライアントの組み込みおよび型定義の更新
- `.dev.vars` / `.env`: DB接続用の環境変数 (`DATABASE_URL`) の設定

## Implementation Steps

### 1. スキーマ定義 (`db/schema.ts` の作成)

`docs/database-design.md` の仕様に従い、以下のテーブルを定義します。

- `households`
- `profiles`
- `beans`
- `brew_logs`

### 2. Drizzle 設定 (`drizzle.config.ts` の作成)

Drizzle Kit がスキーマを読み込み、マイグレーションファイルを生成・適用するための設定を記述します。

```typescript
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 3. DBクライアントの作成 (`src/api/db.ts` の作成)

Cloudflare Workers 上で `postgres` ドライバを使用し、リクエストごとに環境変数からDB URLを取得してDrizzleクライアントを初期化するヘルパーを作成します。
※ Workersの制限を考慮し、プーラー経由での接続に最適化します。

### 4. Hono アプリへの組み込み (`src/api/index.ts` の修正)

Hono の `Bindings` に `DATABASE_URL` の型を追加し、リクエストコンテキスト (`c.env.DATABASE_URL`) からDBにアクセスできるようにします。テスト用にDBの稼働確認ができる簡素なエンドポイント（例: `/api/db-check`）を追加します。

### 5. デプロイおよびマイグレーション用スクリプトの整備

`package.json` には既に `"db:generate"` と `"db:migrate"` がありますが、これらのコマンドが適切に機能することを保証します。ローカル開発時は `.env` を読み込むための設定（例: `dotenv` CLI の活用等）が必要になる場合は調整します。

## Verification & Testing

1. **生成の確認**: `pnpm run db:generate` を実行し、`db/migrations` にSQLファイルが生成されることを確認します。
2. **マイグレーションの確認**: ローカルのSupabaseコンテナ（またはテスト環境）に対して `pnpm run db:migrate` を実行し、テーブルが作成されることを確認します。
3. **Workersでの接続確認**: `vp dev` (ローカルのWrangler環境) を起動し、DB確認用のエンドポイントにアクセスしてデータが正常に取得できるかをテストします。
