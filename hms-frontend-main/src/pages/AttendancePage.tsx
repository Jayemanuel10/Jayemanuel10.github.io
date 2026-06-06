import React, { useState } from "react";
import { Search, Filter, Grid, List, Calendar, Clock, Download, Upload, MoreVertical, CheckCircle2, XCircle, AlertTriangle, Timer, User, Building2 } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
type AttendanceStatus = "present" | "late" | "absent" | "half-day";
type Department = "medical" | "nursing" | "administration" | "laboratory" | "pharmacy" | "hr" | "it";
type ViewMode = "list" | "grid";
interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: Date;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  duration?: string;
  notes?: string;
  avatar: string;
}
const mockAttendance: Attendance[] = [{
  id: "A001",
  employeeId: "EMP001",
  employeeName: "Dr. Sarah Wilson",
  department: "medical",
  date: new Date(),
  checkIn: "08:55 AM",
  checkOut: "05:15 PM",
  status: "present",
  duration: "8h 20m",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}, {
  id: "A002",
  employeeId: "EMP002",
  employeeName: "John Smith",
  department: "nursing",
  date: new Date(),
  checkIn: "09:15 AM",
  checkOut: "05:00 PM",
  status: "late",
  duration: "7h 45m",
  notes: "Traffic delay",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}, {
  id: "A003",
  employeeId: "EMP003",
  employeeName: "Emma Johnson",
  department: "administration",
  date: new Date(),
  status: "absent",
  notes: "Sick leave",
  avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}];
export const AttendancePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | "all">("all");
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const filteredRecords = mockAttendance.filter(record => {
    if (selectedDepartment !== "all" && record.department !== selectedDepartment) return false;
    if (selectedStatus !== "all" && record.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return record.employeeName.toLowerCase().includes(query) || record.employeeId.toLowerCase().includes(query);
    }
    return true;
  });
  const stats = {
    present: mockAttendance.filter(r => r.status === "present").length,
    late: mockAttendance.filter(r => r.status === "late").length,
    absent: mockAttendance.filter(r => r.status === "absent").length,
    halfDay: mockAttendance.filter(r => r.status === "half-day").length
  };
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor employee attendance and time tracking
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Present" value={stats.present} color="emerald" />
        <StatCard icon={AlertTriangle} label="Late" value={stats.late} color="amber" />
        <StatCard icon={XCircle} label="Absent" value={stats.absent} color="rose" />
        <StatCard icon={Timer} label="Half Day" value={stats.halfDay} color="blue" />
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
                    Check In
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Check Out
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map(record => <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={record.avatar} alt={record.employeeName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {record.employeeName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {record.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <DepartmentBadge department={record.department} />
                    </td>
                    <td className="px-4 py-3">
                      {record.checkIn ? <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {record.checkIn}
                          </span>
                        </div> : <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>}
                    </td>
                    <td className="px-4 py-3">
                      {record.checkOut ? <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {record.checkOut}
                          </span>
                        </div> : <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                    setSelectedRecord(record);
                    setShowRecordModal(true);
                  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="lg:hidden grid gap-4 grid-cols-1 md:grid-cols-2">
        {filteredRecords.map(record => <div key={record.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={record.avatar} alt={record.employeeName} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {record.employeeName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {record.employeeId}
                  </p>
                </div>
              </div>
              <StatusBadge status={record.status} />
            </div>
            <div className="space-y-3">
              <div>
                <DepartmentBadge department={record.department} />
              </div>
              {(record.checkIn || record.checkOut) && <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Check In
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {record.checkIn || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Check Out
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {record.checkOut || "-"}
                    </p>
                  </div>
                </div>}
              {record.duration && <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Duration: {record.duration}
                    </span>
                  </div>
                </div>}
              {record.notes && <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Note: {record.notes}
                  </p>
                </div>}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button onClick={() => {
            setSelectedRecord(record);
            setShowRecordModal(true);
          }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>)}
      </div>
      <Modal isOpen={showRecordModal} onClose={() => setShowRecordModal(false)} title="Attendance Record">
        {selectedRecord && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedRecord.avatar} alt={selectedRecord.employeeName} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedRecord.employeeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRecord.employeeId}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Attendance Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {format(selectedRecord.date, "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <DepartmentBadge department={selectedRecord.department} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <StatusBadge status={selectedRecord.status} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Time Details
                </h4>
                <div className="space-y-3">
                  {selectedRecord.checkIn && <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Check In: {selectedRecord.checkIn}
                      </span>
                    </div>}
                  {selectedRecord.checkOut && <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Check Out: {selectedRecord.checkOut}
                      </span>
                    </div>}
                  {selectedRecord.duration && <div className="flex items-center gap-3">
                      <Timer className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Duration: {selectedRecord.duration}
                      </span>
                    </div>}
                </div>
              </div>
            </div>
            {selectedRecord.notes && <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Notes
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedRecord.notes}
                </p>
              </div>}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                Update Record
              </button>
            </div>
          </div>}
      </Modal>
    </div>;
};
const StatCard = ({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "emerald" | "amber" | "rose" | "blue";
}) => {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-600 dark:text-rose-400",
    blue: "text-blue-600 dark:text-blue-400"
  };
  return <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <Icon className={`w-5 h-5 ${colors[color]}`} />
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>;
};
const StatusBadge = ({
  status
}: {
  status: AttendanceStatus;
}) => {
  const styles = {
    present: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    late: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    absent: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    "half-day": "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const DepartmentBadge = ({
  department
}: {
  department: Department;
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