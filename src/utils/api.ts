import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import debounce from 'lodash/debounce';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const debouncedRefresh = debounce(async () => {
  if (isRefreshing) return refreshPromise;
  
  isRefreshing = true;
  refreshPromise = axios.post('/api/auth/refresh', {}, { withCredentials: true })
    .then(() => {
      isRefreshing = false;
      refreshPromise = null;
    })
    .catch((error) => {
      console.error('Failed to refresh token:', error);
      isRefreshing = false;
      refreshPromise = null;
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    });

  return refreshPromise;
}, 1000, { leading: true, trailing: false });

api.interceptors.request.use(async (config) => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  
  if (token) {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime + 300) { // 5 minutes before expiration
      await debouncedRefresh();
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;