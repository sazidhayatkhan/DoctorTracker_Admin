import React from "react";

import AuthGuard from "@/components/auth/AuthGuard";
import TopBar from "@/components/layouts/TopBar";
import SideBar from "@/components/layouts/sidebar/SideBar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <SideBar />

        <SidebarInset className="min-h-svh min-w-0">
          <TopBar />

          <main className="flex-1 bg-muted/30 p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default DashboardLayout;