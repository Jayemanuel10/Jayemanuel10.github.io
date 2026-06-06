import React, { useState } from "react";
import { Search, Plus, Filter, Grid, List, Phone, Video, MoreVertical, Send, Paperclip, Image as ImageIcon, File, Smile, Check, CheckCheck, Clock, User, Users, MessagesSquare } from "lucide-react";
import { format } from "date-fns";
type MessageStatus = "sent" | "delivered" | "read" | "pending";
type MessageType = "text" | "image" | "file" | "notification";
interface Message {
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
interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastMessage?: Message;
  unreadCount?: number;
}
const mockContacts: Contact[] = [{
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
}, {
  id: "2",
  name: "Dr. Michael Chen",
  role: "Neurologist",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  status: "away",
  lastMessage: {
    id: "m2",
    content: "Schedule update for tomorrow",
    type: "text",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    sender: "Dr. Michael Chen",
    status: "delivered"
  }
}, {
  id: "3",
  name: "Nurse Emma Johnson",
  role: "Head Nurse",
  avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  status: "offline",
  lastMessage: {
    id: "m3",
    content: "Patient report attached",
    type: "file",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    sender: "Nurse Emma Johnson",
    status: "sent",
    attachment: {
      name: "patient_report.pdf",
      size: "2.4 MB",
      type: "pdf"
    }
  }
}];
const mockMessages: Message[] = [{
  id: "m1",
  content: "Good morning! The lab results for patient John Doe are ready for review.",
  type: "text",
  timestamp: new Date(Date.now() - 1000 * 60 * 60),
  sender: "Dr. Sarah Wilson",
  status: "read"
}, {
  id: "m2",
  content: "I'll take a look right away. Any concerning findings?",
  type: "text",
  timestamp: new Date(Date.now() - 1000 * 60 * 55),
  sender: "you",
  status: "read"
}, {
  id: "m3",
  content: "Lab Report - John Doe",
  type: "file",
  timestamp: new Date(Date.now() - 1000 * 60 * 50),
  sender: "Dr. Sarah Wilson",
  status: "read",
  attachment: {
    name: "lab_report.pdf",
    size: "1.8 MB",
    type: "pdf"
  }
}, {
  id: "m4",
  content: "All values are within normal range, but I'd like to discuss the cholesterol levels.",
  type: "text",
  timestamp: new Date(Date.now() - 1000 * 60 * 45),
  sender: "Dr. Sarah Wilson",
  status: "read"
}, {
  id: "m5",
  content: "Sure, let's schedule a quick meeting to discuss.",
  type: "text",
  timestamp: new Date(Date.now() - 1000 * 60 * 5),
  sender: "you",
  status: "delivered"
}];
const mockNotifications: Message[] = [{
  id: "n1",
  content: "New appointment scheduled for tomorrow",
  type: "notification",
  timestamp: new Date(Date.now() - 1000 * 60 * 30),
  sender: "Dr. Sarah Wilson",
  status: "read"
}, {
  id: "n2",
  content: "Lab results are ready for review",
  type: "notification",
  timestamp: new Date(Date.now() - 1000 * 60 * 60),
  sender: "Dr. Sarah Wilson",
  status: "read"
}];
export const MessagesPage = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const filteredContacts = mockContacts.filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.role.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message: Message = {
      id: `m${messages.length + 1}`,
      content: newMessage,
      type: "text",
      timestamp: new Date(),
      sender: "you",
      status: "sent"
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };
  return <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-full sm:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => <button key={contact.id} onClick={() => setSelectedContact(contact)} className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedContact?.id === contact.id ? "bg-gray-50 dark:bg-gray-700/50" : ""}`}>
              <div className="relative">
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${contact.status === "online" ? "bg-green-500" : contact.status === "away" ? "bg-yellow-500" : "bg-gray-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {contact.name}
                  </p>
                  {contact.lastMessage && <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(contact.lastMessage.timestamp, "HH:mm")}
                    </span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {contact.role}
                </p>
                {contact.lastMessage && <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {contact.lastMessage.content}
                  </p>}
              </div>
              {contact.unreadCount && <span className="px-2 py-1 text-xs font-medium text-white bg-[#13b8a4] rounded-full">
                  {contact.unreadCount}
                </span>}
            </button>)}
        </div>
      </div>
      {selectedContact ? <div className="hidden sm:flex flex-1 flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full object-cover" />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${selectedContact.status === "online" ? "bg-green-500" : selectedContact.status === "away" ? "bg-yellow-500" : "bg-gray-500"}`} />
              </div>
              <div>
                <h2 className="font-medium text-gray-900 dark:text-white">
                  {selectedContact.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => <div key={message.id} className={`flex items-end gap-3 ${message.sender === "you" ? "flex-row-reverse" : ""}`}>
                {message.sender !== "you" && <img src={selectedContact.avatar} alt={selectedContact.name} className="w-8 h-8 rounded-full object-cover" />}
                <div className={`group max-w-[70%] ${message.sender === "you" ? "items-end" : "items-start"}`}>
                  {message.type === "text" ? <div className={`px-4 py-2 rounded-2xl ${message.sender === "you" ? "bg-[#13b8a4] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                      <p className="text-sm">{message.content}</p>
                    </div> : message.type === "file" && message.attachment ? <div className={`p-3 rounded-2xl ${message.sender === "you" ? "bg-[#13b8a4] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                      <div className="flex items-center gap-3">
                        <File className="w-8 h-8" />
                        <div>
                          <p className="text-sm font-medium">
                            {message.attachment.name}
                          </p>
                          <p className="text-xs opacity-80">
                            {message.attachment.size}
                          </p>
                        </div>
                      </div>
                    </div> : null}
                  <div className={`flex items-center gap-2 mt-1 ${message.sender === "you" ? "justify-end" : ""}`}>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {format(message.timestamp, "HH:mm")}
                    </span>
                    {message.sender === "you" && <div className="text-gray-400 dark:text-gray-500">
                        {message.status === "sent" && <Check className="w-4 h-4" />}
                        {message.status === "delivered" && <CheckCheck className="w-4 h-4" />}
                        {message.status === "read" && <CheckCheck className="w-4 h-4 text-[#13b8a4]" />}
                        {message.status === "pending" && <Clock className="w-4 h-4" />}
                      </div>}
                  </div>
                </div>
              </div>)}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input type="text" placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#13b8a4] focus:ring-1 focus:ring-[#13b8a4] transition-colors" />
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button type="submit" className="p-2 text-white bg-[#13b8a4] hover:bg-[#13b8a4]/90 rounded-lg transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div> : <div className="hidden sm:flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessagesSquare className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a contact to start messaging
            </p>
          </div>
        </div>}
    </div>;
};