import { Button } from "@/components/ui/button"
import { FileText, UserRound } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DocumentsRequestForm } from "./document-request-form"
import { useAuth } from "@/contexts/auth-context"
import { DocumentUpload } from "../document-upload"
import { Separator } from "../ui/separator"
import SignDocument from "@/app/components/SignDocument"

interface PendingCardProps {
  selectedDocument?: any
  setIsModalOpen?: (isModalOpen: boolean) => void
  setDocuments?: (docs: any) => void
}

export const PendingCard = ({ selectedDocument, setIsModalOpen, setDocuments }: PendingCardProps) => {
  const { isLoggedIn, user } = useAuth();

  const sendForSignature = async () => {
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
          case_status: 'pending-signature',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document status');
      }

      const updatedDocument = await response.json();
      setDocuments && setDocuments((prevDocs: any) =>
        prevDocs.map((doc: any) => (doc._id === updatedDocument._id ? updatedDocument : doc))
      );

      setIsModalOpen && setIsModalOpen(false);
    } catch (error) {
      console.error('Error sending for signature:', error);
    }
  }

  console.log('selectedDocument', selectedDocument)

  return (
    <div className="">
      <DialogHeader>
        <DialogTitle>
          {selectedDocument?.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
        </DialogTitle>
        <DialogDescription>
          Added on {selectedDocument && new Date(selectedDocument.createdAt).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 mt-2">
        {/* <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserRound className="mr-2 h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div>
                <div className="font-medium">Company</div>
                <div className="text-sm text-muted-foreground"></div> 
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Document Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div>
                <div className="font-medium">Type</div>
                <div className="text-sm text-muted-foreground"></div>
              </div>
              <div>
                <div className="font-medium">Description</div>
                <div className="text-sm text-muted-foreground"></div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                  <span className="text-muted-foreground">Document preview will be displayed here</span>
                </div>
              </CardContent>
            </Card> */}

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
                <div>
                  {selectedDocument?.input && Object.entries(selectedDocument.input).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}:</strong> {value?.toString()}
                    </div>
                  ))}
                </div>
              )}
            </p>
          </div>
        </div>

        <DocumentUpload />
        <Separator />
        <div className="flex justify-end gap-4">
          <Button variant="outline">Reject Request</Button>
          {/* <Button onClick={() => sendForSignature()}>Complete & Send for Signature</Button> */}

          <SignDocument
            onClick={() => sendForSignature()}
          />
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