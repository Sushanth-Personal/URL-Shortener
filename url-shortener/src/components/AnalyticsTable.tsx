'use client';
import useFetch from '@/hooks/useFetch';

interface LinkData {
  _id: string;
  url: string;
  clicks: number;
}

interface FetchResponse {
  data: LinkData[];
}

export default function AnalyticsTable({ handleEditLinkClick }: { handleEditLinkClick: (id: string) => void }) {
  const { data, error, loading } = useFetch<FetchResponse>('api/url');

  if (loading) return <div className="text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex justify-center p-4 w-full h-[90vh] bg-transparent relative overflow-hidden">
      <div className="overflow-x-auto max-w-[75vw] sm:max-w-[72vw] md:max-w-[68vw] lg:max-w-[65vw] xl:max-w-[91vw] 2xl:max-w-[89vw] 3xl:max-w-[87vw] 4xl:max-w-[85vw]">
        <table className="w-full border-separate border-spacing-0 shadow-sm bg-transparent">
          <thead>
            <tr className="bg-gray-100 h-[63px]">
              <th className="p-2 font-bold text-lg w-[33.33%] min-w-[150px] rounded-tl-xl">URL</th>
              <th className="p-2 font-bold text-lg w-[33.33%] min-w-[150px]">Clicks</th>
              <th className="p-2 font-bold text-lg w-[33.33%] min-w-[150px] rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((link: LinkData) => (
              <tr key={link._id} className="hover:bg-gray-200">
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[50px] first:rounded-bl-xl">
                  {link.url}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm">
                  {link.clicks}
                </td>
                <td className="p-2 border border-gray-100 bg-white h-[58px] min-w-[150px] text-sm last:rounded-br-xl">
                  <button
                    onClick={() => handleEditLinkClick(link._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}