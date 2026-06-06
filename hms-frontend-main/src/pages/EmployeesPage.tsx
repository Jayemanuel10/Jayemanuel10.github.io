import React, { useMemo, useState } from "react";
import { Search, Plus, Filter, Grid, List, MoreVertical, Mail, Phone, Calendar, Clock, Building2, User, Download, Upload, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { Modal } from "../components/Modal";
import { Pagination } from "../components/Pagination";
import { usePagination } from "../hooks/usePagination";
import { useDebounce } from "../hooks/useDebounce";
const mockEmployees = [{
  id: "EMP001",
  name: "Dr. Sarah Wilson",
  role: "doctor",
  department: "medical",
  email: "sarah.wilson@hospital.com",
  phone: "(555) 123-4567",
  joinDate: new Date(2022, 5, 15),
  status: "active",
  schedule: "Mon-Fri, 9:00 AM - 5:00 PM",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  performanceRating: 4.8,
  specialization: "Cardiology",
  supervisor: "Dr. Michael Chen"
}, {
  id: "EMP002",
  name: "John Smith",
  role: "nurse",
  department: "nursing",
  email: "john.smith@hospital.com",
  phone: "(555) 234-5678",
  joinDate: new Date(2023, 1, 10),
  status: "active",
  schedule: "Tue-Sat, 8:00 AM - 4:00 PM",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  performanceRating: 4.5
}, {
  id: "EMP003",
  name: "Emma Johnson",
  role: "administrator",
  department: "administration",
  email: "emma.johnson@hospital.com",
  phone: "(555) 345-6789",
  joinDate: new Date(2021, 8, 20),
  status: "on_leave",
  schedule: "Mon-Fri, 9:00 AM - 5:00 PM",
  avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  performanceRating: 4.2
}];
export const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<EmployeeRole | "all">("all");
  const [selectedDepartment, setSelectedDepartment] = useState<Department | "all">("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery);
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(employee => {
      if (selectedRole !== "all" && employee.role !== selectedRole) return false;
      if (selectedDepartment !== "all" && employee.department !== selectedDepartment) return false;
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        return employee.name.toLowerCase().includes(query) || employee.id.toLowerCase().includes(query) || employee.email.toLowerCase().includes(query);
      }
      return true;
    });
  }, [selectedRole, selectedDepartment, debouncedSearchQuery]);
  const {
    currentPage,
    totalPages,
    currentItems,
    handlePageChange,
    itemsPerPage,
    totalItems
  } = usePagination(filteredEmployees);
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Employees
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage hospital staff and personnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Join Date
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map(employee => <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={employee.avatar} alt={employee.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={employee.role} />
                  </td>
                  <td className="px-4 py-3">
                    <DepartmentBadge department={employee.department} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={employee.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {format(employee.joinDate, "MMM d, yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => {
                  setSelectedEmployee(employee);
                  setShowEmployeeModal(true);
                }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} itemsPerPage={itemsPerPage} totalItems={totalItems} />
      </div>
      <div className="lg:hidden grid gap-4 grid-cols-1 md:grid-cols-2">
        {currentItems.map(employee => <div key={employee.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {employee.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {employee.id}
                  </p>
                </div>
              </div>
              <StatusBadge status={employee.status} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {employee.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {employee.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {employee.schedule}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <RoleBadge role={employee.role} />
                  <DepartmentBadge department={employee.department} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button onClick={() => {
            setSelectedEmployee(employee);
            setShowEmployeeModal(true);
          }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>)}
      </div>
      <Modal isOpen={showEmployeeModal} onClose={() => setShowEmployeeModal(false)} title="Employee Details">
        {selectedEmployee && <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedEmployee.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedEmployee.id}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedEmployee.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedEmployee.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      Joined:{" "}
                      {format(selectedEmployee.joinDate, "MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Work Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <RoleBadge role={selectedEmployee.role} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      <DepartmentBadge department={selectedEmployee.department} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedEmployee.schedule}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {selectedEmployee.specialization && <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Specialization
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedEmployee.specialization}
                </p>
              </div>}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Edit Details
              </button>
              <button className="px-4 py-2 text-sm bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors">
                View Schedule
              </button>
            </div>
          </div>}
      </Modal>
    </div>;
};
const StatusBadge = ({
  status
}: {
  status: EmployeeStatus;
}) => {
  const styles = {
    active: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    on_leave: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    terminated: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    suspended: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const RoleBadge = ({
  role
}: {
  role: EmployeeRole;
}) => {
  const styles = {
    doctor: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    nurse: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    administrator: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    lab_technician: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    pharmacist: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    receptionist: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    hr: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    it: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
      {role.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>;
};
const DepartmentBadge = ({
  department
}: {
  department: Department;
}) => {
  const styles = {
    medical: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    nursing: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    administration: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    laboratory: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    pharmacy: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    hr: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    it: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[department]}`}>
      {department.charAt(0).toUpperCase() + department.slice(1)}
    </span>;
};