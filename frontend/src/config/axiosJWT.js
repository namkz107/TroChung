import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import store from '../redux/store';
import { loginSuccess } from '../redux/slices/authSlice';

const API_URL_FROM_ENV = (process.env.REACT_APP_API_URL || '').trim();
const IS_DEV = process.env.NODE_ENV === 'development';
const API_BASE_URL =
  API_URL_FROM_ENV || (IS_DEV ? '' : 'https://trochung-deployment-phase2.onrender.com');

const axiosJWT = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000
});

let refreshPromise = null;
const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = axios.post('/api/auth/refreshToken', {}, {
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 8000
  }).then((res) => res.data).catch((err) => {
    console.warn('Refresh token failed:', err?.response?.status || err.message);
    return null;
  }).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

const attachToken = (config, token) => {
  if (!token) return config;
  config.headers = config.headers || {};
  config.headers.token = `Bearer ${token}`;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

const isExpired = (accessToken) => {
  try {
    const decoded = jwtDecode(accessToken);
    return !decoded?.exp || decoded.exp < (Date.now() / 1000) + 15;
  } catch {
    return true;
  }
};

axiosJWT.interceptors.request.use(async (config) => {
  const url = String(config?.url || '');
  if (url.includes('/auth/refreshToken')) return config;

  const state = store.getState();
  const accessToken = state?.auth?.login?.accessToken || '';
  const currentUser = state?.auth?.login?.currentUser || null;

  if (accessToken && !isExpired(accessToken)) {
    return attachToken(config, accessToken);
  }

  const data = await refreshAccessToken();
  if (data?.accessToken) {
    store.dispatch(loginSuccess({
      user: data.user || currentUser,
      accessToken: data.accessToken
    }));
    return attachToken(config, data.accessToken);
  }

  if (accessToken) {
    return attachToken(config, accessToken);
  }

  return config;
}, (error) => Promise.reject(error));

export default axiosJWT;
