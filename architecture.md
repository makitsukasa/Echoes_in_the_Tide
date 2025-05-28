## 1. 📁 ディレクトリ構成と責務

```
frontend/        # フロントエンド (Next.js 13.4、React 18.2)
│                # GitHub Pages で公開するため、クライアントサイドのみで動作
├── public/      # 静的ファイル (favicon.ico, og-image.png, manifest.json)
├── src/                     # アプリ本体のソースコード
│   ├── components/          # 複数ページで再利用するUIコンポーネント
│   │   ├── Navbar.tsx       # ナビゲーションメニュー（PC/モバイル両対応）
│   │   └── ...
│   ├── constants/           # 定数定義（例: contracts.ts）
│   ├── features/            # ドメイン単位で機能を分類（1画面1つ+bottleなど）
│   │   ├── bottle/          # 小瓶に関するドメイン（詳細モーダル、型、ロジック）
│   │   │   └── components/BottleDetailModal.tsx    # 小瓶の中身表示(index.tsxとthrow.tsxで使う)
│   │   │   └── stores/useBottleStore.ts            # 小瓶の状態管理
│   │   ├── ocean/components/OceanView.tsx          # 海を眺める画面
│   │   ├── mybottles/components/MyBottlesList.tsx  # 拾った小瓶一覧画面
│   │   ├── throw/components/ThrowForm.tsx          # 小瓶を流す画面のフォーム
│   │   └── ...
│   ├── hooks/               # 共通的なReactカスタムフック（features以下に置けない汎用フック）
│   ├── pages/               # Next.js の各ページ（Pages Router）
│   │   ├── index.tsx        # トップページ（海を眺める）
│   │   ├── throw.tsx        # 小瓶を流す画面
│   │   ├── mybottles.tsx    # 拾った小瓶一覧
│   │   ├── setting.tsx      # 設定画面
│   │   └── _app.tsx         # 全体のProvider（Wagmi/Zustandなど）をラップ
│   ├── stores/              # グローバルな状態管理（Zustand）
│   ├── utils/               # 状態を持たない汎用ユーティリティ（コントラクト操作・subgraph・filebaseなど）
│   ├── types/               # フロント全体で再利用する型定義（BottleType など）
│   └── styles/
├── __tests__/               # おいおい
├── package.json
├── tsconfig.json
└── README.md
contracts/       # スマートコントラクト（Foundry + OpenZeppelin）
subgraph/        # The Graph (サブグラフ定義)

```

---

## 2. 🖼️ 画面構成

- 🌊 海を眺める画面（トップ） → `src/pages/index.tsx`, `features/ocean/components/OceanView.tsx`
    - 動きやアニメーション効果はなし
    - 背景画像は`public/ocean.webp`
        - 画面が横長のとき、画像の下端が表示される
        - 画面が縦長のとき、上下いっぱい、左右中央が表示される
    - 小瓶の画像は`public/bottle.webp`
        - page.tsxの小瓶は全て同じ見た目
        - 画面下部に3つ画像を表示。3つとも角度を変える
        - 画像クリックで小瓶の中身(description,image)表示
- 📝 小瓶を流す画面 → `src/pages/throw.tsx`, `features/throw/components/ThrowView.tsx`
- 📜 拾った小瓶を眺める画面 → `src/pages/mybottles.tsx`, `features/my-bottles/components/MyBottlesView.tsx`
- ⚙️ 設定画面 → `src/pages/setting.tsx`
    - filebaseのapiキーを入力、保存
- 画面遷移はハンバーガーメニュー `src/components/Navbar.tsx`
    - PC、モバイル両対応

---

## 3. 🧠 状態管理の方針

- **Zustand** を基本に使用（`src/stores/` または `features/*/stores/`）
- 各storeは状態の管理のみを行い、副作用があるなら`src/utils/`など別ファイルに分ける
- **Context API** は UI 状態の共有（テーマ、トーストなど）に限定
- コンポーネント内だけで完結する状態は**useState**を使用

---

## 4. 🌐 Web3方針

