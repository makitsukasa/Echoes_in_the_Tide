"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Info, Wallet, Menu, Home, Send, ShoppingBasketIcon as Collection, History } from "lucide-react"

// UIコンポーネントのインポート
import { ConnectWallet } from "@/components/ui/connect-wallet"

// ページコンポーネントのインポート
import { PageOcean } from "@/components/pages/page-ocean"
import { PageBottleForm } from "@/components/pages/page-bottle-form"
import { PageBottleCollection } from "@/components/pages/page-bottle-collection"
import { PageBottleMemories } from "@/components/pages/page-bottle-memories"
import { BottleDetailModal } from "@/components/BottleDetailModal"
import ThrowBottleModal from "@/components/ThrowBottleModal"
import { fetchBottles } from "@/lib/fetchBottles"
import { connectWallet, getWalletAddress, mintAndAssignToOcean, claimBottle, tryAutoConnect } from "@/lib/callcontracts"
import { uploadToIPFS } from "@/lib/pinata"
import { Bottle } from "@/types/bottle"

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeView, setActiveView] = useState<string>("ocean")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showMenuText, setShowMenuText] = useState(false)
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isThrowModalOpen, setIsThrowModalOpen] = useState(false)

  // トランジションの時間を定数として定義（CSSのdurationと一致させる）
  const TRANSITION_DURATION = 300 // ミリ秒

  // ページ読み込み時に自動再接続を試みる
  useEffect(() => {
    const initializeWallet = async () => {
      if (await tryAutoConnect()) {
        const address = await getWalletAddress()
        setWalletAddress(address)
        setIsConnected(true)
      }
    }
    initializeWallet()

    // MetaMaskのアカウント変更イベントをリッスン
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // アカウントが切断された場合
        setIsConnected(false)
        setWalletAddress(null)
      } else {
        // アカウントが変更された場合
        setWalletAddress(accounts[0])
      }
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  // メニューの開閉状態が変わったときの処理
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (menuOpen) {
      // メニューが開くとき、トランジションが完了した後にテキストを表示
      timer = setTimeout(() => {
        setShowMenuText(true)
      }, TRANSITION_DURATION)
    } else {
      // メニューが閉じるとき、即座にテキストを非表示
      setShowMenuText(false)
    }

    // connectWalletイベントをリッスン
    const handleConnectWallet = () => {
      handleConnect()
    }
    window.addEventListener('connectWallet', handleConnectWallet)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('connectWallet', handleConnectWallet)
    }
  }, [menuOpen])

  const handleConnect = async () => {
    if (await connectWallet()) {
      const address = await getWalletAddress()
      setWalletAddress(address)
      setIsConnected(true)
    }
  }

  const handleBottleClick = async (bottle: Bottle) => {
    try {
      setSelectedBottle(bottle)
    } catch (error) {
      console.error("小瓶の中身を取得できませんでした:", error)
    }
  }

  const handleThrowBottle = async (formData: { name: string; description: string; image?: File }) => {
    try {
      const tokenURI = await uploadToIPFS(formData)
      await mintAndAssignToOcean(tokenURI)
    } catch (error) {
      console.error("小瓶を海に流せませんでした:", error)
    }
  }

  const handleClaimBottle = async (tokenId: string) => {
    try {
      await claimBottle(tokenId)
      setSelectedBottle(null)
    } catch (error) {
      console.error("小瓶を拾い上げられませんでした:", error)
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case "ocean":
        return <PageOcean isConnected={isConnected} onBottleClaimed={handleBottleClick} />
      case "create":
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <PageBottleForm isConnected={isConnected} onBottleSent={handleThrowBottle} />
          </div>
        )
      case "collection":
        return (
          <div className="min-h-[70vh]">
            <PageBottleCollection isConnected={isConnected} onBottleSelected={handleBottleClick} />
          </div>
        )
      case "memories":
        return (
          <div className="min-h-[70vh]">
            <PageBottleMemories isConnected={isConnected} onBottleSelected={handleBottleClick} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-sky-100 to-blue-200">
      <div className="container relative z-10 h-full px-4 py-6 mx-auto flex flex-col">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-serif text-blue-900"></h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Info className="w-5 h-5 text-blue-700" />
            </Button>
            {!isConnected ? (
              <ConnectWallet onConnect={handleConnect} />
            ) : (
              <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
                <Wallet className="w-4 h-4 mr-2" />
                接続済み {walletAddress}
              </Button>
            )}
          </div>
        </header>

        <div className="flex-1">
          {renderContent()}
        </div>
      </div>

      {/* ハンバーガーメニュー */}
      <div
        className="fixed top-1/2 -translate-y-1/2 z-50"
        style={{ right: '0', left: 'auto' }}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        onMouseMove={() => {
          if (!menuOpen) {
            setMenuOpen(true)
          }
        }}
      >
        <div
          className={`flex items-center transition-all duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-[calc(100%-2.5rem)]"
          }`}
          style={{ width: menuOpen ? "12rem" : "2.5rem" }}
        >
          <div
            className={`bg-white/70 backdrop-blur-sm shadow-lg rounded-l-lg py-4 px-2 transition-all duration-300 h-64 flex flex-col overflow-hidden ${
              menuOpen ? "w-full" : "w-10"
            }`}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            <div className="flex items-center justify-between mb-6 h-6">
              <div className={`transition-opacity duration-300 ${showMenuText ? "opacity-100" : "opacity-0"}`}>
                {showMenuText && <span className="font-medium text-blue-900">メニュー</span>}
              </div>
              <Menu className="w-5 h-5 text-blue-700 ml-auto shrink-0" />
            </div>

            <nav className="space-y-2 flex-1">
              <Button
                variant={activeView === "ocean" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeView === "ocean" ? "bg-white/30 text-blue-800 hover:bg-white/40" : "bg-transparent hover:bg-white/20"
                }`}
                style={activeView === "ocean" ? { backgroundColor: 'rgba(190, 240, 255, 0.4)' } : {}}
                onClick={() => {
                  setActiveView("ocean")
                  setMenuOpen(false)
                }}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span className={`ml-2 transition-opacity duration-300 ${showMenuText ? "opacity-100" : "opacity-0"}`}>
                  海を眺める
                </span>
              </Button>

              <Button
                variant={activeView === "create" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeView === "create" ? "bg-white/30 text-blue-800 hover:bg-white/40" : "bg-transparent hover:bg-white/20"
                }`}
                style={activeView === "create" ? { backgroundColor: 'rgba(190, 240, 255, 0.4)' } : {}}
                onClick={() => {
                  setActiveView("create")
                  setMenuOpen(false)
                }}
              >
                <Send className="w-4 h-4 shrink-0" />
                <span className={`ml-2 transition-opacity duration-300 ${showMenuText ? "opacity-100" : "opacity-0"}`}>
                  小瓶を流す
                </span>
              </Button>

              <Button
                variant={activeView === "collection" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeView === "collection" ? "bg-white/30 text-blue-800 hover:bg-white/40" : "bg-transparent hover:bg-white/20"
                }`}
                style={activeView === "collection" ? { backgroundColor: 'rgba(190, 240, 255, 0.4)' } : {}}
                onClick={() => {
                  setActiveView("collection")
                  setMenuOpen(false)
                }}
              >
                <Collection className="w-4 h-4 shrink-0" />
                <span className={`ml-2 transition-opacity duration-300 ${showMenuText ? "opacity-100" : "opacity-0"}`}>
                  拾った小瓶
                </span>
              </Button>

              <Button
                variant={activeView === "memories" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeView === "memories" ? "bg-white/30 text-blue-800 hover:bg-white/40" : "bg-transparent hover:bg-white/20"
                }`}
                style={activeView === "memories" ? { backgroundColor: 'rgba(190, 240, 255, 0.4)' } : {}}
                onClick={() => {
                  setActiveView("memories")
                  setMenuOpen(false)
                }}
              >
                <History className="w-4 h-4 shrink-0" />
                <span className={`ml-2 transition-opacity duration-300 ${showMenuText ? "opacity-100" : "opacity-0"}`}>
                  思い出す
                </span>
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* モーダルたち */}
      <BottleDetailModal
        data={selectedBottle}
        onClose={() => setSelectedBottle(null)}
        onClaim={handleClaimBottle}
      />
      <ThrowBottleModal
        isOpen={isThrowModalOpen}
        onClose={() => setIsThrowModalOpen(false)}
        onSubmit={handleThrowBottle}
      />
    </main>
  )
}
