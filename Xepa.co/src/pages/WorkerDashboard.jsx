import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Plus,
  Filter,
  Search,
  BarChart3,
  AlertCircle,
  User
} from "lucide-react";
import { workEntryAPI, dashboardAPI } from "../services/api";
import WorkEntryCard from "../components/Common/WorkEntryCard";
import toast from "react-hot-toast";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [workEntries, setWorkEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entriesResponse, statsResponse] = await Promise.all([
        workEntryAPI.getAll(),
        dashboardAPI.getStats()
      ]);
      setWorkEntries(entriesResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = workEntries.filter(entry => {
    const matchesFilter = filter === "all" || entry.status === filter;
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStats = () => {
    const stats = {
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0
    };
    
    workEntries.forEach(entry => {
      if (stats[entry.status] !== undefined) {
        stats[entry.status]++;
      }
    });
    
    return stats;
  };

  const statusStats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your work entries and track approvals</p>
            </div>
            <button
              onClick={() => navigate("/create-entry")}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Work Entry
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalEntries || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{statusStats.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statusStats.submitted}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{statusStats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search work entries..."
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
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Work Entries List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">My Work Entries</h2>
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work entries found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try a different search term" : "Start by creating your first work entry"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/create-entry")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Entry
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <WorkEntryCard 
                    entry={entry} 
                    onView={() => navigate(`/work-entries/${entry._id}`)}
                    onEdit={() => navigate(`/edit-entry/${entry._id}`)}
                    onDelete={loadData}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Approval Tips</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <span>Provide detailed descriptions for faster approvals</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <span>Submit entries before end of day for priority review</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <span>Track your approval chain in real-time</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Average Approval Time</p>
                  <p className="text-sm text-gray-600">
                    {stats?.averageProcessingTime ? `${stats.averageProcessingTime} hours` : 'Calculating...'}
                  </p>
                </div>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Approval Rate</p>
                  <p className="text-sm text-gray-600">
                    {stats?.totalEntries ? 
                      `${Math.round((statusStats.approved / stats.totalEntries) * 100)}% success` : 
                      '0% success'
                    }
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}