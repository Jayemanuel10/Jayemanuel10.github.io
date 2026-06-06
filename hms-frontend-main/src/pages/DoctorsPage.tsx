import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Mail, Phone, Calendar, Medal, Clock, MoreVertical, Download, Upload, Stethoscope } from "lucide-react";
import { Modal } from "../components/Modal";
type DoctorStatus = "active" | "on-leave" | "unavailable";
type DoctorSpecialization = "cardiology" | "neurology" | "pediatrics" | "orthopedics" | "general";
type ViewMode = "list" | "grid";
type SortField = "name" | "specialization" | "patients" | "experience";
type SortOrder = "asc" | "desc";
interface Doctor {
  id: string;
  name: string;
  specialization: DoctorSpecialization;
  status: DoctorStatus;
  avatar: string;
  email: string;
  phone: string;
  experience: number;
  patients: number;
  rating: number;
  schedule: {
    start: string;
    end: string;
    days: string[];
  };
  qualifications: string[];
}
const mockDoctors: Doctor[] = [{
  id: "D001",
  name: "Dr. Sarah Wilson",
  specialization: "cardiology",
  status: "active",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  email: "sarah.wilson@hospital.com",
  phone: "+1 234-567-8901",
  experience: 12,
  patients: 1500,
  rating: 4.8,
  schedule: {
    start: "09:00 AM",
    end: "05:00 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  qualifications: ["MD", "FACC", "PhD Cardiology"]
}, {
  id: "D002",
  name: "Dr. Michael Chen",
  specialization: "neurology",
  status: "active",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  email: "michael.chen@hospital.com",
  phone: "+1 234-567-8902",
  experience: 15,
  patients: 1200,
  rating: 4.9,
  schedule: {
    start: "10:00 AM",
    end: "06:00 PM",
    days: ["Monday", "Wednesday", "Friday"]
  },
  qualifications: ["MD", "PhD Neuroscience", "FAAN"]
}, {
  id: "D003",
  name: "Dr. Emily Brown",
  specialization: "pediatrics",
  status: "on-leave",
  avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  email: "emily.brown@hospital.com",
  phone: "+1 234-567-8903",
  experience: 8,
  patients: 900,
  rating: 4.7,
  schedule: {
    start: "09:00 AM",
    end: "04:00 PM",
    days: ["Tuesday", "Thursday", "Friday"]
  },
  qualifications: ["MD", "Board Certified Pediatrician"]
}];
export const DoctorsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<DoctorStatus | "all">("all");
  const [selectedSpecialization, setSelectedSpecialization] = useState<DoctorSpecialization | "all">("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
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
  const filteredDoctors = mockDoctors.filter(doctor => {
    if (selectedStatus !== "all" && doctor.status !== selectedStatus) return false;
    if (selectedSpecialization !== "all" && doctor.specialization !== selectedSpecialization) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return doctor.name.toLowerCase().includes(query) || doctor.specialization.toLowerCase().includes(query) || doctor.email.toLowerCase().includes(query);
    }
    return true;
  }).sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        return modifier * a.name.localeCompare(b.name);
      case "specialization":
        return modifier * a.specialization.localeCompare(b.specialization);
      case "patients":
        return modifier * (a.patients - b.patients);
      case "experience":
        return modifier * (a.experience - b.experience);
      default:
        return 0;
    }
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Doctors
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage hospital doctors and their schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Doctor
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Doctor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Specialization
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Experience
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Patients
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDoctors.map(doctor => <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={doctor.avatar} alt={doctor.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {doctor.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SpecializationBadge specialization={doctor.specialization} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doctor.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {doctor.experience} years
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {doctor.patients}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => {
                    setSelectedDoctor(doctor);
                    setShowDoctorModal(true);
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
        {filteredDoctors.map(doctor => <div key={doctor.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {doctor.name}
                  </p>
                  <SpecializationBadge specialization={doctor.specialization} className="mt-1" />
                </div>
              </div>
              <StatusBadge status={doctor.status} />
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Experience</p>
                  <p className="text-gray-900 dark:text-white">
                    {doctor.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Patients</p>
                  <p className="text-gray-900 dark:text-white">
                    {doctor.patients}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {doctor.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {doctor.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {doctor.schedule.start} - {doctor.schedule.end}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button onClick={() => {
              setSelectedDoctor(doctor);
              setShowDoctorModal(true);
            }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>)}
      </div>
      <Modal isOpen={showDoctorModal} onClose={() => setShowDoctorModal(false)} title="Doctor Details">
        {selectedDoctor && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedDoctor.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <SpecializationBadge specialization={selectedDoctor.specialization} />
                  <StatusBadge status={selectedDoctor.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedDoctor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{selectedDoctor.phone}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Schedule
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedDoctor.schedule.start} -{" "}
                      {selectedDoctor.schedule.end}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedDoctor.schedule.days.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Qualifications
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDoctor.qualifications.map((qualification, index) => <div key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm flex items-center gap-2">
                    <Medal className="w-4 h-4" />
                    {qualification}
                  </div>)}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Statistics
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Experience
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                    {selectedDoctor.experience} years
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Patients
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                    {selectedDoctor.patients}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rating
                  </p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                    {selectedDoctor.rating}
                  </p>
                </div>
              </div>
            </div>
          </div>}
      </Modal>
    </div>;
};
const StatusBadge = ({
  status,
  className = ""
}: {
  status: DoctorStatus;
  className?: string;
}) => {
  const styles = {
    active: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    "on-leave": "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    unavailable: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]} ${className}`}>
      {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const SpecializationBadge = ({
  specialization,
  className = ""
}: {
  specialization: DoctorSpecialization;
  className?: string;
}) => {
  const styles = {
    cardiology: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    neurology: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    pediatrics: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    orthopedics: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    general: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[specialization]} ${className}`}>
      <Stethoscope className="w-3 h-3" />
      {specialization.charAt(0).toUpperCase() + specialization.slice(1)}
    </span>;
};