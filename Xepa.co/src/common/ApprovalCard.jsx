import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  AlertCircle,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Eye
} from "lucide-react";

export default function ApprovalCard({ approval, onApprove, onReject, onView }) {
  const [showActions, setShowActions] = useState(false);
  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleApprove = async () => {
    if (!comment.trim()) {
      alert("Please add a comment before approving");
      return;
    }
    setLoading(true);
    try {
      await onApprove(approval._id, comment);
      setComment("");
      setShowActions(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setLoading(true);
    try {
      await onReject(approval._id, rejectionReason);
      setRejectionReason("");
      setShowActions(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(approval.priority)} mr-2`} />
              <span className="text-xs font-medium text-gray-700 uppercase">
                {approval.priority}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {approval.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {approval.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {approval.description}
            </p>
          </div>
          <button
            onClick={() => setShowActions(!showActions)}
            className="ml-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            {showActions ? "Hide Actions" : "Take Action"}
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showActions ? 'rotate-180' : ''}`} />
          </button>
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
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(approval.dateCompleted).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {approval.hoursWorked} hours
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-6 py-4 border-t bg-gray-50"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Approval Comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Add your comments about this approval..."
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="2"
                placeholder="Provide a reason for rejection..."
                disabled={loading}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onView}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="px-4 py-2 border border-red-300 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={loading || !comment.trim()}
                className="px-4 py-2 border border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Approve
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}