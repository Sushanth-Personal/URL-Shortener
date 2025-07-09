// src/hooks/useFetch.ts
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function useFetch(
  url: string,
  options = {},
  fetchOnMount = true,
  page: number | null = null,
  limit: number | null = null
) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: page || 1,
    totalPages: 1,
    totalItems: 0,
  });
  const baseURL =
    process.env.NEXT_PUBLIC_API_STATUS === "DEVELOPMENT"
      ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_API_URL_PRODUCTION;
  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (page !== null) params.page = page;
      if (limit !== null) params.limit = limit;
      const response = await axios.get(`${baseURL}/${url}`, {
        ...options,
        params,
        withCredentials: true,
      });
      setData(response.data);
      if (response.data.pagination) {
        setPagination({
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalUrls,
        });
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) fetchData();
  }, [url, page, limit]);

  return { data, error, loading, pagination, refetch: fetchData };
}
