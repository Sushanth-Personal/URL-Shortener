import axios, { AxiosResponse, AxiosError } from "axios";

// Define interfaces for request payloads



// Define interface for API response data
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

// Define interface for API error
interface ApiError {
  response?: {
    data: {
      message: string;
    };
  };
}

// Initialize axios instance
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_STATUS === "DEVELOPMENT"
      ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT || "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL_PRODUCTION || "https://your-production-api.com",
  withCredentials: true,
});

// Login user
export const loginUser = async (email: string, password: string): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Login failed";
    throw new Error(errorMessage);
  }
};

// Register user
export const registerUser = async (
  username: string,
  email: string,
  contact: string,
  password: string
): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post("/auth/register", {
      username,
      email,
      contact,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Registration failed";
    throw new Error(errorMessage);
  }
};

// Get user profile
export const getProfile = async (): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to fetch profile";
    throw new Error(errorMessage);
  }
};

// Delete user account
export const deleteAccount = async (): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.delete("/auth/profile");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to delete account";
    throw new Error(errorMessage);
  }
};

// Get URLs
export const getUrls = async (
  page: number = 1,
  limit: number = 10,
  query: string = ""
): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.get("/url", {
      params: { page, limit, remarks: query },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to fetch links";
    throw new Error(errorMessage);
  }
};

// Create URL
export const createUrl = async (url: string, remarks: string): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post("/url", { url, remarks });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to create link";
    throw new Error(errorMessage);
  }
};

// Update URL by ID
export const updateUrlById = async (
  id: string,
  url: string,
  remarks: string
): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.patch(`/url/${id}`, { url, remarks });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to update link";
    throw new Error(errorMessage);
  }
};

// Delete URL
export const deleteUrl = async (id: string): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/url/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to delete link";
    throw new Error(errorMessage);
  }
};

// Get connection data
export const getConnectionData = async (): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.get("/connection");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to fetch connection data";
    throw new Error(errorMessage);
  }
};

// Get short URL
export const getShortUrl = async (shortUrl: string): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.get(`/url?shortUrl=${shortUrl}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Failed to fetch short URL";
    throw new Error(errorMessage);
  }
};

// Post URL with expiry
export const postUrl = async (
  url: string,
  remarks: string,
  expiry: string
): Promise<ApiResponse | string> => {
  try {
    console.log(url, remarks, expiry);
    let response: AxiosResponse<ApiResponse>;
    if (expiry === "Select Expiry Date and Time") {
      response = await api.post<ApiResponse>("/api/url", { url, remarks }, { withCredentials: true });
    } else {
      response = await api.post<ApiResponse>("/api/url", { url, remarks, expiry }, { withCredentials: true });
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Unknown error occurred";
    console.error("Error posting URL:", errorMessage);
    return errorMessage;
  }
};

// Update URL with shortUrl and expiry
export const updateUrl = async (
  shortUrl: string,
  url: string,
  remarks: string,
  expiry: string
): Promise<ApiResponse | string> => {
  try {
    console.log(url, remarks, expiry);
    let response: AxiosResponse<ApiResponse>;
    if (expiry === "Select Expiry Date and Time") {
      response = await api.put<ApiResponse>("/api/url", { shortUrl, url, remarks }, { withCredentials: true });
    } else {
      response = await api.put<ApiResponse>("/api/url", { shortUrl, url, remarks, expiry }, { withCredentials: true });
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Unknown error occurred";
    console.error("Error updating URL:", errorMessage);
    return errorMessage;
  }
};

// Logout user
export const logoutUser = async (): Promise<ApiResponse | string> => {
  try {
    const response: AxiosResponse<ApiResponse> = await api.post("/api/logout");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data.message || "Logout failed";
    throw new Error(errorMessage);
  }
};