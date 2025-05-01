import AdminDashboardLayout from "@/components/admin/layout/AdminDashboardLayout";
import { ReactNode } from "react";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export default function AdminFolderLayout({ children }: AdminDashboardLayoutProps) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}