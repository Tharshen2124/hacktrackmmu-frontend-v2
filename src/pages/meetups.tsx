import DashboardLayout from "@/components/DashboardLayout";
import HackathonCard from "@/components/HackathonCard";
import MeetupCard from "@/components/MeetupCard";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Meetups() {
    const { token } = useAuthStore();
    const [paginationNumber, setPaginationNumber] = useState<number>(1)
    const [meetups, setMeetups] = useState<any>()
    const [hackathons, setHackathons] = useState<any>()
    // const 
    // const [isLoading, setIsLoading] = useState();
    // const [error, seError] = useState();

    useEffect(() => {


        async function getData() {
            const response = await axios.get(`${apiUrl}/api/v1/meetups/?page=${paginationNumber}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            setMeetups(response.data.data.regular_meetups)
            setHackathons(response.data.data.hackathons)
            
        }

        getData()
    }, [paginationNumber]) 
    
  return (
    <DashboardLayout>
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Meetups</h1>
            <div className="flex items-center border-2 border-gray-200 rounded-full w-fit">
                <button onClick={() => setPaginationNumber((prev) => prev - 1)} className="text-black bg-white py-2 px-2 rounded-l-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
                    <ChevronLeft />
                </button>
                <div className="text-black bg-white w-[75px] py-2 px-2 text-center">
                    {paginationNumber} - 16
                </div>
                <button onClick={() => setPaginationNumber((prev) => prev + 1)} className="text-black bg-white py-2 px-2 rounded-r-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
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
            <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Regular Meetups</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {meetups && meetups.map((meetup: any, index: number) => (
                <MeetupCard 
                    key={index} 
                    number={meetup.number} 
                    date={meetup.date} 
                    numberOfUpdates={meetup.updates.length} 
                    hostName={meetup.host && meetup.host.name && meetup.host.name || "N/A"}  
                    updates={meetup.updates}
                />
            ))}
        </div>

        </div>

        <div className="mt-10">
            <div className="flex justify-between items-center">
            <h2 className="text-3xl flex items-center font-semibold">Hackathons</h2>
            </div>            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {hackathons && hackathons.map((meetup: any) => (
                <HackathonCard
                    key={meetup.id} 
                    number={meetup.number} 
                    date={meetup.date} 
                    numberOfUpdates={meetup.updates.length} 
                    hostName={meetup.host && meetup.host.name && meetup.host.name || "N/A"}  
                    updates={meetup.updates}
                />
            ))}
            </div>
        </div>
    </DashboardLayout>
  )
}
