import React, { useMemo, useState, memo } from "react";
import { BarChart3, Download, Filter, LineChart, PieChart, RefreshCw, Calendar, DollarSign, TrendingUp, Users, Activity, Heart, Building2 } from "lucide-react";
import { LineChart as RechartsLineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
type ReportType = "financial" | "clinical" | "operational" | "all";
type TimeRange = "week" | "month" | "quarter" | "year";
const revenueData = [{
  month: "Jan",
  revenue: 45000,
  expenses: 32000,
  profit: 13000
}, {
  month: "Feb",
  revenue: 52000,
  expenses: 35000,
  profit: 17000
}, {
  month: "Mar",
  revenue: 48000,
  expenses: 31000,
  profit: 17000
}, {
  month: "Apr",
  revenue: 61000,
  expenses: 38000,
  profit: 23000
}, {
  month: "May",
  revenue: 55000,
  expenses: 35000,
  profit: 20000
}, {
  month: "Jun",
  revenue: 67000,
  expenses: 41000,
  profit: 26000
}];
const patientData = [{
  name: "Emergency",
  value: 30
}, {
  name: "Outpatient",
  value: 45
}, {
  name: "Inpatient",
  value: 25
}];
const departmentData = [{
  department: "Cardiology",
  patients: 120,
  revenue: 85000
}, {
  department: "Pediatrics",
  patients: 90,
  revenue: 62000
}, {
  department: "Orthopedics",
  patients: 75,
  revenue: 71000
}, {
  department: "Neurology",
  patients: 60,
  revenue: 68000
}, {
  department: "Oncology",
  patients: 45,
  revenue: 92000
}];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
export const ReportsPage = () => {
  const [reportType, setReportType] = useState<ReportType>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const memoizedRevenueData = useMemo(() => revenueData, []);
  const memoizedPatientData = useMemo(() => patientData, []);
  const memoizedDepartmentData = useMemo(() => departmentData, []);
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analytics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={reportType} onChange={e => setReportType(e.target.value as ReportType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
            <option value="all">All Reports</option>
            <option value="financial">Financial</option>
            <option value="clinical">Clinical</option>
            <option value="operational">Operational</option>
          </select>
          <select value={timeRange} onChange={e => setTimeRange(e.target.value as TimeRange)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={handleRefresh} className={`p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${isRefreshing ? "animate-spin" : ""}`}>
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value="$328.5k" trend="+12.5%" color="emerald" />
        <StatCard icon={Users} label="Total Patients" value="1,482" trend="+8.2%" color="blue" />
        <StatCard icon={Activity} label="Avg. Treatment Cost" value="$842" trend="-3.1%" color="amber" />
        <StatCard icon={Heart} label="Patient Satisfaction" value="94%" trend="+5.3%" color="rose" />
      </div>
      <div className="hidden lg:grid gap-6 grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#13b8a4]" />
              Revenue Overview
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={memoizedRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#13b8a4" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#13b8a4]" />
              Patient Distribution
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={memoizedPatientData} cx="50%" cy="50%" labelLine={false} label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {patientData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="lg:hidden space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#13b8a4]" />
              Revenue Overview
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={memoizedRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#13b8a4" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#13b8a4]" />
              Patient Distribution
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={memoizedPatientData} cx="50%" cy="50%" labelLine={false} label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {patientData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#13b8a4]" />
            Department Performance
          </h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memoizedDepartmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis yAxisId="left" orientation="left" stroke="#13b8a4" />
              <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="patients" fill="#13b8a4" name="Patients" />
              <Bar yAxisId="right" dataKey="revenue" fill="#8b5cf6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value="$328.5k" trend="+12.5%" color="emerald" />
        <StatCard icon={Users} label="Total Patients" value="1,482" trend="+8.2%" color="blue" />
        <StatCard icon={Activity} label="Avg. Treatment Cost" value="$842" trend="-3.1%" color="amber" />
        <StatCard icon={Heart} label="Patient Satisfaction" value="94%" trend="+5.3%" color="rose" />
      </div>
    </div>;
};
const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  color
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: "emerald" | "blue" | "amber" | "rose";
}) => {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-600 dark:text-rose-400"
  };
  return <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <Icon className={`w-5 h-5 ${colors[color]}`} />
        <span className={`text-xs font-medium ${trend.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {trend}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>;
};