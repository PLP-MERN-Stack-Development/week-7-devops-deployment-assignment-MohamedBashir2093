const baseUrl = import.meta.env.VITE_API_BASE_URL;


export const apiFetch = async (url, options = {}, token) => {
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
};

export const getProviderProfile = (token) =>
  apiFetch('/api/services', { method: 'GET' }, token);

export const getProviderRequests = (token) =>
  apiFetch('/api/requests/provider', { method: 'GET' }, token);

export const updateProviderProfile = (profile, token) =>
  apiFetch('/api/services', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  }, token);

export const getAllProviders = (filters = {}, token) => {
  const params = new URLSearchParams(filters).toString();
  return apiFetch(`/api/services?${params}`, { method: 'GET' }, token);
};

export const createServiceRequest = (serviceId, token) =>
  apiFetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId }),
  }, token);

export const getResidentRequests = (token) =>
  apiFetch('/api/requests/resident', { method: 'GET' }, token);

export const updateRequestStatus = (requestId, status, token) =>
  apiFetch(`/api/requests/${requestId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }, token);

export const updateProviderService = (serviceId, profile, token) =>
  apiFetch(`/api/services/${serviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  }, token); 