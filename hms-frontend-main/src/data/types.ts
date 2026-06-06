// Common Types
export type ViewMode = "list" | "grid";
// Employee Types
export type EmployeeStatus = "active" | "on_leave" | "terminated" | "suspended";
export type EmployeeRole = "doctor" | "nurse" | "administrator" | "lab_technician" | "pharmacist" | "receptionist" | "hr" | "it";
export type Department = "medical" | "nursing" | "administration" | "laboratory" | "pharmacy" | "hr" | "it";
export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  department: Department;
  email: string;
  phone: string;
  joinDate: Date;
  status: EmployeeStatus;
  schedule: string;
  avatar: string;
  performanceRating?: number;
  specialization?: string;
  supervisor?: string;
}
// Performance Types
export type PerformanceStatus = "completed" | "pending" | "overdue" | "in_progress";
export interface Performance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  position: string;
  rating: number;
  status: PerformanceStatus;
  reviewDate: Date;
  nextReview?: Date;
  goals: {
    total: number;
    completed: number;
  };
  metrics: {
    attendance: number;
    productivity: number;
    quality: number;
  };
  reviewer?: string;
  avatar: string;
}
// Leave Types
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type LeaveType = "sick" | "vacation" | "personal" | "maternity" | "paternity";
export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: Date;
  endDate: Date;
  reason: string;
  appliedOn: Date;
  approvedBy?: string;
  avatar: string;
}
// Messages Types
export type MessageStatus = "sent" | "delivered" | "read" | "pending";
export type MessageType = "text" | "image" | "file" | "notification";
export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  sender: string;
  status: MessageStatus;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}
export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastMessage?: Message;
  unreadCount?: number;
}
// Notification Types
export type NotificationType = "system" | "patient" | "appointment" | "message";
export type NotificationPriority = "high" | "medium" | "low";
export type TabType = "all" | "unread" | "read";
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
}