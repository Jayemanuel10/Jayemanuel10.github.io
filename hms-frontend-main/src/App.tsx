import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { KioskLayout } from "./components/KioskLayout";
import { ThemeProvider } from "./components/ThemeProvider";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage, PatientsPage, AppointmentsPage, DoctorsPage, PharmacyPage, MaterialsPage, DietaryPage, LaboratoryPage, MessagesPage, EMRPage, ADTPage, BillingPage, ReportsPage, NotificationsPage, EmployeesPage, AttendancePage, LeavePage, PayrollPage, PerformancePage, RequestsPage, LogsPage, KioskPage } from "./pages";
const Dashboard = lazy(() => import("./components/Dashboard").then(module => ({
  default: module.Dashboard
})));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(module => ({
  default: module.SettingsPage
})));
const LogoutPage = lazy(() => import("./pages/LogoutPage").then(module => ({
  default: module.LogoutPage
})));
const PageLoader = () => <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
  <div className="text-center space-y-3">
    <Loader2 className="w-10 h-10 text-[#13b8a4] animate-spin mx-auto" />
    <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
  </div>
</div>;
const ProtectedRoute = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    isAuthenticated
  } = useAuth();
  if (!isAuthenticated) {
    // return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export function App() {
  return <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route element={<KioskLayout />}>
              <Route path="/kiosk" element={<KioskPage />} />
            </Route>
            <Route element={<ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/pharmacy" element={<PharmacyPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/dietary" element={<DietaryPage />} />
              <Route path="/laboratory" element={<LaboratoryPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/emr" element={<EMRPage />} />
              <Route path="/adt" element={<ADTPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>;
}