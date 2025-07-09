"use client";

import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useUserContext } from "@/contexts/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the shape of the analytics data
interface AnalyticsData {
  _id: string;
  url: string;
  shortUrl: string;
  ipAddress: string;
  platform: string;
  date: string;
}

// Define the shape of pagination data
interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Define props for the component
interface AnalyticsTableProps {
  handleEditLinkClick: (id: string) => void;
}

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({ handleEditLinkClick }) => {
  const { setPageUrlData, refreshData } = useUserContext();

  // Define baseURL with fallback
  const baseURL =
    process.env.NEXT_PUBLIC_API_STATUS === "DEVELOPMENT"
      ? process.env.NEXT_PUBLIC_API_BASE_URL_DEVELOPMENT || "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION || "https://your-production-api.com";

  // Debug environment variables
  useEffect(() => {
    console.log({
      status: process.env.NEXT_PUBLIC_API_STATUS,
      devUrl: process.env.NEXT_PUBLIC_API_BASE_URL_DEVELOPMENT,
      prodUrl: process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION,
      baseURL,
    });
  }, []);

  const [data, setData] = useState<AnalyticsData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 4;

  const {
    data: fetchedData,
    pagination,
    error,
    loading,
    refetch,
  } = useFetch<{ data: AnalyticsData[]; pagination: Pagination }>(
    `${baseURL}/api/analytics?page=${currentPage}&limit=${pageSize}`,
    { withCredentials: true },
    true
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof AnalyticsData | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });

  useEffect(() => {
    if (fetchedData && pagination) {
      setData(fetchedData.data);
      setTotalPages(pagination.totalPages);
      setPageUrlData(fetchedData.data);
    }
  }, [fetchedData, pagination, setPageUrlData]);

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  useEffect(() => {
    if (refreshData) {
      refetch();
    }
  }, [refreshData]);

  const handleSort = (key: keyof AnalyticsData, direction: "asc" | "desc") => {
    const sortedData = [...data].sort((a, b) => {
      if (key === "date") {
        return direction === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return direction === "asc"
          ? (a[key] || "").localeCompare(b[key] || "")
          : (b[key] || "").localeCompare(a[key] || "");
      }
    });
    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render error if baseURL is invalid
  if (!baseURL) {
    return <div className="text-red-500">Error: API base URL is not configured.</div>;
  }

  return (
    <div className="flex justify-center p-4 w-full h-[90vh] bg-transparent relative overflow-hidden">
      {loading && <p className="text-gray-600">Loading data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="overflow-x-auto max-w-[75vw] sm:max-w-[72vw] md:max-w-[68vw] lg:max-w-[65vw] xl:max-w-[91vw] 2xl:max-w-[89vw] 3xl:max-w-[87vw] 4xl:max-w-[85vw]">
        <table className="w-full border-separate border-spacing-0 shadow-sm bg-transparent">
          <thead>
            <tr className="bg-gray-100 h-[63px]">
              <th className="p-2 font-bold text-lg w-[20%] min-w-[150px] rounded-tl-xl">
                <div className="flex justify-center items-center gap-1">
                  <p>Timestamp</p>
                  <span className="flex flex-col items-center w-2">
                    <img
                      role="button"
                      onClick={() => handleSort("date", "asc")}
                      className="cursor-pointer mb-1 w-2 h-1 hover:scale-110 transition-transform duration-150"
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738083451/Vector_9_fdkwkf.png"
                      alt="asc"
                    />
                    <img
                      role="button"
                      onClick={() => handleSort("date", "desc")}
                      className="cursor-pointer mt-1 w-2 h-1 hover:scale-110 transition-transform duration-150"
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738083447/Vector_8_taduxn.png"
                      alt="desc"
                    />
                  </span>
                </div>
              </th>
              <th className="p-2 font-bold text-lg w-[20%] min-w-[150px]">Original Link</th>
              <th className="p-2 font-bold text-lg w-[20%] min-w-[150px]">Short Link</th>
              <th className="p-2 font-bold text-lg w-[20%] min-w-[150px]">IP Address</th>
              <th className="p-2 font-bold text-lg w-[20%] min-w-[150px] rounded-tr-xl">User Device</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: AnalyticsData, index: number) => (
              <tr key={row._id} className="hover:bg-gray-200">
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm first:rounded-bl-xl">
                  {new Date(row.date).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px]">
                  {row.url}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {`${baseURL}/${row.shortUrl}`}
                  </div>
                  <img
                    role="button"
                    onClick={() => handleCopyToClipboard(`${baseURL}/${row.shortUrl}`)}
                    className="ml-2 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737968945/Icons_2_iv0mah.png"
                    alt="copy"
                  />
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm">
                  {row.ipAddress}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm last:rounded-br-xl">
                  {row.platform}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-6 flex justify-center items-center gap-1.5">
        <button
          className="w-[30px] h-[30px] bg-white rounded-sm flex items-center justify-center text-sm font-bold border border-gray-200 hover:shadow-md hover:scale-95 transition-all disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <img
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738087314/Vector_1_oimwdr.svg"
            alt="leftarrow"
          />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`w-[30px] h-[30px] bg-white rounded-sm flex items-center justify-center text-sm font-bold border border-gray-200 hover:shadow-md hover:scale-95 transition-all ${
              currentPage === index + 1 ? "text-blue-700 scale-110 shadow-md" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="w-[30px] h-[30px] bg-white rounded-sm flex items-center justify-center text-sm font-bold border border-gray-200 hover:shadow-md hover:scale-95 transition-all disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <img
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738087377/Vector_2_nysle4.svg"
            alt="rightarrow"
          />
        </button>
      </div>
    </div>
  );
};

export default AnalyticsTable;