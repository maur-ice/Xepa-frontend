import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  AlertCircle,
  Filter,
  Search,
  Eye,
  ChevronDown,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { approvalAPI } from "../services/api";
import toast from "react-hot-toast";

export default function PendingApprovals() {
  const navigate = useNavigate();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approveComment, setApproveComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const response = await approvalAPI.getPending();
      setPendingApprovals(response.data.data);
    } catch (error) {
      toast.error("Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approvalId) => {
    if (!approveComment.trim()) {
      toast.error("Please add a comment before approving");
      return;
    }

    try {
      await approvalAPI.process(approvalId, { 
        action: "approved", 
        comments: approveComment 
      });
      toast.success("Approved successfully!");
      setApproveComment("");
      setSelectedApproval(null);
      loadPendingApprovals();
    } catch (error) {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (approvalId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await approvalAPI.process(approvalId, { 
        action: "rejected", 
        reason: rejectReason 
      });
      toast.success("Rejected successfully!");
      setRejectReason("");
      setSelectedApproval(null);
      loadPendingApprovals();
    } catch (error) {
      toast.error("Failed to reject");
    }
  };

  const toggleApprovalDetails = (approval) => {
    if (selectedApproval?._id === approval._id) {
      setSelectedApproval(null);
      setApproveComment("");
      setRejectReason("");
    } else {
      setSelectedApproval(approval);
      setApproveComment("");
      setRejectReason("");
    }
  };

  const filteredApprovals = pendingApprovals.filter(approval => {
    const matchesFilter = filter === "all" || approval.priority === filter;
    const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.worker?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
              <p className="text-gray-600 mt-1">Review and process work entries awaiting your approval</p>
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
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title or worker name..."
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
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Approvals Grid */}
        {filteredApprovals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
            <p className="text-gray-600">
              Great job! You're all caught up with your approval tasks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApprovals.map((approval, index) => (
              <motion.div
                key={approval._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                {/* Approval Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(approval.priority)} mr-2`} />
                        <span className="text-xs font-medium text-gray-700 uppercase">
                          {approval.priority}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {approval.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {approval.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {approval.hoursWorked} hours
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(approval.dateCompleted).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Worker Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {approval.worker?.name || 'Unknown Worker'}
                        </p>
                        <p className="text-xs text-gray-500">Submitted for approval</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleApprovalDetails(approval)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {selectedApproval?._id === approval._id ? (
                        <>
                          Hide Actions
                          <ChevronDown className="w-4 h-4 ml-1 rotate-180" />
                        </>
                      ) : (
                        <>
                          Take Action
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Panel */}
                {selectedApproval?._id === approval._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 border-t bg-gray-50"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Approval Comments
                      </label>
                      <textarea
                        value={approveComment}
                        onChange={(e) => setApproveComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Add your comments about this approval..."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Rejection Reason (if rejecting)
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows="2"
                        placeholder="Provide a reason for rejection..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => navigate(`/work-entries/${approval._id}`)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleReject(approval._id)}
                        disabled={!rejectReason.trim()}
                        className="px-4 py-2 border border-red-300 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(approval._id)}
                        disabled={!approveComment.trim()}
                        className="px-4 py-2 border border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Approval Meta */}
                <div className="px-6 py-4 bg-gray-50 border-t rounded-b-xl">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Submitted: {new Date(approval.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Category: {approval.category}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <Clock className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval Guidelines</h3>
              <p className="text-gray-700 mb-3">
                Follow these best practices when reviewing work entries:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span>Always provide constructive feedback when approving or rejecting</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span>Prioritize critical and high-priority items first</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt=2 mr-3"></div>
                  <span>Review entries within 24 hours for optimal workflow</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <span>Escalate to higher management if uncertain about approval</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}