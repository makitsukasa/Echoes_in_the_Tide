import { useBottle } from "@/lib/useBottle"
import { useBottleStore } from "@/lib/bottleStore"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Loader2 } from "lucide-react"
import { useState, useCallback } from "react"

interface ThrowBottleModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ThrowBottleModal({ isOpen, onClose }: ThrowBottleModalProps) {
  const [message, setMessage] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { throwBottle, isLoading, error } = useBottle()
  const { setIsThrowModalOpen } = useBottleStore()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

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
  }, [message, image, throwBottle, setIsThrowModalOpen])

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }, [])

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>小瓶を海に流す</DialogTitle>
          <DialogDescription>
            あなたの思いを小瓶に込めて、海に流しましょう。 誰かがあなたの小瓶を拾うかもしれません。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">メッセージ</Label>
              <Textarea
                id="message"
                placeholder="あなたの思いを書いてください..."
                className="min-h-32 resize-none"
                value={message}
                onChange={handleMessageChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">画像（任意）</Label>
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

              {preview && (
                <div className="mt-4 overflow-hidden rounded-md aspect-video bg-blue-50">
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading || !message.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  小瓶を流しています...
                </>
              ) : (
                "小瓶を海に流す"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
