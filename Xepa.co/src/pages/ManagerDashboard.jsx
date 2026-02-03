import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  BarChart3,
  UserCheck,
  FileCheck,
  Eye
} from "lucide-react";
import { approvalAPI, dashboardAPI } from "../services/api";
import ApprovalCard from "../components/Common/ApprovalCard";
import toast from "react-hot-toast";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleApprove = async (id, comments) => {
    try {
      await approvalAPI.process(id, { action: "approved", comments });
      toast.success("Approved successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await approvalAPI.process(id, { action: "rejected", reason });
      toast.success("Rejected successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to reject");
    }
  };

  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesFilter = filter === "all" || approval.priority === filter;
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
                  <p className="text-gray-600 mt-1">Review and approve work entries from your team</p>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingApprovals.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.subordinates || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-100">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Active team</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Approval Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.averageProcessingTime ? `${stats.averageProcessingTime}h` : '0h'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Efficient processing</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.totalEntries && stats.totalEntries > 0 
                    ? `${Math.round((stats.approvedThisMonth / stats.totalEntries) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-100">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Good performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden mb-8">
          <div className="px-6 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Pending Approvals
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review and take action on work entries requiring your approval
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <Filter className="w-5 h-5 text-gray-400 mr-2" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
              <p className="text-gray-600">
                Great job! You're all caught up.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApprovals.map((approval, index) => (
                <motion.div
                  key={approval._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ApprovalCard
                    approval={approval}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={() => navigate(`/work-entries/${approval._id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Approval Timeline */}
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Approval Timeline
            </h3>
            <div className="space-y-4">
              {[
                { time: "Within 1 hour", count: 12, color: "bg-green-500" },
                { time: "1-4 hours", count: 8, color: "bg-blue-500" },
                { time: "4-8 hours", count: 5, color: "bg-amber-500" },
                { time: "8+ hours", count: 3, color: "bg-red-500" }
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">{item.time}</div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.count / 28) * 100}%` }}
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

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Manager Tools</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/team-performance")}
                className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-3" />
                  <span>Team Performance</span>
                </div>
                <AlertCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/subordinates")}
                className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>Team Members</span>
                </div>
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <span>Generate Reports</span>
                </div>
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}