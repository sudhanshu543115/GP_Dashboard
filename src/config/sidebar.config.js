import {
  Activity,
  Briefcase,
  FolderOpen,
  Users,
  Phone,
  PhoneCall,
  Table,
  DollarSign,
  CreditCard,
  History,
  BarChart2,
  Repeat,
  UserCheck,
  UserCog,
  ClipboardCheck,
  Building2,
  Settings,
  PieChart,
  Shield,
  UserSquare,
  FileText
} from "lucide-react";

export const SIDEBAR_CONFIG = [
  {
    key: "overview",
    type: "item",
    label: "Executive Overview",
    path: "/dashboard/overview",
    icon: Activity,
    section: "MAIN"
  },

  {
    key: "sales",
    type: "menu",
    label: "Sales & Pipeline",
    icon: Briefcase,
    section: "SALES",
    children: [
      { key: "leads", label: "Leads", path: "/sales/leads", icon: Briefcase },
      { key: "projects", label: "Projects", path: "/sales/projects", icon: Briefcase },
      // { key: "opportunities", label: "Opportunities", path: "/sales/opportunities", icon: Briefcase },
      // { key: "pipeline", label: "Deal Pipeline", path: "/sales/pipeline", icon: Briefcase },
      { key: "closedProject", label: "Closed Deals", path: "/management/archived", icon: Briefcase },
      
    ]
  },

  {
    key: "operations",
    type: "menu",
    label: "Project Operations",
    icon: Briefcase,
    section: "OPERATIONS",
    children: [
      { key: "projects", label: "Active Projects", path: "/management/projects", icon: Briefcase },
      { key: "archivedProjects", label: "Archived Projects", path: "/management/archived", icon: Briefcase },
      // { key: "ManageProjects", label: "Manage Projects", path: "/management/projects", icon: FolderOpen }
    ]
  },

  {
    key: "clients",
    type: "menu",
    label: "Client Management",
    icon: Users,
    section: "CLIENTS",
    children: [
      { key: "clientDirectory", label: "Client Directory", path: "/management/clients", icon: Users },
      { key: "clientQueries", label: "Client Queries", path: "/management/queries", icon: Phone },
      { key: "callback", label: "Callback Requests", path: "/management/callback", icon: PhoneCall },
      // { key: "billingGenerate", label: "Bill Generate", path: "/management/billing/generate", icon: CreditCard },
      { key: "billingHistory", label: "Invoice History", path: "/management/billing/history", icon: History }
    ]
  },

 {
  key: "finance",
  type: "menu",
  label: "Finance & Contracts",
  icon: BarChart2,  // Finance menu main icon
  section: "FINANCE",
  children: [
    { key: "centers", label: "Centers", path: "/finance/centers", icon: FileText },
    { key: "invoices", label: "Invoices", path: "/finance/invoices", icon: UserCheck },
    { key: "revenue", label: "Revenue Reports", path: "/finance/reports", icon: PieChart },
    // { key: "payouts", label: "Recurring Payouts", path: "/finance/payouts", icon: Repeat },  // Recurring Payouts icon
    { key: "deposits", label: "Security Deposits", path: "/finance/deposits", icon: DollarSign } // Deposits icon
  ]
},

  {
    key: "performance",
    type: "menu",
    label: "Evaluation & Monitoring",
    icon: BarChart2,
    section: "PERFORMANCE",
    children: [
      { key: "performanceDashboard", label: "Performance Dashboard", path: "/performance", icon: BarChart2 },
      { key: "centerEval", label: "Center Evaluation", path: "/evaluation/center", icon: Building2 },
      { key: "agentEval", label: "Agent Evaluation", path: "/evaluation/agent", icon: UserCheck },
      { key: "projectEval", label: "QA Evaluation", path: "/evaluation/qa", icon: UserCog },
      { key: "tlEval", label: "TL Evaluation", path: "/evaluation/tl", icon: ClipboardCheck }
    ]
  },

  {
    key: "identity",
    type: "item",
    label: "Identity & Access",
    path: "/dashboard/identity",
    icon: Shield,
    section: "ADMINISTRATION"
  },

  {
    key: "blogs",
    type: "item",
    label: "Blogs",
    path: "/management/blogs",
    icon: FileText,
    section: "CONTENT"
  }
];