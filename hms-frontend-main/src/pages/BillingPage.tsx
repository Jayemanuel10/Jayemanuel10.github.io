import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Download, Upload, MoreVertical, Calendar, CreditCard, DollarSign, Clock, FileText, Receipt, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";
type PaymentMethod = "credit_card" | "bank_transfer" | "cash" | "insurance";
type ViewMode = "list" | "grid";
interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  paymentHistory?: {
    date: Date;
    amount: number;
    method: PaymentMethod;
    status: "success" | "failed" | "pending";
    reference: string;
  }[];
}
const mockInvoices: Invoice[] = [{
  id: "INV001",
  patientName: "John Smith",
  patientId: "P001",
  date: new Date(2024, 0, 15),
  dueDate: new Date(2024, 1, 15),
  amount: 1250.0,
  status: "pending",
  paymentMethod: "insurance",
  items: [{
    description: "General Consultation",
    quantity: 1,
    unitPrice: 200.0,
    total: 200.0
  }, {
    description: "Blood Test",
    quantity: 1,
    unitPrice: 550.0,
    total: 550.0
  }, {
    description: "X-Ray",
    quantity: 1,
    unitPrice: 500.0,
    total: 500.0
  }],
  paymentHistory: [{
    date: new Date(2024, 0, 15),
    amount: 500.0,
    method: "insurance",
    status: "success",
    reference: "PAY001"
  }]
}, {
  id: "INV002",
  patientName: "Emma Johnson",
  patientId: "P002",
  date: new Date(2024, 0, 10),
  dueDate: new Date(2024, 1, 10),
  amount: 2500.0,
  status: "paid",
  paymentMethod: "credit_card",
  items: [{
    description: "Surgery",
    quantity: 1,
    unitPrice: 2000.0,
    total: 2000.0
  }, {
    description: "Post-op Medication",
    quantity: 1,
    unitPrice: 500.0,
    total: 500.0
  }],
  paymentHistory: [{
    date: new Date(2024, 0, 10),
    amount: 2500.0,
    method: "credit_card",
    status: "success",
    reference: "PAY002"
  }]
}, {
  id: "INV003",
  patientName: "Robert Lee",
  patientId: "P003",
  date: new Date(2023, 11, 15),
  dueDate: new Date(2024, 0, 15),
  amount: 800.0,
  status: "overdue",
  paymentMethod: "bank_transfer",
  items: [{
    description: "Emergency Room Visit",
    quantity: 1,
    unitPrice: 800.0,
    total: 800.0
  }]
}];
export const BillingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "all">("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | "all">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const filteredInvoices = mockInvoices.filter(invoice => {
    if (selectedStatus !== "all" && invoice.status !== selectedStatus) return false;
    if (selectedPaymentMethod !== "all" && invoice.paymentMethod !== selectedPaymentMethod) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return invoice.patientName.toLowerCase().includes(query) || invoice.patientId.toLowerCase().includes(query) || invoice.id.toLowerCase().includes(query);
    }
    return true;
  });
  const totalRevenue = mockInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = mockInvoices.filter(inv => inv.status === "paid").length;
  const pendingAmount = mockInvoices.filter(inv => inv.status === "pending" || inv.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Billing
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage invoices and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="+12.5%" color="emerald" />
        <StatCard icon={CheckCircle2} label="Paid Invoices" value={paidInvoices.toString()} trend="+8.2%" color="blue" />
        <StatCard icon={Clock} label="Pending Amount" value={`$${pendingAmount.toLocaleString()}`} trend="-3.1%" color="amber" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as InvoiceStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select value={selectedPaymentMethod} onChange={e => setSelectedPaymentMethod(e.target.value as PaymentMethod)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="insurance">Insurance</option>
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
                  Invoice
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Due Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map(invoice => <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getPaymentMethodStyles(invoice.paymentMethod)}`}>
                        {getPaymentMethodIcon(invoice.paymentMethod)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invoice.id}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(invoice.date, "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900 dark:text-white">
                      {invoice.patientName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.patientId}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900 dark:text-white">
                      ${invoice.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-900 dark:text-white">
                      {format(invoice.dueDate, "MMM d, yyyy")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => {
                  setSelectedInvoice(invoice);
                  setShowInvoiceModal(true);
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
        {filteredInvoices.map(invoice => <div key={invoice.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getPaymentMethodStyles(invoice.paymentMethod)}`}>
                  {getPaymentMethodIcon(invoice.paymentMethod)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {invoice.id}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(invoice.date, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Patient
                </p>
                <p className="text-gray-900 dark:text-white">
                  {invoice.patientName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {invoice.patientId}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    ${invoice.amount.toLocaleString()}
                  </p>
                </div>
                <button onClick={() => {
              setSelectedInvoice(invoice);
              setShowInvoiceModal(true);
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>)}
      </div>
      <Modal isOpen={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} title="Invoice Details">
        {selectedInvoice && <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedInvoice.id}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Issued on {format(selectedInvoice.date, "MMMM d, yyyy")}
                </p>
              </div>
              <StatusBadge status={selectedInvoice.status} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Patient Information
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {selectedInvoice.patientName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedInvoice.patientId}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Payment Details
                </h4>
                <p className="text-gray-900 dark:text-white">
                  Due Date: {format(selectedInvoice.dueDate, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Method:{" "}
                  {selectedInvoice.paymentMethod.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Invoice Items
              </h4>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedInvoice.items.map((item, index) => <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                          {item.description}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">
                          ${item.unitPrice.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-white text-right">
                          ${item.total.toLocaleString()}
                        </td>
                      </tr>)}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                        Total Amount
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white text-right">
                        ${selectedInvoice.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            {selectedInvoice.paymentHistory && <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Payment History
                </h4>
                <div className="space-y-2">
                  {selectedInvoice.paymentHistory.map((payment, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getPaymentMethodStyles(payment.method)}`}>
                          {getPaymentMethodIcon(payment.method)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(payment.date, "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <PaymentStatusBadge status={payment.status} />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Ref: {payment.reference}
                        </p>
                      </div>
                    </div>)}
                </div>
              </div>}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Download PDF
              </button>
              {selectedInvoice.status !== "paid" && <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
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
  trend,
  color
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  color: "emerald" | "blue" | "amber";
}) => {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
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
const StatusBadge = ({
  status
}: {
  status: InvoiceStatus;
}) => {
  const styles = {
    paid: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    overdue: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    cancelled: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
};
const PaymentStatusBadge = ({
  status
}: {
  status: "success" | "failed" | "pending";
}) => {
  const styles = {
    success: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    failed: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    pending: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
};
const getPaymentMethodStyles = (method: PaymentMethod): string => {
  const styles = {
    credit_card: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    bank_transfer: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    cash: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    insurance: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  };
  return styles[method];
};
const getPaymentMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case "credit_card":
      return <CreditCard className="w-5 h-5" />;
    case "bank_transfer":
      return <Receipt className="w-5 h-5" />;
    case "cash":
      return <DollarSign className="w-5 h-5" />;
    case "insurance":
      return <FileText className="w-5 h-5" />;
  }
};