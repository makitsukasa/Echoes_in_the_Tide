import {
  BottleMinted as BottleMintedEvent,
  BottleClaimed as BottleClaimedEvent
} from "../generated/Ocean/Ocean"
import { BottleMinted, BottleClaimed, DriftingBottle } from "../generated/schema"

export function handleBottleMinted(event: BottleMintedEvent): void {
  // 保存: BottleMinted（ログとして保存）
  let minted = new BottleMinted(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  minted.sender = event.params.sender
  minted.tokenId = event.params.tokenId
  minted.tokenURI = event.params.tokenURI
  minted.blockNumber = event.block.number
  minted.blockTimestamp = event.block.timestamp
  minted.transactionHash = event.transaction.hash
  minted.save()

  // 追加: DriftingBottle（現在海にあるボトル）
  let bottle = new DriftingBottle(event.params.tokenId.toString())
  bottle.tokenId = event.params.tokenId
  bottle.owner = event.params.sender // 初期所有者は Ocean コントラクト
  bottle.tokenURI = event.params.tokenURI
  bottle.save()
}

export function handleBottleClaimed(event: BottleClaimedEvent): void {
  // 保存: BottleClaimed（ログとして保存）
  let claimed = new BottleClaimed(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  claimed.claimer = event.params.claimer
  claimed.tokenId = event.params.tokenId
  claimed.blockNumber = event.block.number
  claimed.blockTimestamp = event.block.timestamp
  claimed.transactionHash = event.transaction.hash
  claimed.save()

  // 削除: DriftingBottle（もう海にない）
  let id = event.params.tokenId.toString()
  let bottle = DriftingBottle.load(id)
  if (bottle !== null) {
    bottle.owner = event.params.claimer
    bottle.save() // 更新も可能にしておく（任意）
    store.remove("DriftingBottle", id)
  }
}
