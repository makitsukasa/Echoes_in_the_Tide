"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWalletSection } from "@/components/ui/ConnectWalletSection"
import { MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { Bottle } from "@/lib/bottleUtil"
import { fetchUserBottles } from "@/lib/fetchUserBottles"
import Image from 'next/image'

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

  if (!isConnected) {
    return (
      <ConnectWalletSection
        title="あなたのコレクションを見るには"
        description="ウォレットを接続してください"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-blue-900">あなたのコレクション</h2>
        <p className="text-sm text-blue-700">{bottles.length}個の小瓶</p>
      </div>

      {selectedBottle ? (
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-medium text-blue-900">小瓶のメッセージ</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={handleBackToList}>
                戻る
              </Button>
            </div>
          </CardHeader>
          {selectedBottle.image && (
            <div className="mb-4 overflow-hidden rounded-md aspect-video bg-blue-50">
              <Image
                src={selectedBottle.image || "/placeholder.svg"}
                alt={selectedBottle.name || "Bottle content"}
                className="object-cover w-full h-full"
                width={400}
                height={200}
              />
            </div>
          )}
          <CardContent className="px-0 pt-4 pb-0">
            <p className="mb-6 text-gray-700">{selectedBottle.message || selectedBottle.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>拾った日: {selectedBottle.date || '不明'}</span>
            </div>
          </CardContent>
        </Card>
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
                  <Image
                    src={bottle.image || "/placeholder.svg"}
                    alt={bottle.name || "Bottle preview"}
                    className="w-full h-48 object-cover rounded-t-lg"
                    width={400}
                    height={200}
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 mt-1 text-blue-500 shrink-0" />
                  <p className="text-sm text-gray-700 line-clamp-2">{bottle.message || bottle.description}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{bottle.date || '不明'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
