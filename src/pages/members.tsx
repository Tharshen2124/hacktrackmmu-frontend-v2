import DashboardLayout from "@/components/DashboardLayout";
import { ErrorPage } from "@/components/errorComponent";
import MemberCard from "@/components/MemberCard";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Members() {
  const { token } = useAuthStore();
  const [paginationNumber, setPaginationNumber] = useState<number>(1);
  const [totalPagination, setTotalPagination] = useState<number>(1);
  const [members, setMembers] = useState<any>();
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/members/?page=${paginationNumber}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setMembers(response.data.data);
        setTotalPagination(response.data.meta.total_pages);
      } catch (error: any) {
        setIsError(true);
        console.log("Error occured and caughted:", error);
      }
    }

    getData();
  }, [paginationNumber]);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Members</h1>
        <div className="flex items-center border-2 border-gray-200 rounded-full w-fit">
          <button
            onClick={() =>
              setPaginationNumber((prev) => (prev - 1 < 1 ? prev : prev - 1))
            }
            className="text-black bg-white py-2 px-2 rounded-l-full transition duration-200 hover:bg-gray-200 active:bg-gray-400"
          >
            <ChevronLeft />
          </button>
          <div className="text-black bg-white w-[75px] py-2 px-2 text-center">
            {paginationNumber} - {totalPagination}
          </div>
          <button
            onClick={() =>
              setPaginationNumber((prev) =>
                prev + 1 > totalPagination ? prev : prev + 1,
              )
            }
            className="text-black bg-white py-2 px-2 rounded-r-full transition duration-200 hover:bg-gray-200 active:bg-gray-400"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {/* <div className="relative mt-4">
            <input
                type="text"
                placeholder="Search meetups..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 text-sm text-[#e0e0e0] bg-white border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-[#333] dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
        </div> */}
      <div className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {members &&
            members.map((member: any) => (
              <MemberCard
                key={member.id}
                name={member.name}
                active={member.active}
                projects={member.projects}
              />
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
