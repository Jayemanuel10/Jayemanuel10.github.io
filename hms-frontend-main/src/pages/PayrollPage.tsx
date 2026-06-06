import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Calendar, Clock, Download, Upload, MoreVertical, DollarSign, User, FileText, CreditCard, Building2, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
type PaymentStatus = "paid" | "pending" | "processing" | "failed";
type PaymentMethod = "bank_transfer" | "check" | "cash";
type ViewMode = "list" | "grid";
interface Salary {
  basic: number;
  allowances: {
    type: string;
    amount: number;
  }[];
  deductions: {
    type: string;
    amount: number;
  }[];
  total: number;
}
interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  salary: Salary;
  paymentDate: Date;
  payPeriod: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  avatar: string;
}
const mockPayrollRecords: PayrollRecord[] = [{
  id: "PAY001",
  employeeId: "EMP001",
  employeeName: "Dr. Sarah Wilson",
  department: "Medical",
  position: "Senior Doctor",
  salary: {
    basic: 8000,
    allowances: [{
      type: "Housing",
      amount: 1000
    }, {
      type: "Transportation",
      amount: 500
    }],
    deductions: [{
      type: "Tax",
      amount: 1500
    }, {
      type: "Insurance",
      amount: 400
    }],
    total: 7600
  },
  paymentDate: new Date(2024, 1, 28),
  payPeriod: "February 2024",
  status: "paid",
  paymentMethod: "bank_transfer",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}, {
  id: "PAY002",
  employeeId: "EMP002",
  employeeName: "John Smith",
  department: "Nursing",
  position: "Head Nurse",
  salary: {
    basic: 5000,
    allowances: [{
      type: "Housing",
      amount: 800
    }, {
      type: "Transportation",
      amount: 300
    }],
    deductions: [{
      type: "Tax",
      amount: 900
    }, {
      type: "Insurance",
      amount: 300
    }],
    total: 4900
  },
  paymentDate: new Date(2024, 1, 28),
  payPeriod: "February 2024",
  status: "processing",
  paymentMethod: "bank_transfer",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}];
export const PayrollPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "all">("all");
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const filteredRecords = mockPayrollRecords.filter(record => {
    if (selectedStatus !== "all" && record.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return record.employeeName.toLowerCase().includes(query) || record.employeeId.toLowerCase().includes(query) || record.department.toLowerCase().includes(query);
    }
    return true;
  });
  const totalPayroll = mockPayrollRecords.reduce((sum, record) => sum + record.salary.total, 0);
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Payroll Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage employee salaries and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Payment
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Payroll" value={`$${totalPayroll.toLocaleString()}`} color="emerald" />
        <StatCard icon={User} label="Total Employees" value={mockPayrollRecords.length.toString()} color="blue" />
        <StatCard icon={CreditCard} label="Processed" value={mockPayrollRecords.filter(r => r.status === "paid").length.toString()} color="purple" />
        <StatCard icon={Clock} label="Pending" value={mockPayrollRecords.filter(r => r.status === "pending").length.toString()} color="amber" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search employees..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as PaymentStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
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
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Pay Period
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Amount
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
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          {record.position}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {record.department}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {record.payPeriod}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        ${record.salary.total.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                  setSelectedRecord(record);
                  setShowPayrollModal(true);
                }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecords.map(record => <div key={record.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
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
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {record.position}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {record.department}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {record.payPeriod}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Amount
                    </span>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      ${record.salary.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button onClick={() => {
            setSelectedRecord(record);
            setShowPayrollModal(true);
          }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>)}
        </div>}
      <Modal isOpen={showPayrollModal} onClose={() => setShowPayrollModal(false)} title="Payroll Details">
        {selectedRecord && <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={selectedRecord.avatar} alt={selectedRecord.employeeName} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedRecord.employeeName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedRecord.employeeId} • {selectedRecord.department}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedRecord.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Payment Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Pay Period
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedRecord.payPeriod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Payment Date
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {format(selectedRecord.paymentDate, "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Payment Method
                    </span>
                    <span className="text-gray-900 dark:text-white capitalize">
                      {selectedRecord.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Salary Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Basic Salary
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ${selectedRecord.salary.basic.toLocaleString()}
                    </span>
                  </div>
                  {selectedRecord.salary.allowances.map((allowance, index) => <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        {allowance.type}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${allowance.amount.toLocaleString()}
                      </span>
                    </div>)}
                  {selectedRecord.salary.deductions.map((deduction, index) => <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        {deduction.type}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        -${deduction.amount.toLocaleString()}
                      </span>
                    </div>)}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-gray-900 dark:text-white">
                        Net Salary
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${selectedRecord.salary.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Download Payslip
              </button>
              {selectedRecord.status === "pending" && <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                  Process Payment
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
  color: "emerald" | "blue" | "purple" | "amber";
}) => {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400"
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
  status: PaymentStatus;
}) => {
  const styles = {
    paid: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    processing: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    failed: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
};