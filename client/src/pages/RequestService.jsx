import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllProviders, createServiceRequest } from '../services/api';

const RequestService = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all providers and find the one with this id
        const providers = await getAllProviders({}, token);
        const found = providers.find(p => p._id === id);
        setProvider(found);
        if (!found) setError('Provider not found.');
      } catch (err) {
        setError('Failed to load provider info.');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      // Send request with serviceId and extra fields (date, time, details)
      await createServiceRequest(id, token); // You can extend this to send date/time/details if backend supports
      setSuccess('Request submitted successfully!');
      setTimeout(() => navigate('/resident'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!provider) return null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 text-2xl font-bold flex items-center gap-2">
          <span className="material-icons">mail</span> Request Service from {provider.provider?.name}
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="font-bold text-lg mb-2">Provider Information:</div>
            <div className="bg-gray-50 rounded border p-4 flex flex-col gap-2">
              <div><span className="font-semibold">Business:</span> {provider.provider?.name}</div>
              <div><span className="font-semibold">Profession:</span> {provider.category}</div>
              <div><span className="font-semibold">Location:</span> {provider.city || 'N/A'}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-semibold">Service Date</label>
                <input type="date" className="border rounded px-3 py-2 w-full" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="flex-1">
                <label className="font-semibold">Service Time</label>
                <input type="time" className="border rounded px-3 py-2 w-full" value={time} onChange={e => setTime(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="font-semibold">Service Details</label>
              <textarea className="border rounded px-3 py-2 w-full" rows={4} value={details} onChange={e => setDetails(e.target.value)} required />
              <div className="text-xs text-gray-500 mt-1">Please describe the service you need in detail</div>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            <button type="submit" className="bg-blue-600 text-white w-full py-3 rounded font-semibold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50" disabled={submitting}>
              <span className="material-icons">send</span> Submit Request
            </button>
          </form>
          <Link to="/resident" className="block w-full mt-4 text-center border rounded py-2 text-gray-500 hover:bg-gray-100">&larr; Back to Providers</Link>
        </div>
      </div>
    </div>
  );
};

export default RequestService; 