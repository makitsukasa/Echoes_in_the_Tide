"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function PageSettings() {
  const [key, setKey] = useState("")
  const [secret, setSecret] = useState("")
  const [saved, setSaved] = useState(false)
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    setKey(localStorage.getItem("filebase_key") || "")
    setSecret(localStorage.getItem("filebase_secret") || "")
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("filebase_key", key)
    localStorage.setItem("filebase_secret", secret)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = () => {
    localStorage.removeItem("filebase_key")
    localStorage.removeItem("filebase_secret")
    setKey("")
    setSecret("")
    setDeleted(true)
    setTimeout(() => setDeleted(false), 2000)
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>設定</CardTitle>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filebase-key">Filebase Key</Label>
              <Input id="filebase-key" value={key} onChange={e => setKey(e.target.value)} autoComplete="off" />
            </div>
            <div>
              <Label htmlFor="filebase-secret">Filebase Secret</Label>
              <Input id="filebase-secret" value={secret} onChange={e => setSecret(e.target.value)} autoComplete="off" type="password" />
            </div>
            {/* 今後の拡張用にここに他の設定項目を追加可能 */}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">保存</Button>
          </CardFooter>
          <div className="flex flex-col items-center gap-2 mt-2">
            <Button type="button" variant="destructive" className="w-full" onClick={handleDelete}>
              Filebase API情報を消去
            </Button>
            {deleted && <div className="text-center text-red-600 py-2">消去しました</div>}
          </div>
          {saved && <div className="text-center text-green-600 py-2">保存しました</div>}
        </form>
      </Card>
    </div>
  )
}
