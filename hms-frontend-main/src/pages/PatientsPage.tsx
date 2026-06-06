import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Download, Upload, MoreVertical, User, Calendar, Phone, Mail, FileText, Activity, Heart, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
type PatientStatus = "active" | "admitted" | "discharged" | "scheduled";
type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type ViewMode = "list" | "grid";
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  bloodType: BloodType;
  status: PatientStatus;
  phone: string;
  email: string;
  address: string;
  admissionDate?: Date;
  lastVisit: Date;
  upcomingAppointment?: Date;
  medicalHistory: {
    condition: string;
    diagnosis: string;
    date: Date;
  }[];
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenLevel: number;
  };
  avatar: string;
}
const mockPatients: Patient[] = [{
  id: "P001",
  name: "John Smith",
  age: 45,
  gender: "male",
  bloodType: "O+",
  status: "active",
  phone: "+1 234-567-8901",
  email: "john.smith@email.com",
  address: "123 Main St, City, State 12345",
  lastVisit: new Date(2024, 0, 15),
  upcomingAppointment: new Date(2024, 1, 20),
  medicalHistory: [{
    condition: "Hypertension",
    diagnosis: "Stage 1 Hypertension",
    date: new Date(2023, 11, 15)
  }],
  vitals: {
    bloodPressure: "120/80",
    heartRate: 72,
    temperature: 98.6,
    oxygenLevel: 98
  },
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}, {
  id: "P002",
  name: "Emma Johnson",
  age: 32,
  gender: "female",
  bloodType: "A+",
  status: "admitted",
  phone: "+1 234-567-8902",
  email: "emma.johnson@email.com",
  address: "456 Oak Ave, City, State 12345",
  admissionDate: new Date(2024, 0, 10),
  lastVisit: new Date(2024, 0, 10),
  medicalHistory: [{
    condition: "Appendicitis",
    diagnosis: "Acute Appendicitis",
    date: new Date(2024, 0, 10)
  }],
  vitals: {
    bloodPressure: "118/75",
    heartRate: 68,
    temperature: 98.4,
    oxygenLevel: 99
  },
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}, {
  id: "P003",
  name: "Michael Chen",
  age: 28,
  gender: "male",
  bloodType: "B+",
  status: "scheduled",
  phone: "+1 234-567-8903",
  email: "michael.chen@email.com",
  address: "789 Pine Ln, City, State 12345",
  lastVisit: new Date(2023, 11, 20),
  upcomingAppointment: new Date(2024, 1, 15),
  medicalHistory: [{
    condition: "Annual Checkup",
    diagnosis: "Healthy",
    date: new Date(2023, 11, 20)
  }],
  vitals: {
    bloodPressure: "122/82",
    heartRate: 70,
    temperature: 98.5,
    oxygenLevel: 98
  },
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}];
export const PatientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const filteredPatients = mockPatients.filter(patient => {
    if (selectedStatus !== "all" && patient.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return patient.name.toLowerCase().includes(query) || patient.id.toLowerCase().includes(query) || patient.email.toLowerCase().includes(query);
    }
    return true;
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Patients
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and view patient information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Patient
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
            <input type="text" placeholder="Search patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
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
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as PatientStatus)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
              <option value="scheduled">Scheduled</option>
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
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Last Visit
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Blood Type
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPatients.map(patient => <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={patient.avatar} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {patient.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={patient.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {format(patient.lastVisit, "MMM d, yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <BloodTypeBadge type={patient.bloodType} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                  setSelectedPatient(patient);
                  setShowPatientModal(true);
                }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map(patient => <div key={patient.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {patient.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={patient.status} />
                      <BloodTypeBadge type={patient.bloodType} />
                    </div>
                  </div>
                </div>
                <StatusBadge status={patient.status} />
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Age</p>
                    <p className="text-gray-900 dark:text-white">
                      {patient.age} years
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Blood Type
                    </p>
                    <BloodTypeBadge type={patient.bloodType} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {patient.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {patient.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Last Visit: {format(patient.lastVisit, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-3 flex justify-end">
                <button onClick={() => {
            setSelectedPatient(patient);
            setShowPatientModal(true);
          }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>)}
        </div>}
      <Modal isOpen={showPatientModal} onClose={() => setShowPatientModal(false)} title="Patient Details">
        {selectedPatient && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedPatient.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedPatient.status} />
                  <BloodTypeBadge type={selectedPatient.bloodType} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedPatient.age} years old • {selectedPatient.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedPatient.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedPatient.email}
                    </span>
                  </div>
                </div>
              </div>
              {selectedPatient.vitals && <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Latest Vitals
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Blood Pressure
                      </p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                        {selectedPatient.vitals.bloodPressure}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Heart Rate
                      </p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                        {selectedPatient.vitals.heartRate} bpm
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Temperature
                      </p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                        {selectedPatient.vitals.temperature}°F
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Oxygen Level
                      </p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                        {selectedPatient.vitals.oxygenLevel}%
                      </p>
                    </div>
                  </div>
                </div>}
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Medical History
              </h4>
              <div className="space-y-3">
                {selectedPatient.medicalHistory.map((record, index) => <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {record.condition}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(record.date, "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {record.diagnosis}
                    </p>
                  </div>)}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                View Full History
              </button>
              <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                Schedule Appointment
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
  status: PatientStatus;
  className?: string;
}) => {
  const styles = {
    active: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    admitted: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    discharged: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400",
    scheduled: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
};
const BloodTypeBadge = ({
  type,
  className = ""
}: {
  type: BloodType;
  className?: string;
}) => {
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 ${className}`}>
      {type}
    </span>;
};