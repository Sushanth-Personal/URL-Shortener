"use client";

import { useState, useEffect, useCallback } from "react"; // Added useCallback
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Define the shape of pagination data
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Define the shape of the response data (generic type for flexibility)
interface FetchResponse<T> {
  data: T;
  pagination?: {
    page: number;
    totalPages: number;
    totalUrls: number;
  };
}

// Define the parameters type
interface FetchParams {
  page?: number;
  limit?: number;
}

export default function useFetch<T>(
  url: string,
  options: AxiosRequestConfig = {},
  fetchOnMount: boolean = true,
  page: number | null = null,
  limit: number | null = null
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: page || 1,
    totalPages: 1,
    totalItems: 0,
  });

  const baseURL =
    process.env.NEXT_PUBLIC_API_STATUS === "DEVELOPMENT"
      ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT || "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL_PRODUCTION || "https://your-production-api.com";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: FetchParams = {};
      if (page !== null) params.page = page;
      if (limit !== null) params.limit = limit;

      const response = await axios.get<FetchResponse<T>>(`${baseURL}/${url}`, {
        ...options,
        params,
        withCredentials: true,
      });

      setData(response.data.data);
      if (response.data.pagination) {
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalUrls,
        });
      }
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Something went wrong!");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [baseURL, url, page, limit, options]); // Dependencies for useCallback

  useEffect(() => {
    if (fetchOnMount) fetchData();
  }, [url, page, limit, fetchData, fetchOnMount]);

  return { data, error, loading, pagination, refetch: fetchData };
}