import React from "react";
import { FileText } from "lucide-react";
import { LoginPage } from "../components/LoginPage";
import { PatientsPage } from "./PatientsPage";
import { AppointmentsPage } from "./AppointmentsPage";
import { NotificationsPage } from "./NotificationsPage";
import { DoctorsPage } from "./DoctorsPage";
import { PharmacyPage } from "./PharmacyPage";
import { MaterialsPage } from "./MaterialsPage";
import { DietaryPage } from "./DietaryPage";
import { LaboratoryPage } from "./LaboratoryPage";
import { MessagesPage } from "./MessagesPage";
import { ADTPage } from "./ADTPage";
import { EMRPage } from "./EMRPage";
import { BillingPage } from "./BillingPage";
import { ReportsPage } from "./ReportsPage";
import { EmployeesPage } from "./EmployeesPage";
import { AttendancePage } from "./AttendancePage";
import { LeavePage } from "./LeavePage";
import { PayrollPage } from "./PayrollPage";
import { PerformancePage } from "./PerformancePage";
import { RequestsPage } from "./RequestsPage";
import { LogsPage } from "./LogsPage";
import { KioskPage } from "./KioskPage";

// Export all pages
export { LoginPage } from "../components/LoginPage";
export { PatientsPage } from "./PatientsPage";
export { AppointmentsPage } from "./AppointmentsPage";
export { NotificationsPage } from "./NotificationsPage";
export { DoctorsPage } from "./DoctorsPage";
export { PharmacyPage } from "./PharmacyPage";
export { MaterialsPage } from "./MaterialsPage";
export { DietaryPage } from "./DietaryPage";
export { LaboratoryPage } from "./LaboratoryPage";
export { MessagesPage } from "./MessagesPage";
export { ADTPage } from "./ADTPage";
export { EMRPage } from "./EMRPage";
export { BillingPage } from "./BillingPage";
export { ReportsPage } from "./ReportsPage";
export { EmployeesPage } from "./EmployeesPage";
export { AttendancePage } from "./AttendancePage";
export { LeavePage } from "./LeavePage";
export { PayrollPage } from "./PayrollPage";
export { PerformancePage } from "./PerformancePage";
export { RequestsPage } from "./RequestsPage";
export { LogsPage } from "./LogsPage";
export { KioskPage } from "./KioskPage";

// Only SettingsPage and LogoutPage remain as placeholders
export const SettingsPage = () => <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
    Settings Page Content
  </div>;
export const LogoutPage = () => <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
    Logout Page Content
  </div>;