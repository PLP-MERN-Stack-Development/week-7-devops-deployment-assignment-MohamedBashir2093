import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProviderProfile, getProviderRequests, updateProviderProfile, updateProviderService } from '../services/api';

const initialProfile = {
  category: '',
  description: '',
  contactInfo: '',
};

const ProviderDashboard = () => {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [requestStatusUpdating, setRequestStatusUpdating] = useState('');
  const [requestStatusError, setRequestStatusError] = useState('');
  const [requestStatusSuccess, setRequestStatusSuccess] = useState('');
  const [serviceId, setServiceId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const servicesData = await getProviderProfile(token);
        setServices(servicesData);
        // Only use the service where provider matches logged-in user
        const myService = servicesData.find(s => {
          if (!s.provider) return false;
          // s.provider can be an object or string
          return (typeof s.provider === 'string' && s.provider === user.id) ||
                 (typeof s.provider === 'object' && (s.provider._id === user.id || s.provider === user.id));
        });
        setProfile(myService || initialProfile);
        setServiceId(myService?._id || null);
        const requestsData = await getProviderRequests(token);
        setRequests(requestsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user.id]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      if (serviceId) {
        await updateProviderService(serviceId, profile, token);
      } else {
        await updateProviderProfile(profile, token);
      }
      setSuccess('Profile saved!');
      // Refresh services
      const servicesData = await getProviderProfile(token);
      setServices(servicesData);
      setServiceId(servicesData[0]?._id || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRequestStatusChange = async (requestId, newStatus) => {
    setRequestStatusUpdating(requestId);
    setRequestStatusError('');
    setRequestStatusSuccess('');
    try {
      await updateRequestStatus(requestId, newStatus, token);
      setRequestStatusSuccess('Request status updated!');
      // Refresh requests
      const requestsData = await getProviderRequests(token);
      setRequests(requestsData);
    } catch (err) {
      setRequestStatusError(err.message);
    } finally {
      setRequestStatusUpdating('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl flex flex-col">
          <div className="rounded-t-2xl bg-gradient-to-r from-blue-700 to-purple-600 px-6 py-4 flex items-center gap-2">
            <span className="text-2xl text-white">👤</span>
            <span className="text-white text-2xl font-bold">My Profile</span>
          </div>
          <form className="flex flex-col gap-3 p-6" onSubmit={handleProfileSave}>
            <label className="font-bold">Business Name</label>
            <input className="border rounded-lg px-3 py-2" name="businessName" value={user?.name || ''} disabled />
            <label className="font-bold">Profession</label>
            <input className="border rounded-lg px-3 py-2" name="category" value={profile.category} onChange={handleProfileChange} required />
            <label className="font-bold">Service Description</label>
            <textarea className="border rounded-lg px-3 py-2" name="description" value={profile.description} onChange={handleProfileChange} maxLength={500} required />
            <div className="text-xs text-gray-400 mb-2">Max 500 characters</div>
            <label className="font-bold">Address</label>
            <input className="border rounded-lg px-3 py-2" name="address" value={profile.address || ''} onChange={handleProfileChange} />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="font-bold">City</label>
                <input className="border rounded-lg px-3 py-2 w-full" name="city" value={profile.city || ''} onChange={handleProfileChange} />
              </div>
              <div className="flex-1">
                <label className="font-bold">Service Radius (miles)</label>
                <input className="border rounded-lg px-3 py-2 w-full" name="radius" value={profile.radius || ''} onChange={handleProfileChange} />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-lg shadow hover:from-blue-700 hover:to-purple-700 disabled:opacity-50" disabled={saving}>
              <span className="material-icons"></span> Update Profile
            </button>
            {success && <div className="text-green-600 mt-2">{success}</div>}
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        </div>
        {/* Requests Card */}
        <div className="bg-white rounded-2xl shadow-xl flex flex-col">
          <div className="rounded-t-2xl bg-gradient-to-r from-blue-700 to-purple-600 px-6 py-4 flex items-center gap-2">
            <span className="text-2xl text-white">📦</span>
            <span className="text-white text-2xl font-bold">Recent Service Requests</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center p-8">
            {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
              requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className="material-icons text-5xl text-gray-400 mb-2">inbox</span>
                  <span className="text-gray-500 text-lg">No recent service requests</span>
                </div>
              ) : (
                <ul className="space-y-2 w-full">
                  {requests.map(req => (
                    <li key={req._id} className="border-b pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="font-semibold">{req.resident?.name || 'Resident'}</div>
                        <div>
                          Status: <span className={
                            req.status === 'pending' ? 'font-semibold text-yellow-600' :
                            req.status === 'accepted' ? 'font-semibold text-blue-600' :
                            req.status === 'in_progress' ? 'font-semibold text-purple-600' :
                            req.status === 'completed' ? 'font-semibold text-green-600' :
                            req.status === 'rejected' ? 'font-semibold text-red-600' :
                            'font-semibold'
                          }>{req.status.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="text-sm text-gray-500">Service: {req.service?.category}</div>
                      </div>
                      {/* Status update controls here if needed */}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard; 