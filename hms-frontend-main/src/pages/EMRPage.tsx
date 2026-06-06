import React, { useState } from "react";
import { FileText, Search, Filter, Plus, Calendar, Activity, Pill, FileCheck, ClipboardList, AlertCircle, ChevronRight, MoreVertical, Download, ChevronDown, Heart, Thermometer, Droplet, Scale } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
type PatientStatus = "active" | "critical" | "stable" | "recovering";
type RecordType = "diagnosis" | "treatment" | "prescription" | "lab" | "note";
interface VitalSign {
  timestamp: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  weight: number;
}
interface MedicalRecord {
  id: string;
  type: RecordType;
  title: string;
  date: Date;
  doctor: string;
  details: string;
  status?: string;
  documents?: {
    name: string;
    type: string;
    size: string;
  }[];
}
const mockVitals: VitalSign[] = [{
  timestamp: "08:00",
  heartRate: 75,
  bloodPressure: "120/80",
  temperature: 36.6,
  weight: 70
}, {
  timestamp: "12:00",
  heartRate: 72,
  bloodPressure: "118/79",
  temperature: 36.7,
  weight: 70
}, {
  timestamp: "16:00",
  heartRate: 78,
  bloodPressure: "122/82",
  temperature: 36.8,
  weight: 70
}, {
  timestamp: "20:00",
  heartRate: 71,
  bloodPressure: "119/78",
  temperature: 36.5,
  weight: 70
}];
const mockRecords: MedicalRecord[] = [{
  id: "REC001",
  type: "diagnosis",
  title: "Initial Consultation",
  date: new Date(2024, 1, 15),
  doctor: "Dr. Sarah Wilson",
  details: "Patient presented with symptoms of...",
  documents: [{
    name: "Initial Assessment.pdf",
    type: "PDF",
    size: "2.4 MB"
  }]
}, {
  id: "REC002",
  type: "treatment",
  title: "Treatment Plan",
  date: new Date(2024, 1, 16),
  doctor: "Dr. Michael Chen",
  details: "Prescribed course of antibiotics...",
  status: "In Progress"
}, {
  id: "REC003",
  type: "lab",
  title: "Blood Work Results",
  date: new Date(2024, 1, 17),
  doctor: "Dr. Lisa Johnson",
  details: "All values within normal range",
  documents: [{
    name: "Lab Results.pdf",
    type: "PDF",
    size: "1.8 MB"
  }]
}];
export const EMRPage = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "medications" | "labs" | "documents">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RecordType | "all">("all");
  const filteredRecords = mockRecords.filter(record => {
    if (selectedType !== "all" && record.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return record.title.toLowerCase().includes(query) || record.doctor.toLowerCase().includes(query);
    }
    return true;
  });
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Patient Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#13b8a4]" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
                Electronic Medical Record
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Patient ID: P-12345 • John Doe • Male • 45 years
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 rounded-full">
                  Active Patient
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated: {format(new Date(), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm text-[#13b8a4] hover:bg-[#13b8a4]/10 rounded-lg transition-colors">
              Export Record
            </button>
            <button className="px-4 py-2 bg-[#13b8a4] text-white rounded-lg hover:bg-[#13b8a4]/90 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-full sm:w-fit">
        {(["overview", "history", "medications", "labs", "documents"] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm rounded-md transition-colors capitalize ${activeTab === tab ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}>
            {tab}
          </button>)}
      </div>
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search records..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as RecordType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Types</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="treatment">Treatment</option>
              <option value="prescription">Prescription</option>
              <option value="lab">Lab Results</option>
              <option value="note">Notes</option>
            </select>
          </div>
        </div>
      </div>
      {/* Vital Signs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Vital Signs
          </h2>
          <select className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Heart Rate
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  75
                </p>
              </div>
            </div>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockVitals}>
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Blood Pressure
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  120/80
                </p>
              </div>
            </div>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockVitals}>
                  <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Temperature
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  36.6°C
                </p>
              </div>
            </div>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockVitals}>
                  <Line type="monotone" dataKey="temperature" stroke="#eab308" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Weight
                </p>
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  70 kg
                </p>
              </div>
            </div>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockVitals}>
                  <Line type="monotone" dataKey="weight" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Medical Records */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredRecords.map(record => <div key={record.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getTypeStyles(record.type)}`}>
                  {getTypeIcon(record.type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {record.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {record.details}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(record.date, "MMM d, yyyy")}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {record.doctor}
                    </span>
                  </div>
                  {record.documents && record.documents.length > 0 && <div className="flex items-center gap-2 mt-3">
                      {record.documents.map((doc, index) => <button key={index} className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <FileText className="w-4 h-4" />
                          <span>{doc.name}</span>
                          <Download className="w-4 h-4" />
                        </button>)}
                    </div>}
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>)}
      </div>
    </div>;
};
const getTypeStyles = (type: RecordType): string => {
  switch (type) {
    case "diagnosis":
      return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
    case "treatment":
      return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    case "prescription":
      return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
    case "lab":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
    case "note":
      return "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400";
  }
};
const getTypeIcon = (type: RecordType) => {
  switch (type) {
    case "diagnosis":
      return <ClipboardList className="w-5 h-5" />;
    case "treatment":
      return <Activity className="w-5 h-5" />;
    case "prescription":
      return <Pill className="w-5 h-5" />;
    case "lab":
      return <FileCheck className="w-5 h-5" />;
    case "note":
      return <FileText className="w-5 h-5" />;
  }
};