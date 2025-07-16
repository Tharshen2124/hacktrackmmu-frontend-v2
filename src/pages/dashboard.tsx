import ControlPanel from "@/components/Admin/ControlPanel";
import DashboardLayout from "@/components/DashboardLayout";
import HackathonCard from "@/components/HackathonCard";
import MeetupCard from "@/components/MeetupCard";
import MemberCard from "@/components/MemberCard";
import SkeletonHackathonCard from "@/components/skeletonComponents/SkeletonHackathonCard";
import SkeletonMemberCard from "@/components/skeletonComponents/SkeletonMemberCard";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import { fetcherWithToken } from "@/utils/fetcher";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

export default function Home() {
  const { token, isAdmin } = useAuthStore();

  const {
    data: members,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR(
    token ? [`${apiUrl}/api/v1/dashboard/members`, token] : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const {
    data: meetups,
    error: meetupsError,
    isLoading: meetupsLoading,
    mutate: mutateMeetups,
  } = useSWR(
    token ? [`${apiUrl}/api/v1/dashboard/meetups`, token] : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const {
    data: hackathons,
    error: hackathonsError,
    isLoading: hackathonsLoading,
  } = useSWR(
    token ? [`${apiUrl}/api/v1/dashboard/hackathons`, token] : null,
    ([url, token]) => fetcherWithToken(url, token)
  );

  const isLoading = membersLoading || meetupsLoading || hackathonsLoading;
  const isError = membersError || meetupsError || hackathonsError;

  if (isLoading) {
    return (
      <DashboardLayout>
        <h1 className="text-4xl font-bold mt-6">Dashboard</h1>
        {isAdmin === "true" && <ControlPanel mutateMeetups={mutateMeetups} />}

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Meetups</h2>
            <Link href="/meetups" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white">
              <CircleArrowRight size="18" />
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, index) => (
              <SkeletonMemberCard key={index} />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Hackathons</h2>
            <Link href="/meetups" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white">
              <CircleArrowRight size="18" />
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, index) => (
              <SkeletonHackathonCard key={index} />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Members</h2>
            <Link href="/members" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white">
              <CircleArrowRight size="18" />
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, index) => (
              <SkeletonMemberCard key={index} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Error occurred</h1>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mt-6">Dashboard</h1>
      {isAdmin === "true" && <ControlPanel mutateMeetups={mutateMeetups} />}

      {/* Meetups */}
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold">Meetups</h2>
          <Link href="/meetups" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white">
            <CircleArrowRight size="18" />
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {Array.isArray(meetups) &&
            meetups.map((meetup: any, index: number) => (
              <MeetupCard
                key={index}
                number={meetup.number}
                date={meetup.date}
                numberOfUpdates={meetup.updates.length}
                hostName={meetup.host?.name || "unknown host"}
                updates={meetup.updates}
              />
            ))}
        </div>
      </div>

      {/* Hackathons */}
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold">Hackathons</h2>
          <Link href="/meetups" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white">
            <CircleArrowRight size="18" />
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {Array.isArray(hackathons) &&
            hackathons.map((hackathon: any) => (
              <HackathonCard
                key={hackathon.id}
                number={hackathon.number}
                date={hackathon.date}
                numberOfUpdates={hackathon.updates.length}
                hostName={hackathon.host?.name || "unknown host"}
                updates={hackathon.updates}
              />
            ))}
        </div>
      </div>

      {/* Members */}
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold">Members</h2>
          <Link href="/members" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white">
            <CircleArrowRight size="18" />
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {Array.isArray(members) &&
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
