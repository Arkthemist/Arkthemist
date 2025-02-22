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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CaseList } from "@/components/case-list";
import { getAllCases } from "@/utils/cases";
import { MessageCircle, PlusCircle } from "lucide-react";
import { UnauthorizedState } from "@/components/unauthorized-state";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { ClientDashboard } from "@/components/client-dashboard";
import { LawyerDashboard } from "@/components/lawyer-dashboard";
import { AppLawyerSidebar } from "@/components/app-lawyer-sidebar";

export default function DashboardPage() {
	const { isLoggedIn, user } = useAuth();

	console.log('user', user)

	return (
		<SidebarProvider>

			{user?.userType === "lawyer" ? (
				<AppLawyerSidebar />
			) : (
				<AppSidebar />
			)}
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										{user ? `Welcome, ${user.name}` : 'Dashboard'}
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
						{isLoggedIn ? (
							<>
								{user?.userType === "lawyer" ? (
									<LawyerDashboard isLoggedIn={isLoggedIn} />
								) : (
									<ClientDashboard isLoggedIn={isLoggedIn} />
								)}
							</>
						) : (
							<UnauthorizedState />
						)}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
