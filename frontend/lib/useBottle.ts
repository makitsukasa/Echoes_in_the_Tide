import { useState, useCallback, useRef } from "react"
import { mintAndAssignToOcean, claimBottle as claimBottleContract } from "./ocean-contract"
import { uploadToIPFS } from "./pinata"

export function useBottle() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const throwBottleRef = useRef<((formData: { name: string; description: string; image?: File }) => Promise<boolean>) | null>(null)

  const throwBottle = useCallback(async (formData: { name: string; description: string; image?: File }) => {
    try {
      setIsLoading(true)
      setError(null)
      const tokenURI = await uploadToIPFS({
        name: formData.name,
        description: formData.description,
        image: formData.image
      })
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
