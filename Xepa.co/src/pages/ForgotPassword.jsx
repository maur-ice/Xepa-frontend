import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Key,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Shield,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: reset code, 3: new password

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      toast.success("Reset link sent to your email!");
      
      setTimeout(() => {
        setStep(2);
        setSuccess(false);
      }, 2000);

    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResetCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(3);
      toast.success("Code verified!");
    } catch (error) {
      toast.error("Invalid reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Password reset successful!");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-md">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {step === 1 && "Reset Your Password"}
                  {step === 2 && "Enter Reset Code"}
                  {step === 3 && "Create New Password"}
                </h1>
                <p className="text-gray-600">
                  {step === 1 && "Enter your email to receive a reset link"}
                  {step === 2 && "Check your email for the 6-digit code"}
                  {step === 3 && "Create a strong new password"}
                </p>
              </motion.div>

              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">
                        Reset link sent! Check your email.
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Email Input */}
                {step === 1 && (
                  <form onSubmit={handleSubmitEmail} className="space-y-6">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        Email Address
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                          type="email"
                          required
                          className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                          placeholder="Enter your registered email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">
                          We'll send a password reset link to your email. The link will expire in 1 hour.
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-medium text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </div>
                    </motion.button>
                  </form>
                )}

                {/* Step 2: Reset Code */}
                {step === 2 && (
                  <form onSubmit={handleSubmitResetCode} className="space-y-6">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        6-Digit Reset Code
                      </label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                        <Key className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                          type="text"
                          required
                          maxLength="6"
                          pattern="[0-9]{6}"
                          className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent text-center tracking-widest"
                          placeholder="000000"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Enter the 6-digit code sent to {email}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Use different email
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitEmail}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Resend code
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-medium text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          "Verify Code"
                        )}
                      </div>
                    </motion.button>
                  </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                  <form onSubmit={handleSubmitNewPassword} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                          New Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                          <Key className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type="password"
                            required
                            minLength="8"
                            className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                          Confirm New Password
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
                          <Key className="w-5 h-5 text-gray-400 mr-3" />
                          <input
                            type="password"
                            required
                            minLength="8"
                            className="flex-1 outline-none text-gray-900 placeholder-gray-500 text-sm bg-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-amber-800 font-medium mb-1">
                            Password Requirements:
                          </p>
                          <ul className="text-xs text-amber-800 space-y-1">
                            <li>• Minimum 8 characters</li>
                            <li>• At least one uppercase letter</li>
                            <li>• At least one number</li>
                            <li>• At least one special character</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-medium text-sm relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </div>
                    </motion.button>
                  </form>
                )}

                {/* Login Link */}
                <div className="text-center pt-6 border-t mt-6">
                  <p className="text-gray-600 text-sm">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-gray-900 font-semibold hover:text-gray-700 transition-colors"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-8"
              >
                <p className="text-gray-500 text-xs">
                  Need help? Contact support@workflowsystem.com
                </p>
                <p className="text-gray-400 text-xs mt-2">
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