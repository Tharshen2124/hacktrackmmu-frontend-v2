import ControlPanel from "@/components/Admin/ControlPanel";
import DashboardLayout from "@/components/DashboardLayout";
import HackathonCard from "@/components/HackathonCard";
import MeetupCard from "@/components/MeetupCard";
import MemberCard from "@/components/MemberCard";
import SkeletonHackathonCard from "@/components/skeletonComponents/SkeletonHackathonCard";
import SkeletonMemberCard from "@/components/skeletonComponents/SkeletonMemberCard";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { token, isAdmin } = useAuthStore();
  const [members, setMembers] = useState<any>([]);
  const [meetups, setMeetups] = useState<any>([]);
  const [hackathons, setHackathons] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    async function getData() {
      try {
        function getMembers() {
          return axios.get(`${apiUrl}/api/v1/dashboard/members`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        function getHackathons() {
          return axios.get(`${apiUrl}/api/v1/dashboard/hackathons`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        function getMeetups() {
          return axios.get(`${apiUrl}/api/v1/dashboard/meetups`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        }

        Promise.all([getMembers(), getMeetups(), getHackathons()]).then(
          function (results) {
            setMembers(results[0].data.data);
            setMeetups(results[1].data.data);
            setHackathons(results[2].data.data);

            setIsLoading(false);
          },
        );
      } catch (error: any) {
        console.error("Error occured during fetch", error);
        setShowError(true);
      }
    }

    getData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <h1 className="text-4xl font-bold mt-6">Dashboard</h1>
        {/* {
          isAdmin && members && meetups &&
            <ControlPanel 
              members={members}
              meetups={meetups}
              token={token}
            />
        } */}

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Meetups</h2>
            <Link
              href="/meetups"
              className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white"
            >
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
            <h2 className="text-3xl flex items-center font-semibold">
              Hackathons
            </h2>
            <Link
              href="/meetups"
              className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white"
            >
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
            <Link
              href="/members"
              className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white"
            >
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

  if (showError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Error occured</h1>
      </div>
    );
  }

  return (
    <>
      <DashboardLayout>
        <h1 className="text-4xl font-bold mt-6">Dashboard</h1>

        {
          isAdmin && 
            <ControlPanel 
              members={members}
              meetups={meetups}
              token={token}
            />
        }

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Meetups</h2>
            <Link
              href="/meetups"
              className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white"
            >
              <CircleArrowRight size="18" />
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {meetups?.length > 0 &&
              meetups.map((meetup: any, index: number) => (
                <MeetupCard
                  key={index}
                  number={meetup.number}
                  date={meetup.date}
                  numberOfUpdates={meetup.updates.length}
                  hostName={meetup.host.name}
                  updates={meetup.updates}
                />
              ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl flex items-center font-semibold">
              Hackathons
            </h2>
            <Link
              href="/meetups"
              className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white"
            >
              <CircleArrowRight size="18" />
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {hackathons?.length > 0 &&
              hackathons.map((meetup: any) => (
                <HackathonCard
                  key={meetup.id}
                  number={meetup.number}
                  date={meetup.date}
                  numberOfUpdates={meetup.updates.length}
                  hostName={meetup.host.name}
                  updates={meetup.updates}
                />
              ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Members</h2>
            <Link
              href="/members"
              className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-full font-semibold text-white"
            >
              <CircleArrowRight size="18" />
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {members?.length > 0 &&
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
    </>
  );
}
