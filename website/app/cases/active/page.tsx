"use client"

import { useRef, useState } from "react"
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

const ELIZA_API_URL = process.env.NEXT_PUBLIC_ELIZA_API_URL
const AGENT_ID = "a9e6b80b-7aa5-090a-a403-36c9d676c764"
//a9e6b80b-7aa5-090a-a403-36c9d676c764

export default function ActiveCasesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
                  <BreadcrumbPage>Active Cases</BreadcrumbPage>
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
                    <h1 className="text-2xl mb-4">Active Cases</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                </CardContent>
              </Card>
            </div>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 