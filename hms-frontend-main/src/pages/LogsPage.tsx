import React, { useState } from "react";
import { Search, Filter, Download, Clock, AlertTriangle, Shield, Settings, User, Database, MoreVertical, RefreshCw } from "lucide-react";
import { format } from "date-fns";
type LogSeverity = "info" | "warning" | "error" | "critical";
type LogType = "system" | "user" | "security" | "database";
interface Log {
  id: string;
  timestamp: Date;
  type: LogType;
  severity: LogSeverity;
  message: string;
  source: string;
  details?: string;
  user?: string;
}
const mockLogs: Log[] = [{
  id: "LOG001",
  timestamp: new Date(),
  type: "system",
  severity: "info",
  message: "System backup completed successfully",
  source: "Backup Service",
  details: "Full system backup completed in 15 minutes"
}, {
  id: "LOG002",
  timestamp: new Date(Date.now() - 1000 * 60 * 15),
  type: "security",
  severity: "warning",
  message: "Multiple failed login attempts detected",
  source: "Auth Service",
  user: "Unknown",
  details: "5 failed attempts from IP: 192.168.1.100"
}, {
  id: "LOG003",
  timestamp: new Date(Date.now() - 1000 * 60 * 30),
  type: "user",
  severity: "error",
  message: "Failed to update patient record",
  source: "EMR Module",
  user: "dr.wilson@hospital.com",
  details: "Database constraint violation"
}, {
  id: "LOG004",
  timestamp: new Date(Date.now() - 1000 * 60 * 45),
  type: "database",
  severity: "critical",
  message: "Database connection timeout",
  source: "Database Server",
  details: "Connection pool exhausted"
}];
export const LogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<LogType | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<LogSeverity | "all">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  const filteredLogs = mockLogs.filter(log => {
    if (selectedType !== "all" && log.type !== selectedType) return false;
    if (selectedSeverity !== "all" && log.severity !== selectedSeverity) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return log.message.toLowerCase().includes(query) || log.source.toLowerCase().includes(query) || log.user?.toLowerCase().includes(query);
    }
    return true;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  return <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            System Logs
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor and track system activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRefresh} className={`p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${isRefreshing ? "animate-spin" : ""}`}>
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value as LogType)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Types</option>
              <option value="system">System</option>
              <option value="user">User</option>
              <option value="security">Security</option>
              <option value="database">Database</option>
            </select>
            <select value={selectedSeverity} onChange={e => setSelectedSeverity(e.target.value as LogSeverity)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Severity
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map(log => <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {format(log.timestamp, "MMM d, yyyy HH:mm:ss")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <LogTypeBadge type={log.type} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {log.message}
                    </p>
                    {log.user && <p className="text-xs text-gray-500 dark:text-gray-400">
                        User: {log.user}
                      </p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {log.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={log.severity} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
const LogTypeBadge = ({
  type
}: {
  type: LogType;
}) => {
  const styles = {
    system: {
      className: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      icon: Settings
    },
    user: {
      className: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      icon: User
    },
    security: {
      className: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      icon: Shield
    },
    database: {
      className: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      icon: Database
    }
  };
  const {
    className,
    icon: Icon
  } = styles[type];
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>;
};
const SeverityBadge = ({
  severity
}: {
  severity: LogSeverity;
}) => {
  const styles = {
    info: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    warning: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    error: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    critical: "bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
  };
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[severity]}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>;
};