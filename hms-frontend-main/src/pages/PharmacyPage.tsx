import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Package, AlertCircle, Clock, MoreVertical, Download, Upload, Pill, Calendar, ShieldAlert, BadgeAlert, AlertOctagon } from "lucide-react";
import { Modal } from "../components/Modal";
type MedicationStatus = "in-stock" | "low-stock" | "out-of-stock" | "expired";
type MedicationType = "tablet" | "capsule" | "liquid" | "injection" | "cream";
type ViewMode = "list" | "grid";
type SortField = "name" | "stock" | "category" | "expiry";
type SortOrder = "asc" | "desc";
interface Medication {
  id: string;
  name: string;
  genericName: string;
  type: MedicationType;
  category: string;
  manufacturer: string;
  stock: number;
  minStock: number;
  price: number;
  status: MedicationStatus;
  expiryDate: Date;
  batchNumber: string;
  location: string;
  description?: string;
  sideEffects?: string[];
  dosage?: string;
}
const mockMedications: Medication[] = [{
  id: "MED001",
  name: "Paracetamol 500mg",
  genericName: "Acetaminophen",
  type: "tablet",
  category: "Pain Relief",
  manufacturer: "PharmaCorp",
  stock: 500,
  minStock: 100,
  price: 5.99,
  status: "in-stock",
  expiryDate: new Date("2025-12-31"),
  batchNumber: "PCB2023001",
  location: "Shelf A1",
  dosage: "1-2 tablets every 4-6 hours",
  sideEffects: ["Nausea", "Liver problems with overdose"]
}, {
  id: "MED002",
  name: "Amoxicillin 250mg",
  genericName: "Amoxicillin",
  type: "capsule",
  category: "Antibiotics",
  manufacturer: "MediPharm",
  stock: 50,
  minStock: 100,
  price: 12.99,
  status: "low-stock",
  expiryDate: new Date("2024-06-30"),
  batchNumber: "MPB2023045",
  location: "Shelf B3",
  dosage: "1 capsule three times daily",
  sideEffects: ["Diarrhea", "Rash", "Nausea"]
}, {
  id: "MED003",
  name: "Insulin Regular",
  genericName: "Human Insulin",
  type: "injection",
  category: "Diabetes",
  manufacturer: "DiabeCare",
  stock: 0,
  minStock: 20,
  price: 45.99,
  status: "out-of-stock",
  expiryDate: new Date("2024-12-31"),
  batchNumber: "DCB2023089",
  location: "Refrigerator 2",
  dosage: "As prescribed",
  sideEffects: ["Hypoglycemia", "Injection site reactions"]
}];
export const PharmacyPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MedicationStatus | "all">("all");
  const [selectedType, setSelectedType] = useState<MedicationType | "all">("all");
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const filteredMedications = mockMedications.filter(medication => {
    if (selectedStatus !== "all" && medication.status !== selectedStatus) return false;
    if (selectedType !== "all" && medication.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return medication.name.toLowerCase().includes(query) || medication.genericName.toLowerCase().includes(query) || medication.category.toLowerCase().includes(query);
    }
    return true;
  }).sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        return modifier * a.name.localeCompare(b.name);
      case "stock":
        return modifier * (a.stock - b.stock);
      case "category":
        return modifier * a.category.localeCompare(b.category);
      case "expiry":
        return modifier * (a.expiryDate.getTime() - b.expiryDate.getTime());
      default:
        return 0;
    }
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Pharmacy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage medications and inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Medication
          </button>
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
            <input type="text" placeholder="Search medications..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as MedicationStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="expired">Expired</option>
            </select>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as MedicationType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Types</option>
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="liquid">Liquid</option>
              <option value="injection">Injection</option>
              <option value="cream">Cream</option>
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
                    Medication
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Expiry
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMedications.map(medication => <tr key={medication.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeStyles(medication.type)}`}>
                          {getTypeIcon(medication.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {medication.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {medication.genericName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {medication.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {medication.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={medication.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {medication.expiryDate.toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                  setSelectedMedication(medication);
                  setShowMedicationModal(true);
                }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="lg:hidden grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredMedications.map(medication => <div key={medication.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeStyles(medication.type)}`}>
                    {getTypeIcon(medication.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {medication.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {medication.genericName}
                    </p>
                  </div>
                </div>
                <StatusBadge status={medication.status} />
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <p className="text-gray-900 dark:text-white">
                      {medication.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Stock</p>
                    <p className="text-gray-900 dark:text-white">
                      {medication.stock} units
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Batch: {medication.batchNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Expires: {medication.expiryDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button onClick={() => {
              setSelectedMedication(medication);
              setShowMedicationModal(true);
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>)}
        </div>}
      <Modal isOpen={showMedicationModal} onClose={() => setShowMedicationModal(false)} title="Medication Details">
        {selectedMedication && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getTypeStyles(selectedMedication.type)}`}>
                {getTypeIcon(selectedMedication.type)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedMedication.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedMedication.genericName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Stock Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">
                      Current Stock: {selectedMedication.stock} units
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      Minimum Stock: {selectedMedication.minStock} units
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Expiry:{" "}
                      {selectedMedication.expiryDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Additional Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Category
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedMedication.category}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Manufacturer
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedMedication.manufacturer}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedMedication.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {selectedMedication.dosage && <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Dosage Information
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMedication.dosage}
                </p>
              </div>}
            {selectedMedication.sideEffects && <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Side Effects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedication.sideEffects.map((effect, index) => <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs">
                      {effect}
                    </span>)}
                </div>
              </div>}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                Update Stock
              </button>
            </div>
          </div>}
      </Modal>
    </div>;
};
const StatusBadge = ({
  status,
  className = ""
}: {
  status: MedicationStatus;
  className?: string;
}) => {
  const styles = {
    "in-stock": "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    "low-stock": "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    "out-of-stock": "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    expired: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const getTypeStyles = (type: MedicationType): string => {
  const styles = {
    tablet: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    capsule: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    liquid: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    injection: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    cream: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
  };
  return styles[type];
};
const getTypeIcon = (type: MedicationType) => {
  switch (type) {
    case "tablet":
      return <Pill className="w-5 h-5" />;
    case "capsule":
      return <Pill className="w-5 h-5" />;
    case "liquid":
      return <Package className="w-5 h-5" />;
    case "injection":
      return <ShieldAlert className="w-5 h-5" />;
    case "cream":
      return <Package className="w-5 h-5" />;
  }
};