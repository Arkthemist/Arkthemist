

// export default function SignupPage({
// 	searchParams,
// }: {
// 	searchParams: { address: string }
// }) {
// 	return (
// 		<div className="container max-w-xl py-10">
// 			<div className="mb-8 space-y-2 text-center">
// 				<h1 className="text-3xl font-bold">Complete Your Profile</h1>
// 				<p className="text-muted-foreground">Please provide additional information to complete your signup</p>
// 			</div>
// 			<SignupForm address={searchParams.address} />
// 		</div>
// 	)
// }


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
import { SignUpForm } from "@/components/sign-up-form"

export default function DashboardPage({ searchParams }: any) {

	// {
	// 	searchParams: { address: string }
	// }

	const { isLoggedIn, user } = useAuth();
	const [cases, setCases] = useState([]);

	useEffect(() => {
		async function fetchCases() {
			if (isLoggedIn) {
				const fetchedCases = await getAllCases();
				setCases(fetchedCases);
			}
		}
		fetchCases();
	}, [isLoggedIn]);

	// Filter cases based on their status
	const activeCasesList = cases.filter((caseItem: any) => caseItem.status === "active");
	const resolvedCasesList = cases.filter((caseItem: any) => caseItem.status === "resolved");

	return (
		<SidebarProvider>
			<AppSidebar />
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
						{user?.userType ? (
							<>
								You are ready to use the app
							</>
						) : (
							<div className="  py-10">
								<div className="mb-8 space-y-2 text-center">
									<h1 className="text-3xl font-bold">Complete Your Profile</h1>
									<p className="text-muted-foreground">Please provide additional information to complete your signup</p>
								</div>
								<SignUpForm address={searchParams.address} />
							</div>
						)}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

