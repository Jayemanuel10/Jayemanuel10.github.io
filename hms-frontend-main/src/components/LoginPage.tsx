import { ChevronDown, Loader2, Lock, Mail, Moon, Sun, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getLocalData, setLocalData } from "../lib/utils";
import { apiPost } from "../utils/api";
import { Modal } from "./Modal";
import { useTheme } from "./ThemeProvider";
const employeeTypes = ["Doctor/Physician", "Nurse", "Administrator", "Lab Technician", "Pharmacist", "Reception Staff", "HR Personnel", "IT Staff"];
const sampleCredentials = [{
  type: "Doctor/Physician",
  email: "doctor@hospital.com",
  password: "12345678"
}, {
  type: "Nurse",
  email: "nurse@hospital.com",
  password: "12345678"
}, {
  type: "Administrator",
  email: "admin@hospital.com",
  password: "12345678"
}, {
  type: "Lab Technician",
  email: "lab@hospital.com",
  password: "12345678"
}, {
  type: "Pharmacist",
  email: "pharmacist@hospital.com",
  password: "12345678"
}, {
  type: "Reception Staff",
  email: "reception@hospital.com",
  password: "12345678"
}, {
  type: "HR Personnel",
  email: "hr@hospital.com",
  password: "12345678"
}, {
  type: "IT Staff",
  email: "it@hospital.com",
  password: "12345678"
}];
export const LoginPage = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    login
  } = useAuth();
  const [employeeType, setEmployeeType] = useState(() => {
    return getLocalData("employeeType") || "";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"email" | "code">("email");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showTechProInfo, setShowTechProInfo] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiPost("/login", { email, password });

      // Assuming the API returns a token
      setLocalData("token", data.token);

      login(employeeType as EmployeeType);
      navigate("/dashboard");
    } catch (error) {
      alert(error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationStep === "email") {
      // Simulate sending verification code
      setVerificationStep("code");
    } else {
      // Verify code logic here
      console.log("Verification code:", verificationCode);
      setShowForgotPassword(false);
      setVerificationStep("email");
      setVerificationCode("");
      setVerificationEmail("");
    }
  };
  return <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <button onClick={toggleTheme} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200" aria-label="Toggle theme">
      {theme === "light" ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
    </button>
    <div className="hidden lg:block lg:w-1/2 relative">
      <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] bg-teal-600 dark:bg-teal-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-600 dark:bg-teal-500 rounded-full blur-3xl opacity-15" />
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-teal-600 dark:bg-teal-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-teal-600 dark:bg-teal-500 rounded-full blur-3xl opacity-10" />
      <div className="h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10 rounded-r-3xl" />
        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3" alt="Medical professionals" className="object-cover w-full h-full rounded-r-3xl" />
        <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-white/70" />
            <h3 className="text-sm font-medium text-white">
              Sample Credentials
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {sampleCredentials.map(cred => <div key={cred.type} className="cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors" onClick={() => {
              setEmployeeType(cred.type);
              setEmail(cred.email);
              setPassword(cred.password);
            }}>
              <div className="font-medium text-white/90">{cred.type}</div>
              <div className="text-xs text-white/70">{cred.email}</div>
            </div>)}
          </div>
          <p className="mt-4 text-xs text-white/70 text-center">
            Password for all accounts: 12345678
          </p>
        </div>
      </div>
    </div>
    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col relative">
      <div className="max-w-md w-full mx-auto flex-1 relative z-10">
        <div className="mb-8 lg:mb-12 transition-all duration-300 ease-in-out">
          <div className="inline-block border border-gray-200 dark:border-gray-700 rounded-full px-6 py-2 mb-8 hover:border-teal-500 dark:hover:border-teal-400 transition-colors duration-300">
            <h1 className="text-gray-600 dark:text-gray-300 text-sm font-light">
              Hospital Management System
            </h1>
          </div>
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-light">
            Please sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <label className="block text-sm font-light text-gray-600 dark:text-gray-300 mb-2">
              Employee Type
            </label>
            <div className="relative">
              <select value={employeeType} onChange={(e) => { const selectedType = e.target.value; setEmployeeType(selectedType); setLocalData("employeeType", selectedType);}} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 font-light appearance-none transition-colors duration-200 pr-12 hover:border-[#14B8A6] dark:hover:border-[#14B8A6]" required >
                <option value="">Select employee type</option>
                {employeeTypes.map(type => <option key={type} value={type}>
                  {type}
                </option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-200" />
            </div>
          </div>
          <div className="relative group">
            <label className="block text-sm font-light text-gray-600 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 pl-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 font-light transition-colors duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-600" placeholder="Enter your email" required />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-200" />
            </div>
          </div>
          <div className="relative group">
            <label className="block text-sm font-light text-gray-600 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 pl-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 font-light transition-colors duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-600" placeholder="Enter your password" required />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-200" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 group cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded-full border-gray-300 dark:border-gray-600 text-[#14B8A6] focus:ring-[#14B8A6] transition-colors duration-200" />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                Remember me
              </span>
            </label>
            <button onClick={() => setShowForgotPassword(true)} className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-200">
              Forgot password?
            </button>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-4 px-6 bg-teal-600 dark:bg-teal-500 text-white rounded-2xl hover:bg-teal-700 dark:hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 font-light text-sm flex items-center justify-center space-x-2">
            {isLoading ? <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </> : <span>Sign in</span>}
          </button>
        </form>
        <div className="mt-8 text-center space-y-4">
          <button onClick={() => setShowTerms(true)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 font-light transition-colors duration-200">
            Terms & Conditions
          </button>
          <div onClick={() => setShowTechProInfo(true)} className="text-sm text-gray-400 dark:text-gray-500 font-light cursor-pointer hover:text-teal-600 dark:hover:text-teal-400">
            © 2024 TechPro360 Solutions. All rights reserved.
          </div>
        </div>
      </div>
    </div>
    <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms & Conditions">
      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <h3 className="font-medium text-gray-900 dark:text-white">
          Hospital Management System Terms
        </h3>
        <div className="space-y-4">
          <p>1. Data Privacy and Security</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              All patient data must be handled with strict confidentiality
            </li>
            <li>
              Access to the system is restricted to authorized personnel only
            </li>
            <li>
              Users must maintain the security of their login credentials
            </li>
          </ul>
          <p>2. System Usage</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              The system should only be used for official hospital operations
            </li>
            <li>Users must log out after each session</li>
            <li>
              Any unauthorized access or misuse will be subject to
              disciplinary action
            </li>
          </ul>
          {/* Add more terms as needed */}
        </div>
      </div>
    </Modal>
    <Modal isOpen={showTechProInfo} onClose={() => setShowTechProInfo(false)} title="About TechPro360 Solutions">
      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <p>
          TechPro360 Solutions is a leading healthcare technology provider
          specializing in:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Hospital Management Systems</li>
          <li>Electronic Health Records</li>
          <li>Medical Practice Management</li>
          <li>Healthcare Analytics</li>
        </ul>
        <p>Contact us at: support@techpro360.com</p>
      </div>
    </Modal>
    <Modal isOpen={showForgotPassword} onClose={() => {
      setShowForgotPassword(false);
      setVerificationStep("email");
      setVerificationCode("");
      setVerificationEmail("");
    }} title="Reset Password">
      <form onSubmit={handleForgotPassword} className="space-y-6">
        {verificationStep === "email" ? <div>
          <label className="block text-sm font-light text-gray-600 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input type="email" value={verificationEmail} onChange={e => setVerificationEmail(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 font-light transition-colors duration-200 hover:border-[#14B8A6]" placeholder="Enter your email" required />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We'll send a verification code to this email
          </p>
        </div> : <div>
          <label className="block text-sm font-light text-gray-600 dark:text-gray-300 mb-2">
            Verification Code
          </label>
          <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value.slice(0, 6))} className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-400 focus:ring-1 focus:ring-teal-500 dark:focus:ring-teal-400 font-light transition-colors duration-200 hover:border-[#14B8A6] tracking-widest text-center" placeholder="000000" maxLength={6} pattern="\d{6}" required />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code sent to {verificationEmail}
          </p>
        </div>}
        <button type="submit" className="w-full py-4 px-6 bg-teal-600 dark:bg-teal-500 text-white rounded-2xl hover:bg-teal-700 dark:hover:bg-teal-600 transition-all duration-200 font-light">
          {verificationStep === "email" ? "Send Code" : "Verify Code"}
        </button>
      </form>
    </Modal>
  </div>;
};