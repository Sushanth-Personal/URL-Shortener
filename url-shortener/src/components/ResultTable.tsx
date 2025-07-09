"use client";

import { useState, useEffect, useCallback } from "react"; // Added useCallback
import useFetch from "@/hooks/useFetch";
import { useUserContext } from "@/contexts/UserContext";
import { deleteUrl } from "@/api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

// Define the shape of the URL data
interface UrlData {
  _id: string;
  url: string;
  shortUrl: string;
  remarks?: string;
  clicks: number;
  expiry: string | null;
}

// Define the shape of pagination data
interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Define props for the component
interface ResultTableProps {
  handleEditLinkClick: (id: string) => void;
  query: string;
}

const ResultTable: React.FC<ResultTableProps> = ({ handleEditLinkClick, query }) => {
  const {
    setPageUrlData,
    refreshData,
    setShowConfirmationModal,
    confirmDeleteUrl,
    setConfirmDeleteUrl,
    setModalType,
  } = useUserContext();

  const baseURL =
    process.env.NEXT_PUBLIC_API_STATUS === "DEVELOPMENT"
      ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT || "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL_PRODUCTION || "https://your-production-api.com";

  const [data, setData] = useState<UrlData[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 4;

  const { data: fetchedData, error, loading, refetch } = useFetch<{
    data: UrlData[];
    pagination: Pagination;
  }>(`api/url?page=${currentPage}&limit=${pageSize}`, { withCredentials: true }, true);

  const [filteredData, setFilteredData] = useState<UrlData[]>([]);

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData.data);
      setTotalPages(fetchedData.pagination.totalPages);
      setPageUrlData(fetchedData.data);
    }
  }, [fetchedData, setPageUrlData]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (refreshData) {
      refetch();
    }
  }, [refreshData, refetch]);

  useEffect(() => {
    console.log("Total pages:", totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (query) {
      const filtered = data.filter((item) =>
        item.remarks?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [query, data]);

  const handleSort = (key: keyof UrlData, direction: "asc" | "desc") => {
    const sortedData = [...data].sort((a, b) => {
      if (key === "expiry") {
        return direction === "asc"
          ? new Date(a.expiry || 0).getTime() - new Date(b.expiry || 0).getTime()
          : new Date(b.expiry || 0).getTime() - new Date(a.expiry || 0).getTime();
      } else {
        return direction === "asc"
          ? (a[key] || "").localeCompare(b[key] || "")
          : (b[key] || "").localeCompare(a[key] || "");
      }
    });
    setData(sortedData);
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

  const handleDelete = (rowId: string) => {
    setDeleteId(rowId);
    setModalType("deleteUrl");
    setShowConfirmationModal(true);
  };

  const handleDeleteLink = useCallback(async (rowId: string) => {
    try {
      const response = await deleteUrl(rowId);
      if (response.message === "URL deleted successfully") {
        toast.success("Deleted Successfully ...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setConfirmDeleteUrl(false);
        setShowConfirmationModal(false);
        refetch();
      }
    } catch (err) {
      console.error(err);
    }
  }, [setConfirmDeleteUrl, setShowConfirmationModal, refetch]); // Dependencies for useCallback

  useEffect(() => {
    if (confirmDeleteUrl && deleteId) {
      handleDeleteLink(deleteId);
    }
  }, [confirmDeleteUrl, deleteId, handleDeleteLink]);

  // Render error if baseURL is invalid
  if (!baseURL) {
    return <div className="text-red-500">Error: API base URL is not configured.</div>;
  }

  return (
    <div className="flex justify-center p-4 w-full h-[90vh] bg-transparent relative overflow-hidden">
      {loading && <p className="text-gray-600">Loading data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="overflow-x-auto max-w-[75vw] h-[70vh]">
        <table className="w-full border-separate border-spacing-0 shadow-sm bg-transparent">
          <thead>
            <tr className="bg-gray-100 h-[63px]">
              <th className="min-w-[150px] p-2 text-lg font-bold w-[10%] rounded-tl-xl">
                <div className="flex justify-center items-center gap-1">
                  <p>Date</p>
                  <span className="flex flex-col items-center w-2">
                    <Image
                      role="button"
                      onClick={() => handleSort("expiry", "asc")}
                      className="cursor-pointer mb-1 w-2 h-1 hover:scale-110 transition-transform duration-150"
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738083451/Vector_9_fdkwkf.png"
                      alt="asc"
                      width={8}
                      height={4}
                    />
                    <Image
                      role="button"
                      onClick={() => handleSort("expiry", "desc")}
                      className="cursor-pointer mt-1 w-2 h-1 hover:scale-110 transition-transform duration-150"
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738083447/Vector_8_taduxn.png"
                      alt="desc"
                      width={8}
                      height={4}
                    />
                  </span>
                </div>
              </th>
              <th className="min-w-[150px] p-2 text-lg font-bold w-[10%]">Original Link</th>
              <th className="min-w-[150px] p-2 text-lg font-bold w-[10%]">Short Link</th>
              <th className="min-w-[150px] p-2 text-lg font-bold w-[10%]">Remarks</th>
              <th className="min-w-[150px] p-2 text-lg font-bold w-[10%]">Clicks</th>
              <th className="min-w-[150px] p-2 text-lg font-bold w-[10%]">Status</th>
              <th className="min-w-[150px] p-2 text-lg font-bold w-[10%] rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row._id} className="hover:bg-gray-200">
                <td className="p-4 border border-gray-100 bg-white h-[58px] min-w-[150px] first:rounded-bl-xl last:rounded-br-xl">
                  {row.expiry === null
                    ? "No expiry"
                    : new Date(row.expiry).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">
                  {row.url}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <div className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">{row.shortUrl}</div>
                    <Image
                      role="button"
                      onClick={() => handleCopyToClipboard(`${baseURL}/${row.shortUrl}`)}
                      className="ml-2 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737968945/Icons_2_iv0mah.png"
                      alt="copy"
                      width={16}
                      height={16}
                    />
                  </div>
                </td>
                <td className="p-4 border border-gray-100 bg-white h-[58px] min-w-[150px]">
                  {row.remarks || "N/A"}
                </td>
                <td className="p-4 border border-gray-100 bg-white h-[58px] min-w-[150px]">
                  {row.clicks}
                </td>
                <td className="p-4 border border-gray-100 bg-white h-[58px] min-w-[150px]">
                  {row.expiry === null || new Date(row.expiry) > new Date() ? (
                    <p className="text-green-500 font-medium text-sm">Active</p>
                  ) : (
                    <p className="text-yellow-600 font-medium text-sm">Inactive</p>
                  )}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[10px]">
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      role="button"
                      onClick={() => handleEditLinkClick(row._id)}
                      className="mr-2 cursor-pointer"
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738081242/Icons_3_zzabfr.png"
                      alt="edit"
                      width={16}
                      height={16}
                    />
                    <Image
                      role="button"
                      onClick={() => handleDelete(row._id)}
                      className="cursor-pointer"
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738081533/Icons_6_bmvvl6.png"
                      alt="delete"
                      width={16}
                      height={16}
                    />
                  </div>
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
          <Image
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738087314/Vector_1_oimwdr.svg"
            alt="leftarrow"
            width={16}
            height={16}
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
          <Image
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738087377/Vector_2_nysle4.svg"
            alt="rightarrow"
            width={16}
            height={16}
          />
        </button>
      </div>
    </div>
  );
};

export default ResultTable;