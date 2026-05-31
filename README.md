# Brewlog

A lightweight coffee brewing log application for personal/couple use, running as a LINE LIFF App.

## 🚀 技術スタック

- **Frontend:** React (Vite)
- **Backend:** Hono (Cloudflare Workers)
- **Database:** Supabase + Drizzle ORM
- **UI Framework:** shadcn/ui + Tailwind CSS
- **Authentication:** LINE LIFF ID Token Verification

## 🛠 開発準備

このプロジェクトでは、開発環境の管理に **Nix + direnv** を推奨しています。

1.  **リポジトリをクローン**
2.  **環境変数の設定**
    `.env.example` を参考に、以下のファイルを作成してください。
    - `.env.development`: フロントエンド用 (VITE_LIFF_ID等)
    - `.dev.vars`: バックエンド用 (DATABASE_URL, LINE_CHANNEL_ID等)
    - `.env`: データベース・マイグレーション用 (DATABASE_URL)
3.  **セットアップ**
    ```bash
    direnv allow  # Nix環境の有効化
    pnpm install  # 依存関係のインストール
    ```

## 💻 ローカル開発・デバッグ

LIFFアプリとしてローカルで動作確認を行うには、バックエンド、フロントエンド、およびトンネル（ngrok等）の起動が必要です。

### 1. バックエンド (API) の起動

Cloudflare Workersをローカルで起動します。

```bash
wrangler dev
```

デフォルトでは `http://localhost:8787` で起動します。

### 2. フロントエンドの起動

Viteデバッグサーバを起動します。

```bash
pnpm run dev
```

デフォルトでは `http://localhost:5173` で起動します。
`vite.config.ts` の設定により、`/api` へのリクエストはバックエンド (`localhost:8787`) にプロキシされます。

### 3. トンネルの起動 (ngrok)

LIFFはインターネットからアクセス可能なHTTPSエンドポイントを必要とするため、ngrok等でポート `5173` を公開します。

```bash
ngrok http 5173
```

起動後、発行されたURL（例: `https://xxxx.ngrok-free.dev`）をコピーします。

> [!IMPORTANT]
> `.env.development` の `VITE_ALLOWED_HOSTS` に、使用するngrokのホスト名（例: `xxxx.ngrok-free.dev`）を追加してください。複数のホストがある場合はカンマ区切りで指定できます。

### 4. LIFFの設定

[LINE Developers Console](https://developers.line.biz/console/) にログインし、該当するLIFFアプリの「エンドポイントURL」を、ngrokで発行されたURLに更新します。

これで、LINEアプリ内からローカルの開発環境にアクセスしてデバッグが可能になります。

## 🗄 データベース管理

Drizzle ORMを使用してスキーマを管理しています。

- **マイグレーションファイルの生成:** `pnpm run db:generate`
- **マイグレーションの適用:** `pnpm run db:migrate`

## 📦 その他のコマンド

- `vp check`: 構文チェック、フォーマット、型チェックを一括実行
- `vp check --fix`: 自動修正
- `vp build`: 本番用ビルド
- `pnpm run deploy`: 本番環境（Cloudflare Workers）へのデプロイ
