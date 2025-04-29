"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ConnectWallet } from "@/components/ui/connect-wallet"
import { MessageCircle, Calendar, Heart, Share2, Anchor } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PageBottleMemoriesProps {
  isConnected: boolean
  onBottleSelected?: (bottle: any) => void
}

// モックデータ
const mockSentBottles = [
  {
    id: 101,
    message: "遠い誰かへ。あなたの一日が、穏やかな波のように優しいものでありますように。",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-04-10",
    status: "漂流中",
    interactions: 0,
  },
  {
    id: 102,
    message: "星空を見上げると、同じ空の下で誰かも見上げているかもしれない。そう思うと不思議な気持ちになります。",
    image: null,
    date: "2023-05-22",
    status: "拾われた",
    interactions: 1,
  },
  {
    id: 103,
    message:
      "今日、海辺で見つけた小さな貝殻。誰かに届けたくて、この小瓶に入れました。あなたにとって、幸運の象徴になりますように。",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-06-15",
    status: "漂流中",
    interactions: 0,
  },
  {
    id: 104,
    message: "雨の日は、窓辺で本を読むのが好きです。あなたはどんな過ごし方が好きですか？",
    image: "/placeholder.svg?height=200&width=400",
    date: "2023-07-03",
    status: "拾われた",
    interactions: 3,
  },
]

export function PageBottleMemories({ isConnected, onBottleSelected }: PageBottleMemoriesProps) {
  const [selectedBottle, setSelectedBottle] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [bottles, setBottles] = useState(mockSentBottles)

  // 実際のアプリケーションでは、ここでウォレットアドレスに基づいて
  // ブロックチェーンやAPIからボトルデータを取得する処理を実装

  const filteredBottles =
    filterStatus === "all"
      ? bottles
      : bottles.filter((bottle) =>
          filterStatus === "floating" ? bottle.status === "漂流中" : bottle.status === "拾われた",
        )

  const handleSelectBottle = (bottle: any) => {
    setSelectedBottle(bottle)

    // 親コンポーネントに通知（必要な場合）
    if (onBottleSelected) {
      onBottleSelected(bottle)
    }
  }

  const handleBackToList = () => {
    setSelectedBottle(null)
  }

  const handleShareBottle = (bottle: any) => {
    // 共有機能の実装
    alert(`小瓶ID: ${bottle.id}の旅を共有します`)
  }

  const handleConnectWallet = () => {
    // この関数は実際には使用されませんが、ConnectWalletコンポーネントに渡すために必要
    // 実際のウォレット接続は親コンポーネントで管理されています
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 text-center">
        <h3 className="text-xl font-medium text-blue-800">あなたの流した小瓶を思い出すには</h3>
        <p className="text-blue-700">ウォレットを接続してください</p>
        <ConnectWallet onConnect={handleConnectWallet} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-blue-900">あなたが流した小瓶</h2>
        <Tabs defaultValue="all" onValueChange={setFilterStatus}>
          <TabsList className="bg-blue-50">
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="floating">漂流中</TabsTrigger>
            <TabsTrigger value="found">拾われた</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {selectedBottle ? (
        <Card className="p-6 bg-white rounded-lg shadow-md">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <CardTitle className="text-lg font-medium text-blue-900">あなたの小瓶</CardTitle>
                <CardDescription>{selectedBottle.date}に流した小瓶</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleBackToList}>
                戻る
              </Button>
            </div>
            <Badge
              variant={selectedBottle.status === "漂流中" ? "outline" : "default"}
              className={
                selectedBottle.status === "漂流中"
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                  : "bg-green-100 text-green-800 hover:bg-green-100"
              }
            >
              {selectedBottle.status === "漂流中" ? (
                <>
                  <Anchor className="w-3 h-3 mr-1" /> 漂流中
                </>
              ) : (
                <>
                  <Heart className="w-3 h-3 mr-1" /> 拾われました
                </>
              )}
            </Badge>
          </CardHeader>

          {selectedBottle.image && (
            <div className="mb-4 overflow-hidden rounded-md aspect-video bg-blue-50">
              <img
                src={selectedBottle.image || "/placeholder.svg"}
                alt="Bottle content"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <CardContent className="px-0 pt-4 pb-0">
            <p className="mb-6 text-gray-700">{selectedBottle.message}</p>

            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-medium text-blue-800">小瓶の旅の記録</h4>
                {selectedBottle.status === "拾われた" ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{selectedBottle.date}</span>
                      <span className="text-blue-700">あなたが海に流しました</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {
                          new Date(new Date(selectedBottle.date).getTime() + 1000 * 60 * 60 * 24 * 14)
                            .toISOString()
                            .split("T")[0]
                        }
                      </span>
                      <span className="text-green-700">誰かに拾われました</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">インタラクション</span>
                      <span className="flex items-center text-pink-600">
                        <Heart className="w-3 h-3 mr-1 fill-pink-600" /> {selectedBottle.interactions}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{selectedBottle.date}</span>
                      <span className="text-blue-700">あなたが海に流しました</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">現在</span>
                      <span className="text-blue-700">どこかの海を漂っています...</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedBottle.status === "拾われた" && (
                <Button variant="outline" className="w-full" onClick={() => handleShareBottle(selectedBottle)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  この小瓶の旅を共有する
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {filteredBottles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filteredBottles.map((bottle) => (
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
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{bottle.date}</span>
                      </div>
                      <Badge
                        variant={bottle.status === "漂流中" ? "outline" : "default"}
                        className={`text-xs ${bottle.status === "漂流中" ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "bg-green-100 text-green-800 hover:bg-green-100"}`}
                      >
                        {bottle.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-10 text-center">
              <p className="text-blue-700">
                {filterStatus === "all"
                  ? "まだ小瓶を流していません"
                  : filterStatus === "floating"
                    ? "漂流中の小瓶はありません"
                    : "拾われた小瓶はありません"}
              </p>
              {filterStatus === "all" && (
                <Button variant="outline" onClick={() => document.querySelector('[data-value="create"]')?.click()}>
                  小瓶を流してみましょう
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
