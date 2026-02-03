// components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Bell, Clock, CheckCircle, Users, BarChart3 } from "lucide-react";
import StatsCard from "../common/StatsCard";
import NotificationBell from "../common/NotificationBell";
import NotificationModal from "../Modals/NotificationModal";
import WorkEntryCard from "../common/WorkEntryCard";
import ApprovalCard from "../common/ApprovalCard";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls
  const stats = [
    { 
      title: "Pending Approvals", 
      value: "12", 
      icon: CheckCircle, 
      color: "yellow",
      trend: { value: "+15", direction: 'up' },
      description: "Awaiting your review"
    },
    { 
      title: "Total Hours", 
      value: "248", 
      icon: Clock, 
      color: "blue",
      trend: { value: "-8", direction: 'down' },
      description: "This month"
    },
    { 
      title: "Team Members", 
      value: "24", 
      icon: Users, 
      color: "green",
      description: "Active workers"
    },
    { 
      title: "Completion Rate", 
      value: "92%", 
      icon: BarChart3, 
      color: "purple",
      trend: { value: "+5", direction: 'up' },
      description: "Work entries approved"
    },
  ];

  const recentWorkEntries = [
    {
      id: 1,
      title: "Project Alpha Documentation",
      description: "Complete documentation for Project Alpha including API specifications and user guides.",
      hoursWorked: 8,
      dateCompleted: new Date().toISOString(),
      status: 'approved',
      priority: 'high',
      category: 'Documentation',
      worker: { name: 'John Doe', role: 'Technical Writer' },
      updatedAt: new Date().toISOString(),
    },
    // Add more entries...
  ];

  const pendingApprovals = [
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete redesign of company website with responsive layouts",
      hoursWorked: 40,
      dateCompleted: new Date().toISOString(),
      priority: 'critical',
      status: 'pending',
      category: 'Design',
      worker: { name: 'Jane Smith', role: 'UI Designer' },
      createdAt: new Date().toISOString(),
    },
    // Add more approvals...
  ];

  useEffect(() => {
    // Fetch notifications
    const mockNotifications = [
      {
        id: 1,
        title: "New Approval Request",
        message: "Jane Smith submitted work entry for review",
        type: 'approval',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        metadata: {
          workEntry: "Website Redesign",
          worker: "Jane Smith"
        },
        action: {
          label: "Review Now",
          onClick: () => {
            setIsNotificationModalOpen(false);
            // Navigate to approvals page
          }
        }
      },
      // Add more notifications...
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleViewWorkEntry = (workEntry) => {
    console.log('View work entry:', workEntry);
    // Navigate to work entry detail page
  };

  const handleApprove = (approval) => {
    console.log('Approve:', approval);
    // API call to approve
  };

  const handleReject = (approval) => {
    console.log('Reject:', approval);
    // API call to reject
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
              />
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} loading={loading} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Work Entries */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Work Entries</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {recentWorkEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <WorkEntryCard 
                    workEntry={entry}
                    onViewDetails={handleViewWorkEntry}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {pendingApprovals.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ApprovalCard 
                    approval={approval}
                    isExpanded={false}
                    onToggle={(a) => console.log('Toggle:', a)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewDetails={handleViewWorkEntry}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        onDelete={handleDeleteNotification}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;