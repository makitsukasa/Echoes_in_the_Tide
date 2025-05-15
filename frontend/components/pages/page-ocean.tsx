"use client"

import { useState, useEffect } from "react"
import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Ocean } from "@/components/ui/ocean"
import { MessageCircle } from "lucide-react"
import { fetchBottles } from "@/lib/fetchBottles"
import { Bottle } from "@/lib/bottleUtil"
import { useAccount } from "wagmi"

interface PageOceanProps {
  isConnected: boolean
  onBottleClaimed?: (bottle: Bottle) => void
}

export function PageOcean({ isConnected, onBottleClaimed }: PageOceanProps) {
  const { address } = useAccount();
  const { data: bottles = [], error } = useSWR(
    address ? ['/api/bottles', address] : '/api/bottles',
    () => fetchBottles(address),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1000 * 60 * 10,
      dedupingInterval: 1000 * 60 * 10,
    }
  )

  // デバッグ用に3つ小瓶を表示
  if (bottles.length === 1) {
    const length = bottles[0].id.slice(2).length;
    bottles.push(JSON.parse(JSON.stringify(bottles[0])));
    bottles[1].id = "0x" + (parseInt(bottles[0].id, 16) + 1).toString(16).padStart(length, "0");
    bottles.push(JSON.parse(JSON.stringify(bottles[0])));
    bottles[2].id = "0x" + (parseInt(bottles[0].id, 16) + 2).toString(16).padStart(length, "0");
    console.log(bottles);
  }

  const [washedBottles, setWashedBottles] = useState<Bottle[]>([]);

  useEffect(() => {
    if (bottles.length > 0) {
      setWashedBottles(bottles.slice(0, Math.min(3, bottles.length)));
    }
  }, [bottles]);

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
        {washedBottles.length > 0 ? (
          <div className="absolute z-20 w-full h-full">
            {washedBottles.map((bottle, index) => (
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
              <Button variant="outline" className="bg-white/80 hover:bg-white" onClick={() => setWashedBottles(bottles.slice(0, Math.min(3, bottles.length)))}>
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
