import {
  BottleClaimed as BottleClaimedEvent,
  BottleMinted as BottleMintedEvent
} from "../generated/Ocean/Ocean"
import { BottleClaimed, BottleMinted } from "../generated/schema"

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
}
