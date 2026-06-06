import React, { useState } from "react";
import { Settings, User, Bell, Shield, Sliders } from "lucide-react";
type TabType = "profile" | "preferences" | "notifications" | "security";
export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const tabs: {
    id: TabType;
    label: string;
    icon: React.ElementType;
  }[] = [{
    id: "profile",
    label: "Profile",
    icon: User
  }, {
    id: "preferences",
    label: "Preferences",
    icon: Sliders
  }, {
    id: "notifications",
    label: "Notifications",
    icon: Bell
  }, {
    id: "security",
    label: "Security",
    icon: Shield
  }];
  return <div className="max-w-4xl mx-auto py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-8 h-8 text-[#13b8a4]" />
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>
      <div className="flex flex-nowrap overflow-x-auto -mx-4 px-4 pb-4 mb-6 sm:mx-0 sm:px-0 sm:pb-0 sm:mb-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-md whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}>
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>)}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        {activeTab === "profile" && <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Profile Settings
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Profile settings coming soon...
            </p>
          </div>}
        {activeTab === "preferences" && <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Preferences
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Preferences settings coming soon...
            </p>
          </div>}
        {activeTab === "notifications" && <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Notification settings coming soon...
            </p>
          </div>}
        {activeTab === "security" && <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Security Settings
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Security settings coming soon...
            </p>
          </div>}
      </div>
    </div>;
};