import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Upload,
  AlertCircle,
  Calendar,
  Clock,
  Tag,
  FileText,
  ChevronDown
} from "lucide-react";
import { workEntryAPI } from "../services/api";
import toast from "react-hot-toast";

export default function CreateWorkEntry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    hoursWorked: "",
    dateCompleted: new Date().toISOString().split('T')[0]
  });
  const [attachments, setAttachments] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    "Project Work",
    "Research",
    "Development",
    "Design",
    "Testing",
    "Documentation",
    "Maintenance",
    "Support",
    "Training",
    "Meeting",
    "Other"
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800" },
    { value: "high", label: "High", color: "bg-amber-100 text-amber-800" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB'
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await workEntryAPI.create(formData);
      toast.success("Work entry created successfully!");
      
      // Handle file uploads if any
      if (attachments.length > 0) {
        // You would implement file upload logic here
        toast.success(`${attachments.length} file(s) uploaded`);
      }

      // Redirect to entries page
      setTimeout(() => {
        navigate("/work-entries");
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create work entry");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage as draft
    const drafts = JSON.parse(localStorage.getItem('workEntryDrafts') || '[]');
    drafts.push({
      ...formData,
      attachments,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('workEntryDrafts', JSON.stringify(drafts));
    toast.success("Saved as draft");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <X className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Work Entry</h1>
          <p className="text-gray-600 mt-2">Document your work and submit for approval</p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border overflow-hidden"
        >
          <form onSubmit={handleSubmit}>
            {/* Form Sections */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h2>
                
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter a descriptive title"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Describe the work done in detail..."
                  />
                </div>
              </div>

              {/* Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" />
                  Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-left hover:border-gray-400 transition-colors"
                      >
                        <span className={formData.category ? "text-gray-900" : "text-gray-500"}>
                          {formData.category || "Select category"}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showCategoryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, category });
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {priorities.map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: priority.value })}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            formData.priority === priority.value
                              ? priority.color + ' border-transparent'
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hours Worked */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours Worked *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type="number"
                        name="hoursWorked"
                        required
                        min="0"
                        step="0.5"
                        value={formData.hoursWorked}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-900"
                        placeholder="Enter hours"
                      />
                      <span className="text-gray-500 ml-2">hours</span>
                    </div>
                  </div>

                  {/* Date Completed */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Completed *
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type="date"
                        name="dateCompleted"
                        required
                        value={formData.dateCompleted}
                        onChange={handleChange}
                        className="flex-1 outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Attachments (Optional)
                </h2>
                
                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop files here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports: PDF, DOC, XLS, JPG, PNG (Max 10MB each)
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </div>
                </div>

                {/* File List */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(file.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Tip:</span> Make sure all information is accurate before submitting. 
                      Once submitted, the entry will go through the approval chain (Manager → Top Manager).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Fields marked with * are required
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Create Work Entry</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}