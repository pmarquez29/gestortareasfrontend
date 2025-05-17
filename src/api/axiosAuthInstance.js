import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
});

// Interceptor para enviar el token automáticamente si existe
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
