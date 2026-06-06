import { BoxIcon, Briefcase, Building2, Calendar, ClipboardList, Clock, Database, DollarSign, FileBarChart, FileText, HelpCircle, LayoutDashboard, ListIcon, MessagesSquare, Pill, Receipt, Settings, Stethoscope, TrendingUp, Users, X } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getLocalData } from "../lib/utils";
const navItems = [{
  icon: LayoutDashboard,
  text: "Dashboard",
  path: "/dashboard"
}, {
  icon: Users,
  text: "Patients",
  path: "/patients"
}, {
  icon: Calendar,
  text: "Appointments",
  path: "/appointments"
}, {
  icon: Stethoscope,
  text: "Doctors",
  path: "/doctors"
}, {
  icon: Users,
  text: "Employees",
  path: "/employees"
}, {
  icon: Pill,
  text: "Pharmacy",
  path: "/pharmacy"
}, {
  icon: BoxIcon,
  text: "Materials",
  path: "/materials"
}, {
  icon: FileText,
  text: "Dietary",
  path: "/dietary"
}, {
  icon: Database,
  text: "Laboratory",
  path: "/laboratory"
}, {
  icon: MessagesSquare,
  text: "Messages",
  path: "/messages"
}, {
  icon: FileText,
  text: "EMR",
  path: "/emr"
}, {
  icon: Receipt,
  text: "ADT",
  path: "/adt"
}, {
  icon: FileBarChart,
  text: "Billing",
  path: "/billing"
}, {
  icon: ClipboardList,
  text: "Reports",
  path: "/reports"
}, {
  icon: Clock,
  text: "Attendance",
  path: "/attendance"
}, {
  icon: Briefcase,
  text: "Leave",
  path: "/leave"
}, {
  icon: TrendingUp,
  text: "Performance",
  path: "/performance"
}, {
  icon: DollarSign,
  text: "Payroll",
  path: "/payroll"
}, {
  icon: FileText,
  text: "Requests",
  path: "/requests"
}, {
  icon: ListIcon,
  text: "Logs",
  path: "/logs"
}];
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
export const Sidebar = ({
  isOpen,
  onClose
}: SidebarProps) => {
  const employeeType = getLocalData('employeeType');
  const getAuthorizedNavItems = () => {
    if (!employeeType) return [];
    const baseNavItems = [{
      icon: LayoutDashboard,
      text: "Dashboard",
      path: "/dashboard"
    }, {
      icon: MessagesSquare,
      text: "Messages",
      path: "/messages"
    }];
    const roleNavItems = {
      "Doctor/Physician": [{
        icon: Users,
        text: "Patients",
        path: "/patients"
      }, {
        icon: Calendar,
        text: "Appointments",
        path: "/appointments"
      }, {
        icon: FileText,
        text: "EMR",
        path: "/emr"
      }],
      Nurse: [{
        icon: Users,
        text: "Patients",
        path: "/patients"
      }, {
        icon: Calendar,
        text: "Appointments",
        path: "/appointments"
      }, {
        icon: FileText,
        text: "EMR",
        path: "/emr"
      }],
      Administrator: navItems,
      "Lab Technician": [{
        icon: Database,
        text: "Laboratory",
        path: "/laboratory"
      }, {
        icon: Users,
        text: "Patients",
        path: "/patients"
      }],
      Pharmacist: [{
        icon: Pill,
        text: "Pharmacy",
        path: "/pharmacy"
      }, {
        icon: Users,
        text: "Patients",
        path: "/patients"
      }],
      "Reception Staff": [{
        icon: Calendar,
        text: "Appointments",
        path: "/appointments"
      }, {
        icon: Users,
        text: "Patients",
        path: "/patients"
      }],
      "HR Personnel": [{
        icon: Users,
        text: "Employees",
        path: "/employees"
      }, {
        icon: Clock,
        text: "Attendance",
        path: "/attendance"
      }, {
        icon: Briefcase,
        text: "Leave",
        path: "/leave"
      }, {
        icon: DollarSign,
        text: "Payroll",
        path: "/payroll"
      }, {
        icon: TrendingUp,
        text: "Performance",
        path: "/performance"
      }],
      "IT Staff": [{
        icon: ListIcon,
        text: "Logs",
        path: "/logs"
      }, {
        icon: Settings,
        text: "Settings",
        path: "/settings"
      }]
    };
    if (employeeType === "Administrator") {
      return roleNavItems[employeeType];
    }
    return [...baseNavItems, ...(roleNavItems[employeeType] || [])];
  };
  const authorizedNavItems = getAuthorizedNavItems();
  const navigate = useNavigate();
  const location = useLocation();
  const [showGuide, setShowGuide] = useState(true);
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  const NavItem = ({
    icon: Icon,
    text,
    path
  }: {
    icon: React.ElementType;
    text: string;
    path: string;
  }) => <button onClick={() => handleNavigation(path)} className={`flex items-center w-full px-3 py-3.5 text-sm rounded-lg transition-all duration-200
        ${location.pathname === path ? "text-[#13b8a4] bg-[#13b8a4]/10" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
      <Icon className="w-5 h-5" />
      <span className="ml-3">{text}</span>
    </button>;
  return <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <aside className={`fixed lg:sticky top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-800 z-50 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-all duration-300 lg:transform-none ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center">
          <div className="flex items-center gap-3 min-w-0">
            <Building2 className="w-6 h-6 text-[#13b8a4] shrink-0" />
            <span className="text-[#13b8a4] text-lg font-medium truncate">
              Hospital Management
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ml-auto">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="py-4 space-y-1">
            {authorizedNavItems.map(item => <NavItem key={item.path} {...item} />)}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className={`${showGuide ? "block" : "hidden"} px-3 py-6 space-y-3 bg-[#13b8a4]/10 rounded-lg transition-all`}>
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#13b8a4]" />
              <p className="text-sm font-medium text-[#13b8a4]">Need Help?</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Check our system guide for detailed instructions and tips.
            </p>
            <button className="w-full text-sm text-white bg-[#13b8a4] hover:bg-[#13b8a4]/90 transition-all duration-200 rounded-lg px-4 py-2 active:scale-95">
              View Guide
            </button>
          </div>
          <div className="px-4 text-center mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 TechPro360
            </span>
          </div>
        </div>
      </aside>
    </>;
};