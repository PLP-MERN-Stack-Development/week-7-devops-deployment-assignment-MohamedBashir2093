import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      // Auto-login after registration
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
      login(loginData.user, loginData.token);
      if (loginData.user.role === 'provider') navigate('/provider');
      else navigate('/resident');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-blue-200">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Name" className="border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" className="border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
          <select className="border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value)} required>
            <option value="resident">Resident (Service Seeker)</option>
            <option value="provider">Service Provider</option>
          </select>
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800">Register</button>
        </form>
        <div className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-700 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 