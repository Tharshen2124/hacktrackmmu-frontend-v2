import DashboardLayout from "@/components/DashboardLayout";
import HackathonCard from "@/components/HackathonCard";
import MeetupCard from "@/components/MeetupCard";
import MemberCard from "@/components/MemberCard";
import { CircleArrowRight } from "lucide-react";

export default function Home() {
  return (
   <> 
      <DashboardLayout>
        <h1 className="text-4xl font-bold mt-6">Dashboard</h1>
        <div className="mt-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">Meetups</h2>
              <a href="/meetups" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-md font-semibold text-white">
                <CircleArrowRight size="20"/>
                View All
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            <MeetupCard />
            <MeetupCard />
            <MeetupCard />
            <MeetupCard />
          </div>

        </div>

        <div className="mt-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl flex items-center font-semibold">Hackathons</h2>
                <a href="/meetups" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-md font-semibold text-white">
                  <CircleArrowRight size="20"/>
                  View All
                </a>
            </div>            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
              <HackathonCard /> 
              <HackathonCard /> 
              <HackathonCard />  
              <HackathonCard /> 

            </div>
        </div>

        <div className="mt-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">Members</h2>
              <a href="/meetups" className="flex items-center gap-x-2 dark:bg-white dark:hover:bg-[#e0e0e0] dark:text-black transition duration-200 bg-gray-800 hover:bg-gray-950 py-2 px-6 rounded-md font-semibold text-white">
                <CircleArrowRight size="20"/>
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
              <MemberCard />
              <MemberCard />
              <MemberCard />
              <MemberCard />
              <MemberCard />
              <MemberCard />
              <MemberCard />
              <MemberCard />
            </div>
        </div>
      </DashboardLayout>
   </>    
  );
}
