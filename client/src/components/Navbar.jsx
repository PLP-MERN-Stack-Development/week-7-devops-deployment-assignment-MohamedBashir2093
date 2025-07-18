import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const isProviderDashboard = user && user.role === 'provider';

  if (isLanding) {
    return (
      <nav className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between shadow">
        <div className="flex items-center gap-6">
          <span className="text-2xl mr-2">👥</span>
          <Link to="/" className="font-bold text-lg tracking-wide">Community Service Provider</Link>
          <Link to="/" className="font-semibold text-lg tracking-wide ml-4">Home</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="bg-white text-blue-700 px-5 py-2 rounded font-semibold shadow hover:bg-blue-100 transition-all mr-2">Login</Link>
          <Link to="/register" className="bg-blue-900 text-white px-5 py-2 rounded font-semibold shadow hover:bg-blue-800 transition-all">Register</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between shadow">
      <div className="flex items-center gap-2">
        <span className="text-2xl mr-2">👥</span>
        <Link to="/" className="font-bold text-lg tracking-wide">Community Service Provider</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        {user && user.role === 'resident' && (
          <>
            <Link to="/resident" className="hover:underline">Find Providers</Link>
            <Link to="/my-requests" className="hover:underline">My Requests</Link>
          </>
        )}
        {isProviderDashboard && (
          <>
            <Link to="/provider" className="hover:underline">My Services</Link>
            <Link to="/provider" className="hover:underline">Requests</Link>
          </>
        )}
        {user ? (
          <>
            <span className="font-semibold">{user.name} <span className="text-xs">({user.role})</span></span>
            <button onClick={logout} className="ml-2 px-3 py-1 rounded bg-blue-900 hover:bg-blue-800">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 