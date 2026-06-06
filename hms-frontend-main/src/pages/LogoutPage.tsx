import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
export const LogoutPage = () => {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, logout]);
  return <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#13b8a4]/10 mb-4">
          <LogOut className="w-8 h-8 text-[#13b8a4]" />
        </div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Logging you out...
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Thank you for using Hospital Management System
        </p>
        <div className="w-16 h-1 bg-[#13b8a4]/20 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="w-16 h-1 bg-[#13b8a4] rounded-full animate-progress" />
        </div>
      </div>
    </div>;
};