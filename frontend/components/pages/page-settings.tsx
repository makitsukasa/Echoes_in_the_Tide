"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { saveEncryptedCredentials, getCredentialsFromSession } from "@/lib/encryption"

export default function PageSettings() {
  const [key, setKey] = useState("")
  const [secret, setSecret] = useState("")
  const [saved, setSaved] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // セッションストレージから直接確認
    const credentials = getCredentialsFromSession()
    if (credentials) {
      setKey(credentials.key)
      setSecret(credentials.secret)
      setIsConfigured(true)
    } else {
      // localStorageに暗号化されたデータがあるか確認
      const hasEncryptedData = localStorage.getItem("encryptedFilebaseKey") &&
                             localStorage.getItem("encryptedFilebaseSecret")
      setIsConfigured(!!hasEncryptedData)
    }
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await saveEncryptedCredentials(key, secret)
      setSaved(true)
      setIsConfigured(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    localStorage.removeItem("encryptedFilebaseKey")
    localStorage.removeItem("encryptedFilebaseSecret")
    sessionStorage.removeItem("encryptedFilebaseKey")
    sessionStorage.removeItem("encryptedFilebaseSecret")
    sessionStorage.removeItem("sessionFilebaseKey")
    sessionStorage.removeItem("sessionFilebaseSecret")
    setKey("")
    setSecret("")
    setDeleted(true)
    setIsConfigured(false)
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
              {isConfigured && !saved && !deleted && (
                <div className="text-green-600 text-sm">Filebase API情報が保存されています</div>
              )}
              <Input
                id="filebase-key"
                value={key}
                onChange={e => setKey(e.target.value)}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="filebase-secret">Filebase Secret</Label>
              <Input
                id="filebase-secret"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                autoComplete="off"
                type="password"
                disabled={isLoading}
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </CardFooter>
          <div className="flex flex-col items-center gap-2 mt-2">
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isLoading}
            >
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
