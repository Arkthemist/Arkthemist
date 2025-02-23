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
import FileHandler from "../app/components/FileHandler";
import LawyerDocumentsList from "./lawyer-documents-list";

interface LawyerDashboardProps {
  isLoggedIn?: boolean
}

export const LawyerDashboard = ({ isLoggedIn }: LawyerDashboardProps) => {
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
    <div>
      {/* LAWYER DASHBOARD
     <FileHandler /> */}

      <LawyerDocumentsList />
    </div>
  )
}