import React, { useState } from "react";
import { Bell, Calendar, CheckCircle2, Filter, MailWarning, Search, Trash2, User } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { mockNotifications } from "../data/mockData";
import type { Notification, NotificationType, TabType } from "../data/types";
import { getTypeIcon, getTypeStyles } from "../components/NotificationDropdown";
export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<NotificationType | "all">("all");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => notif.id === id ? {
      ...notif,
      read: true
    } : notif));
  };
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({
      ...notif,
      read: true
    })));
  };
  const handleClearNotifications = () => {
    setNotifications([]);
  };
  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "read") return notif.read;
    return true;
  }).filter(notif => selectedType === "all" || notif.type === selectedType).filter(notif => notif.title.toLowerCase().includes(searchQuery.toLowerCase()) || notif.message.toLowerCase().includes(searchQuery.toLowerCase()));
  const unreadCount = notifications.filter(n => !n.read).length;
  return <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-[#13b8a4]" />
          <div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have {unreadCount} unread notifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAllAsRead} className="px-4 py-2 text-sm text-[#13b8a4] hover:bg-[#13b8a4]/10 rounded-lg transition-colors">
            Mark all as read
          </button>
          <button onClick={handleClearNotifications} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-full sm:w-fit">
        {(["all", "unread", "read"] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm rounded-md transition-colors ${activeTab === tab ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab !== "all" && <span className="ml-1 text-xs text-gray-400">
                (
                {notifications.filter(n => tab === "unread" ? !n.read : n.read).length}
                )
              </span>}
          </button>)}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search notifications..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select value={selectedType} onChange={e => setSelectedType(e.target.value as NotificationType | "all")} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors">
            <option value="all">All</option>
            <option value="system">System</option>
            <option value="patient">Patient</option>
            <option value="appointment">Appointment</option>
            <option value="message">Message</option>
          </select>
        </div>
      </div>

      <div className="hidden lg:block">
        {filteredNotifications.length === 0 ? <EmptyState /> : <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Message
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Time
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map(notification => <tr key={notification.id} className={`group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read ? "bg-[#13b8a4]/5 dark:bg-[#13b8a4]/5" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${getTypeStyles(notification.type)}`}>
                            {getTypeIcon(notification.type)}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white capitalize">
                            {notification.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getPriorityStyles(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(notification.timestamp)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleDelete(notification.id)} className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {!notification.read && <button onClick={() => handleMarkAsRead(notification.id)} className="p-1 text-[#13b8a4] hover:bg-[#13b8a4]/10 rounded-full transition-colors">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>}
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}
      </div>

      <div className="lg:hidden grid gap-4 grid-cols-1 md:grid-cols-2">
        {filteredNotifications.length === 0 ? <EmptyState /> : filteredNotifications.map(notification => <NotificationCard key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />)}
      </div>
    </div>;
};
const getPriorityStyles = (priority: NotificationPriority): string => {
  switch (priority) {
    case "high":
      return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
    case "medium":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
    case "low":
      return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
  }
};
const EmptyState = () => {
  return <div className="col-span-full text-center py-12">
      <MailWarning className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
    </div>;
};
const formatDate = (date: Date) => {
  try {
    return formatDistanceToNow(date, {
      addSuffix: true
    });
  } catch (error) {
    return "Invalid date";
  }
};
const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return <div key={notification.id} className={`group relative bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all duration-200 hover:shadow-md ${notification.read ? "border-gray-200 dark:border-gray-700" : "border-[#13b8a4] dark:border-[#13b8a4] bg-[#13b8a4]/5"}`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${getTypeStyles(notification.type)}`}>
          {getTypeIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {notification.message}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button onClick={() => onDelete(notification.id)} className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
              {!notification.read && <button onClick={() => onMarkAsRead(notification.id)} className="p-1 text-[#13b8a4] hover:bg-[#13b8a4]/10 rounded-full transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                </button>}
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getPriorityStyles(notification.priority)}`}>
                {notification.priority}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatDate(notification.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};