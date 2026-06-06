import { Bell, LogOut, Menu, Moon, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockNotifications } from "../data/mockData";
import { getLocalData } from "../lib/utils";
import { apiGet, apiPost } from "../utils/api";
import { NotificationDropdown } from "./NotificationDropdown";
import { useTheme } from "./ThemeProvider";
interface HeaderProps {
  onMenuClick: () => void;
}
export const Header = ({
  onMenuClick
}: HeaderProps) => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const handleLogout = async () => {
    try {
      await apiPost("/logout");
  
      // Clear token from storage
      localStorage.removeItem("token");
  
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => notif.id === id ? {
      ...notif,
      read: true
    } : notif));
  };
  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getLocalData('token');
  
      if (!token) {
        navigate("/login");
        return;
      }
  
      try {
        await apiGet("/user"); // Uses reusable GET method
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
  
    checkAuth();
  }, [navigate]);
  
  return <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              {theme === "light" ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {notifications.some(n => !n.read) && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              <NotificationDropdown notifications={notifications} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
            </div>
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1.5 transition-all duration-200">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80" alt="User" className="w-7 h-7 rounded-full ring-2 ring-[#13b8a4]/20" />
                <div className="hidden sm:block text-right">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Dr. Sarah Wilson
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Head of Department
                  </div>
                </div>
              </button>
              {showProfileMenu && <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80" alt="User" className="w-12 h-12 rounded-full ring-2 ring-[#13b8a4]/20" />
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dr. Sarah Wilson
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          sarah.wilson@hospital.com
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/settings");
                }} className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </header>;
};