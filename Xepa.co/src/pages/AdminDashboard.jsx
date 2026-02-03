import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  Activity,
  Database,
  Key,
  Globe,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  Filter
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    status: "healthy",
    uptime: "99.9%",
    responseTime: "124ms",
    errors: "0.2%"
  });

  useEffect(() => {
    loadData();
    loadActiveUsers();
  }, []);

  const loadData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadActiveUsers = async () => {
    // Mock active users data
    setActiveUsers([
      { id: 1, name: "John Worker", role: "worker", lastActive: "2 min ago" },
      { id: 2, name: "Jane Manager", role: "manager", lastActive: "5 min ago" },
      { id: 3, name: "Bob Top Manager", role: "top_manager", lastActive: "10 min ago" },
      { id: 4, name: "Alice Admin", role: "admin", lastActive: "Just now" }
    ]);
  };

  const adminMetrics = [
    { label: "Total Users", value: "1,247", icon: Users, color: "bg-blue-500" },
    { label: "Active Sessions", value: "89", icon: Activity, color: "bg-green-500" },
    { label: "System Uptime", value: "99.9%", icon: Database, color: "bg-purple-500" },
    { label: "API Requests", value: "12.4k", icon: Globe, color: "bg-amber-500" }
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
      {/* Header */}
      <div className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-white">
                  <Shield className="w-6 h-6 text-gray-900" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">Administrator Dashboard</h1>
                  <p className="text-gray-300 mt-1">System management and monitoring</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => navigate("/system-settings")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => navigate("/user-management")}
                  className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${metric.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Stable</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* System Health & Active Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              System Health Monitor
            </h3>
            <div className="space-y-4">
              {[
                { label: "Server Status", value: systemHealth.status, color: "bg-green-500" },
                { label: "Uptime", value: systemHealth.uptime, color: "bg-blue-500" },
                { label: "Avg Response", value: systemHealth.responseTime, color: "bg-amber-500" },
                { label: "Error Rate", value: systemHealth.errors, color: "bg-red-500" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`} />
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <span className={`font-medium ${
                    item.label.includes('Error') ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => navigate("/system-logs")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                View System Logs
              </button>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Active Users
              </h3>
              <span className="text-sm text-gray-500">Real-time</span>
            </div>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{user.lastActive}</span>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => navigate("/user-management")}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Manage All Users
              </button>
            </div>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Admin Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/database-backup")}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left group"
            >
              <Database className="w-6 h-6 text-gray-600 mb-2 group-hover:text-blue-600" />
              <p className="font-medium text-gray-900">Database Backup</p>
              <p className="text-sm text-gray-600 mt-1">Schedule or run backup</p>
            </button>
            
            <button
              onClick={() => navigate("/security-audit")}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left group"
            >
              <Key className="w-6 h-6 text-gray-600 mb-2 group-hover:text-green-600" />
              <p className="font-medium text-gray-900">Security Audit</p>
              <p className="text-sm text-gray-600 mt-1">Run security checks</p>
            </button>
            
            <button
              onClick={() => navigate("/system-config")}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left group"
            >
              <Settings className="w-6 h-6 text-gray-600 mb-2 group-hover:text-purple-600" />
              <p className="font-medium text-gray-900">System Config</p>
              <p className="text-sm text-gray-600 mt-1">Update system settings</p>
            </button>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Alerts</h3>
              <p className="text-gray-700">
                <span className="font-medium">No critical issues detected.</span> System is running smoothly. 
                Last security audit was completed 2 days ago. All backups are up to date.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => navigate("/alerts")}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  View All Alerts
                </button>
                <button
                  onClick={() => navigate("/maintenance")}
                  className="px-4 py-2 border border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50"
                >
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}