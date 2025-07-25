// client/src/api/api.js
// Centralized API request functions using Axios

import axios from 'axios';
import { fallbackProjects, fallbackServices, fallbackSlides, fallbackTestimonials } from '../pages/fallbackData';


const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API call failed:', error.response?.data?.message || error.message);
    // Example: if unauthorized (e.g., token expired), redirect to login
    if (error.response?.status === 401 && !error.config.url.includes('/login') && !error.config.url.includes('/register')) {
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Or use react-router-dom's navigate/history
    }
    return Promise.reject(error.response?.data || error.message);
  }
);


// --- Slideshow API ---
export const getSlides = async () => {
  api.get('/slideshow')
    .then(response => {
      // console.log('Slides fetched successfully:', response.data.slides);
      return response;
    })
    .catch(error => {
      console.error('Failed to fetch slides:', error);
      return fallbackSlides;
    });
};

// --- Services API ---
export const getServices = async () => {
 return fallbackServices;
};

// --- Projects API ---
export const getProjects = async () => {
  return fallbackProjects;
};

// --- Testimonials API ---
export const getTestimonials = async () => {
  return fallbackTestimonials;
};

// --- Appointment Slots API ---
export const getAvailableSlots = async (date) => {
  console.log(`[API] Attempting to fetch slots for date: ${date}`);
  try {
    const response = await api.get(`/contact/appointments/slots?date=${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment slots:", error);
    throw error;
  }
};

// --- Contact Form Submission API ---
export const submitContactForm = async (formData) => {
  console.log("[API] Submitting contact form data:", formData);
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};

// --- Appointment Form Submission API ---
export const submitAppointmentForm = async (formData) => {
  console.log("[API] Submitting appointment form data:", formData);
  try {
    const response = await api.post('/appointments', formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting appointment form:", error);
    throw error;
  }
};

// --- User Authentication and Management APIs ---
export const registerUser = async (userData) => {
  console.log("[API] Registering user:", userData.email || userData.phone);
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  console.log("[API] Logging in user:", credentials.email || credentials.phone);
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const forgotPassword = async (data) => {
  console.log("[API] Requesting password reset for:", data.email);
  try {
    const response = await api.post('/users/forgot-password', { email: data.email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

export const resetPassword = async (token, data) => {
  console.log("[API] Resetting password with token:", token);
  try {
    const response = await api.put(`/users/reset-password/${token}`, data);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};