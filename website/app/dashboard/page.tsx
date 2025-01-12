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
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
          <div className="min-h-screen bg-gray-950 p-4 space-y-6">
            {/* Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="flex items-center justify-center border border-white/20 bg-gray-950 transition-colors">
                <div className="w-full p-[10px]">
                  <h2 className="text-2xl text-white mb-2">Active Cases</h2>
                  <div className="w-full">
                    <CaseList cases={activeCases} />
                  </div>
                </div>
              </Card>
              <Card className="h-32 flex items-center justify-center border border-white/20 bg-gray-950 transition-colors">
                <h2 className="text-2xl text-white">Resolved Cases</h2>
              </Card>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-12 text-base relative group overflow-hidden bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5"
                asChild
              >
                <Link href="/cases/new" className="flex items-center justify-center gap-3">
                  <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Create a New Case</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base relative group overflow-hidden bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5"
                asChild
              >
                <Link href="/chat" className="flex items-center justify-center gap-3">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Chat to Get Advice</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
