import axios from "axios";

export const API = "/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get("/listings", { params }),
  getById: (id) => api.get(`/listings/${id}`),
  getHostListings: () => api.get("/listings/dashboard/listings"),
  create: (formData) => api.post("/listings", formData),
  update: (id, formData) => api.put(`/listings/${id}`, formData),
  delete: (id) => api.delete(`/listings/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post("/bookings", bookingData),
  getUserBookings: () => api.get("/bookings/user"),
  getHostBookings: () => api.get("/bookings/host/bookings"),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default api;
