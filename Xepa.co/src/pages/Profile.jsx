import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Building,
  Briefcase,
  Edit,
  Save,
  Lock,
  Key,
  LogOut,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data);
      setFormData({
        name: response.data.data.name,
        email: response.data.data.email,
        department: response.data.data.department || "",
        position: response.data.data.position || ""
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await authAPI.updateProfile(formData);
      toast.success("Profile updated successfully");
      setEditing(false);
      loadUserProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password changed successfully");
      setChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'top_manager': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'worker': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-900" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold">{user?.name}</h2>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                          {user?.role?.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="ml-2 text-sm text-gray-300">
                          Joined {new Date(user?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30"
                  >
                    {editing ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Edit className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-6">
                {editing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter department"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Position
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter position"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setEditing(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Shield className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Role</p>
                          <p className="font-medium text-gray-900 capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium text-gray-900">{user?.department || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Position</p>
                          <p className="font-medium text-gray-900">{user?.position || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Account Created</p>
                        <p className="font-medium text-gray-900">
                          {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Security & Actions */}
          <div className="space-y-6">
            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2 text-blue-600" />
                Security
              </h3>
              
              {changingPassword ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => setChangingPassword(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Update Password
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-600">Last changed 2 weeks ago</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setChangingPassword(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        For security reasons, you should change your password regularly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Work Entries</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Approvals</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notifications</span>
                  <span className="font-bold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Last Login</span>
                  <span className="font-bold">Today</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Go to Dashboard</span>
                  <span className="text-gray-400">→</span>
                </button>
                <button
                  onClick={() => navigate("/work-entries")}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">View Work Entries</span>
                  <span className="text-gray-400">→</span>
                </button>
                <button
                  onClick={() => navigate("/notifications")}
                  className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Notifications</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}