import {
  BottleClaimed as BottleClaimedEvent,
  BottleMinted as BottleMintedEvent
} from "../generated/Ocean/Ocean"
import { BottleClaimed, BottleMinted, DriftingBottle } from "../generated/schema"
import { Bytes, ByteArray } from "@graphprotocol/graph-ts"

export function handleBottleClaimed(event: BottleClaimedEvent): void {
  let entity = new BottleClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.claimer = event.params.claimer
  entity.tokenId = event.params.tokenId
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // DriftingBottle のオーナーを更新
  let bottle = DriftingBottle.load(Bytes.fromByteArray(ByteArray.fromBigInt(event.params.tokenId)))
  if (bottle) {
    bottle.owner = event.params.claimer
    bottle.save()
  }
}

export function handleBottleMinted(event: BottleMintedEvent): void {
  let entity = new BottleMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.tokenId = event.params.tokenId
  entity.tokenURI = event.params.tokenURI
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // DriftingBottle を新規作成
  let bottle = new DriftingBottle(Bytes.fromByteArray(ByteArray.fromBigInt(event.params.tokenId)))
  bottle.owner = event.address
  bottle.tokenURI = event.params.tokenURI
  bottle.save()
}
