# 波打ち際の小瓶 (Echoes in the Tide) 実装仕様書

LLMまたは開発者がそのまま実装判断に使うための仕様である。
コンセプト説明は `idea.md` に記載。

# 00. 概要

## 1. プロダクト概要

ブラウザ上で動く Web3 アプリ。ユーザーは以下を行える。

1. 海にある小瓶を眺める
2. 海にある小瓶を拾う（claim）
3. 新しい小瓶を海に流す（mint）
4. 自分が拾った小瓶を一覧で眺める
5. 画像投稿用の Filebase API キーを設定する

## 2. 実装上の前提

- フロントエンドは静的ホスティング前提。GitHub Pages で公開する。
- バックエンドサーバーは持たない。
- オンチェーン状態は Polygon / Amoy 上のスマートコントラクトに保存する。
- 一覧取得は The Graph を利用する。
- Filebase APIキーの有無によって tokenUri の生成方式が分岐する
  - Filebase APIキーがない場合、画像付き投稿は不可。メタデータ文字列を onchain URI として扱う。
  - Filebase APIキーがある場合、画像を添付できる。Filebaseへmetadata.jsonをアップロードする。
- ウォレット未接続でも「海を眺める」「拾った小瓶一覧を見る」は可能。ただし拾った一覧は接続中アドレスに依存するため、未接続時は空状態メッセージを表示する。

## 3. 用語定義

- **Bottle**: 小瓶 1 件を表す NFT / 表示単位
- **Ocean**: まだ誰にも拾われていない状態
- **mint**: 新しい小瓶を海へ追加する操作
- **claim**: 海にある小瓶を自分のものにする操作
- **creator**: 小瓶を流したアドレス
- **owner**: 現在の所有者。海にある間は `OCEAN_ADDRESS`
- **metadata URI**: Bottle の本文や画像参照先を表す URI。画像なしでは data URI、画像ありでは IPFS URI

---

# 01. ドメインモデル

## 1. Bottle の論理モデル

フロントエンド・サブグラフ・コントラクトの間で整合する最小モデルを以下とする。

```ts
export type BottleStatus = 'AT_OCEAN' | 'CLAIMED'

export type Bottle = {
  tokenId: string
  creator: `0x${string}`
  owner: `0x${string}`
  status: BottleStatus
  tokenUri: string
  description: string
  imageUrl?: string
  createdAt: number
  claimedAt?: number
}
```

## 2. 状態定義

### AT_OCEAN
- `owner === OCEAN_ADDRESS`
- 海画面の候補になりうる
- claim 可能

### CLAIMED
- `owner !== OCEAN_ADDRESS`
- 海画面には出さない
- mybottles の一覧対象になりうる

## 3. metadata の最小スキーマ

画像あり・画像なしの双方で、最終的に BottleModal がこの情報を読めればよい。

### 画像あり（IPFS JSON）

```json
{
  "name": "Bottle #123",
  "description": "海に流す本文",
  "image": "ipfs://..."
}
```

### 画像なし（data URI または onchain 文字列化 JSON）

```json
{
  "name": "Bottle #123",
  "description": "海に流す本文"
}
```

## 4. 制約

- `description` は必須
- `description` 最大長は 200 文字
- 画像は任意
- 画像サイズ上限は 5MB
- 対応画像形式は問わない（`accept="image/*"`）
- creator 本人が自分の瓶を海で拾える実装にはしない。海画面候補から除外する

---

# 02. 機能仕様

## A. 海を眺める

### 目的
未取得の小瓶を 3 件だけ提示し、ユーザーに「見る」「拾う」の導線を与える。

### 入力
- The Graph から取得した `AT_OCEAN` の Bottle 一覧
- 現在接続中ウォレットアドレス（未接続可）

### 表示ルール
- 画面下部に 3 本まで表示する
- 同一 tokenId を同時に重複表示しない
- 接続中アドレスがある場合、そのアドレスが `creator` の Bottle は候補から除外する
- 候補が 3 件未満なら、存在する件数だけ表示する
- 候補が 0 件なら空状態メッセージを表示する
- 瓶画像は全件同じ `public/bottle.webp` を使い、角度だけ変える
- 画面リロード時または「読み込み直し」操作時に再抽選してよい。自動更新は不要

