"use client"

import { FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentsRequestForm } from "./document-request-form"

interface Document {
  _id: string
  type: string
  case_status: string
  input: any
  documentUrl?: string
  createdAt: string
}

export default function DocumentsList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/forms', {
          headers: {
            'user-type': 'client', // or 'lawyer' depending on the user type
            'user-id': '0x037842c7063587d86cb52c9dd1f161e039275058040a25aa3f3b284e805be61d', // replace with actual user ID from auth
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

  const pendingDocuments = documents.filter(doc => doc.case_status === 'pending-lawyer' || doc.case_status === 'pending-client')
  const signedDocuments = documents.filter(doc => doc.case_status === 'completed')

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Legal Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage and sign documents for your clients</p>
        </div>
        <DocumentsRequestForm />
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Documents</TabsTrigger>
          <TabsTrigger value="signed">Signed Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          {isLoading ? (
            <div className="text-center p-6">Loading...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pendingDocuments.map((doc) => (
                <Card key={doc._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Added on {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm">This document requires your attention</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedDocument(doc)
                        setIsModalOpen(true)
                      }}
                    >
                      Review & Sign
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="signed" className="mt-6">
          {signedDocuments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {signedDocuments.map((doc) => (
                <Card key={doc._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.type}
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
      </Tabs>

      {/* Document Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.type}</DialogTitle>
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            {selectedDocument?.case_status !== 'completed' && (
              <Button>Sign Document</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

