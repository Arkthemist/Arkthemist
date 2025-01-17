import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CaseList } from "@/components/case-list"
import { activeCases } from "@/utils/cases"
import { MessageCircle, PlusCircle } from "lucide-react"

export default function Page() {
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Cases</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
          <div className="min-h-screen bg-background p-4 space-y-6">
            {/* Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="flex items-center justify-center border-border bg-card">
                <div className="w-full p-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Active Cases</h2>
                  <div className="w-full">
                    <CaseList cases={activeCases} />
                  </div>
                </div>
              </Card>
              <Card className="flex items-center justify-center border-border bg-card p-6">
                <h2 className="text-2xl font-semibold text-foreground">Resolved Cases</h2>
              </Card>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-12 bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
                asChild
              >
                <Link href="/cases/new" className="flex items-center justify-center gap-3">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create a New Case</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
                asChild
              >
                <Link href="/chat" className="flex items-center justify-center gap-3">
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat to Get Advice</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
