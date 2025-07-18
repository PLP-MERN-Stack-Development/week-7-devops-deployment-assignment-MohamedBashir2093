import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.user, data.token);
      if (data.user.role === 'provider') navigate('/provider');
      else navigate('/resident');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-200">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800">Login</button>
        </form>
        <div className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-700 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 