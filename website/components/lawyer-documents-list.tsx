"use client"

import { FileText, UserRound } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentsRequestForm } from "./document-request-form"
import { useAuth } from "@/contexts/auth-context"
import { Separator } from "./ui/separator"
import { DocumentUpload } from "./document-upload"
import { LawyerDocumentCard } from "./lawyer-document-card"

import { PendingCard } from "./lawyer/pending-card"
import { SignedCard } from "./lawyer/signed-card"
import { CompletedCard } from "./lawyer/completed-card"
import PayWithStark from "@/app/components/PayWithStark"

interface Document {
  _id: string
  type: string
  case_status: string
  input: any
  documentUrl?: string
  formId?: string
  createdAt: string
}

export default function LawyerDocumentsList() {
  const { isLoggedIn, user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  console.log('selectedDocument', selectedDocument)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/forms', {
          headers: {
            'user-type': 'lawyer', // or 'lawyer' depending on the user type
            'user-id': user?.walletAddress ?? ''
          },
        })
        if (!response.ok) throw new Error('Failed to fetch documents')
        const data = await response.json()

        console.log('data', data)
        setDocuments(data)
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const pendingDocuments = documents.filter((doc: any) => doc.case_status === 'pending-lawyer')
  const signedDocuments = documents.filter((doc: any) => doc.case_status === 'pending-signature')
  const completedDocuments = documents.filter((doc: any) => doc.case_status === 'completed')

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lawyer Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage client documents: review, create, and sign with ease.
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending requests</TabsTrigger>
          <TabsTrigger value="signed">Signed Documents</TabsTrigger>
          <TabsTrigger value="completed">Completed Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">

          {pendingDocuments.length > 0 && <p className="mb-2">You have documents pending review. Please check them for any necessary actions.</p>}
          {pendingDocuments.length === 0 && <p className="mb-2">You don't have any requests to review.</p>}

          {isLoading ? (
            <div className="text-center p-6">Loading...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pendingDocuments.map((doc: any, index: number) => (
                <LawyerDocumentCard
                  doc={doc}
                  setSelectedDocument={setSelectedDocument}
                  setIsModalOpen={setIsModalOpen}
                  key={`lawyer-pendingDocuments-${index}`}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="signed" className="mt-6">
          {signedDocuments && <p className="mb-2">You have uploaded and signed the contract. Awaiting the user to sign it.</p>}
          {signedDocuments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {signedDocuments.map((doc: any, index: number) => (
                <LawyerDocumentCard
                  doc={doc}
                  setSelectedDocument={setSelectedDocument}
                  setIsModalOpen={setIsModalOpen}
                  key={`lawyer-signedDocuments-${index}`}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No signed documents yet</h3>
              <p className="text-sm text-muted-foreground">Your signed documents will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedDocuments && <p className="mb-2">These documents have been signed by both you and the client. No further action is required.</p>}
          {completedDocuments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {completedDocuments.map((doc: any, index: number) => (
                <LawyerDocumentCard
                  doc={doc}
                  setSelectedDocument={setSelectedDocument}
                  setIsModalOpen={setIsModalOpen}
                  key={`lawyer-completedDocuments-${index}`}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No completed documents yet</h3>
              <p className="text-sm text-muted-foreground">Your completed documents will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* {selectedDocument?.case_status === 'pending-lawyer' && <PendingCard selectedDocument={selectedDocument} setIsModalOpen={setIsModalOpen} setDocuments={setDocuments}  />} */}

      {/* Document Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[90%] max-w-5xl overflow-y-auto">
          {selectedDocument?.case_status === 'pending-lawyer' && <PendingCard selectedDocument={selectedDocument} setIsModalOpen={setIsModalOpen} setDocuments={setDocuments}  />}
          {selectedDocument?.case_status === 'pending-signature' && <SignedCard selectedDocument={selectedDocument} setIsModalOpen={setIsModalOpen} setDocuments={setDocuments} />}
          {selectedDocument?.case_status === 'completed' && <CompletedCard selectedDocument={selectedDocument} setIsModalOpen={setIsModalOpen} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

