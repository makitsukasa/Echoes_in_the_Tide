"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectWallet } from "@/components/ui/connect-wallet"
import { MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { Bottle } from "@/types/bottle"
import { fetchUserBottles } from "@/lib/fetchUserBottles"

interface PageBottleCollectionProps {
  isConnected: boolean
}

export function PageBottleCollection({ isConnected }: PageBottleCollectionProps) {
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null)
  const [bottles, setBottles] = useState<Bottle[]>([])
  const { address } = useAccount()

  useEffect(() => {
    const loadBottles = async () => {
      if (isConnected && address) {
        try {
          const userBottles = await fetchUserBottles(address)
          setBottles(userBottles)
        } catch (error) {
          console.error('ボトルの取得に失敗しました:', error)
        }
      }
    }

    loadBottles()
  }, [isConnected, address])

  const handleSelectBottle = (bottle: Bottle) => {
    setSelectedBottle(bottle)
  }

  const handleBackToList = () => {
    setSelectedBottle(null)
  }

  const handleConnectWallet = () => {
    window.dispatchEvent(new CustomEvent('connectWallet'))
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 text-center">
        <h3 className="text-xl font-medium text-blue-800">あなたのコレクションを見るには</h3>
        <p className="text-blue-700">ウォレットを接続してください</p>
        <ConnectWallet onConnect={handleConnectWallet} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-blue-900">あなたのコレクション</h2>
        <p className="text-sm text-blue-700">{bottles.length}個の小瓶</p>
      </div>

      {selectedBottle ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-blue-900">小瓶のメッセージ</h3>
            <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-800" onClick={handleBackToList}>
              戻る
            </Button>
          </div>

          {selectedBottle.image && (
            <div className="mb-4 overflow-hidden rounded-md aspect-video bg-blue-50">
              <img
                src={selectedBottle.image || "/placeholder.svg"}
                alt="Bottle content"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <p className="mb-4 text-gray-700">{selectedBottle.message || selectedBottle.description}</p>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>拾った日: {selectedBottle.date || '不明'}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {bottles.map((bottle) => (
            <Card
              key={bottle.id}
              className="overflow-hidden transition-shadow cursor-pointer hover:shadow-md"
              onClick={() => handleSelectBottle(bottle)}
            >
              {bottle.image && (
                <div className="aspect-video bg-blue-50">
                  <img
                    src={bottle.image || "/placeholder.svg"}
                    alt="Bottle preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 mt-1 text-blue-500 shrink-0" />
                  <p className="text-sm text-gray-700 line-clamp-2">{bottle.message || bottle.description}</p>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{bottle.date || '不明'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
