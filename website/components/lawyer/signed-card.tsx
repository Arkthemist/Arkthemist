import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

interface SignedCardProps {
  selectedDocument?: any
  setIsModalOpen?: (isModalOpen: boolean) => void
  setDocuments?: (docs: any) => void
}

export const SignedCard = ({ selectedDocument, setIsModalOpen, setDocuments }: SignedCardProps) => {
  const { isLoggedIn, user } = useAuth();

  console.log('selectedDocument', selectedDocument)

  const approveAndSignDocument = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch('/api/forms', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'user-type': 'lawyer',
          'user-id': user?.walletAddress ?? '',
        },
        body: JSON.stringify({
          id: selectedDocument._id ?? '',
          case_status: 'completed',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document status');
      }

      const updatedDocument: any = await response.json();

      console.log('updatedDocument', updatedDocument);

      if (setDocuments) {
        setDocuments((prevDocs: any) =>
          prevDocs.map((doc: any) => (doc._id === updatedDocument._id ? updatedDocument : doc))
        );
      }

      // setIsModalOpen(false);
    } catch (error) {
      console.error('Error sending for signature:', error);
    }
  }

  return (
    <div className="overflow-auto max-h-[80vh]">
      <DialogHeader>
        <DialogTitle>
          {selectedDocument?.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
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
          src={selectedDocument?.documentUrl}
          className="w-full h-[650px] rounded-b-lg"
        />
      </div>

      {/* <PDFViewer
        url="https://pdfdrive.com.co/wp-content/pdfh/Fourth-Wing%20-The-Empyrean-Book-1.pdf"
      /> */}

      <div className="mt-6 flex justify-end gap-4">

        {/* <Button variant="outline" onClick={() => {
          approveAndSignDocument()
          setIsModalOpen && setIsModalOpen(false)
        }}>
          Approve document and Sign
        </Button> */}
        <Button variant="outline" onClick={() => { setIsModalOpen && setIsModalOpen(false) }}>
          Close
        </Button>
      </div>
    </div>
  )
}