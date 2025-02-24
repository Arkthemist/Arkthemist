import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CompletedCardProps {
  selectedDocument?: any
  setIsModalOpen?: (isModalOpen: boolean) => void
}

export const CompletedCard = ({ selectedDocument, setIsModalOpen }: CompletedCardProps) => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          <div className="flex">
            {selectedDocument?.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
            <Badge variant="secondary" className="ml-2 bg-green-600 hover:bg-green-600">
              Completed
            </Badge>
          </div>

        </DialogTitle>
        <DialogDescription>
          Added on {selectedDocument && new Date(selectedDocument.createdAt).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      {/* <div className="mt-4">
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
      </div> */}

      <div className="mt-[20px]">
        <iframe
          src={"https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/44678.pdf"}
          className="w-full h-[500px] rounded-b-lg"
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => { setIsModalOpen && setIsModalOpen(false) }}>
          Close
        </Button>
      </div>
    </div>
  )
}