import React, { useState, Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
const PageLoader = () => <div className="flex-1 flex items-center justify-center">
    <div className="text-center space-y-3">
      <Loader2 className="w-10 h-10 text-[#13b8a4] animate-spin mx-auto" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>;
export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 lg:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Suspense fallback={<PageLoader />}>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>;
};