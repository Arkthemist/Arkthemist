"use client"

import { useRef, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Chat } from "@/app/components/Chat"
import { PaymentModal } from "@/app/components/PaymentModal"

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

export default function NewCasePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [caseInfo, setCaseInfo] = useState<any>({})
  const [showPayment, setShowPayment] = useState(false)

  console.log('res messages', messages)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    setIsSubmitting(true);

    // Create a prompt with the form data
    const promptMessage = `
      solve_case, orderId: 6, issue description: tenant A, which has address ${formData.yourAddress}, is demanding tenant B, which has address: ${formData.defendantAddress}
      Case Title: ${formData.caseTitle}
      Issue description: ${formData.claim}
      Amount: ${formData.amount}
    `;

    setCaseInfo({
      title: formData.caseTitle,
      partyA: formData.yourAddress,
      partyB: formData.defendantAddress,
      amount: formData.amount
    })

    const userMessage: Message = {
      id: Date.now().toString(),
      content: promptMessage,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Log the prompt message for now
    console.log('Prompt message:', promptMessage);

    // Create a variable to store the room ID
    const roomId = 'asdasd123'; // Store the current room ID

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

      data.forEach((responseMsg: { text: string }) => {
        const botMessage: Message = {
          id: Date.now().toString() + Math.random(),
          content: responseMsg.text,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      })
      setHasSubmitted(true)

      // Redirect the user to the chat page with the roomId
      // window.location.href = `/chat?roomId=${roomId}`; // Redirect after the API call
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
          {!hasSubmitted &&
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
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-white text-black hover:bg-zinc-200"
                      onClick={(e) => {
                        e.preventDefault();
                        // handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                        setShowPayment(true)
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Case For Review'}
                    </Button>
                  </CardFooter>
                </Card>

                <PaymentModal
                  isOpen={showPayment}
                  onClose={() => setShowPayment(false)}
                  amount={Number(formData.amount)}
                  onConfirm={()=>{
                    handleSubmit();
                  }}
                  isSubmitting={isSubmitting}
                />
              </div>
            </Card>
          }

          {hasSubmitted &&
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-xl mb-4">{caseInfo?.title}</h1>
                  <p className="text-md mb-4">Paty A: {caseInfo?.partyA}</p>
                  <p className="text-md mb-4">Paty B: {caseInfo?.partyB}</p>
                </CardTitle>
              </CardHeader>
            </Card>
          }

          {hasSubmitted &&
            <Chat
              externalMessages={messages}
            // onSendMessage={(message) => {
            //   console.log('message', message)
            // }}
            //   messages={messages}
            />
          }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 