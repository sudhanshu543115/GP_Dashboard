import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ZoomProvider } from "./context/ZoomContext";
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
import ProtectedRoute from './ProtectedRoute';
import UserManagement from './pages/identity/UserManagement';
import ManageContracts from './pages/Finance/Centers';

//  DASHBOARDS
const UnifiedDashboard = lazy(() => import('./pages/dashboard/UnifiedDashboard'));
const ManagementDashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const EvaluationDashboard = lazy(() => import('./pages/dashboard/evaluation/EvaluationDashboard'));
const IdentityDashboard = lazy(() => import('./pages/dashboard/IdentityHub/IdentityDashboard'));

//Sales
const SalesLeads = lazy(() => import('./pages/Sales/Leads'));
const SalesOpportunities = lazy(() => import('./pages/Sales/Opportunities'));
const SalesManageProjects = lazy(() => import('./pages/Sales/ManageProjects'));
const SalesCloseDeal = lazy(() => import('./pages/Sales/ClosedDeals'));
const SalesDealPipeline = lazy(() => import('./pages/Sales/DealPipeline'));
const SalesProjects = lazy(() => import('./pages/Sales/Projects'));


// Finance & Contracts

const SecurityDeposits = lazy(()=> import("./pages/Finance/SecurityDeposits"))
const Invoices = lazy(()=> import("./pages/Finance/invoice"))
const RecurringPayouts = lazy(()=> import("./pages/Finance/RecurringPayouts"))
const RecurringReports = lazy(()=> import("./pages/Finance/RevenueReports"))
const Center = lazy

//  MANAGEMENT
const Projects = lazy(() => import('./pages/adminmanagement/projects/Projects'));
const ArchivedProjects = lazy(() => import('./pages/adminmanagement/projects/ArchiveProjects'));
const AllProjects = lazy(() => import('./pages/adminmanagement/projects/AllProjects'));
const Blogs = lazy(() => import('./pages/adminmanagement/blogs/Blogs'));
const ClientsData = lazy(() => import('./pages/adminmanagement/clients/ClientsData'));
const ClientQueries = lazy(() => import('./pages/adminmanagement/queries/ClientQueries'));
const ClientCallbackData = lazy(() => import('./pages/adminmanagement/callback/ClientCallbackData'));
const Tables = lazy(() => import('./components/tables/Tables'));
const BillGenerate = lazy(() => import('./pages/adminmanagement/billing/BillGenerate'));
const InvoiceHistory = lazy(() => import('./pages/adminmanagement/billing/InvoiceHistory'));

//  EVALUATION
const AgentEvaluation = lazy(() => import('./pages/evaluation/AgentEvaluation'));
const TLEvaluation = lazy(() => import('./pages/evaluation/TLEvaluation'));
const QAEvaluation = lazy(() => import('./pages/evaluation/QAEvaluation'));
const CenterEvaluation = lazy(() => import('./pages/evaluation/CenterEvaluation'));
const ManageAdmin = lazy(() => import('./pages/evaluation/ManageAdmin'));
const Charts = lazy(() => import('./pages/evaluation/Charts'));

//  IDENTITY
// (UserManagement is statically imported at the top)

// Finance



const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-dark-900 dark:bg-dark-950 light:bg-light-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ZoomProvider>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
        <Routes>
          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              {/* DEFAULT REDIRECT */}
              <Route index element={<Navigate to="/dashboard/overview" replace />} />

              {/* DASHBOARDS */}
              <Route path="dashboard/overview" element={<UnifiedDashboard />} />
              <Route path="dashboard/management" element={<ManagementDashboard />} />
              <Route path="dashboard/evaluation" element={<EvaluationDashboard />} />
              <Route path="dashboard/identity" element={<UserManagement />} />

              {/* Sales */}
                <Route path="sales/leads" element={<SalesLeads />} />
              <Route path="sales/opportunities" element={<SalesOpportunities />} />
              <Route path="sales/projects" element={<SalesManageProjects />} />
              <Route path="sales/pipeline" element={<SalesDealPipeline />} />
              <Route path="sales/closed" element={<SalesCloseDeal />} />
              <Route path="sales/projects" element={<SalesProjects />} />

                  {/* Finance & Contracts */}


              <Route path="finance/centers" element={<ManageContracts />} />
              <Route path="finance/invoices" element={<Invoices />} />
              <Route path="finance/payouts" element={<RecurringPayouts />} />
              <Route path="finance/reports" element={<RecurringReports />} />
              <Route path="finance/deposits" element={<SecurityDeposits />} />


              {/* MANAGEMENT */}
              <Route path="management/blogs" element={<Blogs />} />
              <Route path="management/clients" element={<ClientsData />} />
              <Route path="management/projects" element={<Projects />} />
              <Route path="management/all-projects" element={<AllProjects />} />
              <Route path="management/archived" element={<ArchivedProjects />} />
              <Route path="management/queries" element={<ClientQueries />} />
              <Route path="management/callback" element={<ClientCallbackData />} />
              <Route path="management/tables" element={<Tables />} />
              <Route path="management/billing/generate" element={<BillGenerate />} />
              <Route path="management/billing/history" element={<InvoiceHistory />} />

              {/* EVALUATION */}
              <Route path="evaluation/agent" element={<AgentEvaluation />} />
              <Route path="evaluation/tl" element={<TLEvaluation />} />
              <Route path="evaluation/qa" element={<QAEvaluation />} />
              <Route path="evaluation/center" element={<CenterEvaluation />} />
              <Route path="evaluation/admin" element={<ManageAdmin />} />
              <Route path="evaluation/charts" element={<Charts />} />

              {/* IDENTITY */}
              <Route path="identity" element={<UserManagement />} />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/dashboard/management" replace />} />
            </Route>
          </Route>
        </Routes>
        </Suspense>
      </AuthProvider>
      </ZoomProvider>
    </ThemeProvider>
  );
}

export default App;