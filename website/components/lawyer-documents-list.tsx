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
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => (doc._id === updatedDocument._id ? updatedDocument : doc))
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sending for signature:', error);
    }
  }

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
              {pendingDocuments.map((doc: any) => (
                <Card key={doc._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Added on {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    {/* <p className="mt-2 text-sm">This document requires your attention</p> */}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedDocument(doc)
                        setIsModalOpen(true)
                      }}
                    >
                      Review request
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="signed" className="mt-6">
          {signedDocuments && <p className="mb-2">You have signed the contract. Awaiting the user to sign it.</p>}
          {signedDocuments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {signedDocuments.map((doc: any) => (
                <Card key={doc._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Signed on {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedDocument(doc)
                        setIsModalOpen(true)
                      }}
                    >
                      View Document
                    </Button>
                  </CardFooter>
                </Card>
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
              {completedDocuments.map((doc: any) => (
                <Card key={doc._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Signed on {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedDocument(doc)
                        setIsModalOpen(true)
                      }}
                    >
                      View Document
                    </Button>
                  </CardFooter>
                </Card>
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

      {/* Document Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[90%] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.type.replace(/-/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase())}
            </DialogTitle>
            <DialogDescription>
              Added on {selectedDocument && new Date(selectedDocument.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
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
                    {/* <div className="text-sm text-muted-foreground">{request.client}</div> */}
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    {/* <div className="text-sm text-muted-foreground">{request.clientEmail}</div> */}
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
                    {/* <div className="text-sm text-muted-foreground">{request.documentType}</div> */}
                  </div>
                  <div>
                    <div className="font-medium">Description</div>
                    {/* <div className="text-sm text-muted-foreground">{request.description}</div> */}
                  </div>
                </CardContent>
              </Card>
            </div>
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

            <DocumentUpload />
            <Separator />
            <div className="flex justify-end gap-4">
              <Button variant="outline">Reject Request</Button>
              <Button onClick={() => sendForSignature()}>Complete & Send for Signature</Button>
            </div>
          </div>

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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

