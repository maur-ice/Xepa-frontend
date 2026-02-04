import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Filter,
  Search
} from "lucide-react";
import { approvalAPI, dashboardAPI } from "../services/api";
import toast from "react-hot-toast";

export default function TopManagerDashboard() {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [approvalsResponse, statsResponse] = await Promise.all([
        approvalAPI.getPending(),
        dashboardAPI.getStats()
      ]);
      setPendingApprovals(approvalsResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const performanceMetrics = [
    { label: "Overall Approval Rate", value: "92%", change: "+2.3%" },
    { label: "Avg Processing Time", value: "4.2h", change: "-0.8h" },
    { label: "Escalated Cases", value: "3", change: "-1" },
    { label: "Team Satisfaction", value: "94%", change: "+3.1%" }
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
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-900">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Top Manager Dashboard</h1>
                <p className="text-gray-600 mt-1">Executive overview and strategic insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Executive Summary */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Executive Summary</h2>
                <p className="text-gray-300 mt-2">
                  Strategic overview of organizational workflow performance
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <select
                  className="bg-gray-800 text-white border-gray-700 rounded-lg px-4 py-2"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">{metric.label}</p>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.change}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>On track</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Approval Flow */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Approval Flow Analysis
              </h3>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
            <div className="space-y-4">
              {[
                { stage: "Submitted", count: 145, color: "bg-blue-500" },
                { stage: "Under Review", count: 89, color: "bg-amber-500" },
                { stage: "Approved", count: 134, color: "bg-green-500" },
                { stage: "Rejected", count: 11, color: "bg-red-500" },
                { stage: "Escalated", count: 3, color: "bg-purple-500" }
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">{item.stage}</div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.count / 382) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm font-medium text-gray-900">
                        {item.count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" />
              Department Performance
            </h3>
            <div className="space-y-4">
              {[
                { department: "Engineering", approvalRate: "96%", avgTime: "3.2h", trend: "+" },
                { department: "Sales", approvalRate: "89%", avgTime: "5.1h", trend: "-" },
                { department: "Marketing", approvalRate: "92%", avgTime: "4.3h", trend: "+" },
                { department: "Operations", approvalRate: "95%", avgTime: "3.8h", trend: "+" },
                { department: "HR", approvalRate: "91%", avgTime: "4.7h", trend: "-" }
              ].map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{dept.department}</p>
                    <p className="text-sm text-gray-600">
                      {dept.approvalRate} approval • {dept.avgTime} avg
                    </p>
                  </div>
                  <div className={`flex items-center ${
                    dept.trend === '+' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{dept.trend === '+' ? 'Improving' : 'Declining'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Across all departments</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Completed This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.approvedThisMonth || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Work entries approved</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-amber-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pendingApprovals.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Awaiting your attention</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Actions</h3>
              <p className="text-gray-600">Tools for executive decision making</p>
            </div>
            <div className="mt-4 lg:mt-0 flex space-x-4">
              <button
                onClick={() => navigate("/analytics")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                <Target className="w-4 h-4 inline mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}