import axios from 'axios';

const Connector = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
Connector.interceptors.request.use((config) => {
  const token = localStorage.getItem('md_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
Connector.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('md_token');
      localStorage.removeItem('md_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default Connector;