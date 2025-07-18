import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getResidentRequests } from '../services/api';

const MyRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getResidentRequests(token);
        setRequests(data);
      } catch (err) {
        setError('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">My Service Requests</h2>
        {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
          requests.length === 0 ? (
            <div className="text-gray-500 text-center">No service requests yet.</div>
          ) : (
            <ul className="space-y-4">
              {requests.map(req => (
                <li key={req._id} className="border rounded-xl p-4 flex flex-col gap-2 shadow">
                  <div className="font-semibold text-lg">{req.service?.category}</div>
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
                  <div className="text-sm text-gray-500">Provider: {req.provider?.name}</div>
                  <div className="text-sm text-gray-500">Service Details: {req.service?.description}</div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default MyRequests; 