"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectWallet } from "@/components/ui/connect-wallet"
import { MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageBottleCollectionProps {
  isConnected: boolean
}

// モックデータ
const mockBottles = [
  {
    id: 1,
    message: "今日も一日お疲れ様。あなたが頑張っていることを、誰かが見ています。",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-05-15",
  },
  {
    id: 2,
    message: "海の向こうから届いた言葉。あなたの小さな親切が、誰かの希望になるかもしれません。",
    image: null,
    date: "2023-06-22",
  },
  {
    id: 3,
    message: "星空を見上げると、同じ空の下で誰かも見上げているかもしれない。そう思うと不思議な気持ちになります。",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-07-10",
  },
]

export function PageBottleCollection({ isConnected }: PageBottleCollectionProps) {
  const [selectedBottle, setSelectedBottle] = useState<any>(null)
  const [bottles, setBottles] = useState(mockBottles)

  // 実際のアプリケーションでは、ここでウォレットアドレスに基づいて
  // ブロックチェーンやAPIからボトルデータを取得する処理を実装

  const handleSelectBottle = (bottle: any) => {
    setSelectedBottle(bottle)
  }

  const handleBackToList = () => {
    setSelectedBottle(null)
  }

  const handleConnectWallet = () => {
    // 親コンポーネントのhandleConnect関数を呼び出す
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

          <p className="mb-4 text-gray-700">{selectedBottle.message}</p>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>拾った日: {selectedBottle.date}</span>
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
                  <p className="text-sm text-gray-700 line-clamp-2">{bottle.message}</p>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{bottle.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
