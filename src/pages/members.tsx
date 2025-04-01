import DashboardLayout from "@/components/DashboardLayout";
import { ErrorPage } from "@/components/errorComponent";
import MemberCard from "@/components/MemberCard";
import SkeletonMemberCard from "@/components/skeletonComponents/SkeletonMemberCard";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Members() {
  const { token } = useAuthStore();
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [totalPagination, setTotalPagination] = useState(1);
  const [members, setMembers] = useState<any>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
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
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setIsError(true);
        console.log("Error occured and caughted:", error);
      }
    }

    getData();
  }, [paginationNumber]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <h1 className="text-4xl font-bold">Members</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {[...Array(28)].map((_, index) => (
            <SkeletonMemberCard key={index} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

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
