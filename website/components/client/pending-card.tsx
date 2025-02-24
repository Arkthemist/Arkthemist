import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PendingCardProps {
  selectedDocument?: any
  setIsModalOpen?: (isModalOpen: boolean) => void
}

export const PendingCard = ({ selectedDocument, setIsModalOpen }: PendingCardProps) => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {selectedDocument?.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
        </DialogTitle>
        <DialogDescription>
          Added on {selectedDocument && new Date(selectedDocument.createdAt).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <div className="rounded-lg border bg-muted/40 p-6">
          <p className="whitespace-pre-wrap font-mono text-sm">
            {selectedDocument?.documentUrl ? (
              <iframe
                src={selectedDocument.documentUrl}
                className="w-full h-[60vh]"
                title="Document Preview"
              />
            ) : (
              JSON.stringify(selectedDocument?.input, null, 2)
            )}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => { setIsModalOpen && setIsModalOpen(false) }}>
          Close
        </Button>
      </div>
    </div>
  )
}