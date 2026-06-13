/**
 * A fetch wrapper that automatically includes the JWT token in headers
 * and handles basic JSON parsing and error responses.
 */
const BASE_URL = 'http://localhost:5000/api';

async function client(endpoint, { body, ...customConfig } = {}) {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Handle empty responses
    if (response.status === 204) return null;
    
    const data = await response.json();
    
    if (response.ok) return data;
    
    throw new Error(data.message || 'An error occurred with the API request');
  } catch (error) {
    return Promise.reject(error);
  }
}

export const apiClient = {
  get: (endpoint, config) => client(endpoint, { ...config, method: 'GET' }),
  post: (endpoint, body, config) => client(endpoint, { ...config, body, method: 'POST' }),
  put: (endpoint, body, config) => client(endpoint, { ...config, body, method: 'PUT' }),
  delete: (endpoint, config) => client(endpoint, { ...config, method: 'DELETE' }),
};