### 操作
- 瓶クリックでモーダルを開く
- モーダルには `description` と `imageUrl` を表示する
- `imageUrl` がない場合はテキストのみ表示する
- モーダル内の Claim ボタン押下で claim を実行する

### エラー時
- 一覧取得失敗時はトースト表示と空状態メッセージ表示
- claim 失敗時は理由別トーストを表示する

## B. 小瓶を拾う（claim）

### 前提条件
- 対象 Bottle は `AT_OCEAN`
- ウォレット接続済み
- 対応ネットワークに接続済み

### 実行ルール
- claim 実行中は該当ボタンを disabled
- トランザクション送信開始時にローディング表示
- 成功時は成功トースト表示
- 成功後は海一覧を再取得し、モーダルを閉じる
- 成功後は mybottles 一覧にも反映されること

### 競合時
- 別ユーザーに先に claim された場合、revert または owner 不一致エラーとして扱う
- この場合は「すでに誰かに拾われました」と表示し、海一覧を再取得する

## C. 小瓶を流す（mint）

### 入力項目
- `description`: 必須、最大 200 文字
- `imageFile`: 任意（※Filebase APIキーあり時のみ有効）

### バリデーション
- `description` 空文字不可
- `description` 201 文字以上不可
- APIキー未設定時は画像入力不可
- 画像あり時、MIME type とファイルサイズ(5MB 以下)を検証

### 実行フロー

#### ■ Filebase APIキーあり

1. バリデーション
2. 画像ありなら Filebase に画像アップロード
3. metadata JSON を生成
4. metadata JSON を **必ず Filebase にアップロード**
5. metadata の IPFS URI を取得
6. `mint(tokenUri)` 実行
7. 成功トースト
8. フォームリセット
9. トップへ遷移

#### ■ Filebase APIキーなし

1. バリデーション
2. 画像入力不可
3. metadata JSON を生成
4. metadata を **data URI（base64）へ変換**
5. `mint(tokenUri)` 実行
6. 成功トースト
7. フォームリセット
8. トップへ遷移

### 成功後の状態
- minted 直後の owner は `OCEAN_ADDRESS`
- creator は送信ウォレットアドレス
- creator 本人の海一覧には表示しない

## D. 拾った小瓶を眺める

### 表示対象
- 接続中ウォレットアドレスが `owner` の Bottle
- `status === CLAIMED`

### 表示ルール
- 新しい取得順（`claimedAt desc`）で並べる
- description を先頭 80 文字までカード表示し、省略時は `...`
- imageUrl がある場合のみサムネイル表示
- カードクリックで詳細モーダル表示

### 未接続時
- 一覧は表示しない
- 「ウォレットを接続すると拾った小瓶を見られます」と表示する

## E. 設定画面

### 目的
Filebase API キーをブラウザローカルに暗号化保存する

### 入力項目
- access key
- secret key

### 保存ルール
- ウォレット署名から導出した鍵で AES 暗号化して保存
- Zustand persist を利用して localStorage に保存
- 平文保存しない

### UI ルール
- 保存済みならマスク表示する
- 削除ボタンで保存値を消去できる
- API キー未設定でも画像なし投稿は可能であることを明示する

---

# 03. 画面仕様

## 1. 共通

- ハンバーガーメニューで `index / throw / mybottles / setting` へ遷移可能
- Sonner によるトースト通知を全画面共通で使用
- ローディング中は該当操作ボタンを disabled

## 2. トップ画面

### 固定表示
- 背景画像は `public/ocean.webp`
- 横長画面: 下端が見えるように表示
- 縦長画面: 上下いっぱい、左右中央を表示
- 瓶画像は `public/bottle.webp`

### 空状態
- 候補 0 件時: `今は流れ着いている小瓶がありません`

