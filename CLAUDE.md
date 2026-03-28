# Echoes in the Tide — Claude 向け引き継ぎメモ

> **仕様は `architecture.md`、コンセプトは `idea.md` を参照。**
> このファイルには両ファイルに書かれていない実装上の注意点・開発環境のみ記載する。
> タスク状況・バグ・進捗は memory/ に記録し、このファイルには書かない。

## セッション引き継ぎ

会話をまたぐ記憶は以下に保存されている。新しいセッション冒頭で必ず読むこと。

```
~/.claude/projects/-mnt-c-Users-tsukasa-Documents-Echoes-in-the-Tide/memory/MEMORY.md
```

## 開発環境

- OS: Windows 11 + WSL2。Node は WSL 側の nvm で管理
- `npm run dev` / `npm install` は必ず WSL 内で実行する（理由は `architecture.md` # 07.2）
- WSL コマンドを外から呼ぶ場合: `wsl.exe -e bash -c "source ~/.nvm/nvm.sh 2>/dev/null; ..."`

## 重要な実装メモ

### wagmi WalletConnect の挙動

wagmi v2 の WalletConnect connector は `getProvider({ chainId })` を呼ぶたびに `switchChain` を実行する。
MetaMask がメインネット (chainId 1) 接続中に WalletConnect すると `connection.chainId = 1` になり、
`wagmiConfig.chains`（[80002] のみ）に chainId 1 が存在しないため `ChainNotConfiguredError` になる。

対策として `frontend/src/utils/wagmi.ts` 末尾に `getProvider` パッチを当てている（コメント参照）。

- `useChainId()` = グローバル状態。接続後も更新されないことがある → **使わない**
- `useAccount().chainId` = 実際の接続チェーン → **wrong chain 判定はこちらを使う**

### The Graph サブグラフ

URL: `https://api.studio.thegraph.com/query/109981/ocean/version/latest`

長期間呼ばれないと休眠する。休眠明けは sync 完了まで数十分かかる。
