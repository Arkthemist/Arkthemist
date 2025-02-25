import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FileHandler from "@/app/components/FileHandler"

interface DocumentUploadProps {
  documentId?: string
}

export const DocumentUpload = ({ documentId }: DocumentUploadProps) => {
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setIsDocumentUploaded(true)
      // Optionally, handle the file here
      event.dataTransfer.clearData()
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsDocumentUploaded(true)
      // Optionally, handle the file here
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Document/Contract uploading</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div
            className={`flex items-center justify-center rounded-lg border border-dashed cursor-pointer ${isDocumentUploaded ? 'h-[400px]' : 'h-[200px]'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
          >
            <span className="text-muted-foreground">
              {isDocumentUploaded ? "Document preview will be displayed here" : "Upload the document"}
            </span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          /> */}

          <FileHandler documentId={documentId} />
        </CardContent>
      </Card>
    </div>
  )
}