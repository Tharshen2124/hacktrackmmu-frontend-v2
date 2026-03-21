import DashboardLayout from "@/components/DashboardLayout";
import MemberFilter from "@/components/FilterPopover/memberFilter";
import OnboardingMobileCard from "@/components/Onboarding/OnboardingMobileCard";
import OnboardingTableRow from "@/components/Onboarding/OnboardingTableRow";
import { useMediaQuery } from "@/hooks";
import useAuthStore from "@/store/useAuthStore";
import { MemberStatus, Member } from "@/types/types";
import { apiUrl } from "@/utils/env";
import { fetcherWithToken } from "@/utils/fetcher";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

const ONBOARDING_STATUSES = [
  MemberStatus.Registered,
  MemberStatus.Contacted,
  MemberStatus.IdeaTalked,
  MemberStatus.NeverActive,
  MemberStatus.Active,
  MemberStatus.SociallyActive,
  MemberStatus.WasActive,
  MemberStatus.WasSociallyActive,
  MemberStatus.Terminated,
];

export default function Onboarding() {
  const { token } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const isMaxWidth768px = useMediaQuery("(max-width: 768px)");
  const [paginationNumber, setPaginationNumber] = useState(1);
  const [statusFilter, setStatusFilter] =
    useState<string[]>(ONBOARDING_STATUSES);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createQueryParams = (page: number) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
    });
    statusFilter.forEach((status) => {
      queryParams.append("status[]", status);
    });
    return queryParams;
  };

  const {
    data: onboardingData,
    error: onboardingError,
    isLoading: onboardingLoading,
    mutate: mutateOnboarding,
  } = useSWR(
    token && isClient
      ? [
          `${apiUrl}/api/v1/members/filtered?${createQueryParams(paginationNumber).toString()}`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
  );

  const totalPagination = onboardingData?.meta?.total_pages || 1;

  useEffect(() => {
    setPaginationNumber(1);
  }, [statusFilter]);

  console.log("Onboarding data:", onboardingData);

  const members = useMemo(() => {
    const rawMembers = onboardingData?.data || [];
    return rawMembers.sort((a: Member, b: Member) => {
      const dateA = dayjs(a.register_date);
      const dateB = dayjs(b.register_date);

      if (dateB.isAfter(dateA)) return 1;
      if (dateB.isBefore(dateA)) return -1;
      return 0;
    });
  }, [onboardingData]);

  const handleStatusChange = (newStatuses: string[]) => {
    setStatusFilter(newStatuses);
  };

  const getCurrentSingleStatus = () => {
    if (statusFilter.length === ONBOARDING_STATUSES.length) return "all";
    return statusFilter[0] || "all";
  };

  if (!isClient) {
    return (
      <DashboardLayout>
        <h1 className="text-4xl font-bold mt-6">Onboarding</h1>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mt-6">Onboarding</h1>
      {onboardingError && <p>Error loading data</p>}

      <div className="mt-4 border w-full border-gray-800 rounded-lg active:shadow-none transition duration-200">
        {!isMaxWidth768px ? (
          <table className="w-full text-sm text-left">
            <thead className="text-gray-200 bg-[#1e1e1e]">
              <tr className="border-b border-gray-800">
                <th className="pl-8 pr-2 py-4 bg-neutral-700 dark:bg-[#1e1e1e] min-w-[150px]">
                  Name
                </th>
                <th className="py-4 px-4 bg-neutral-700 dark:bg-[#1e1e1e]">
                  Contact Number
                </th>
                <th className="py-4 px-4 bg-neutral-700 dark:bg-[#1e1e1e]">
                  Register Date
                </th>
                <th className="py-4 px-4 bg-neutral-700 dark:bg-[#1e1e1e]">
                  <div className="flex items-center gap-x-3">
                    Status
                    <MemberFilter
                      onStatusChange={handleStatusChange}
                      currentStatus={getCurrentSingleStatus()}
                      availableStatuses={ONBOARDING_STATUSES}
                      defaultStatuses={ONBOARDING_STATUSES}
                      isOnboarding={true}
                    />
                  </div>
                </th>
                <th className="pl-2 pr-8 py-4 bg-neutral-700 dark:bg-[#1e1e1e] w-[297px]">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member: Member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-800 last:border-b-0"
                  >
                    <OnboardingTableRow
                      member={member}
                      mutateOnboarding={mutateOnboarding}
                    />
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {onboardingLoading ? "Loading..." : "No members found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <>
            {members.length > 0 ? (
              members.map((member: Member) => (
                <OnboardingMobileCard
                  key={member.id}
                  member={member}
                  mutateOnboarding={mutateOnboarding}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {onboardingLoading ? "Loading..." : "No members found"}
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-full w-fit bottom-4 right-4 z-50 overflow-hidden">
        <button
          onClick={() => setPaginationNumber((prev) => Math.max(1, prev - 1))}
          className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 py-2 px-2 transition duration-200 hover:bg-gray-200 dark:hover:bg-neutral-800 active:bg-gray-300 dark:active:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={onboardingLoading || paginationNumber === 1}
        >
          <ChevronLeft />
        </button>
        <div className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 w-[75px] py-2 px-2 text-center border-x border-gray-200 dark:border-gray-700">
          {paginationNumber} - {totalPagination}
        </div>
        <button
          onClick={() =>
            setPaginationNumber((prev) => Math.min(totalPagination, prev + 1))
          }
          className="text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 py-2 px-2 transition duration-200 hover:bg-gray-200 dark:hover:bg-neutral-800 active:bg-gray-300 dark:active:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            onboardingLoading || paginationNumber >= totalPagination
          }
        >
          <ChevronRight />
        </button>
      </div>
    </DashboardLayout>
  );
}
