"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Ocean } from "@/components/ui/ocean"
import { MessageCircle, Bookmark } from "lucide-react"
import { fetchBottles } from "@/lib/fetchBottles"
import { Bottle } from "@/types/bottle"

interface PageOceanProps {
  isConnected: boolean
  onBottleClaimed?: (bottle: Bottle) => void
}

export function PageOcean({ isConnected, onBottleClaimed }: PageOceanProps) {
  const [bottles, setBottles] = useState<Bottle[]>([])
  const [currentBottle, setCurrentBottle] = useState<Bottle | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function getBottles() {
      const data = await fetchBottles()
      setBottles(data)
      if (data.length > 0) {
        setCurrentBottle(data[0])
      }
    }
    getBottles()
  }, [])

  // 次の小瓶を表示する関数
  const handleNextBottle = () => {
    if (bottles.length > 0) {
      const nextIndex = (currentIndex + 1) % bottles.length
      setCurrentIndex(nextIndex)
      setCurrentBottle(bottles[nextIndex])
    }
  }

  // 小瓶を拾う関数
  const handleClaimBottle = () => {
    if (!isConnected) {
      alert("小瓶を拾うにはウォレットを接続してください")
      return
    }

    if (currentBottle && onBottleClaimed) {
      onBottleClaimed(currentBottle)
    }

    // 次の小瓶を表示
    handleNextBottle()
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh]">
      <Ocean />
      {currentBottle ? (
        <div
          className="absolute z-20 w-32 h-32 -translate-x-1/2 -translate-y-1/2 cursor-pointer top-1/2 left-1/2"
          onClick={() => onBottleClaimed?.(currentBottle)}
        >
          <img
            src={"/bottle.webp"}
            alt="Bottle"
            className="object-contain w-full h-full"
          />
        </div>
      ) : (
        <div className="absolute z-20 flex flex-col items-center gap-4 text-center bottom-10">
          <p className="text-lg font-medium text-blue-800">波打ち際に流れ着いた小瓶を見つけてください</p>
          {bottles.length > 0 && (
            <Button variant="outline" className="bg-white/80 hover:bg-white" onClick={() => setCurrentBottle(bottles[0])}>
              <MessageCircle className="w-4 h-4 mr-2" />
              小瓶を見る
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
