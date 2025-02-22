'use client'

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CaseList } from "@/components/case-list";
import { getAllCases } from "@/utils/cases";
import { MessageCircle, PlusCircle } from "lucide-react";
import { UnauthorizedState } from "@/components/unauthorized-state";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { FileText, Gavel, MessageSquare, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ClientDashboardProps {
  isLoggedIn?: boolean
}

export const ClientDashboard = ({ isLoggedIn }: ClientDashboardProps) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
          Legal Services Made Simple
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Choose the service you need. Our platform provides professional legal assistance tailored to your
          requirements.
        </p>
      </div>

      <div className="mx-auto mt-8 grid gap-6 md:grid-cols-3 md:gap-8 lg:mt-12">
        <Card className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex justify-center">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-xl text-center mt-4">Legal Consultation</CardTitle>
            <CardDescription className="text-center">
              Connect with experienced lawyers for personalized legal advice and guidance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              <li className="flex items-center">• Free AI legal consultations</li>
              <li className="flex items-center">• Instant legal advice</li>
              <li className="flex items-center">• Secure communication</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold">$0</span>
              <span className="text-muted-foreground">/consultation</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/chat">Start free AI Consultation</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex justify-center">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-xl text-center mt-4">Document Creation</CardTitle>
            <CardDescription className="text-center">
              Professional legal document drafting and review services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              <li className="flex items-center">• Contract creation by a verified lawyer</li>
              <li className="flex items-center">• Document signing on the blockchain</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold">$40-$200</span>
              <span className="text-muted-foreground">/document</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/documents">Create Document</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex justify-center">
              <Gavel className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-xl text-center mt-4">Arbitration Service</CardTitle>
            <CardDescription className="text-center">
              Professional dispute resolution and mediation services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm text-muted-foreground">
              <li className="flex items-center">• Online arbitration</li>
              <li className="flex items-center">• Expert AI mediators</li>
              <li className="flex items-center">• Case management</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold">$0-$200</span>
              <span className="text-muted-foreground">/case</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/arbitration">Start Arbitration</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  )
}