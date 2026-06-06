import React, { useState } from "react";
import { Search, Filter, Grid, List, Download, Upload, Star, TrendingUp, Target, Award, Calendar, CheckCircle2, Clock, AlertTriangle, Eye, PenSquare, Archive } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
type PerformanceStatus = "completed" | "pending" | "overdue" | "in_progress";
type Department = "medical" | "nursing" | "administration" | "laboratory" | "pharmacy" | "hr" | "it";
interface Performance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  position: string;
  rating: number;
  status: PerformanceStatus;
  reviewDate: Date;
  nextReview?: Date;
  goals: {
    total: number;
    completed: number;
  };
  metrics: {
    attendance: number;
    productivity: number;
    quality: number;
  };
  reviewer?: string;
  avatar: string;
}
const mockPerformance: Performance[] = [{
  id: "P001",
  employeeId: "EMP001",
  employeeName: "Dr. Sarah Wilson",
  department: "medical",
  position: "Senior Doctor",
  rating: 4.8,
  status: "completed",
  reviewDate: new Date(2024, 1, 15),
  nextReview: new Date(2024, 7, 15),
  goals: {
    total: 5,
    completed: 4
  },
  metrics: {
    attendance: 98,
    productivity: 95,
    quality: 97
  },
  reviewer: "Dr. Michael Chen",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}, {
  id: "P002",
  employeeId: "EMP002",
  employeeName: "John Smith",
  department: "nursing",
  position: "Head Nurse",
  rating: 4.5,
  status: "pending",
  reviewDate: new Date(2024, 2, 20),
  goals: {
    total: 4,
    completed: 3
  },
  metrics: {
    attendance: 95,
    productivity: 92,
    quality: 94
  },
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}];
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: "emerald" | "amber" | "blue" | "purple";
}
const StatCard: FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  color
}) => {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400"
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
interface DepartmentBadgeProps {
  department: Department;
}
const DepartmentBadge: FC<DepartmentBadgeProps> = ({
  department
}) => {
  const styles = {
    medical: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    nursing: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    administration: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    laboratory: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    pharmacy: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    hr: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    it: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[department]}`}>
      {department.charAt(0).toUpperCase() + department.slice(1)}
    </span>;
};
interface StatusBadgeProps {
  status: PerformanceStatus;
}
const StatusBadge: FC<StatusBadgeProps> = ({
  status
}) => {
  const styles = {
    completed: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    overdue: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    in_progress: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
export const PerformancePage: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<PerformanceStatus | "all">("all");
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const filteredPerformance = mockPerformance.filter(record => {
    if (selectedDepartment !== "all" && record.department !== selectedDepartment) return false;
    if (selectedStatus !== "all" && record.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return record.employeeName.toLowerCase().includes(query) || record.employeeId.toLowerCase().includes(query) || record.department.toLowerCase().includes(query);
    }
    return true;
  });
  const averageRating = mockPerformance.reduce((sum, record) => sum + record.rating, 0) / mockPerformance.length;
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Performance Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track and manage employee performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Review Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPerformance.map(record => <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={record.avatar} alt={record.employeeName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {record.employeeName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {record.position}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <DepartmentBadge department={record.department} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-gray-900 dark:text-white">
                          {record.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {format(record.reviewDate, "MMM d, yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => {
                      setSelectedPerformance(record);
                      setShowPerformanceModal(true);
                    }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                      /* handle edit */
                    }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400" title="Edit Review">
                          <PenSquare className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                      /* handle archive */
                    }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400" title="Archive Review">
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredPerformance.map(record => <div key={record.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={record.avatar} alt={record.employeeName} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {record.employeeName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {record.position}
                    </p>
                  </div>
                </div>
                <StatusBadge status={record.status} />
              </div>
              <div className="space-y-3">
                <div>
                  <DepartmentBadge department={record.department} />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {record.rating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Goals: {record.goals.completed}/{record.goals.total}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Review: {format(record.reviewDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  {record.nextReview && <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        Next: {format(record.nextReview, "MMM d, yyyy")}
                      </span>
                    </div>}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                <button onClick={() => {
              setSelectedPerformance(record);
              setShowPerformanceModal(true);
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400" title="View Details">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => {
              /* handle edit */
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400" title="Edit Review">
                  <PenSquare className="w-4 h-4" />
                </button>
                <button onClick={() => {
              /* handle archive */
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400" title="Archive Review">
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>)}
        </div>
      </div>

      <Modal isOpen={showPerformanceModal} onClose={() => setShowPerformanceModal(false)} title="Performance Details">
        {selectedPerformance && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedPerformance.avatar} alt={selectedPerformance.employeeName} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedPerformance.employeeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPerformance.position} •{" "}
                  {selectedPerformance.department}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Review Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Overall Rating
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedPerformance.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Goals Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPerformance.goals.completed}/
                      {selectedPerformance.goals.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Status
                    </span>
                    <StatusBadge status={selectedPerformance.status} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Performance Metrics
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Attendance
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPerformance.metrics.attendance}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Productivity
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPerformance.metrics.productivity}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Quality
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPerformance.metrics.quality}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                View Full Report
              </button>
              <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                Schedule Review
              </button>
            </div>
          </div>}
      </Modal>
    </div>;
};