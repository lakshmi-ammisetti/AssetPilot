const BASE_URL = 'https://assetpilot.onrender.com/';

async function request(url, options = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const loginUser = (data) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const registerUser = (data) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getMe = () => request('/auth/me');

export const getAssets = (query = '') => request(`/assets${query}`);

export const createAsset = (data) =>
  request('/assets', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const assignAsset = (id, data) =>
  request(`/assets/${id}/assign`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const getEmployeeAssets = (employeeId) =>
  request(`/assets/employee/${employeeId}`);

export const createMaintenance = (data) =>
  request('/maintenance', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const updateMaintenance = (id, data) =>
  request(`/maintenance/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const getMaintenanceDetails = (id) =>
  request(`/maintenance/${id}`);

export const getDashboardMetrics = () =>
  request('/dashboard/assets');

export const updateAsset = (id, data) =>
  request(`/assets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const deleteAsset = (id) =>
  request(`/assets/${id}`, {
    method: 'DELETE'
  });