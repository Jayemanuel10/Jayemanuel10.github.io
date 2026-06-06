import React from "react";
import { Users, Calendar, DollarSign, Activity, TrendingUp, UserPlus, Clock, CheckCircle2, BedDouble, Pill, LineChart, BarChart3 } from "lucide-react";
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: "blue" | "emerald" | "violet" | "amber";
}
const StatCard: FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  color
}) => {
  const colors = {
    blue: "text-blue-600 dark:text-blue-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    violet: "text-violet-600 dark:text-violet-400",
    amber: "text-amber-600 dark:text-amber-400"
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
interface QuickStatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  text: string;
}
const QuickStatCard: FC<QuickStatCardProps> = ({
  icon: Icon,
  label,
  value,
  text
}) => {
  return <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-[#13b8a4]/10 rounded-lg">
          <Icon className="w-5 h-5 text-[#13b8a4]" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {value}{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {text}
            </span>
          </p>
        </div>
      </div>
    </div>;
};
const patientData = [{
  month: "Jan",
  inpatient: 120,
  outpatient: 250,
  emergency: 80
}, {
  month: "Feb",
  inpatient: 150,
  outpatient: 280,
  emergency: 70
}, {
  month: "Mar",
  inpatient: 140,
  outpatient: 260,
  emergency: 90
}, {
  month: "Apr",
  inpatient: 160,
  outpatient: 290,
  emergency: 85
}, {
  month: "May",
  inpatient: 170,
  outpatient: 310,
  emergency: 75
}, {
  month: "Jun",
  inpatient: 180,
  outpatient: 320,
  emergency: 95
}];
const revenueData = [{
  department: "Cardiology",
  revenue: 85000,
  patients: 120
}, {
  department: "Orthopedics",
  revenue: 65000,
  patients: 90
}, {
  department: "Pediatrics",
  revenue: 55000,
  patients: 150
}, {
  department: "Neurology",
  revenue: 75000,
  patients: 80
}, {
  department: "Oncology",
  revenue: 95000,
  patients: 70
}];
export const Dashboard: FC = () => {
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hospital overview and key metrics
        </p>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Patients" value="1,234" trend="+12.5%" color="blue" />
        <StatCard icon={Calendar} label="Appointments" value="156" trend="+5.2%" color="emerald" />
        <StatCard icon={DollarSign} label="Revenue" value="$52.5k" trend="+8.1%" color="violet" />
        <StatCard icon={Activity} label="Operations" value="24" trend="+2.3%" color="amber" />
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#13b8a4]" />
              Patient Statistics
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="inpatient" stroke="#13b8a4" strokeWidth={2} />
                <Line type="monotone" dataKey="outpatient" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="emergency" stroke="#f59e0b" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#13b8a4]" />
              Departmental Revenue
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis yAxisId="left" orientation="left" stroke="#13b8a4" />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#13b8a4" name="Revenue" />
                <Bar yAxisId="right" dataKey="patients" fill="#8b5cf6" name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <QuickStatCard icon={UserPlus} label="New Patients" value="28" text="today" />
        <QuickStatCard icon={Clock} label="Avg. Wait Time" value="18" text="minutes" />
        <QuickStatCard icon={BedDouble} label="Available Beds" value="45" text="of 180" />
        <QuickStatCard icon={Pill} label="Prescriptions" value="124" text="today" />
      </div>
    </div>;
};