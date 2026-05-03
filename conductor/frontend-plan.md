# Frontend Implementation Plan: Coffee Profile LIFF App

## 1. Objective

LINE LIFF上で動作する、個人用のコーヒー抽出記録アプリ（Coffee Profile）のフロントエンドを構築する。スマホでの閲覧・操作に最適化し、シンプルで使いやすいUIを提供する。

## 2. Key Requirements & Constraints (MVP)

- **ターゲット**: 個人利用（※初期フェーズでは夫婦間連携・household機能は見送り、個人用アプリとして構築）。
- **機能スコープ**: 豆の登録と抽出記録のみ（残量・在庫管理はスコープ外）。
- **ナビゲーション**: スマホアプリライクなボトムナビゲーションを採用。
- **デザインテーマ**: コーヒーらしいブラウン系を基調とし、主張しすぎないシンプルなモダンデザイン。
- **技術スタック**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui (Base UI Edition), @line/liff, Hono RPC.

## 3. Screen Architecture

主要な画面とルーティング設計。

- **`/'` (Home)**
  - 最近の抽出記録のタイムライン（直近数件）。
  - 「抽出を記録する」へのクイックアクセスボタン。
- **`/beans` (Beans List)**
  - 登録済みのコーヒー豆一覧（カード形式）。
  - 新規豆登録ボタン。
- **`/beans/new` (Add Bean)**
  - コーヒー豆の登録フォーム（名前、産地、焙煎度、購入日など）。
- **`/beans/:id` (Bean Detail)**
  - 豆の詳細情報と、その豆を使った抽出記録の履歴。
- **`/logs` (Brew Logs)**
  - すべての抽出記録の履歴一覧。
- **`/logs/new` (Add Log)**
  - 抽出記録の登録フォーム（豆の選択、器具、挽き目、湯温、豆量、注水量、評価、メモ）。
- **`/settings` (Settings / Profile)**
  - ユーザー情報（LIFFから取得したプロフィール）の表示。

## 4. UI/UX & Design Strategy

### Color Palette (Tailwind)

`tailwind.config.ts` にカスタムカラーを設定する。

- **Primary**: 落ち着いたコーヒーブラウン（例: `#6F4E37` や `#5C4033`）。
- **Background**: 真っ白ではなく、わずかに温かみのあるオフホワイトや薄いベージュ（例: `#FAFAFA` や `#F5F5DC` の彩度を落としたもの）。
- **Text**: ダークグレー〜黒に近いブラウンで視認性を確保。

### Navigation

- 画面下部に固定の `BottomNavigation` コンポーネントを配置。
  - アイコン構成: [Home] [Beans] [Logs] [Settings]
- フォーム入力画面（`/beans/new`, `/logs/new`）ではボトムナビゲーションを隠し、ヘッダーに「戻る」ボタンを配置して入力に集中させる。

### Components (shadcn/ui - Base UI)

- `Button`, `Input`, `Select`, `Slider` (評価や焙煎度用), `Card`, `Form` などをBase UIプリミティブを利用して実装。

## 5. State Management & Data Fetching

- **API Client**: `hono/client` (hc) を使用し、バックエンドと型安全に通信。
- **Data Fetching**: SWR または React Query を導入し、キャッシュ管理とローディング状態のUI（スケルトンスクリーンやスピナー）を実装する（LIFFの初期化待ちも含む）。
- **Auth State**: LIFF SDKの初期化状態と、取得したIDトークン・プロフィール情報をContextで管理。

## 6. Implementation Phases

- **Phase 1: Setup & Theming**
  - Tailwindのカラーテーマ設定。
  - 基本レイアウト（Header, Bottom Navigation）の実装。
  - LIFF SDKの初期化ロジックの組み込み。
- **Phase 2: API Client & UI Primitives**
  - Hono RPCクライアントの設定。
  - 共通UIコンポーネント（ボタン、入力フォーム、カード）の作成。
- **Phase 3: Beans Feature**
  - 豆一覧画面、豆詳細画面、豆登録フォームの実装。
- **Phase 4: Brew Log Feature**
  - 抽出記録一覧画面、抽出記録フォームの実装。
- **Phase 5: Home & Settings**
  - ホーム画面のダッシュボード化。
  - 設定画面の実装。動作確認とUIの微調整。
