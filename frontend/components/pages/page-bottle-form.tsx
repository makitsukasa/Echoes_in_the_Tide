"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ConnectWalletSection } from "@/components/ui/ConnectWalletSection"
import { Send, Upload, Sparkles } from "lucide-react"
import { useBottle } from "@/lib/useBottle"
import { useBottleStore } from "@/lib/bottleStore"
import Image from 'next/image'
import { getCredentialsFromSession } from "@/lib/encryption"

interface PageBottleFormProps {
  isConnected: boolean
}

export function PageBottleForm({ isConnected }: PageBottleFormProps) {
  const [message, setMessage] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { throwBottle, isLoading } = useBottle()
  const { setIsThrowModalOpen } = useBottleStore()
  const [filebaseConfigured, setFilebaseConfigured] = useState(false)

  useEffect(() => {
    // セッションストレージから直接確認
    const credentials = getCredentialsFromSession()
    if (credentials) {
      setFilebaseConfigured(true)
    } else {
      // localStorageに暗号化されたデータがあるか確認
      const hasEncryptedData = localStorage.getItem("encryptedFilebaseKey") &&
                             localStorage.getItem("encryptedFilebaseSecret")
      setFilebaseConfigured(!!hasEncryptedData)
    }
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      alert("ウォレットを接続してください")
      return
    }

    if (!message.trim()) {
      alert("メッセージを入力してください")
      return
    }

    try {
      await throwBottle({
        name: "Echoes in the Tide",
        description: message,
        image: image || undefined
      })
      setMessage("")
      setImage(null)
      setPreview(null)
      setIsThrowModalOpen(false)
      alert("小瓶を海に流しました！")
    } catch (error) {
      console.error("小瓶を流す際にエラーが発生しました", error)
      alert("小瓶を流せませんでした。もう一度お試しください。")
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">小瓶を海に流す</CardTitle>
        <CardDescription>
          あなたの思いを小瓶に込めて、海に流しましょう。 誰かがあなたの小瓶を拾うかもしれません。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <ConnectWalletSection
            title="小瓶を流すには"
            description="ウォレットの接続が必要です"
          />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="message">メッセージ</Label>
                <Textarea
                  id="message"
                  placeholder="あなたの思いを書いてください..."
                  className="min-h-32 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">画像（任意）</Label>
                {!filebaseConfigured ? (
                  <div className="text-xs text-gray-500 mt-1">
                    画像をアップロードするには設定よりfilebase apiを登録してください
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      画像をアップロード
                    </Button>
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </div>
                )}
                {preview && (
                  <div className="mt-4 overflow-hidden rounded-md aspect-video bg-blue-50">
                    <Image
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-t-lg"
                      width={400}
                      height={200}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" className="w-full" disabled={isLoading || !message.trim()}>
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    小瓶を流しています...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    小瓶を海に流す
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-xs text-center text-gray-500">
        <p className="w-full">
          ※ 小瓶を流すには少量のガス代が必要です。
          <br />※ 一度流した小瓶は取り消せません。
        </p>
      </CardFooter>
    </Card>
  )
}
