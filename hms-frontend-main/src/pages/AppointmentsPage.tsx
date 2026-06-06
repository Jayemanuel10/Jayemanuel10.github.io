import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Filter, Search, User, X, Check, MoreVertical, Plus } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
import { List, Grid } from "lucide-react";
type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled";
type AppointmentType = "consultation" | "follow-up" | "surgery" | "checkup";
interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  type: AppointmentType;
  date: Date;
  time: string;
  duration: number;
  doctor: string;
  status: AppointmentStatus;
  notes?: string;
  room?: string;
}
const mockAppointments: Appointment[] = [{
  id: "APT001",
  patientName: "John Smith",
  patientId: "P001",
  type: "consultation",
  date: new Date(),
  time: "09:00 AM",
  duration: 30,
  doctor: "Dr. Sarah Wilson",
  status: "scheduled",
  room: "Room 101"
}, {
  id: "APT002",
  patientName: "Emma Johnson",
  patientId: "P002",
  type: "follow-up",
  date: new Date(),
  time: "10:30 AM",
  duration: 45,
  doctor: "Dr. Michael Chen",
  status: "confirmed",
  notes: "Post-surgery follow-up"
}, {
  id: "APT003",
  patientName: "James Brown",
  patientId: "P003",
  type: "surgery",
  date: new Date(),
  time: "02:00 PM",
  duration: 120,
  doctor: "Dr. Sarah Wilson",
  status: "scheduled",
  room: "OR 3",
  notes: "Appendectomy"
}];
export const AppointmentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | "all">("all");
  const [selectedType, setSelectedType] = useState<AppointmentType | "all">("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const filteredAppointments = mockAppointments.filter(appointment => {
    if (selectedStatus !== "all" && appointment.status !== selectedStatus) return false;
    if (selectedType !== "all" && appointment.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return appointment.patientName.toLowerCase().includes(query) || appointment.patientId.toLowerCase().includes(query) || appointment.doctor.toLowerCase().includes(query);
    }
    return true;
  });
  const handleStatusChange = (appointment: Appointment, newStatus: AppointmentStatus) => {
    console.log(`Updating appointment ${appointment.id} status to ${newStatus}`);
  };
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Appointments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and schedule patient appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search appointments..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
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
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as AppointmentStatus | "all")} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as AppointmentType | "all")} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="surgery">Surgery</option>
              <option value="checkup">Checkup</option>
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
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Doctor
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
                {filteredAppointments.map(appointment => <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {appointment.patientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {appointment.patientId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {format(appointment.date, "MMM d, yyyy")}
                        </span>
                        <Clock className="w-4 h-4 text-gray-400 ml-2" />
                        <span className="text-gray-900 dark:text-white">
                          {appointment.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={appointment.type} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white">
                        {appointment.doctor}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowAppointmentModal(true);
                  }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAppointments.map(appointment => <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {appointment.patientName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.patientId}
                    </p>
                  </div>
                </div>
                <button onClick={() => {
            setSelectedAppointment(appointment);
            setShowAppointmentModal(true);
          }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {format(appointment.date, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    {appointment.time} ({appointment.duration} mins)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <TypeBadge type={appointment.type} />
                  <StatusBadge status={appointment.status} />
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {appointment.doctor}
                  </p>
                  {appointment.room && <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.room}
                    </p>}
                </div>
              </div>
            </div>)}
        </div>}
      <Modal isOpen={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} title="Appointment Details">
        {selectedAppointment && <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedAppointment.patientName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Patient ID: {selectedAppointment.patientId}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedAppointment.status} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Appointment Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {format(selectedAppointment.date, "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedAppointment.time} ({selectedAppointment.duration}{" "}
                      mins)
                    </span>
                  </div>
                  {selectedAppointment.room && <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {selectedAppointment.room}
                      </span>
                    </div>}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Medical Staff
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedAppointment.doctor}
                </p>
              </div>
            </div>
            {selectedAppointment.notes && <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Notes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedAppointment.notes}
                </p>
              </div>}
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button onClick={() => handleStatusChange(selectedAppointment, "cancelled")} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                Cancel Appointment
              </button>
              <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                Reschedule
              </button>
            </div>
          </div>}
      </Modal>
    </div>;
};
const TypeBadge = ({
  type
}: {
  type: AppointmentType;
}) => {
  const styles = {
    consultation: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    "follow-up": "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    surgery: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    checkup: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>;
};
const StatusBadge = ({
  status
}: {
  status: AppointmentStatus;
}) => {
  const styles = {
    scheduled: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    confirmed: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    completed: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400",
    cancelled: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>;
};