import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import TopManagerDashboard from './pages/TopManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateWorkEntry from './pages/CreateWorkEntry';
import WorkEntries from './pages/WorkEntries';
import PendingApprovals from './pages/PendingApprovals';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/worker-dashboard" element={
            <ProtectedRoute>
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/manager-dashboard" element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/top-manager-dashboard" element={
            <ProtectedRoute>
              <TopManagerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/create-entry" element={
            <ProtectedRoute>
              <CreateWorkEntry />
            </ProtectedRoute>
          } />
          
          <Route path="/work-entries" element={
            <ProtectedRoute>
              <WorkEntries />
            </ProtectedRoute>
          } />
          
          <Route path="/pending-approvals" element={
            <ProtectedRoute>
              <PendingApprovals />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;