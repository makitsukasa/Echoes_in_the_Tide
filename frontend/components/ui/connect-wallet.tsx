"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function ConnectWallet({ onConnect }: { onConnect: () => void }) {
  return (
    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={onConnect}>
      <Wallet className="w-4 h-4 mr-2" />
      ウォレットを接続
    </Button>
  )
}
