import React, { useState } from "react";
import { Search, Plus, Filter, Calendar, Clock, Download, Upload, MoreVertical, CheckCircle2, XCircle, AlertTriangle, User, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
type LeaveType = "sick" | "vacation" | "personal" | "maternity" | "paternity";
interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}
interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: Date;
  endDate: Date;
  reason: string;
  appliedOn: Date;
  approvedBy?: string;
  avatar: string;
}
const mockLeaveBalances: LeaveBalance[] = [{
  type: "vacation",
  total: 20,
  used: 12,
  remaining: 8
}, {
  type: "sick",
  total: 10,
  used: 3,
  remaining: 7
}, {
  type: "personal",
  total: 5,
  used: 2,
  remaining: 3
}, {
  type: "maternity",
  total: 90,
  used: 0,
  remaining: 90
}];
const mockLeaveRequests: LeaveRequest[] = [{
  id: "L001",
  employeeId: "EMP001",
  employeeName: "Dr. Sarah Wilson",
  department: "Medical",
  type: "vacation",
  status: "approved",
  startDate: new Date(2024, 2, 15),
  endDate: new Date(2024, 2, 20),
  reason: "Annual family vacation",
  appliedOn: new Date(2024, 2, 1),
  approvedBy: "Dr. Michael Chen",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}, {
  id: "L002",
  employeeId: "EMP002",
  employeeName: "John Smith",
  department: "Nursing",
  type: "sick",
  status: "pending",
  startDate: new Date(2024, 2, 10),
  endDate: new Date(2024, 2, 12),
  reason: "Flu symptoms",
  appliedOn: new Date(2024, 2, 9),
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}];
export const LeavePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<LeaveType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<LeaveStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const filteredRequests = mockLeaveRequests.filter(request => {
    if (selectedType !== "all" && request.type !== selectedType) return false;
    if (selectedStatus !== "all" && request.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return request.employeeName.toLowerCase().includes(query) || request.employeeId.toLowerCase().includes(query);
    }
    return true;
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Leave Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage employee leave requests and balances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {mockLeaveBalances.map(balance => <div key={balance.type} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                {balance.type} Leave
              </span>
              <LeaveTypeBadge type={balance.type} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {balance.remaining}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                / {balance.total} days
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-[#13b8a4] h-2 rounded-full" style={{
            width: `${balance.used / balance.total * 100}%`
          }} />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {balance.used} days used
            </p>
          </div>)}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search leave requests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as LeaveType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Types</option>
              <option value="vacation">Vacation</option>
              <option value="sick">Sick</option>
              <option value="personal">Personal</option>
              <option value="maternity">Maternity</option>
              <option value="paternity">Paternity</option>
            </select>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as LeaveStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Applied On
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map(request => <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={request.avatar} alt={request.employeeName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.employeeName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {request.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <LeaveTypeBadge type={request.type} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {format(request.startDate, "MMM d")} -{" "}
                        {format(request.endDate, "MMM d, yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {format(request.appliedOn, "MMM d, yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => {
                  setSelectedRequest(request);
                  setShowRequestModal(true);
                }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lg:hidden grid gap-4 grid-cols-1 md:grid-cols-2">
        {filteredRequests.map(request => <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={request.avatar} alt={request.employeeName} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {request.employeeName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {request.employeeId}
                  </p>
                </div>
              </div>
              <StatusBadge status={request.status} />
            </div>
            <div className="space-y-3">
              <div>
                <LeaveTypeBadge type={request.type} />
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {format(request.startDate, "MMM d")} -{" "}
                      {format(request.endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Applied: {format(request.appliedOn, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reason: {request.reason}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button onClick={() => {
            setSelectedRequest(request);
            setShowRequestModal(true);
          }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>)}
      </div>
      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Leave Request Details">
        {selectedRequest && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedRequest.avatar} alt={selectedRequest.employeeName} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedRequest.employeeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRequest.employeeId} • {selectedRequest.department}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Leave Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <LeaveTypeBadge type={selectedRequest.type} />
                    <StatusBadge status={selectedRequest.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {format(selectedRequest.startDate, "MMM d")} -{" "}
                      {format(selectedRequest.endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Request Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Applied on:{" "}
                      {format(selectedRequest.appliedOn, "MMM d, yyyy")}
                    </span>
                  </div>
                  {selectedRequest.approvedBy && <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Approved by: {selectedRequest.approvedBy}
                      </span>
                    </div>}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Reason
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedRequest.reason}
              </p>
            </div>
            {selectedRequest.status === "pending" && <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Reject
                </button>
                <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                  Approve
                </button>
              </div>}
          </div>}
      </Modal>
    </div>;
};
const StatusBadge = ({
  status
}: {
  status: LeaveStatus;
}) => {
  const styles = {
    pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    approved: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    rejected: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    cancelled: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
};
const LeaveTypeBadge = ({
  type
}: {
  type: LeaveType;
}) => {
  const styles = {
    vacation: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    sick: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    personal: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    maternity: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    paternity: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>;
};