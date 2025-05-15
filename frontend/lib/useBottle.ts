import { useState, useCallback, useRef } from "react"
import { mintAndAssignToOcean, claimBottle as claimBottleContract } from "./ocean-contract"
import { uploadToIPFS } from "../app/filebase-actions"

// Filebaseの設定状態を確認する関数
function isFilebaseConfigured(): boolean {
  const key = localStorage.getItem('filebase_key')
  const secret = localStorage.getItem('filebase_secret')
  return !!(key && secret)
}

// FilebaseのAPIキーを取得する関数
function getFilebaseCredentials(): { key: string; secret: string } | null {
  const key = localStorage.getItem('filebase_key')
  const secret = localStorage.getItem('filebase_secret')
  if (!key || !secret) return null
  return { key, secret }
}

// メタデータをBase64エンコードされたJSONに変換する関数
function createOnChainMetadata(data: { name: string; description: string; image?: File }): string {
  const metadata = {
    name: data.name,
    description: data.description,
    // 画像はオンチェーンには保存しない
  }

  const jsonString = JSON.stringify(metadata)
  // UTF-8でエンコードしてからBase64に変換
  const utf8String = encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }
  );
  const base64 = btoa(utf8String)
  return `data:application/json;base64,${base64}`
}

export function useBottle() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const throwBottleRef = useRef<((formData: { name: string; description: string; image?: File }) => Promise<boolean>) | null>(null)

  const throwBottle = useCallback(async (formData: { name: string; description: string; image?: File }) => {
    try {
      setIsLoading(true)
      setError(null)

      let tokenURI: string

      // Filebaseが設定されている場合はFilebaseを使用
      if (isFilebaseConfigured()) {
        const credentials = getFilebaseCredentials()
        if (!credentials) throw new Error('Filebaseの認証情報が取得できません')

        tokenURI = await uploadToIPFS(
          {
            name: formData.name,
            description: formData.description,
            image: formData.image
          },
          credentials.key,
          credentials.secret
        )
      } else {
        // Filebaseが設定されていない場合はオンチェーンに書き込む
        tokenURI = createOnChainMetadata(formData)
      }

      await mintAndAssignToOcean(tokenURI)
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : "小瓶を流す際にエラーが発生しました")
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  throwBottleRef.current = throwBottle

  const wrappedThrowBottle = useCallback(async (formData: { name: string; description: string; image?: File }) => {
    if (!throwBottleRef.current) {
      throw new Error("throwBottleが初期化されていません")
    }
    return throwBottleRef.current(formData)
  }, [])

  const claimBottle = useCallback(async (tokenId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Claiming bottle with tokenId:', tokenId);
      await claimBottleContract(tokenId)
      return true
    } catch (error) {
      setError(error instanceof Error ? error.message : "小瓶を拾う際にエラーが発生しました")
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { throwBottle: wrappedThrowBottle, claimBottle, isLoading, error }
}
