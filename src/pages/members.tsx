import DashboardLayout from "@/components/DashboardLayout";
import { ErrorPage } from "@/components/errorComponent";
import MemberFilter from "@/components/FilterPopover/memberFilter";
import MemberCard from "@/components/MemberCard";
import SearchComponent from "@/components/Search";
import SkeletonMemberCard from "@/components/skeletonComponents/SkeletonMemberCard";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import { Member } from "@/types/types";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const MemberStatusComponent = ({ status }: { status: string }) => {
  return (
    <div className="border border-gray-200 px-4 py-1 rounded-2xl text-center items-center flex">
      <p>{status}</p>
    </div>
  );
};

export default function Members() {
  const { token } = useAuthStore();
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [totalPagination, setTotalPagination] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "active",
    "socially_active",
  ]);

  const displayMembers = isSearching ? searchResults : members;

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: paginationNumber.toString(),
        });

        if (statusFilter.length > 0 && !statusFilter.includes("all")) {
          statusFilter.forEach((status) => {
            queryParams.append("status[]", status);
          });
        }

        const response = await axios.get(
          `${apiUrl}/api/v1/members/filtered?${queryParams.toString()}`,
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
        console.log("Error occurred and caught:", error);
      }
    }

    if (!isSearching) {
      getData();
    }
  }, [paginationNumber, token, statusFilter, isSearching]);

  useEffect(() => {
    setPaginationNumber(1);
  }, [statusFilter]);

  const splitStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const [currentStatus, setCurrentStatus] = useState<string[]>(() => {
    return ["active", "socially_active"].map((status) => splitStatus(status));
  });

  const handleStatusChange = (statuses: string[]) => {
    setStatusFilter(statuses);
    const formattedStatuses = statuses.map((status) => splitStatus(status));
    setCurrentStatus(formattedStatuses);
  };

  const handleSearchResults = (results: Member[], searching: boolean) => {
    setSearchResults(results);
    setIsSearching(searching);
    if (searching) {
      setCurrentStatus(["All"]);
    } else {
      handleStatusChange(statusFilter);
    }
  };

  const handleSearchError = (error: any) => {
    console.error("Search failed:", error);
    setIsError(true);
  };

  const getCurrentSingleStatus = () => {
    if (statusFilter.includes("all")) return "all";
    if (
      statusFilter.includes("active") ||
      statusFilter.includes("socially_active")
    ) {
      return "active";
    }
    if (
      statusFilter.includes("was_active") ||
      statusFilter.includes("was_socially_active")
    ) {
      return "was_active";
    }
    return statusFilter[0] || "all";
  };

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-row gap-4">
          <h1 className="text-4xl font-bold">Members</h1>
          <div className="currentStatusMap gap-2 flex-row items-center md:flex hidden">
            {currentStatus.length > 0 &&
              currentStatus.map((status, index) => (
                <MemberStatusComponent key={index} status={status} />
              ))}
          </div>
        </div>
        <MemberFilter
          onStatusChange={handleStatusChange}
          currentStatus={getCurrentSingleStatus()}
        />
      </div>

      {/* Search */}
      <div className="filter-section flex flex-row items-center justify-between">
        <SearchComponent
          token={token}
          onSearchResults={handleSearchResults}
          onSearchError={handleSearchError}
        />
      </div>
      <div className="mt-10 mb-[70px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {isLoading && !isSearching
            ? [...Array(8)].map((_, index) => (
                <SkeletonMemberCard key={index} />
              ))
            : displayMembers?.map((member: Member) => (
                <MemberCard key={member.id} {...member} />
              ))}
        </div>
        <div className="fixed flex items-center border-2 border-gray-200 rounded-full w-fit bottom-4 right-4 z-50">
          <button
            onClick={() =>
              setPaginationNumber((prev) => (prev - 1 < 1 ? prev : prev - 1))
            }
            className="text-black bg-white py-2 px-2 rounded-l-full transition duration-200 hover:bg-gray-200 active:bg-gray-400"
            disabled={isLoading}
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
            disabled={isLoading}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
