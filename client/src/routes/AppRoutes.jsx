import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider, useAuth } from '../context/AuthContext';

const Landing = lazy(() => import('../pages/Landing'));
const ProviderDashboard = lazy(() => import('../pages/ProviderDashboard'));
const ResidentDashboard = lazy(() => import('../pages/ResidentDashboard'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const RequestService = lazy(() => import('../pages/RequestService'));
const MyRequests = lazy(() => import('../pages/MyRequests'));

// Protects any route, redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Restricts route to a specific role
function RoleRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/provider" element={
            <RoleRoute role="provider">
              <ProviderDashboard />
            </RoleRoute>
          } />
          <Route path="/resident" element={
            <RoleRoute role="resident">
              <ResidentDashboard />
            </RoleRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/request/:id" element={<RequestService />} />
          <Route path="/my-requests" element={<MyRequests />} />
        </Routes>
      </Suspense>
    </Router>
  </AuthProvider>
);

export default AppRoutes; 