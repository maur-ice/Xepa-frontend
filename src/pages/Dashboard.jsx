import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Plus,
  Bell,
  LogOut
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const getRoleBasedDashboard = () => {
    if (!user) return "/login";
    
    switch (user.role) {
      case "worker":
        return "/worker-dashboard";
      case "manager":
        return "/manager-dashboard";
      case "top_manager":
        return "/top-manager-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/dashboard";
    }
  };

  const statCards = [
    {
      title: "Total Entries",
      value: stats?.totalEntries || 0,
      icon: FileText,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
      icon: Clock,
      color: "bg-amber-500",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Approved This Month",
      value: stats?.approvedThisMonth || 0,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Avg Processing Time",
      value: stats?.averageProcessingTime ? `${stats.averageProcessingTime}h` : "0h",
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-gray-900" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Workflow Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/notifications")}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => navigate("/create-entry")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Users className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your work entries today.
          </p>
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            <span className="capitalize">{user?.role?.replace('_', ' ')}</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  {card.title === "Pending Approvals" && card.value > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {card.value} pending
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
                  <span>Updated just now</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button
                onClick={() => navigate("/work-entries")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View all
              </button>
            </div>
            <div className="space-y-4">
              {[
                { action: "Submitted", title: "Q4 Report", time: "2 hours ago", status: "pending" },
                { action: "Approved", title: "Project Alpha", time: "1 day ago", status: "approved" },
                { action: "Rejected", title: "Bug Fixes", time: "3 days ago", status: "rejected" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'approved' ? 'bg-green-100' :
                    activity.status === 'rejected' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.status === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : activity.status === 'rejected' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.action} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/create-entry")}
                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
              >
                <Plus className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">New Entry</p>
                <p className="text-sm text-gray-600 mt-1">Create work entry</p>
              </button>
              
              <button
                onClick={() => navigate("/pending-approvals")}
                className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all"
              >
                <Clock className="w-6 h-6 text-amber-600 mb-2" />
                <p className="font-medium text-gray-900">Approvals</p>
                <p className="text-sm text-gray-600 mt-1">Review pending</p>
              </button>
              
              <button
                onClick={() => navigate("/notifications")}
                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all"
              >
                <AlertCircle className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600 mt-1">View updates</p>
              </button>
              
              <button
                onClick={() => navigate("/profile")}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all"
              >
                <Users className="w-6 h-6 text-gray-600 mb-2" />
                <p className="font-medium text-gray-900">Profile</p>
                <p className="text-sm text-gray-600 mt-1">Account settings</p>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Role-specific Dashboard Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  Go to your {user?.role?.replace('_', ' ') || 'role'} dashboard
                </h3>
                <p className="text-gray-300 mt-2">
                  Access role-specific features and detailed analytics
                </p>
              </div>
              <button
                onClick={() => navigate(getRoleBasedDashboard())}
                className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}