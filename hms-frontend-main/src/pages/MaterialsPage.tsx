import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Package, AlertCircle, MoreVertical, Download, Upload, Calendar, Tag, Truck, ShieldAlert } from "lucide-react";
import { Modal } from "../components/Modal";
type MaterialStatus = "in-stock" | "low-stock" | "out-of-stock" | "ordered";
type MaterialCategory = "supplies" | "equipment" | "disposables" | "instruments" | "ppe";
type SortField = "name" | "stock" | "category" | "expiry";
type SortOrder = "asc" | "desc";
interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  description: string;
  stock: number;
  minStock: number;
  price: number;
  status: MaterialStatus;
  expiryDate?: Date;
  supplier: string;
  location: string;
  lastOrdered?: Date;
  unit: string;
  specifications?: string[];
}
const mockMaterials: Material[] = [{
  id: "MAT001",
  name: "Surgical Masks",
  category: "ppe",
  description: "3-ply disposable surgical masks",
  stock: 5000,
  minStock: 1000,
  price: 0.5,
  status: "in-stock",
  expiryDate: new Date("2025-12-31"),
  supplier: "MedSupply Co",
  location: "Storage A1",
  lastOrdered: new Date("2024-01-15"),
  unit: "piece",
  specifications: ["3-ply", "Latex-free", "Blue"]
}, {
  id: "MAT002",
  name: "Surgical Gloves",
  category: "disposables",
  description: "Powder-free nitrile examination gloves",
  stock: 200,
  minStock: 500,
  price: 12.99,
  status: "low-stock",
  expiryDate: new Date("2024-12-31"),
  supplier: "SafeCare Medical",
  location: "Storage B2",
  lastOrdered: new Date("2024-01-10"),
  unit: "box",
  specifications: ["Powder-free", "Nitrile", "Size: M"]
}, {
  id: "MAT003",
  name: "Vital Signs Monitor",
  category: "equipment",
  description: "Multi-parameter patient monitor",
  stock: 0,
  minStock: 5,
  price: 2499.99,
  status: "out-of-stock",
  supplier: "MedTech Solutions",
  location: "Equipment Room 2",
  lastOrdered: new Date("2023-12-01"),
  unit: "unit",
  specifications: ["12-inch display", "Battery backup", "WiFi enabled"]
}];
export const MaterialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<MaterialStatus | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | "all">("all");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
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
  const filteredMaterials = mockMaterials.filter(material => {
    if (selectedStatus !== "all" && material.status !== selectedStatus) return false;
    if (selectedCategory !== "all" && material.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return material.name.toLowerCase().includes(query) || material.description.toLowerCase().includes(query) || material.category.toLowerCase().includes(query);
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
        if (!a.expiryDate || !b.expiryDate) return 0;
        return modifier * (a.expiryDate.getTime() - b.expiryDate.getTime());
      default:
        return 0;
    }
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Materials
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage medical supplies and equipment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Material
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
            <input type="text" placeholder="Search materials..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as MaterialStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="ordered">Ordered</option>
            </select>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as MaterialCategory)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Categories</option>
              <option value="supplies">Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="disposables">Disposables</option>
              <option value="instruments">Instruments</option>
              <option value="ppe">PPE</option>
            </select>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Material
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
                    Location
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMaterials.map(material => <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryStyles(material.category)}`}>
                          {getCategoryIcon(material.category)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {material.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {material.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={material.category} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {material.stock} {material.unit}s
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={material.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {material.location}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                    setSelectedMaterial(material);
                    setShowMaterialModal(true);
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
      <div className="lg:hidden">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {filteredMaterials.map(material => <div key={material.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryStyles(material.category)}`}>
                    {getCategoryIcon(material.category)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {material.name}
                    </p>
                    <CategoryBadge category={material.category} className="mt-1" />
                  </div>
                </div>
                <StatusBadge status={material.status} />
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Stock</p>
                    <p className="text-gray-900 dark:text-white">
                      {material.stock} {material.unit}s
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Price</p>
                    <p className="text-gray-900 dark:text-white">
                      ${material.price}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {material.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {material.location}
                    </span>
                  </div>
                  {material.expiryDate && <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        Expires: {material.expiryDate.toLocaleDateString()}
                      </span>
                    </div>}
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button onClick={() => {
                setSelectedMaterial(material);
                setShowMaterialModal(true);
              }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      <Modal isOpen={showMaterialModal} onClose={() => setShowMaterialModal(false)} title="Material Details">
        {selectedMaterial && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getCategoryStyles(selectedMaterial.category)}`}>
                {getCategoryIcon(selectedMaterial.category)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedMaterial.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedMaterial.id}
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
                      Current Stock: {selectedMaterial.stock}{" "}
                      {selectedMaterial.unit}s
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      Minimum Stock: {selectedMaterial.minStock}{" "}
                      {selectedMaterial.unit}s
                    </span>
                  </div>
                  {selectedMaterial.expiryDate && <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Expiry:{" "}
                        {selectedMaterial.expiryDate.toLocaleDateString()}
                      </span>
                    </div>}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Supplier Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm">{selectedMaterial.supplier}</span>
                  </div>
                  {selectedMaterial.lastOrdered && <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Last Ordered:{" "}
                        {selectedMaterial.lastOrdered.toLocaleDateString()}
                      </span>
                    </div>}
                </div>
              </div>
            </div>
            {selectedMaterial.specifications && <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Specifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.specifications.map((spec, index) => <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                      {spec}
                    </span>)}
                </div>
              </div>}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Description
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMaterial.description}
              </p>
            </div>
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
  status: MaterialStatus;
  className?: string;
}) => {
  const styles = {
    "in-stock": "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    "low-stock": "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    "out-of-stock": "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    ordered: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const CategoryBadge = ({
  category,
  className = ""
}: {
  category: MaterialCategory;
  className?: string;
}) => {
  const styles = {
    supplies: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    equipment: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    disposables: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    instruments: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    ppe: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[category]} ${className}`}>
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>;
};
const getCategoryStyles = (category: MaterialCategory): string => {
  const styles = {
    supplies: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    equipment: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    disposables: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    instruments: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    ppe: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return styles[category];
};
const getCategoryIcon = (category: MaterialCategory) => {
  switch (category) {
    case "supplies":
      return <Package className="w-5 h-5" />;
    case "equipment":
      return <div className="w-5 h-5" />;
    case "disposables":
      return <Package className="w-5 h-5" />;
    case "instruments":
      return <div className="w-5 h-5" />;
    case "ppe":
      return <ShieldAlert className="w-5 h-5" />;
  }
};