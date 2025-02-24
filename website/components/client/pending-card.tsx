import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface PendingCardProps {
  selectedDocument?: any
  setIsModalOpen?: (isModalOpen: boolean) => void
}

export const PendingCard = ({ selectedDocument, setIsModalOpen }: PendingCardProps) => {
  const router = useRouter();

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
          {selectedDocument ? (
            <table className="min-w-full bg-black border border-gray-700 rounded-lg">
              <tbody>
                {Object.entries(selectedDocument.input).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-700 last:border-none">
                    <td className="px-4 py-2 font-medium text-white bg-gray-800 w-1/3 capitalize">
                      {key.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-2 text-gray-300">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="whitespace-pre-wrap font-mono text-sm">
              No document available
            </p>
          )}
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