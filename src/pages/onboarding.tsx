import DashboardLayout from "@/components/DashboardLayout";
import MemberFilter from "@/components/FilterPopover/memberFilter";
import OnboardingTableRow from "@/components/Onboarding/OnboardingTableRow";
import useAuthStore from "@/store/useAuthStore";
import { MemberStatus, Member } from "@/types/types";
import { apiUrl } from "@/utils/env";
import { fetcherWithToken } from "@/utils/fetcher";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export default function Onboarding() {
  const { token } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([
    MemberStatus.Registered,
    MemberStatus.Contacted,
    MemberStatus.IdeaTalked,
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createQueryParams = () => {
    const queryParams = new URLSearchParams();
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
          `${apiUrl}/api/v1/members/filtered?${createQueryParams().toString()}`,
          token,
        ]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
  );

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
    if (
      statusFilter.length === 3 &&
      statusFilter.includes(MemberStatus.Registered) &&
      statusFilter.includes(MemberStatus.Contacted) &&
      statusFilter.includes(MemberStatus.IdeaTalked)
    ) {
      return "all";
    }
    return statusFilter[0] || MemberStatus.Registered;
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
      {onboardingLoading && <p>Loading onboarding data...</p>}
      {onboardingError && <p>Error loading data</p>}

      <div className="mt-4 border w-full border-gray-800 rounded-lg active:shadow-none transition duration-200">
        <table className="w-full">
          <thead className="border-b pb-3">
            <tr className="border-b border-gray-800 pb-3">
              <th className="text-left pl-8 pr-2 bg-[#1e1e1e] rounded-tl-lg min-w-[150px]">
                Name
              </th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e]">
                Contact Number
              </th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e]">
                Register Date
              </th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e]">
                <div className="flex items-center gap-x-3">
                  Status
                  <MemberFilter
                    onStatusChange={handleStatusChange}
                    currentStatus={getCurrentSingleStatus()}
                    isOnboarding={true}
                  />
                </div>
              </th>
              <th className="text-left pl-2 pr-8 bg-[#1e1e1e] rounded-tr-lg w-[297px]">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((member: Member) => (
                <tr key={member.id} className="border border-gray-800">
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
      </div>
    </DashboardLayout>
  );
}
