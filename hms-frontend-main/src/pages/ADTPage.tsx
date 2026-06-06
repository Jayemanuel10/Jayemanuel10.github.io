import React, { useState } from "react";
import { BedDouble, Plus, Search, Filter, ArrowRightLeft, UserPlus, LogOut, Grid, List, Clock, Users, Bed as BedIcon, Building2, BoxIcon, MoreVertical, Calendar, FileText } from "lucide-react";
import { Modal } from "../components/Modal";
import { format } from "date-fns";
type BedStatus = "occupied" | "available" | "reserved" | "maintenance";
type WardType = "general" | "icu" | "emergency" | "pediatric" | "maternity";
type AdmissionType = "emergency" | "planned" | "transfer";
type ViewMode = "list" | "grid";
interface Bed {
  id: string;
  number: string;
  ward: string;
  status: BedStatus;
  patient?: {
    id: string;
    name: string;
    admissionDate: Date;
    diagnosis?: string;
    estimatedDischarge?: Date;
  };
}
interface Ward {
  id: string;
  name: string;
  type: WardType;
  totalBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
}
const mockWards: Ward[] = [{
  id: "W001",
  name: "General Ward A",
  type: "general",
  totalBeds: 20,
  occupiedBeds: 15,
  reservedBeds: 2
}, {
  id: "W002",
  name: "ICU",
  type: "icu",
  totalBeds: 10,
  occupiedBeds: 8,
  reservedBeds: 1
}, {
  id: "W003",
  name: "Emergency Ward",
  type: "emergency",
  totalBeds: 15,
  occupiedBeds: 10,
  reservedBeds: 0
}];
const mockBeds: Bed[] = [{
  id: "B001",
  number: "A-101",
  ward: "General Ward A",
  status: "occupied",
  patient: {
    id: "P001",
    name: "John Smith",
    admissionDate: new Date(2024, 1, 15),
    diagnosis: "Pneumonia",
    estimatedDischarge: new Date(2024, 1, 20)
  }
}, {
  id: "B002",
  number: "A-102",
  ward: "General Ward A",
  status: "available"
}, {
  id: "B003",
  number: "ICU-01",
  ward: "ICU",
  status: "occupied",
  patient: {
    id: "P002",
    name: "Emma Johnson",
    admissionDate: new Date(2024, 1, 16),
    diagnosis: "Post-surgery monitoring"
  }
}];
export const ADTPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWard, setSelectedWard] = useState<string | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<BedStatus | "all">("all");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [showBedModal, setShowBedModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const filteredBeds = mockBeds.filter(bed => {
    if (selectedWard !== "all" && bed.ward !== selectedWard) return false;
    if (selectedStatus !== "all" && bed.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return bed.number.toLowerCase().includes(query) || bed.ward.toLowerCase().includes(query) || bed.patient?.name.toLowerCase().includes(query);
    }
    return true;
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            ADT Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage patient admissions, discharges, and transfers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            New Admission
          </button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {mockWards.map(ward => <div key={ward.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <WardTypeBadge type={ward.type} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-2">
                  {ward.name}
                </h3>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {ward.totalBeds}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Occupied
                </p>
                <p className="text-2xl font-medium text-[#13b8a4]">
                  {ward.occupiedBeds}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  {ward.totalBeds - ward.occupiedBeds - ward.reservedBeds}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div className="bg-[#13b8a4] h-2" style={{
            width: `${ward.occupiedBeds / ward.totalBeds * 100}%`
          }} />
            </div>
          </div>)}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search beds or patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>
                <List className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>
                <Grid className="w-4 h-4" />
              </button>
            </div>
            <select value={selectedWard} onChange={e => setSelectedWard(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Wards</option>
              {mockWards.map(ward => <option key={ward.id} value={ward.name}>
                  {ward.name}
                </option>)}
            </select>
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as BedStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="occupied">Occupied</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
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
                    Bed
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Ward
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Admission Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBeds.map(bed => <tr key={bed.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusStyles(bed.status)}`}>
                          <BedDouble className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {bed.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {bed.ward}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={bed.status} />
                    </td>
                    <td className="px-4 py-3">
                      {bed.patient ? <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {bed.patient.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {bed.patient.id}
                          </p>
                        </div> : <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>}
                    </td>
                    <td className="px-4 py-3">
                      {bed.patient?.admissionDate ? <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {format(bed.patient.admissionDate, "MMM d, yyyy")}
                          </span>
                        </div> : <span className="text-gray-400 dark:text-gray-500">
                          -
                        </span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                  setSelectedBed(bed);
                  setShowBedModal(true);
                }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBeds.map(bed => <div key={bed.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getStatusStyles(bed.status)}`}>
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Bed {bed.number}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {bed.ward}
                    </p>
                  </div>
                </div>
                <StatusBadge status={bed.status} />
              </div>
              {bed.patient ? <div className="space-y-3">
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {bed.patient.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {bed.patient.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Admitted:{" "}
                      {format(bed.patient.admissionDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  {bed.patient.diagnosis && <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {bed.patient.diagnosis}
                      </span>
                    </div>}
                </div> : <div className="py-6 flex items-center justify-center border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No patient assigned
                  </span>
                </div>}
              <div className="flex items-center justify-end gap-2 mt-4">
                <button onClick={() => {
            setSelectedBed(bed);
            setShowBedModal(true);
          }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>)}
        </div>}
      <Modal isOpen={showBedModal} onClose={() => setShowBedModal(false)} title="Bed Details">
        {selectedBed && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${getStatusStyles(selectedBed.status)}`}>
                <BedDouble className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Bed {selectedBed.number}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedBed.ward}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Bed Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedBed.ward}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BedIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Status: <StatusBadge status={selectedBed.status} />
                    </span>
                  </div>
                </div>
              </div>
              {selectedBed.patient && <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Patient Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedBed.patient.name} ({selectedBed.patient.id})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Admitted:{" "}
                        {format(selectedBed.patient.admissionDate, "MMM d, yyyy")}
                      </span>
                    </div>
                    {selectedBed.patient.estimatedDischarge && <div className="flex items-center gap-3">
                        <LogOut className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Est. Discharge:{" "}
                          {format(selectedBed.patient.estimatedDischarge, "MMM d, yyyy")}
                        </span>
                      </div>}
                  </div>
                </div>}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              {selectedBed.status === "occupied" && <>
                  <button className="px-4 py-2 text-sm text-[#13b8a4] hover:bg-[#13b8a4]/10 rounded-lg transition-colors">
                    Transfer Patient
                  </button>
                  <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Discharge Patient
                  </button>
                </>}
              {selectedBed.status === "available" && <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                  Admit Patient
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
  status: BedStatus;
  className?: string;
}) => {
  const styles = {
    occupied: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    available: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    reserved: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    maintenance: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
};
const WardTypeBadge = ({
  type,
  className = ""
}: {
  type: WardType;
  className?: string;
}) => {
  const styles = {
    general: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    icu: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    emergency: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    pediatric: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    maternity: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[type]} ${className}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>;
};
const getStatusStyles = (status: BedStatus): string => {
  const styles = {
    occupied: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    available: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    reserved: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    maintenance: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return styles[status];
};