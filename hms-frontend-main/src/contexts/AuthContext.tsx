import React, { useState, createContext, useContext } from "react";
type EmployeeType = "Doctor/Physician" | "Nurse" | "Administrator" | "Lab Technician" | "Pharmacist" | "Reception Staff" | "HR Personnel" | "IT Staff";
interface AuthContextType {
  isAuthenticated: boolean;
  employeeType: EmployeeType | null;
  login: (employeeType: EmployeeType) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeType, setEmployeeType] = useState<EmployeeType | null>(null);
  const login = (type: EmployeeType) => {
    setIsAuthenticated(true);
    setEmployeeType(type);
  };
  const logout = () => {
    setIsAuthenticated(false);
    setEmployeeType(null);
  };
  return <AuthContext.Provider value={{
    isAuthenticated,
    employeeType,
    login,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}