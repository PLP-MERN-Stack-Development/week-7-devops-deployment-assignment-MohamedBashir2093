import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllProviders, getResidentRequests } from '../services/api';
import { useNavigate } from 'react-router-dom';

const professions = [
  { value: '', label: 'All Professions' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'cleaner', label: 'Cleaner' },
];

const ResidentDashboard = () => {
  const { token } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [filters, setFilters] = useState({ profession: '', city: '', search: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const providersData = await getAllProviders({
          category: filters.profession,
          city: filters.city,
          search: filters.search,
        }, token);
        setProviders(providersData);
        const requestsData = await getResidentRequests(token);
        setMyRequests(requestsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters }); // triggers useEffect
  };

  const handleRequestService = (provider) => {
    navigate(`/request/${provider._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-6xl mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center">Find Service Providers</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleSearch}>
            <div className="flex-1 w-full">
              <label className="block font-semibold mb-1">Profession</label>
              <select
                className="border rounded px-3 py-2 w-full"
                name="profession"
                value={filters.profession}
                onChange={handleFilterChange}
              >
                {professions.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block font-semibold mb-1">City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                className="border rounded px-3 py-2 w-full"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block font-semibold mb-1">Search</label>
              <input
                type="text"
                name="search"
                placeholder="Name or keywords"
                className="border rounded px-3 py-2 w-full"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 mt-6 md:mt-0"> <span className="material-icons align-middle">search</span> </button>
          </form>
        </div>
        {loading ? <div>Loading...</div> : error ? <div className="text-red-600">{error}</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {providers.length === 0 && <div className="text-gray-500">No providers found.</div>}
            {providers.map(provider => (
              (provider.provider?.name && provider.contactInfo) && (
                <div key={provider._id} className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden flex flex-col items-stretch max-w-md mx-auto min-h-[350px] w-full">
                  <div className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between">
                    <span className="text-lg font-bold">{provider.provider.name}</span>
                    <span className="bg-green-400 text-white px-4 py-1 rounded-full text-xs font-semibold">Available</span>
                  </div>
                  <div className="p-6 flex flex-col gap-2 flex-1">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{provider.category}</span>
                      {provider.city && <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-semibold">{provider.city}</span>}
                    </div>
                    {provider.description && <div className="text-gray-700 mb-2">{provider.description}</div>}
                    <div className="bg-gray-50 rounded p-3 text-sm flex flex-col gap-1">
                      <div><span className="font-semibold">👤</span> {provider.provider.name}</div>
                      <div><span className="font-semibold">📞</span> {provider.contactInfo}</div>
                      {provider.provider.email && (
                        <div><span className="font-semibold">✉️</span> {provider.provider.email}</div>
                      )}
                    </div>
                    <button
                      className="mt-4 bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 disabled:opacity-50"
                      onClick={() => handleRequestService(provider)}
                    >
                      Request Service
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard; 