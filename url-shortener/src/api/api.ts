// src/api/api.ts
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_STATUS === 'DEVELOPMENT'
  ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT
  : process.env.NEXT_PUBLIC_API_URL_PRODUCTION;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post(`${baseURL}/auth/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const registerUser = async (username: string, email: string, contact: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { username, email, contact, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch profile';
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/auth/profile');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to delete account';
  }
};

export const getUrls = async (page: number = 1, limit: number = 10, query: string = '') => {
  try {
    const response = await api.get('/url', { params: { page, limit, remarks: query } });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch links';
  }
};

export const createUrl = async (url: string, remarks: string) => {
  try {
    const response = await api.post('/url', { url, remarks });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to create link';
  }
};

export const updateUrl = async (id: string, url: string, remarks: string) => {
  try {
    const response = await api.patch(`/url/${id}`, { url, remarks });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to update link';
  }
};

export const deleteUrl = async (id: string) => {
  try {
    const response = await api.delete(`/url/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to delete link';
  }
};

export const getConnectionData = async () => {
  try {
    const response = await api.get('/connection');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch connection data';
  }
};

export const getShortUrl = async (shortUrl: string) => {
  try {
    const response = await api.get(`/url?shortUrl=${shortUrl}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to fetch short URL';
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/api/logout');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Logout failed';
  }
};