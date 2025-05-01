import { 
  Users,
  Database,
  CreditCard,
  BarChart4,
  Settings,
  Shield,
  Bell,
  FileText,
  HelpCircle,
  LayoutDashboard,
  UserCheck
} from "lucide-react";

export type AdminNavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  { 
    name: "Admin Dashboard", 
    href: "/admin/dashboard", 
    icon: LayoutDashboard,
    description: "System overview and metrics"
  },
  { 
    name: "User Management", 
    href: "/admin/users", 
    icon: Users,
    description: "Manage user accounts and permissions"
  },
  { 
    name: "Leads", 
    href: "/admin/leads", 
    icon: UserCheck,
    description: "Track and manage sales leads"
  },
  { 
    name: "Data Management", 
    href: "/admin/data", 
    icon: Database,
    description: "Datasets and storage administration"
  },
  { 
    name: "Billing & Subscriptions", 
    href: "/admin/billing", 
    icon: CreditCard,
    description: "Manage plans, payments, and subscriptions"
  },
  { 
    name: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart4,
    description: "Usage statistics and trends"
  },
  { 
    name: "Security", 
    href: "/admin/security", 
    icon: Shield,
    description: "Security settings and audit logs"
  },
  { 
    name: "Content Management", 
    href: "/admin/content", 
    icon: FileText,
    description: "Manage help docs and resources"
  },
  { 
    name: "Support", 
    href: "/admin/support", 
    icon: HelpCircle,
    description: "User support requests and tickets"
  },
  { 
    name: "System Settings", 
    href: "/admin/settings", 
    icon: Settings,
    description: "Configure system-wide settings"
  },
];