# データベース設計

このドキュメントでは、Drizzle ORM で実装するデータベーススキーマの設計について記述します。
ご夫婦でのデータ共有を実現するため、`household_id`（世帯/グループID）を軸にした設計を採用します。

## エンティティ関係

### 1. households (世帯/グループ)
ご夫婦を一つのグループとして管理するためのテーブル。
- `id`: uuid (Primary Key)
- `name`: text (例: "Our Coffee Home")
- `created_at`: timestamp

### 2. profiles (ユーザープロフィール)
LINEユーザーごとの情報を管理。
- `line_user_id`: text (Primary Key / LINEの sub)
- `household_id`: uuid (Foreign Key -> households.id)
- `display_name`: text
- `avatar_url`: text
- `created_at`: timestamp

### 3. beans (コーヒー豆)
共有されるコーヒー豆のデータ。`household_id` に紐づくため、夫婦で同じリストを共有。
- `id`: uuid (Primary Key)
- `household_id`: uuid (Foreign Key -> households.id)
- `name`: text (豆の名前)
- `origin`: text (産地)
- `roast_level`: integer (1:浅煎り 〜 5:深煎り 等)
- `purchase_date`: date (購入日)
- `image_url`: text (豆の画像パス)
- `is_archived`: boolean (使い切った豆を非表示にする用)
- `created_at`: timestamp

### 4. brew_logs (抽出記録)
いつ、誰が、どの豆をどう淹れたかの記録。
- `id`: uuid (Primary Key)
- `bean_id`: uuid (Foreign Key -> beans.id)
- `user_id`: text (Foreign Key -> profiles.line_user_id)
- `household_id`: uuid (Foreign Key -> households.id)
- `method`: text (ハリオV60, フレンチプレス等)
- `grind_size`: text (挽き目)
- `water_temp`: integer (湯温)
- `bean_amount`: real (豆の量 g)
- `water_amount`: real (注水量 ml)
- `rating`: integer (1〜5評価)
- `note`: text (感想)
- `created_at`: timestamp

## データ共有の仕様
- **閲覧:** アプリを開いた際、自分の `household_id` に紐づくすべての `beans` および `brew_logs` を取得します。
- **作成:** データ作成時、常に自分の `household_id` を付与します。
- **編集/削除:** 原則として、作成者本人のみが操作可能（または夫婦ならお互いに可能とするかは実装時に調整）。

## 今後の拡張案
- **在庫管理:** `beans` に `initial_amount` と `brew_logs` の `bean_amount` を合計して残量を計算する機能。
