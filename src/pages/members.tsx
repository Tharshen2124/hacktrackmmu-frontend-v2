import DashboardLayout from "@/components/DashboardLayout";
import { ErrorPage } from "@/components/errorComponent";
import MemberFilter from "@/components/FilterPopover/memberFilter";
import MemberCard from "@/components/MemberCard";
import SearchComponent from "@/components/Search";
import SkeletonMemberCard from "@/components/skeletonComponents/SkeletonMemberCard";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import { Member, MemberStatus, getStatusLabel } from "@/types/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcherWithToken } from "@/utils/fetcher";

const DEFAULT_STATUSES = [MemberStatus.Active, MemberStatus.SociallyActive];

const MemberStatusComponent = ({ status }: { status: string }) => {
  return (
    <div className="border-neutral-400 border dark:border-gray-200 px-4 py-1 rounded-2xl text-center items-center flex">
      <p>{status}</p>
    </div>
  );
};

export default function Members() {
  const { token } = useAuthStore();
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string[]>(DEFAULT_STATUSES);
  const [sortBy, setSortBy] = useState<string>("");

  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchError, setIsSearchError] = useState(false);

  // SWR automatically watches this. If pagination or filters change, it re-fetches
  const getSWRKey = () => {
    if (!token || isSearching) return null;

    const queryParams = new URLSearchParams({
      page: paginationNumber.toString(),
    });

    statusFilter.forEach((status) => {
      queryParams.append("status[]", status);
    });

    if (sortBy) {
      queryParams.append("sort_by", sortBy);
    }

    return [
      `${apiUrl}/api/v1/members/filtered?${queryParams.toString()}`,
      token,
    ];
  };

  // SWR as the single source of truth
  const {
    data: swrData,
    error: swrError,
    isLoading: swrLoading,
    mutate: mutateMembers,
  } = useSWR(getSWRKey(), ([url, token]) => fetcherWithToken(url, token));

  // 3. Extract the data cleanly
  const members = swrData?.data || [];
  const totalPagination = swrData?.meta?.total_pages || 1;
  const isError = swrError || isSearchError;
  const isLoading = swrLoading && !isSearching;

  const displayMembers = isSearching ? searchResults : members;

  // Reset pagination when filters change
  useEffect(() => {
    setPaginationNumber(1);
  }, [statusFilter, sortBy]);

  const currentStatusLabels = statusFilter.map((status) =>
    getStatusLabel(status),
  );

  const handleStatusChange = (statuses: string[]) => {
    setStatusFilter(statuses);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleSearchResults = (results: Member[], searching: boolean) => {
    setSearchResults(results);
    setIsSearching(searching);
  };

  const handleSearchError = (error: unknown) => {
    console.error("Search failed:", error);
    setIsSearchError(true);
  };

  const getCurrentSingleStatus = () => {
    if (statusFilter.length === Object.values(MemberStatus).length)
      return "all";
    return statusFilter[0] || "all";
  };

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <DashboardLayout pageTitle="HackTrack - Members">
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-row gap-4">
          <h1 className="text-4xl font-bold">Members</h1>
          <div className="currentStatusMap gap-2 flex-row items-center md:flex hidden">
            {currentStatusLabels.map((status, index) => (
              <MemberStatusComponent key={index} status={status} />
            ))}
          </div>
        </div>
        <MemberFilter
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          currentStatus={getCurrentSingleStatus()}
          currentSortBy={sortBy}
          defaultStatuses={DEFAULT_STATUSES}
        />
      </div>

      <div className="filter-section flex flex-row items-center justify-between">
        <SearchComponent
          token={token}
          onSearchResults={handleSearchResults}
          onSearchError={handleSearchError}
        />
      </div>

      <div className="mt-10 mb-[70px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {isLoading
            ? [...Array(8)].map((_, index) => (
                <SkeletonMemberCard key={index} />
              ))
            : displayMembers?.map((member: Member) => (
                <MemberCard
                  key={member.id}
                  {...member}
                  mutateMembers={mutateMembers}
                />
              ))}
        </div>

        {/* Hide pagination if searching */}
        {!isSearching && (
          <div className="fixed flex items-center border-2 border-gray-200 rounded-full w-fit bottom-4 right-4 z-50 bg-white dark:bg-[#222]">
            <button
              onClick={() =>
                setPaginationNumber((prev) => Math.max(1, prev - 1))
              }
              className="text-black dark:text-white bg-transparent py-2 px-2 rounded-l-full transition duration-200 hover:bg-gray-200 dark:hover:bg-[#333] active:bg-gray-400"
              disabled={isLoading || paginationNumber === 1}
            >
              <ChevronLeft />
            </button>
            <div className="text-black dark:text-white bg-transparent w-[75px] py-2 px-2 text-center font-medium">
              {paginationNumber} - {totalPagination}
            </div>
            <button
              onClick={() =>
                setPaginationNumber((prev) =>
                  Math.min(totalPagination, prev + 1),
                )
              }
              className="text-black dark:text-white bg-transparent py-2 px-2 rounded-r-full transition duration-200 hover:bg-gray-200 dark:hover:bg-[#333] active:bg-gray-400"
              disabled={isLoading || paginationNumber === totalPagination}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
