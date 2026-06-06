import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Clock, AlertCircle, User, MoreVertical, Download, Upload, FlaskConical, Calendar, FileText, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Modal } from "../components/Modal";
import { format } from "date-fns";
type TestStatus = "pending" | "in-progress" | "completed" | "cancelled";
type TestType = "blood" | "urine" | "imaging" | "pathology" | "microbiology";
type TestPriority = "routine" | "urgent" | "stat";
type ViewMode = "list" | "grid";
interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  type: TestType;
  testName: string;
  status: TestStatus;
  priority: TestPriority;
  requestedBy: string;
  requestedAt: Date;
  dueDate: Date;
  sampleId?: string;
  results?: {
    value: string;
    unit: string;
    referenceRange: string;
    flag?: "normal" | "high" | "low" | "critical";
  }[];
  notes?: string;
}
const mockTests: LabTest[] = [{
  id: "LAB001",
  patientName: "John Smith",
  patientId: "P001",
  type: "blood",
  testName: "Complete Blood Count",
  status: "in-progress",
  priority: "urgent",
  requestedBy: "Dr. Sarah Wilson",
  requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  // 2 hours ago
  dueDate: new Date(Date.now() + 1000 * 60 * 60 * 4),
  // Due in 4 hours
  sampleId: "SMP001",
  results: [{
    value: "4.5",
    unit: "million/µL",
    referenceRange: "4.5-5.5",
    flag: "normal"
  }, {
    value: "15.5",
    unit: "g/dL",
    referenceRange: "13.5-17.5",
    flag: "normal"
  }]
}, {
  id: "LAB002",
  patientName: "Emma Johnson",
  patientId: "P002",
  type: "urine",
  testName: "Urinalysis",
  status: "pending",
  priority: "routine",
  requestedBy: "Dr. Michael Chen",
  requestedAt: new Date(Date.now() - 1000 * 60 * 30),
  // 30 minutes ago
  dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  // Due in 24 hours
  sampleId: "SMP002"
}, {
  id: "LAB003",
  patientName: "Robert Lee",
  patientId: "P003",
  type: "imaging",
  testName: "Chest X-Ray",
  status: "completed",
  priority: "stat",
  requestedBy: "Dr. Emily Brown",
  requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  // 24 hours ago
  dueDate: new Date(Date.now() - 1000 * 60 * 60 * 20),
  // Due 4 hours ago
  notes: "Follow-up required"
}];
export const LaboratoryPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TestStatus | "all">("all");
  const [selectedType, setSelectedType] = useState<TestType | "all">("all");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const filteredTests = mockTests.filter(test => {
    if (selectedStatus !== "all" && test.status !== selectedStatus) return false;
    if (selectedType !== "all" && test.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return test.patientName.toLowerCase().includes(query) || test.patientId.toLowerCase().includes(query) || test.testName.toLowerCase().includes(query);
    }
    return true;
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Laboratory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage laboratory tests and results
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Test Request
          </button>
          <div className="border-l border-gray-200 dark:border-gray-700 h-8" />
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
              <Grid className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search tests or patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as TestStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as TestType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Types</option>
              <option value="blood">Blood Test</option>
              <option value="urine">Urine Test</option>
              <option value="imaging">Imaging</option>
              <option value="pathology">Pathology</option>
              <option value="microbiology">Microbiology</option>
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
                    Test Details
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Priority
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
                {filteredTests.map(test => <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeStyles(test.type)}`}>
                          {getTypeIcon(test.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {test.testName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {test.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">
                            {test.patientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {test.patientId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {format(test.dueDate, "MMM d, h:mm a")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={test.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={test.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                  setSelectedTest(test);
                  setShowTestModal(true);
                }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map(test => <div key={test.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeStyles(test.type)}`}>
                    {getTypeIcon(test.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {test.testName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {test.id}
                    </p>
                  </div>
                </div>
                <StatusBadge status={test.status} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {test.patientName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {test.patientId}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Requested By
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {test.requestedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Priority</p>
                    <PriorityBadge priority={test.priority} className="mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Due: {format(test.dueDate, "MMM d, h:mm a")}
                  </span>
                </div>
                {test.sampleId && <div className="flex items-center gap-2 text-sm">
                    <FlaskConical className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Sample ID: {test.sampleId}
                    </span>
                  </div>}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button onClick={() => {
              setSelectedTest(test);
              setShowTestModal(true);
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>)}
        </div>}
      <Modal isOpen={showTestModal} onClose={() => setShowTestModal(false)} title="Test Details">
        {selectedTest && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getTypeStyles(selectedTest.type)}`}>
                {getTypeIcon(selectedTest.type)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedTest.testName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedTest.status} />
                  <PriorityBadge priority={selectedTest.priority} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Patient Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedTest.patientName} ({selectedTest.patientId})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Requested by: {selectedTest.requestedBy}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Test Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Requested:{" "}
                      {format(selectedTest.requestedAt, "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Due: {format(selectedTest.dueDate, "MMM d, h:mm a")}
                    </span>
                  </div>
                  {selectedTest.sampleId && <div className="flex items-center gap-3">
                      <FlaskConical className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        Sample ID: {selectedTest.sampleId}
                      </span>
                    </div>}
                </div>
              </div>
            </div>
            {selectedTest.results && <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Test Results
                </h4>
                <div className="space-y-3">
                  {selectedTest.results.map((result, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Value: {result.value} {result.unit}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Reference: {result.referenceRange}
                        </p>
                      </div>
                      {result.flag && <ResultFlagBadge flag={result.flag} />}
                    </div>)}
                </div>
              </div>}
            {selectedTest.notes && <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Notes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedTest.notes}
                </p>
              </div>}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {selectedTest.status === "pending" && <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                  Start Processing
                </button>}
              {selectedTest.status === "in-progress" && <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                  Add Results
                </button>}
            </div>
          </div>}
      </Modal>
    </div>;
};
const StatusBadge = ({
  status,
  className = ""
}: {
  status: TestStatus;
  className?: string;
}) => {
  const styles = {
    pending: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    "in-progress": "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    completed: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    cancelled: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const PriorityBadge = ({
  priority,
  className = ""
}: {
  priority: TestPriority;
  className?: string;
}) => {
  const styles = {
    routine: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400",
    urgent: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    stat: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[priority]} ${className}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>;
};
const ResultFlagBadge = ({
  flag
}: {
  flag: "normal" | "high" | "low" | "critical";
}) => {
  const styles = {
    normal: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    high: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    low: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    critical: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[flag]}`}>
      {flag.charAt(0).toUpperCase() + flag.slice(1)}
    </span>;
};
const getTypeStyles = (type: TestType): string => {
  const styles = {
    blood: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    urine: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    imaging: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    pathology: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    microbiology: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
  };
  return styles[type];
};
const getTypeIcon = (type: TestType) => {
  switch (type) {
    case "blood":
    case "urine":
      return <FlaskConical className="w-5 h-5" />;
    case "imaging":
      return <FileText className="w-5 h-5" />;
    case "pathology":
      return <AlertCircle className="w-5 h-5" />;
    case "microbiology":
      return <AlertTriangle className="w-5 h-5" />;
  }
};