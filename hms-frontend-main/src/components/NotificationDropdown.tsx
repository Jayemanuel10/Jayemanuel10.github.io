import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Calendar, User, MailWarning } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationType, Notification } from "../data/types";
import { Trash2 } from "lucide-react";
export const getTypeStyles = (type: NotificationType): string => {
  switch (type) {
    case "system":
      return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
    case "patient":
      return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    case "appointment":
      return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
    case "message":
      return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400";
  }
};
export const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case "system":
      return <Bell className="w-5 h-5" />;
    case "patient":
      return <User className="w-5 h-5" />;
    case "appointment":
      return <Calendar className="w-5 h-5" />;
    case "message":
      return <MailWarning className="w-5 h-5" />;
  }
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
interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}
export const NotificationDropdown = ({
  notifications,
  onMarkAsRead,
  onDelete,
  isOpen,
  onClose
}: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter(n => !n.read).length;
  if (!isOpen) return null;
  return <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="sm:hidden fixed inset-x-4 top-20 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && <span className="text-xs text-[#13b8a4]">
                  {unreadCount} unread
                </span>}
            </div>
          </div>
          <NotificationContent notifications={recentNotifications} onMarkAsRead={onMarkAsRead} onDelete={onDelete} navigate={navigate} onClose={onClose} />
        </div>
      </div>
      <div className="hidden sm:block absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-100 dark:border-gray-700 transform rotate-45" />
        <div className="relative">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && <span className="text-xs text-[#13b8a4]">
                  {unreadCount} unread
                </span>}
            </div>
          </div>
          <NotificationContent notifications={recentNotifications} onMarkAsRead={onMarkAsRead} onDelete={onDelete} navigate={navigate} onClose={onClose} />
        </div>
      </div>
    </>;
};
const NotificationContent = ({
  notifications,
  onMarkAsRead,
  onDelete,
  navigate,
  onClose
}: {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  navigate: (path: string) => void;
  onClose: () => void;
}) => <>
    <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
      {notifications.length === 0 ? <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No notifications
        </div> : notifications.map(notification => <div key={notification.id} className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group ${!notification.read ? "bg-[#13b8a4]/5" : ""}`}>
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg shrink-0 ${getTypeStyles(notification.type)}`}>
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {notification.title}
                  </p>
                  <button onClick={e => {
              e.stopPropagation();
              onDelete(notification.id);
            }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all shrink-0">
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(notification.timestamp)}
                  </p>
                  {!notification.read && <button onClick={e => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }} className="w-2 h-2 rounded-full bg-[#13b8a4]" />}
                </div>
              </div>
            </div>
          </div>)}
    </div>
    <div className="p-3 border-t border-gray-100 dark:border-gray-700">
      <button onClick={() => {
      navigate("/notifications");
      onClose();
    }} className="w-full text-center text-sm text-[#13b8a4] hover:text-[#13b8a4]/80 transition-colors">
        View all notifications
      </button>
    </div>
  </>;