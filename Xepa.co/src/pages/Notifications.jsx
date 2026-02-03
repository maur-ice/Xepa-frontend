import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  User,
  Trash2,
  Check,
  Filter,
  Search,
  X,
  BellOff,
  BellRing
} from "lucide-react";
import { notificationAPI } from "../services/api";
import toast from "react-hot-toast";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.data);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(notifications.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      // Implement delete API call here
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'approval_request':
        return { icon: BellRing, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'approval_action':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'comment':
        return { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'escalation':
        return { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' };
      case 'system':
        return { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100' };
      default:
        return { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !notification.isRead) ||
                         (filter === "read" && notification.isRead);
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gray-900">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 mt-1">Stay updated with all system activities</p>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{unreadCount}</span>
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <BellRing className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => 
                    new Date(n.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                  <option value="read">Read Only</option>
                </select>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark All as Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {filter === "all" ? "All Notifications" : 
               filter === "unread" ? "Unread Notifications" : 
               "Read Notifications"} ({filteredNotifications.length})
            </h2>
          </div>
          
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm ? "No notifications match your search criteria" : 
                 filter === "unread" ? "All notifications are read" : 
                 "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification, index) => {
                const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
                const timeAgo = getTimeAgo(notification.createdAt);
                
                return (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`p-3 rounded-lg ${bg} mr-4`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium text-gray-900 mr-2">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {timeAgo}
                            {notification.relatedEntry && (
                              <button
                                onClick={() => navigate(`/work-entries/${notification.relatedEntry}`)}
                                className="ml-4 text-blue-600 hover:text-blue-800"
                              >
                                View Entry
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification._id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              <p className="text-gray-600 mt-1">Manage your notification preferences</p>
            </div>
            <button
              onClick={() => navigate("/settings/notifications")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Manage Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper function to calculate time ago
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}