import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { BottleClaimed, BottleMinted } from "../generated/Ocean/Ocean"

export function createBottleClaimedEvent(
  claimer: Address,
  tokenId: BigInt
): BottleClaimed {
  let bottleClaimedEvent = changetype<BottleClaimed>(newMockEvent())

  bottleClaimedEvent.parameters = new Array()

  bottleClaimedEvent.parameters.push(
    new ethereum.EventParam("claimer", ethereum.Value.fromAddress(claimer))
  )
  bottleClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return bottleClaimedEvent
}

export function createBottleMintedEvent(
  sender: Address,
  tokenId: BigInt,
  tokenURI: string
): BottleMinted {
  let bottleMintedEvent = changetype<BottleMinted>(newMockEvent())

  bottleMintedEvent.parameters = new Array()

  bottleMintedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  bottleMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  bottleMintedEvent.parameters.push(
    new ethereum.EventParam("tokenURI", ethereum.Value.fromString(tokenURI))
  )

  return bottleMintedEvent
}