### ボタン文言
- モーダル内ボタン: `拾う`
- ウォレット未接続時に拾う操作へ進んだ場合: `ウォレットを接続してください`

## 3. throw 画面

### フォーム部品
- description 用 textarea
- 画像選択 input
- 投稿ボタン
- Filebase 未設定時の注記文

### 画面文言
- 画像なしならテキストだけで流せる
- 画像つき投稿には Filebase API キーが必要

### UIルール

* **APIキー未設定時**

  * 画像 input を disabled
  * 「テキストのみ投稿可能」と明示

* **APIキー設定済み時**

  * 画像は任意
  * 「画像を添付した投稿が可能」と明示

## 4. mybottles 画面

### カード表示要素
- 取得日時または claimedAt
- description 抜粋
- 任意でサムネイル

### 空状態
- 接続済みかつ 0 件: `まだ拾った小瓶はありません`
- 未接続: `ウォレットを接続すると拾った小瓶を見られます`

## 5. setting 画面

### 表示要素
- access key 入力欄
- secret key 入力欄
- 保存ボタン
- 削除ボタン
- 保存状態メッセージ

---

# 04. フロントエンド実装方針

## 1. ディレクトリ責務

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── throw/
│   │   ├── mybottles/
│   │   └── setting/
│   ├── hooks/
│   ├── pages/
│   ├── stores/
│   ├── types/
│   ├── services/
│   │   ├── contract/
│   │   ├── subgraph/
│   │   ├── filebase/
│   │   └── crypto/
│   ├── utils/
│   ├── constants/
│   └── styles/
```

## 2. 責務ルール

- `components/`: UI 表示のみ。可能な限り副作用を持たせない
- `hooks/`: UI とサービスの橋渡し。フォーム制御や非同期処理の統合
- `stores/`: Zustand による状態保持。設定値や UI 状態を持つ
- `services/`: 副作用あり処理。コントラクト呼び出し、The Graph、Filebase、暗号化 I/O を置く
- `utils/`: 純粋関数。整形、バリデーション、data URI 変換など
- `types/`: Bottle, GraphQL response, contract types
- `constants/`: ABI、アドレス、chainId、制約値

## 3. 状態管理

### Zustand で持つもの
- 保存済み Filebase API キー
- Bottle モーダルの開閉状態
- 一時的な選択 Bottle

### useState で持つもの
- フォーム入力値
- 送信中フラグ
- その画面だけで完結する UI 状態

## 4. Web3 呼び出し方針

- Wagmi を使用
- `useReadContract` / `useWriteContract` 相当の低レベル呼び出しは service 層のみに閉じ込める
- ページやコンポーネントから ABI やアドレスを直接触らない

## 5. エラーハンドリング方針

- service 層で例外を意味のあるエラー種別へ変換する
- hook / page 層ではエラー種別に応じてトースト文言を切り替える
- 予期しないエラーは `予期しないエラーが発生しました` と表示する

---

# 05. 外部連携仕様

## 1. コントラクト

前提となる関数は以下。

```solidity
function mint(string calldata tokenUri) external;
function claim(uint256 tokenId) external;
```

イベントは少なくとも以下をサブグラフで拾えること。

- Minted(tokenId, creator, tokenUri, createdAt)
- Claimed(tokenId, claimer, claimedAt)

owner は ERC721 の Transfer 由来でもよいが、サブグラフ最終形では Bottle 一覧取得に必要な情報が 1 件に集約されていること。

## 2. The Graph

### 必要クエリ 1: 海にある小瓶一覧
- 条件: `status == AT_OCEAN`
- 任意で `creator != currentUser` をフロントまたはクエリで除外
- 必須フィールド: tokenId, creator, owner, tokenUri, createdAt

### 必要クエリ 2: 自分が拾った小瓶一覧
- 条件: `owner == currentUser` かつ `status == CLAIMED`
- ソート: `claimedAt desc`

## 3. metadata 解決

Bottle 表示時は `tokenUri` を解決して metadata JSON を取得する。

### tokenUri が `ipfs://` の場合
- HTTP gateway URL に変換して fetch

