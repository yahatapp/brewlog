# 技術スタック選定

このドキュメントでは、Coffee Profile LIFF Apの技術スタックに関する決定事項を記録します。

## アーキテクチャ概要

LINE Front-end Framework (LIFF) をフロントエンドとし、Cloudflare Workers (Hono) と Supabase を組み合わせた軽量な構成。
個人・夫婦利用を想定し、審査不要なLIFFアプリとして構築する。

## フロントエンド

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Base UI Edition)
  - 従来の Radix UI ではなく、最新の shadcn/ui でサポートされた **Base UI** をプリミティブとして採用。
  - Render Props パターンによる高いカスタマイズ性とアクセシビリティを両立。
- **LINE Integration:** @line/liff (LIFF SDK)
- **API Client:** Hono RPC (Type-safe client)

## バックエンド / インフラ

- **Framework:** Hono
- **Runtime:** Cloudflare Pages Functions
- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM (Cloudflare Workers / Pages に最適化)

## プロジェクト構造（予定）

- `src/`: フロントエンド (React)
- `functions/api/[[route]].ts`: バックエンド (Hono)
- `schema/`: データベース定義 (Drizzle ORM)

## データベース / 認証

- **BaaS:** Supabase
  - **Database:** PostgreSQL
  - **Authentication:** Supabase Auth + LIFF (IDトークン検証による連携)
  - **Storage:** Supabase Storage (コーヒー豆の画像保存用)

## 開発ツール

- **Package Manager:** npm (または pnpm / yarn)
