import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { Bottle } from "@/types/bottle"

interface BottleDetailModalProps {
  data: Bottle | null
  onClose: () => void
  onClaim: (tokenId: string) => void
}

export function BottleDetailModal({ data, onClose, onClaim }: BottleDetailModalProps) {
  if (!data) return null

  return (
    <Dialog open={!!data} onOpenChange={onClose}>
      <DialogContent className="w-auto max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>小瓶のメッセージ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {data.image && (
            <div className="flex justify-center">
              <div className="relative w-full max-h-[60vh] overflow-hidden rounded-md bg-blue-50">
                <img
                  src={data.image}
                  alt="Bottle content"
                  className="object-contain w-full h-full"
                  style={{ maxHeight: '60vh' }}
                />
              </div>
            </div>
          )}
          <p className="text-gray-700">{data.message || data.description}</p>
          <div className="flex justify-end">
            <Button onClick={() => onClaim(data.id)}>
              <Bookmark className="w-4 h-4 mr-2" />
              この小瓶を拾う
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
