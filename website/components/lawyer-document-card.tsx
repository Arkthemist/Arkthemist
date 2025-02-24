import { FileText } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Document {
  _id: string
  type: string
  createdAt: string
  case_status?: string
  assignee?: {
    name: string
    avatar?: string
  }
}

interface LawyerDocumentCardProps {
  doc: Document
  setSelectedDocument?: (doc: Document | any) => void
  setIsModalOpen?: (isModalOpen: boolean) => void
}

export const LawyerDocumentCard = ({ doc, setSelectedDocument, setIsModalOpen }: LawyerDocumentCardProps) => {
  if (!doc) {
    return null
  }

  const formatDocumentType = (type: string) => {
    return type.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <Card key={doc._id}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {formatDocumentType(doc.type)}
          </div>
          <Badge variant="secondary">
            {(() => {
              switch (doc?.case_status) {
                case 'pending-lawyer':
                  return "Awaiting your signature";
                case 'pending-signature':
                  return "Awaiting client's signature";
                case 'completed':
                  return "Completed";
                default:
                  return "Unknown status"; // Fallback for any other status
              }
            })()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Added on {new Date(doc.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={doc.assignee?.avatar || "/placeholder.svg"} alt={doc.assignee?.name || "Robert"} />
            <AvatarFallback>{doc.assignee?.name?.[0] || "R"}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="text-muted-foreground">Assigned to</p>
            <p className="font-medium">{doc.assignee?.name || "Robert"}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => {
            setSelectedDocument && setSelectedDocument(doc)
            setIsModalOpen && setIsModalOpen(true)
          }}
        >
          {doc.case_status === 'pending-signature' ? 'View' : 
           doc.case_status === 'completed' ? 'View document' : 
           'Review request'}
        </Button>
      </CardFooter>
    </Card>
  )
}

