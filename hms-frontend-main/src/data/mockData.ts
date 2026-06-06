import { Employee, Performance, LeaveBalance, LeaveRequest, Contact, Message, Notification } from './types';

// Employee Data
export const mockEmployees: Employee[] = [{
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
}
// ... add more employees
];

// Performance Data
export const mockPerformance: Performance[] = [{
  id: "P001",
  employeeId: "EMP001",
  employeeName: "Dr. Sarah Wilson",
  department: "medical",
  position: "Senior Doctor",
  rating: 4.8,
  status: "completed",
  reviewDate: new Date(2024, 1, 15),
  nextReview: new Date(2024, 7, 15),
  goals: {
    total: 5,
    completed: 4
  },
  metrics: {
    attendance: 98,
    productivity: 95,
    quality: 97
  },
  reviewer: "Dr. Michael Chen",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}
// ... add more performance records
];

// Leave Data
export const mockLeaveBalances: LeaveBalance[] = [{
  type: "vacation",
  total: 20,
  used: 12,
  remaining: 8
}
// ... add more leave balances
];
export const mockLeaveRequests: LeaveRequest[] = [{
  id: "L001",
  employeeId: "EMP001",
  employeeName: "Dr. Sarah Wilson",
  department: "Medical",
  type: "vacation",
  status: "approved",
  startDate: new Date(2024, 2, 15),
  endDate: new Date(2024, 2, 20),
  reason: "Annual family vacation",
  appliedOn: new Date(2024, 2, 1),
  approvedBy: "Dr. Michael Chen",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
}
// ... add more leave requests
];

// Messages Data
export const mockContacts: Contact[] = [{
  id: "1",
  name: "Dr. Sarah Wilson",
  role: "Cardiologist",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  status: "online",
  lastMessage: {
    id: "m1",
    content: "Patient lab results are ready",
    type: "text",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sender: "Dr. Sarah Wilson",
    status: "read"
  },
  unreadCount: 2
}
// ... add more contacts
];
export const mockMessages: Message[] = [{
  id: "m1",
  content: "Good morning! The lab results for patient John Doe are ready for review.",
  type: "text",
  timestamp: new Date(Date.now() - 1000 * 60 * 60),
  sender: "Dr. Sarah Wilson",
  status: "read"
}
// ... add more messages
];

// Notifications Data
export const mockNotifications: Notification[] = [{
  id: "1",
  type: "system",
  title: "System Maintenance",
  message: "Scheduled maintenance in 30 minutes. Please save your work.",
  timestamp: new Date(Date.now() - 1000 * 60 * 5),
  read: false,
  priority: "high"
}, {
  id: "2",
  type: "patient",
  title: "Patient Update",
  message: "Lab results for John Doe are ready for review.",
  timestamp: new Date(Date.now() - 1000 * 60 * 30),
  read: false,
  priority: "medium"
}, {
  id: "3",
  type: "appointment",
  title: "New Appointment",
  message: "Dr. Wilson, you have a new appointment scheduled for tomorrow at 2 PM.",
  timestamp: new Date(Date.now() - 1000 * 60 * 60),
  read: true,
  priority: "low"
}];