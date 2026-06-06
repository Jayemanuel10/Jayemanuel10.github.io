import React from "react";
import { Notification } from "../pages/NotificationsPage";
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