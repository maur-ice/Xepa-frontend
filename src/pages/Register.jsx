import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Loader2, 
  CheckCircle, 
  User, 
  Mail, 
  Lock, 
  Briefcase,
  Building,
  UserCog,
  ChevronDown
} from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "worker",
    department: "",
    position: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    { value: "worker", label: "Worker", icon: User },
    { value: "manager", label: "Manager", icon: UserCog },
    { value: "top_manager", label: "Top Manager", icon: Building },
    { value: "admin", label: "Admin", icon: Briefcase }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await authAPI.register(submitData);
      
      setSuccess(true);
      toast.success("Account created successfully!");
      
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(role => role.value === formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                WElcome to xepa.co
              </h1>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600">
                Join our workflow management platform
              </p>
            </motion.div>

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">
                      Account created successfully! Redirecting...
                    </span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Full Name
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      name="name"
                      type="text"
                      required
                      className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Email Address
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Role Dropdown */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Role
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="w-full flex items-center justify-between border border-gray-300 rounded-lg bg-white px-4 py-3 text-left hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-center">
                        {selectedRole && (
                          <>
                            <selectedRole.icon className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-gray-900">{selectedRole.label}</span>
                          </>
                        )}
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showRoleDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {roles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, role: role.value });
                                setShowRoleDropdown(false);
                              }}
                              className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <Icon className="w-5 h-5 text-gray-400 mr-3" />
                              <span className="text-gray-900">{role.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Department (Optional)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                    <Building className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      name="department"
                      type="text"
                      className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                      placeholder="Enter department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Password
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                    <Lock className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1 flex items-center justify-between">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Confirm Password
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                    <Lock className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1 flex items-center justify-between">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-medium text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Success!</span>
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </div>
                </motion.button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-gray-900 font-semibold hover:text-gray-700 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-8"
            >
              <p className="text-gray-500 text-sm">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-gray-900 hover:text-gray-700 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-gray-900 hover:text-gray-700 font-medium">
                  Privacy Policy
                </a>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                © {new Date().getFullYear()} Workflow Approval System
              </p>
              <p>Developed by Streams Technologies. MAURICE GALEN</p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}