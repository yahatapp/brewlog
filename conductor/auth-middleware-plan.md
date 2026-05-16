# 認証ミドルウェアの実装計画（署名検証方式）

## 目的

`jose` ライブラリを使用して、LINE LIFF の IDトークンを Cloudflare Workers（エッジ）上で高速かつ安全に検証する Hono ミドルウェアを実装し、同時に Allowlist による認可（アクセス制限）を設ける。

## 対象ファイル

1. `.env.example` (環境変数の定義追加)
2. `src/api/middleware/auth.ts` (新規作成: ミドルウェア本体)
3. `src/api/index.ts` (ミドルウェアの組み込みと型定義の更新)

## 実施手順

### 1. 環境変数の追加

`.env.example` に、バックエンドでの検証に必要な以下の環境変数を追加します。

- `LINE_CHANNEL_ID`: トークンの `aud` (audience) 検証に使用する LINE チャネル ID。
- `ALLOWED_LINE_USER_IDS`: アクセスを許可する LINE ユーザーの ID (`sub`) のカンマ区切りリスト。

### 2. ミドルウェアの実装 (`src/api/middleware/auth.ts`)

- `hono/factory` から `createMiddleware` を使用して型安全なミドルウェアを作成します。
- `jose` ライブラリの `createRemoteJWKSet` と `jwtVerify` を用いて、`https://api.line.me/oauth2/v2.1/certs` を取得先とする署名検証を実装します。
- 検証要件:
  - `iss` が `https://access.line.me` であること。
  - `aud` が環境変数 `LINE_CHANNEL_ID` と一致すること。
  - `exp`（有効期限）のチェック（`jose` が自動的に行います）。
- 認可チェック: トークンから取り出した `sub` が `ALLOWED_LINE_USER_IDS` に含まれているかを確認し、含まれていなければ 403 Forbidden を返します。
- `c.set('lineUserId', sub)` として後続のハンドラにユーザーIDを渡します。

### 3. APIエントリーポイントへの適用 (`src/api/index.ts`)

- 定義したミドルウェアをインポートし、`app.use('/*', authMiddleware)` のように全体に適用します（必要に応じて公開エンドポイントは除外）。
- Hono のジェネリクス (`<{ Bindings, Variables }>`) に新しい環境変数と `lineUserId` の型定義を追加し、`c.get('lineUserId')` が型安全に利用できるようにします。

## 懸念事項・確認事項

- 開発時のテストを容易にするために、ダミーのトークンをバイパスするフラグ（例えば `NODE_ENV === 'development'` かつ特定のヘッダーがある場合など）を入れるかどうかは今後の検討事項としますが、今回は本番相当の厳密なロジックを実装します。
