"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Hide sidebar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/";
  const isAuthPageWithoutUser = isAuthPage && pathname !== "/";

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {!isAuthPageWithoutUser && <Sidebar />}
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
