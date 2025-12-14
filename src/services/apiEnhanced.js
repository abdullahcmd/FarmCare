import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token and request logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and response logging
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem("token");
          window.location.href = "/";
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden:", data);
          break;
        case 404:
          // Not found
          console.error("Resource not found:", error.config.url);
          break;
        case 422:
          // Validation error
          console.error("Validation error:", data);
          break;
        case 500:
          // Server error
          console.error("Server error:", data);
          break;
        default:
          console.error("API Error:", status, data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.message);
    } else {
      // Other error
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Retry mechanism for failed requests
const retryRequest = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) except 408 (timeout)
      if (
        error.response?.status >= 400 &&
        error.response?.status < 500 &&
        error.response?.status !== 408
      ) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(
        `API call failed, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

// Enhanced API wrapper with consistent error handling
const createApiMethod = (method) => {
  return async (url, data = null, config = {}) => {
    const apiCall = () => {
      switch (method) {
        case "get":
          return api.get(url, config);
        case "post":
          return api.post(url, data, config);
        case "put":
          return api.put(url, data, config);
        case "patch":
          return api.patch(url, data, config);
        case "delete":
          return api.delete(url, config);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    };

    try {
      return await retryRequest(apiCall, config.maxRetries || 3);
    } catch (error) {
      // Enhance error with user-friendly message
      const enhancedError = new Error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
      enhancedError.originalError = error;
      enhancedError.status = error.response?.status;
      throw enhancedError;
    }
  };
};

// Create enhanced API methods
const enhancedApi = {
  get: createApiMethod("get"),
  post: createApiMethod("post"),
  put: createApiMethod("put"),
  patch: createApiMethod("patch"),
  delete: createApiMethod("delete"),
};

// Enhanced Auth APIs
export const authAPI = {
  register: (data) => enhancedApi.post("/auth/register", data),
  login: (data) => {
    const formData = new FormData();
    formData.append("username", data.number);
    formData.append("password", data.password);
    return enhancedApi.post("/auth/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Enhanced Profile APIs
export const profileAPI = {
  getProfile: () => enhancedApi.get("/profile/"),
  updateProfile: (data) => enhancedApi.put("/profile/", data),
};

// Enhanced Crop APIs
export const cropAPI = {
  getAll: () => enhancedApi.get("/crops/"),
  getById: (id) => enhancedApi.get(`/crops/${id}`),
  getDetails: (id) => enhancedApi.get(`/crops/${id}/details`),
  create: (data) => enhancedApi.post("/crops/", data),
  update: (id, data) => enhancedApi.put(`/crops/${id}`, data),
  delete: (id) => enhancedApi.delete(`/crops/${id}`),
};

// Enhanced Crop Log APIs
export const cropLogAPI = {
  getAll: (cropId) => enhancedApi.get(`/crops/${cropId}/logs`),
  getById: (cropId, logId) => enhancedApi.get(`/crops/${cropId}/logs/${logId}`),
  create: (cropId, data) => enhancedApi.post(`/crops/${cropId}/logs`, data),
  update: (cropId, logId, data) =>
    enhancedApi.put(`/crops/${cropId}/logs/${logId}`, data),
  delete: (cropId, logId) =>
    enhancedApi.delete(`/crops/${cropId}/logs/${logId}`),
};

// Enhanced Problem APIs
export const problemAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status_filter", filters.status);
    if (filters.issue_type) params.append("issue_type", filters.issue_type);
    return enhancedApi.get(`/problems/?${params.toString()}`);
  },
  getById: (id) => enhancedApi.get(`/problems/${id}`),
  create: (data) => enhancedApi.post("/problems/", data),
  update: (id, data) => enhancedApi.put(`/problems/${id}`, data),
  close: (id) => enhancedApi.patch(`/problems/${id}/close`),
  reopen: (id) => enhancedApi.patch(`/problems/${id}/reopen`),
};

// Enhanced Expert APIs
export const expertAPI = {
  getProblems: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status_filter)
      params.append("status_filter", filters.status_filter);
    if (filters.issue_type) params.append("issue_type", filters.issue_type);
    if (filters.crop_type) params.append("crop_type", filters.crop_type);
    if (filters.severity) params.append("severity", filters.severity);
    return enhancedApi.get(`/expert/problems?${params.toString()}`);
  },
  getProblem: (id) => enhancedApi.get(`/expert/problems/${id}`),
  diagnose: (id, data) =>
    enhancedApi.post(`/expert/problems/${id}/diagnose`, data),
  updateDiagnosis: (id, data) =>
    enhancedApi.put(`/expert/problems/${id}/diagnose`, data),
  resolve: (id) => enhancedApi.patch(`/expert/problems/${id}/resolve`),
  addFollowup: (id, data) =>
    enhancedApi.patch(`/expert/problems/${id}/followup`, data),
};

// Enhanced Dashboard APIs
export const dashboardAPI = {
  getFarmerDashboard: () => enhancedApi.get("/dashboard/farmer"),
  getExpertDashboard: () => enhancedApi.get("/dashboard/expert"),
};

export default enhancedApi;
