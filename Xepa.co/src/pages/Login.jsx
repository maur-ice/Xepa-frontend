import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2,
  CheckCircle,
  Mail,
  Lock,
} from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authAPI.login(formData);
      
      setSuccess(true);
      
      // Save user data locally
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      toast.success("Login successful!");
      
      // Redirect based on role
      setTimeout(() => {
        const user = response.data.data.user;
        
        switch (user.role) {
          case "worker":
            navigate("/worker-dashboard");
            break;
          case "manager":
            navigate("/manager-dashboard");
            break;
          case "top_manager":
            navigate("/top-manager-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }, 1500);

    } catch (error) {
      setMessage(
        `❌ Login failed: ${error.response?.data?.message || "Please check your credentials"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-md">
              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Workflow Approval System</h1>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign in</h2>
                <p className="text-gray-600 text-sm">Streamline your approval workflow</p>
              </motion.div>

              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6"
              >
                {/* Success Overlay */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 max-w-sm w-full"
                      >
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Welcome Back!</h3>
                        <p className="text-gray-600 mb-4 text-center text-sm">
                          Login successful! Redirecting to your dashboard...
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Message Display */}
                {message && !success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-md mb-4 text-sm ${
                      message.includes('Error') || message.includes('failed') || message.includes('error') 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {message}
                  </motion.div>
                )}

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Email Address
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <input
                        name="email"
                        type="email"
                        required
                        className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="off"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Password
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200">
                      <Lock className="w-4 h-4 text-gray-400 mr-2" />
                      <div className="flex justify-between w-full">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer mt-1 text-black"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Remember Me Checkbox */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center"
                  >
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </motion.div>

                  {/* Sign In Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={loading || success}
                      className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Signing in...</span>
                          </>
                        ) : success ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Success!</span>
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </div>
                    </motion.button>
                  </motion.div>
                </form>

                {/* Forgot Password Link */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Link
                    to="/forgot-password"
                    className="text-gray-900 font-medium hover:text-gray-700 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Sign Up Link */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center mt-6"
                >
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link 
                      to="/register" 
                      className="text-gray-900 font-medium hover:text-gray-700 transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </p>
                </motion.div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <p className="text-gray-500 text-xs">
                  © {new Date().getFullYear()} Workflow Approval System
                </p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}