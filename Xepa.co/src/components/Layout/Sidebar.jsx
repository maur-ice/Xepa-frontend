import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  FileText, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings,
  Calendar,
  Folder,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Bell,
  Clock
} from "lucide-react";

const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/work-entries", label: "Work Entries", icon: <FileText className="w-5 h-5" /> },
    { path: "/approvals", label: "Approvals", icon: <CheckSquare className="w-5 h-5" /> },
    { path: "/team", label: "Team", icon: <Users className="w-5 h-5" /> },
    { path: "/reports", label: "Reports", icon: <BarChart3 className="w-5 h-5" /> },
    { path: "/calendar", label: "Calendar", icon: <Calendar className="w-5 h-5" /> },
  ];

  const secondaryNavItems = [
    { path: "/projects", label: "Projects", icon: <Folder className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { path: "/help", label: "Help & Support", icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const quickActions = [
    { label: "New Entry", icon: <PlusCircle className="w-5 h-5" />, path: "/work-entries/new" },
    { label: "Pending", icon: <Clock className="w-5 h-5" />, path: "/approvals/pending" },
    { label: "Notifications", icon: <Bell className="w-5 h-5" />, path: "/notifications" },
  ];

  const navLinkClass = ({ isActive }) => {
    const baseClasses = "flex items-center rounded-lg transition-colors";
    const collapsedClasses = collapsed ? "justify-center p-3" : "px-4 py-3";
    const activeClasses = isActive 
      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
    
    return `${baseClasses} ${collapsedClasses} ${activeClasses}`;
  };

  return (
    <aside className={`bg-white border-r h-screen sticky top-0 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WorkFlow</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-4 border-b">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <NavLink
                key={action.label}
                to={action.path}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                <span className="mr-3">{action.icon}</span>
                {action.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
            >
              <span className={collapsed ? "" : "mr-3"}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Secondary Navigation */}
      <div className="p-4 border-t">
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
            >
              <span className={collapsed ? "" : "mr-3"}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Collapse Info */}
      {collapsed && (
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500 rotate-90 whitespace-nowrap mt-8">
            WorkFlow Manager
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;