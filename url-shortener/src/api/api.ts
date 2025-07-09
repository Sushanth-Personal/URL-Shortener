import axios, { AxiosError } from "axios";

// Define the shape of the user data (consistent with UserContext.tsx)
interface UserData {
  _id: string;
  username: string;
  email: string;
  contact: string;
  [key: string]: string | number | undefined;
}



// Define the shape of the API error response
interface ApiError {
  message: string;
}

// Define the shape of the login response
interface LoginResponse {
  message: string;
  user: UserData;
}

// Define the shape of the register response
interface RegisterResponse {
  message: string;
}

// Define the shape of the delete URL response
interface DeleteUrlResponse {
  message: string;
}

// Define the shape of the logout response
interface LogoutResponse {
  message: string;
}

// Define the base URL
const baseURL =
  process.env.NEXT_PUBLIC_API_STATUS === "DEVELOPMENT"
    ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT || "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_URL_PRODUCTION || "https://your-production-api.com";

// Login user API call
export const loginUser = async (email: string, password: string): Promise<LoginResponse | string> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${baseURL}/api/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

// Register user API call
export const registerUser = async (
  username: string,
  email: string,
  contact: string,
  password: string
): Promise<RegisterResponse | string> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${baseURL}/api/register`,
      { username, email, contact, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data?.message || "Registration failed";
    throw new Error(errorMessage);
  }
};

// Delete URL API call
export const deleteUrl = async (urlId: string): Promise<DeleteUrlResponse> => {
  try {
    const response = await axios.delete<DeleteUrlResponse>(`${baseURL}/api/url/${urlId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data?.message || "Failed to delete URL";
    throw new Error(errorMessage);
  }
};

// Logout user API call
export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const response = await axios.post<LogoutResponse>(
      `${baseURL}/api/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage = axiosError.response?.data?.message || "Logout failed";
    throw new Error(errorMessage);
  }
};