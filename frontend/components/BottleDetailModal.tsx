import { useBottle } from "@/lib/useBottle"
import { useBottleStore } from "@/lib/bottleStore"
import { Bottle } from "@/types/bottle"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface BottleDetailModalProps {
  data: Bottle | null
  onClose: () => void
}

export function BottleDetailModal({ data, onClose }: BottleDetailModalProps) {
  const { claimBottle, isLoading, error } = useBottle()
  const { setSelectedBottle } = useBottleStore()

  const handleClaim = async () => {
    if (!data) return
    try {
      await claimBottle(data.tokenId)
      setSelectedBottle(null)
    } catch (error) {
      console.error("小瓶を拾い上げられませんでした:", error)
    }
  }

  if (!data) return null

  return (
    <Dialog open={!!data} onOpenChange={onClose}>
      <DialogContent className="w-auto max-w-[min(50vw,800px)] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>小瓶の中身</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">メッセージ</h4>
            <p className="text-sm text-gray-500">{data.description}</p>
          </div>
          {data.image && (
            <div className="space-y-2">
              <h4 className="font-medium">画像</h4>
              <img
                src={data.image}
                alt="Bottle content"
                className="w-full h-auto max-h-[50vh] object-contain rounded-md"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
          <Button onClick={handleClaim} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                拾い上げ中...
              </>
            ) : (
              "この小瓶を拾い上げる"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
