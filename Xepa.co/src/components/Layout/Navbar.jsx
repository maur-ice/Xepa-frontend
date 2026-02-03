import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  User,
  Settings,
  LogOut,
  Home,
  FileText,
  CheckSquare,
  Users,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, onLogout, notifications }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { path: "/work-entries", label: "Work Entries", icon: <FileText className="w-4 h-4" /> },
    { path: "/approvals", label: "Approvals", icon: <CheckSquare className="w-4 h-4" /> },
    { path: "/team", label: "Team", icon: <Users className="w-4 h-4" /> },
    { path: "/reports", label: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg mr-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WorkFlow</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex ml-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg mx-1 transition-colors"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Search and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6" />
              {notifications && notifications.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50"
                  >
                    <div className="p-4 border-b">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="border-t py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t mt-2"
            >
              <div className="pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-3 py-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;