import axios from "axios";
import { getLocalData } from "../lib/utils";

// Base URL from environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000/api";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header dynamically
api.interceptors.request.use((config) => {
  const token = getLocalData("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
const handleError = (error: any) => {
  console.error("API Error:", error);
  throw error.response?.data?.message || "Something went wrong";
};

// Reusable GET method
export const apiGet = async (url: string, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Reusable POST method
export const apiPost = async (url: string, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Reusable PUT method
export const apiPut = async (url: string, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Reusable DELETE method
export const apiDelete = async (url: string) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