- ネットワークは Polygon（開発中は Amoy テストネット）
- **Wagmi** で状態管理とコントラクト呼び出しを統一
    - `useContractRead` / `useContractWrite` は直接使わず `utils/contract.ts` に集約
    - WalletConnect対応
    - アドレスやABIは `frontend/src/constants/contracts.ts`
- スマートコントラクト呼び出しは `frontend/src/utils/contract.ts` に集約
    - 例: `mintBottle()`, `claimBottle()` など関数化

---

## 5. 🛰️ API設計（The Graph + IPFS）

- **オンチェーン状態の取得**：
    - `The Graph` を使ってデータ取得。
    - フロントエンドの GraphQL クエリは `frontend/src/utils/subgraph.ts` に集約。
- **IPFSアップロード（Filebase経由）**：
    - IPFSへのデータアップロードは `frontend/src/utils/filebase.ts` に実装。
    - FilebaseのAPIキーの扱いに応じて以下の挙動を実装：
        - **APIキーあり**：
            - テキスト投稿のメタデータも画像も、Filebase経由でIPFSに保存。
        - **APIキーなし**：
            - 画像の投稿は不可。
            - テキスト投稿のメタデータはbase64エンコードの上オンチェーンに直接保存。
- **APIキーの管理方法**：
    - APIキーを**Metamask署名で導出した鍵でAES暗号化して保存**。`Zustand`の`persist`を使用。
    - 暗号化・復号のロジックは `frontend/src/utils/encrypt.ts` に実装。
- **型定義**：
    - The Graph関連の戻り値型は `frontend/src/types/subgraph.ts` に定義。
    - コントラクト呼び出しに関する型は `frontend/src/types/contract.ts` に定義。

---

## 6. ⚠️ エラーハンドリングとUI

- API・トランザクションすべてに `try/catch`
- 通知は**Sonner** を使ったトースト通知に統一
    - ラップ済みの関数: `utils/toast.ts`, `components/ToastProvider.tsx`
- ローディング中の状態は `isLoading`, `disabled` で制御

---

## 7. 🔠 命名規則

| 種類 | 規則 |
| --- | --- |
| コンポーネント | PascalCase（例: `NavBar.tsx`） |
| Hooks | camelCase（例: `useBottleList`） |
| 状態変数 | camelCase（例: `selectedBottleId`） |
| ストア | `useXxxStore.ts` に統一（Zustand） |
| 定数 | SCREAMING_SNAKE_CASE（例: `CHAIN_ID`） |
| 型定義 | PascalCase + `Type` 接尾辞（例: `BottleType`） |

---

## 8. ♻️ 再利用性と共通化方針

- 重複する処理/スタイル/フックは即共通化
    - 例: `WalletConnectButton` → `components/` 配下へ
- fetcher や useQuery 系も DRY 原則に沿って共通化

---

## 9. 🚀 公開

### 9-1. GitHub Pagesへのデプロイ

- `frontend/` ディレクトリ内のNext.jsアプリを **静的サイトとしてビルド・出力**
    - `next.config.ts` に `output: 'export'` と `basePath: '/Echoes_in_the_Tide'` を設定
    - `npm run build` 実行時に `frontend/out/` に静的ファイルが生成される
- `main` ブランチへの push をトリガーに GitHub Actions がデプロイを実行
    - `.github/workflows/deploy.yml` にて `peaceiris/actions-gh-pages@v3` を使用
    - `publish_dir: ./frontend/out` を指定し、`gh-pages` ブランチへデプロイ
    - `.nojekyll` ファイルを生成して GitHub Pages の特殊処理を無効化
- GitHub Pages の公開設定
    - GitHub リポジトリの Settings > Pages にて `gh-pages` ブランチを指定
    - `/ (root)` を公開ディレクトリとして設定

### 9-2. スマートコントラクト

```bash
forge script script/Deploy.s.sol --rpc-url amoy --broadcast --verify -vvvv
```

Mint.s.sol、Claim.s.sol、subgraph.yaml、callcontacts.jsのコントラクトアドレスを更新

### 9-3. **The Graph**

```bash
jq '.abi' contracts/out/Ocean.sol/Ocean.json > subgraph/abis/Ocean.json
graph codegen
graph build
graph deploy ocean
```
