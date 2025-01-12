"use client"

import { Send } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { ChangeEvent, FormEvent } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from 'lucide-react'
import supabase from "@/lib/supabaseClient"; // Adjust the path as necessary

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface LegalCaseFormData {
  caseTitle: string;
  yourAddress: string;
  defendantAddress: string;
  claim: string;
  amount: string;
  judgeModel: string;
  evidence: File | null;
}

const ELIZA_API_URL = "http://localhost:3000"
const AGENT_ID = "a9e6b80b-7aa5-090a-a403-36c9d676c764"
//a9e6b80b-7aa5-090a-a403-36c9d676c764

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch(`${ELIZA_API_URL}/${AGENT_ID}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userMessage.content,
          userId: "user",
          userName: "User",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()

      // Handle each message in the response
      data.forEach((responseMsg: { text: string }) => {
        const botMessage: Message = {
          id: Date.now().toString() + Math.random(),
          content: responseMsg.text,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      })
    } catch (error) {
      console.error("Error sending message:", error)
      // Optionally add an error message to the chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const [formData, setFormData] = useState<LegalCaseFormData>({
    caseTitle: "",
    yourAddress: "",
    defendantAddress: "",
    claim: "",
    amount: "",
    judgeModel: "",
    evidence: null
  })

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev: any) => ({
      ...prev,
      evidence: file
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a prompt with the form data
    const promptMessage = `
      Case Title: ${formData.caseTitle}
      Your Wallet Address: ${formData.yourAddress}
      Defendant's Wallet Address: ${formData.defendantAddress}
      Claim: ${formData.claim}
      Amount: ${formData.amount}
      Judge Model: ${formData.judgeModel}
      Evidence: ${formData.evidence ? formData.evidence.name : 'No evidence uploaded'}
    `;

    // Log the prompt message for now
    console.log('Prompt message:', promptMessage);

    // Create a variable to store the room ID
    const roomId = '933dd399-138e-4dcf-aa8a-371698943ea1'; // Store the current room ID

    // Send the prompt message to the API
    try {
      const response = await fetch(`${ELIZA_API_URL}/${AGENT_ID}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: promptMessage,
          userId: "1",
          roomId: roomId, // Use the roomId variable here
          userName: "User",
          unique: true
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send prompt message");
      }

      const data = await response.json();
      console.log('Response from API:', data);

      // Redirect the user to the chat page with the roomId
      window.location.href = `/chat?roomId=${roomId}`; // Redirect after the API call
    } catch (error) {
      console.error('Error sending prompt message:', error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>New Case</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="flex flex-1 flex-col">
            <div>
              <Card className="w-full max-w-4xl mx-auto bg-zinc-900 text-white border-zinc-800 mt-[20px]">
                <CardHeader>
                  <CardTitle>
                    <h1 className="text-2xl mb-4">Create new case</h1>
                    <Input
                      name="caseTitle"
                      value={formData.caseTitle}
                      onChange={handleInputChange}
                      placeholder="Write Case Title"
                      className="text-xl bg-zinc-800/50 border-zinc-700 placeholder:text-zinc-400"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yourAddress">Your Wallet Address</Label>
                      <Input
                        id="yourAddress"
                        name="yourAddress"
                        value={formData.yourAddress}
                        onChange={handleInputChange}
                        className="bg-zinc-800/50 border-zinc-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defendantAddress">Provide Address of Defendant</Label>
                      <Input
                        id="defendantAddress"
                        name="defendantAddress"
                        value={formData.defendantAddress}
                        onChange={handleInputChange}
                        placeholder="Enter defendant's address"
                        className="bg-zinc-800/50 border-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claim">Describe Your Claim In Natural Language</Label>
                    <Textarea
                      id="claim"
                      name="claim"
                      value={formData.claim}
                      onChange={handleInputChange}
                      placeholder="Describe your claim here..."
                      className="min-h-[200px] bg-zinc-800/50 border-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Submit Demanding Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount in $"
                        className="bg-zinc-800/50 border-zinc-700"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="judgeModel">Select AI Judge Model</Label>
                      <Select value={formData.judgeModel} onValueChange={handleSelectChange}>
                        <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt4">GPT-4 Judge</SelectItem>
                          <SelectItem value="claude">Claude Judge</SelectItem>
                          <SelectItem value="llama">Llama Judge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Your Evidence (Party A)</Label>
                    <div
                      className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center bg-zinc-800/50 cursor-pointer"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-zinc-400" />
                        <p className="text-sm text-zinc-400">
                          {formData.evidence ? formData.evidence.name : 'Drag and drop your files here or click to browse'}
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-white text-black hover:bg-zinc-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Case For Review'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 