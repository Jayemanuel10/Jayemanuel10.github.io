import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Clock, Download, Upload, MoreVertical, Monitor, Truck, User, Calendar, AlertTriangle, CheckCircle2, XCircle, AlertCircle, Building2, BoxIcon } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";
type RequestType = "maintenance" | "it_support" | "supplies" | "facility" | "equipment";
type RequestPriority = "low" | "medium" | "high" | "urgent";
type ViewMode = "list" | "grid";
interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  department: string;
  requestedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatar: string;
  };
  status: RequestStatus;
  priority: RequestPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  comments?: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: Date;
  }[];
}
const mockRequests: Request[] = [{
  id: "REQ001",
  type: "maintenance",
  title: "AC Repair in ICU",
  description: "The air conditioning unit in ICU Room 3 is not cooling properly.",
  department: "Facilities",
  requestedBy: {
    id: "EMP001",
    name: "Dr. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  assignedTo: {
    id: "MAINT001",
    name: "John Tech",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  status: "in_progress",
  priority: "high",
  createdAt: new Date(2024, 1, 15, 9, 30),
  updatedAt: new Date(2024, 1, 15, 10, 45),
  dueDate: new Date(2024, 1, 16)
}, {
  id: "REQ002",
  type: "it_support",
  title: "EMR System Access Issue",
  description: "Unable to access the EMR system from the nursing station computers.",
  department: "IT",
  requestedBy: {
    id: "EMP002",
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  status: "pending",
  priority: "urgent",
  createdAt: new Date(2024, 1, 15, 8, 15),
  updatedAt: new Date(2024, 1, 15, 8, 15)
}];
export const RequestsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RequestType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "all">("all");
  const [selectedPriority, setSelectedPriority] = useState<RequestPriority | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const filteredRequests = mockRequests.filter(request => {
    if (selectedType !== "all" && request.type !== selectedType) return false;
    if (selectedStatus !== "all" && request.status !== selectedStatus) return false;
    if (selectedPriority !== "all" && request.priority !== selectedPriority) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return request.title.toLowerCase().includes(query) || request.description.toLowerCase().includes(query) || request.requestedBy.name.toLowerCase().includes(query);
    }
    return true;
  });
  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === "pending").length,
    inProgress: mockRequests.filter(r => r.status === "in_progress").length,
    completed: mockRequests.filter(r => r.status === "completed").length
  };
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Requests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and track service requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Request
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AlertCircle} label="Total Requests" value={stats.total.toString()} color="blue" />
        <StatCard icon={Clock} label="Pending" value={stats.pending.toString()} color="amber" />
        <StatCard icon={BoxIcon} label="In Progress" value={stats.inProgress.toString()} color="purple" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed.toString()} color="emerald" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search requests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as RequestType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Types</option>
              <option value="maintenance">Maintenance</option>
              <option value="it_support">IT Support</option>
              <option value="supplies">Supplies</option>
              <option value="facility">Facility</option>
              <option value="equipment">Equipment</option>
            </select>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as RequestStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value as RequestPriority)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>
      {viewMode === "list" ? <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Request
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Requested By
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map(request => <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {request.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RequestTypeBadge type={request.type} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={request.requestedBy.avatar} alt={request.requestedBy.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {request.requestedBy.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {request.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={request.priority} />
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
        </div> : <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map(request => <div key={request.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <RequestTypeBadge type={request.type} />
                <PriorityBadge priority={request.priority} />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {request.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {request.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <img src={request.requestedBy.avatar} alt={request.requestedBy.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {request.requestedBy.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {request.department}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {format(request.createdAt, "MMM d, yyyy")}
                  </div>
                  <button onClick={() => {
              setSelectedRequest(request);
              setShowRequestModal(true);
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>)}
        </div>}
      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Request Details">
        {selectedRequest && <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedRequest.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRequest.id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={selectedRequest.priority} />
                <StatusBadge status={selectedRequest.status} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Request Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedRequest.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Created:{" "}
                      {format(selectedRequest.createdAt, "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                  {selectedRequest.dueDate && <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Due: {format(selectedRequest.dueDate, "MMM d, yyyy")}
                      </span>
                    </div>}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  People
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={selectedRequest.requestedBy.avatar} alt={selectedRequest.requestedBy.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedRequest.requestedBy.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Requester
                      </p>
                    </div>
                  </div>
                  {selectedRequest.assignedTo && <div className="flex items-center gap-3">
                      <img src={selectedRequest.assignedTo.avatar} alt={selectedRequest.assignedTo.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedRequest.assignedTo.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Assigned
                        </p>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Description
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedRequest.description}
              </p>
            </div>
            {selectedRequest.comments && <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Comments
                </h4>
                <div className="space-y-4">
                  {selectedRequest.comments.map(comment => <div key={comment.id} className="flex gap-3">
                      <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.user.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {comment.content}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {format(comment.timestamp, "MMM d, yyyy HH:mm")}
                        </p>
                      </div>
                    </div>)}
                </div>
              </div>}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {selectedRequest.status === "pending" && <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                  Take Action
                </button>}
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
  value: string;
  color: "emerald" | "blue" | "amber" | "purple";
}) => {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    purple: "text-purple-600 dark:text-purple-400"
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
  status: RequestStatus;
}) => {
  const styles = {
    pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    in_progress: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    completed: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    cancelled: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const PriorityBadge = ({
  priority
}: {
  priority: RequestPriority;
}) => {
  const styles = {
    low: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    medium: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    high: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    urgent: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>;
};
const RequestTypeBadge = ({
  type
}: {
  type: RequestType;
}) => {
  const styles = {
    maintenance: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    it_support: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    supplies: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    facility: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    equipment: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
  };
  const icons = {
    maintenance: BoxIcon,
    it_support: Monitor,
    supplies: Truck,
    facility: Building2,
    equipment: BoxIcon
  };
  const Icon = icons[type];
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      <Icon className="w-3 h-3" />
      {type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};