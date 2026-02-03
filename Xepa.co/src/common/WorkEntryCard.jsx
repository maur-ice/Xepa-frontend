import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Send,
  AlertCircle,
  Calendar,
  User
} from "lucide-react";
import { workEntryAPI } from "../../services/api";
import toast from "react-hot-toast";

export default function WorkEntryCard({ entry, onView, onEdit, onDelete }) {
  const [loading, setLoading] = useState(false);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'draft':
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Draft' };
      case 'submitted':
        return { color: 'bg-blue-100 text-blue-800', icon: Send, label: 'Submitted' };
      case 'under_review':
        return { color: 'bg-amber-100 text-amber-800', icon: Clock, label: 'Under Review' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' };
      case 'escalated':
        return { color: 'bg-purple-100 text-purple-800', icon: AlertCircle, label: 'Escalated' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Unknown' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-gray-500';
      case 'medium': return 'bg-blue-500';
      case 'high': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const statusInfo = getStatusInfo(entry.status);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await workEntryAPI.submit(entry._id);
      toast.success("Work entry submitted for approval");
      if (onDelete) onDelete();
    } catch (error) {
      toast.error("Failed to submit entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this work entry?")) {
      setLoading(true);
      try {
        await workEntryAPI.delete(entry._id);
        toast.success("Work entry deleted");
        if (onDelete) onDelete();
      } catch (error) {
        toast.error("Failed to delete entry");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {entry.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {entry.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                <statusInfo.icon className="w-3 h-3 mr-1" />
                {statusInfo.label}
              </span>
              <div className="flex items-center text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(entry.priority)} mr-1`} />
                {entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1)}
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(entry.dateCompleted).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {entry.hoursWorked} hours
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {entry.worker?.name || 'Unknown'}
            </div>
            {entry.currentApprover && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Waiting on: {entry.currentApprover?.name || 'Approver'}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="View details"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          {entry.status === 'draft' && (
            <>
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit entry"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Submit for approval"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete entry"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}