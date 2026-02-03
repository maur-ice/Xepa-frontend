import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Filter,
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Send,
  ChevronDown
} from "lucide-react";
import { workEntryAPI } from "../services/api";
import WorkEntryCard from "../components/Common/WorkEntryCard";
import toast from "react-hot-toast";

export default function WorkEntries() {
  const navigate = useNavigate();
  const [workEntries, setWorkEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    loadWorkEntries();
  }, []);

  const loadWorkEntries = async () => {
    try {
      const response = await workEntryAPI.getAll();
      setWorkEntries(response.data.data);
    } catch (error) {
      toast.error("Failed to load work entries");
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = workEntries.filter(entry => {
    const matchesFilter = filter === "all" || entry.status === filter;
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || new Date(entry.createdAt).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const getStatusCounts = () => {
    const counts = {
      all: workEntries.length,
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0
    };
    
    workEntries.forEach(entry => {
      if (counts[entry.status] !== undefined) {
        counts[entry.status]++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Work Entries</h1>
              <p className="text-gray-600 mt-1">Manage and track all your work submissions</p>
            </div>
            <button
              onClick={() => navigate("/create-entry")}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`p-3 rounded-lg border text-center transition-colors ${
              filter === "all" 
                ? "bg-gray-900 text-white border-gray-900" 
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">{statusCounts.all}</div>
            <div className="text-xs">All</div>
          </button>
          
          <button
            onClick={() => setFilter("draft")}
            className={`p-3 rounded-lg border text-center transition-colors ${
              filter === "draft" 
                ? "bg-gray-800 text-white border-gray-800" 
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">{statusCounts.draft}</div>
            <div className="text-xs">Draft</div>
          </button>
          
          <button
            onClick={() => setFilter("submitted")}
            className={`p-3 rounded-lg border text-center transition-colors ${
              filter === "submitted" 
                ? "bg-blue-800 text-white border-blue-800" 
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">{statusCounts.submitted}</div>
            <div className="text-xs">Submitted</div>
          </button>
          
          <button
            onClick={() => setFilter("approved")}
            className={`p-3 rounded-lg border text-center transition-colors ${
              filter === "approved" 
                ? "bg-green-800 text-white border-green-800" 
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">{statusCounts.approved}</div>
            <div className="text-xs">Approved</div>
          </button>
          
          <button
            onClick={() => setFilter("rejected")}
            className={`p-3 rounded-lg border text-center transition-colors ${
              filter === "rejected" 
                ? "bg-red-800 text-white border-red-800" 
                : "bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="text-lg font-bold">{statusCounts.rejected}</div>
            <div className="text-xs">Rejected</div>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search work entries by title or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Created
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="date"
                    className="flex-1 outline-none"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Title A-Z</option>
                  <option>Title Z-A</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Priorities</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Work Entries List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {filter === "all" ? "All Work Entries" : 
               filter === "draft" ? "Draft Entries" :
               filter === "submitted" ? "Submitted Entries" :
               filter === "approved" ? "Approved Entries" :
               "Rejected Entries"} ({filteredEntries.length})
            </h2>
            <span className="text-sm text-gray-500">
              Showing {filteredEntries.length} of {workEntries.length} entries
            </span>
          </div>
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work entries found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No entries match your search criteria" : 
                 filter !== "all" ? `No ${filter} entries found` : 
                 "Start by creating your first work entry"}
              </p>
              {!searchTerm && filter === "all" && (
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
                    onDelete={loadWorkEntries}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <FileText className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-700 mb-3">
                Here are some tips for managing your work entries effectively:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span>Save entries as draft if you need to complete them later</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span>Submit entries during working hours for faster approval</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span>Check the status regularly to track approval progress</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}