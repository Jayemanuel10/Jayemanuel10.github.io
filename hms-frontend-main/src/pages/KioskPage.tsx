import React, { useState } from "react";
import { QrCode, Users, CalendarCheck, Clock, HelpCircle, Globe, ChevronRight, ArrowLeft } from "lucide-react";
export const KioskPage = () => {
  const [language, setLanguage] = useState<"en" | "es" | "tl">("en");
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-400" />
        <select value={language} onChange={e => setLanguage(e.target.value as "en" | "es" | "tl")} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="tl">Tagalog</option>
        </select>
      </div>
      {/* Help Button */}
      <button className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <HelpCircle className="w-6 h-6" />
      </button>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to City General Hospital
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              How can we help you today?
            </p>
          </div>
          {/* Main Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* OPD Queue Card */}
            <button className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#13b8a4] dark:hover:border-[#13b8a4] transition-all duration-200 text-left">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-[#13b8a4]/10 rounded-xl">
                  <Users className="w-8 h-8 text-[#13b8a4]" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#13b8a4] transition-colors" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
                OPD Queue
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Get your queue number for outpatient consultation
              </p>
            </button>
            {/* Patient Data Access Card */}
            <button className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#13b8a4] dark:hover:border-[#13b8a4] transition-all duration-200 text-left">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-[#13b8a4]/10 rounded-xl">
                  <QrCode className="w-8 h-8 text-[#13b8a4]" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#13b8a4] transition-colors" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
                Patient Access
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Scan your QR code to view your records and billing
              </p>
            </button>
          </div>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <QuickActionButton icon={CalendarCheck} label="Appointments" sublabel="View or verify schedule" />
            <QuickActionButton icon={Clock} label="Wait Times" sublabel="Check current wait times" />
            <QuickActionButton icon={HelpCircle} label="Information" sublabel="Hospital information & FAQ" />
          </div>
          {/* Current Status Display */}
          <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Current OPD Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatusCard label="Now Serving" value="A-15" sublabel="General Medicine" />
              <StatusCard label="Current Queue" value="25" sublabel="Patients waiting" />
              <StatusCard label="Est. Wait Time" value="45 min" sublabel="Average wait time" />
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 City General Hospital
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For emergencies, please proceed to the Emergency Room
          </p>
        </div>
      </footer>
    </div>;
};
const QuickActionButton = ({
  icon: Icon,
  label,
  sublabel
}: {
  icon: React.ElementType;
  label: string;
  sublabel: string;
}) => <button className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#13b8a4] dark:hover:border-[#13b8a4] transition-all duration-200">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-[#13b8a4]/10 rounded-lg">
        <Icon className="w-5 h-5 text-[#13b8a4]" />
      </div>
      <div className="text-left">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{sublabel}</p>
      </div>
    </div>
  </button>;
const StatusCard = ({
  label,
  value,
  sublabel
}: {
  label: string;
  value: string;
  sublabel: string;
}) => <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-3xl font-bold text-gray-900 dark:text-white my-1">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{sublabel}</p>
  </div>;