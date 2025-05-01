import DashboardLayout from "@/providers/DashboardLayout";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function MenuFolderLayout({ children }: DashboardLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}