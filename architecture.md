## 1. 📁 ディレクトリ構成と責務

```
frontend/               # クライアントだけで動くフロントエンド（next.js）。github-pagesで公開
├── public/             # 静的ファイル（favicon.ico、og-image.png、manifest.json）
├── src/                # アプリ本体のソースコード
│   ├── assets/         # 画像やスタイル
│   ├── components/     # 再利用可能なUI部品
│   ├── constants/      # 定数
│   ├── features/       # ボトル、ウォレット、ユーザーなど「ドメインごとの機能」をまとめる
│   │   ├── bottle/
│   │   │   ├── components/  # BottleImageなど
│   │   │   ├── hooks/       # useBottleList、useMintBottleなど、状態を持たないもの
│   │   │   ├── stores/      # useBottleStore.tsなど、状態を管理するもの
│   │   │   └── utils/       # createBottleData.ts
│   │   └── ...
│   ├── hooks/          # カスタムフック
│   ├── pages/          # 画面単位のコンポーネント（Next.jsではここが特別）
│   │   ├── _app.tsx    # エントリーポイント
│   │   └── ...
│   ├── stores/         # Zustandなど状態管理
│   └── utils/          # 汎用ユーティリティ関数
├── package.json
├── tsconfig.json
└── README.md
contracts/              # スマートコントラクト（Foundry、openzeppelin-contracts）
subgraph/               # オンチェーンの情報をAPIから取得。 thegraph.com にデプロイ。

```

### 2. 🧠 状態管理の方針

- **基本はZustandでグローバル状態を管理**
    - 例: `useBottleStore.ts`, `useWalletStore.ts`
- **Context APIは「階層的に共有すべきUI状態」限定で使用**
    - 例: トースト、テーマ切り替えなど
- **local state（useState）で十分な場合はuseStateで完結させる**

### 3. 🌐 Web3関連の方針

- **状態管理とコントラクト呼び出しには`wagmi`を使用**
    - wagmiの`useContractRead`, `useContractWrite`はhooks内では直接使わず、共通の関数（frontend/src/utils/contract.ts）でラップして共通化
    - アドレスやABIは `frontend/src/constants/contracts.ts` に定義して import
- **スマートコントラクト呼び出しは `frontend/src/utils/contract.ts` に集約**
    - `mintBottle()`, `claimBottle()` のように切り出す

### 4. 🛰️ API設計方針（The Graph + IPFS）

- **The Graphを通じてオンチェーン状態を取得（Query）**
    - fetchロジックは `frontend/src/utils/subgraph.ts` に共通化
- **ファイルアップロードにIPFS（filebase）を使用**
    - filebaseのAPI呼び出しは `frontend/src/utils/filebase.ts` に集約**

### 5. ⚠️エラーハンドリングとUI

- **全てのトランザクションやAPI呼び出しにはtry/catchをつける**
- **エラー表示は `frontend/src/utils/toast.ts` に統一**
    - 成功: `toast.success("小瓶を流しました！")`
    - 失敗: `toast.error("ネットワークエラー。もう一度お試しください")`
- **UI操作不能時は `isLoading`, `disabled` を状態で管理**

### 6. 🔠 命名規則（Naming Conventions）

| 種類 | 規則 |
| --- | --- |
| コンポーネント | `PascalCase` (例: `BottleCard.tsx`) |
| Hooks | `camelCase`, `use`プレフィックス (例: `useBottleList.ts`) |
| 状態 | `camelCase` (例: `selectedBottleId`) |
| ストア | `useXxxStore.ts` に統一 (Zustand) |
| 定数 | `SCREAMING_SNAKE_CASE` (例: `CHAIN_ID`) |
| 型定義 | `PascalCase` + 接尾辞 `Type` (例: `BottleType`) |

### 7. ♻️ 再利用性

- **同じロジック/スタイル/フックが複数箇所に登場したら即共通化**
    - 例: `MintButton` や `BottleImage` は `components/` に
- **fetcherや`useQuery`系の処理はDRY原則で集約**
