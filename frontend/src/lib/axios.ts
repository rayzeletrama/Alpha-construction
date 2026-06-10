import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le Token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Optionnel : Envoyer le domaine actuel pour le multi-tenant si pas géré par le Host
  // config.headers['X-Tenant-Domain'] = window.location.hostname;
  
  return config;
});

export default api;
