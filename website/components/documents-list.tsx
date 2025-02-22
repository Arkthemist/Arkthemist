"use client"

import { FileText, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentsRequestForm } from "./document-request-form"

interface Document {
  id: string
  title: string
  date: string
  status: "pending" | "signed"
  content: string
}

const documents: Document[] = [
  {
    id: "1",
    title: "Partnership Agreement",
    date: "2024-02-21",
    status: "pending",
    content: "This is a sample partnership agreement document content...",
  },
  {
    id: "2",
    title: "Terms of Service",
    date: "2024-02-19",
    status: "pending",
    content: "This is a sample terms of service document content...",
  },
]

export default function DocumentsList() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

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
          <div className="grid gap-6 md:grid-cols-2">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {doc.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Added on {doc.date}</p>
                  <p className="mt-2 text-sm">This document requires your signature</p>
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
        </TabsContent>
        <TabsContent value="signed" className="mt-6">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No signed documents yet</h3>
            <p className="text-sm text-muted-foreground">Your signed documents will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
            <DialogDescription>Added on {selectedDocument?.date}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="rounded-lg border bg-muted/40 p-6">
              <p className="whitespace-pre-wrap font-mono text-sm">{selectedDocument?.content}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button>Sign Document</Button>
          </div>
        </DialogContent>
      </Dialog>

     
    </div>
  )
}

