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
  const [currentBottles, setCurrentBottles] = useState<Bottle[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function getBottles() {
      const data = await fetchBottles()
      // data[1] = data[0]; data[1].id = data[0].id + 1;
      // data[2] = data[0]; data[2].id = data[0].id + 2;
      setBottles(data)
      if (data.length > 0) {
        setCurrentBottles(data.slice(0, Math.min(3, data.length)))
      }
    }
    getBottles()
  }, [])

  // 次の小瓶を表示する関数
  const handleNextBottle = () => {
    if (bottles.length > 0) {
      const nextIndex = (currentIndex + 1) % bottles.length
      setCurrentIndex(nextIndex)
      const newBottles = []
      for (let i = 0; i < 3; i++) {
        const index = (nextIndex + i) % bottles.length
        newBottles.push(bottles[index])
      }
      setCurrentBottles(newBottles)
    }
  }

  // 小瓶を拾う関数
  const handleClaimBottle = () => {
    if (!isConnected) {
      alert("小瓶を拾うにはウォレットを接続してください")
      return
    }

    if (currentBottles.length > 0 && onBottleClaimed) {
      currentBottles.forEach(bottle => onBottleClaimed(bottle))
    }

    // 次の小瓶を表示
    handleNextBottle()
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <img
          src="/ocean.webp"
          alt="Ocean background"
          className="w-full h-full object-cover object-[center_bottom]"
          style={{
            objectFit: 'cover',
            objectPosition: 'center bottom',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
      <div className="fixed inset-0 bg-black/20" />
      <div className="relative flex flex-col items-center justify-center h-full">
        <Ocean />
        {currentBottles.length > 0 ? (
          <div className="absolute z-20 w-full h-full">
            {currentBottles.map((bottle, index) => (
              <div
                key={bottle.id}
                className="cursor-pointer absolute"
                style={{
                  top: index === 0 ? '85%' : index === 1 ? '90%' : '80%',
                  left: index === 0 ? '45%' : index === 1 ? '20%' : '70%',
                  transform: `translate(-50%, -50%) rotate(${
                    index === 0 ? '10deg' : index === 1 ? '-5deg' : '-10deg'
                  })`,
                  width: 'min(12vw, 160px)',
                  height: 'min(12vw, 160px)'
                }}
                onClick={() => onBottleClaimed?.(bottle)}
              >
                <img
                  src={"/bottle.webp"}
                  alt="Bottle"
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute z-20 flex flex-col items-center gap-4 text-center bottom-10">
            {bottles.length > 0 && (
              <Button variant="outline" className="bg-white/80 hover:bg-white" onClick={() => setCurrentBottles(bottles.slice(0, Math.min(3, bottles.length)))}>
                <MessageCircle className="w-4 h-4 mr-2" />
                小瓶を見る
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