### tokenUri が `data:application/json;base64,` の場合
- フロントで decode して JSON parse

## 4. Filebase

### 分岐の原則

| 状態      | Filebase使用 | 画像 | tokenUri |
| ------- | ---------- | -- | -------- |
| Filebase APIキーあり | 使用する       | 任意 | IPFS URI |
| Filebase APIキーなし | 使用しない      | 不可 | data URI |

### Filebase APIキーあり

#### 共通ルール

* **metadata.json は必ず Filebase にアップロードする**

#### 画像あり

1. 画像アップロード
2. metadata に `image: ipfs://...`
3. metadata.json アップロード
4. metadata の CID を tokenUri に使用

#### 画像なし

1. metadata.json 作成（descriptionのみ）
2. metadata.json アップロード
3. CID を tokenUri に使用

### Filebase APIキーなし

* 画像不可
* Filebase 不使用
* metadata.json を生成
* **base64 data URI に変換**
* それを tokenUri として使用

### metadata 最小形

#### Filebase APIキーあり・画像あり

```json
{
  "name": "Bottle #123",
  "description": "海に流す本文",
  "image": "ipfs://..."
}
```

#### Filebase APIキーあり・画像なし

```json
{
  "name": "Bottle #123",
  "description": "海に流す本文"
}
```

#### Filebase APIキーなし

```json
{
  "name": "Bottle #123",
  "description": "海に流す本文"
}
```

---

# 06. 受け入れ条件

## 1. 海を眺める
- The Graph 取得結果から海の Bottle を最大 3 件表示できる
- 同一 Bottle が同時に重複しない
- creator 本人の Bottle は海候補から除外される
- 0 件時は空状態を表示する
- 画像あり / 画像なしの双方をモーダル表示できる

## 2. claim
- ウォレット接続済みなら claim を実行できる
- 成功時に海一覧から対象 Bottle が消える
- 成功時に mybottles に対象 Bottle が出現する
- 二重 claim 時に失敗トーストを表示できる

## 3. mint

- description のみで投稿できる
- APIキー未設定時は画像投稿不可
- APIキー設定時は画像なし投稿も可能
- metadata が正しく：
  - APIキーあり → IPFS
  - APIキーなし → data URI
- 投稿成功後トップへ戻る
- 自分の瓶は海に表示されない

## 4. mybottles
- owner が接続アドレスの Bottle のみ表示される
- claimedAt の降順で表示される
- 0 件時 / 未接続時の空状態が区別される

## 5. setting
- API キーを暗号化保存できる
- ページ再訪時に保存状態が復元される
- 削除操作で保存値が消える

## 6. エラー
- network mismatch, wallet 未接続, tx reject, claim 済み, Filebase upload 失敗の各ケースでユーザーに理由を表示できる

---

# 07. デプロイ

## 1. フロントエンド（GitHub Pages）

- `next.config.ts` に `output: 'export'` と `basePath: '/Echoes_in_the_Tide'` を設定
- `npm run build` で `frontend/out/` に静的ファイルを生成
- `main` ブランチへの push をトリガーに `.github/workflows/deploy.yml` が自動実行
  - `peaceiris/actions-gh-pages@v3` で `gh-pages` ブランチへデプロイ
  - `publish_dir: ./frontend/out`
  - `.nojekyll` を生成して GitHub Pages の特殊処理を無効化
- GitHub リポジトリの Settings > Pages で `gh-pages` ブランチ・`/ (root)` を指定

## 2. スマートコントラクト

```bash
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify -vvvv
```

デプロイ後は以下のファイルのコントラクトアドレスを更新する。

- `script/Mint.s.sol`
- `script/Claim.s.sol`
- `subgraph/subgraph.yaml`
- `callcontacts.js`

## 3. The Graph

```bash
jq '.abi' contracts/out/Ocean.sol/Ocean.json > subgraph/abis/Ocean.json
graph codegen
graph build
graph deploy ocean
```

---
