import DashboardLayout from "@/components/DashboardLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useState } from "react";

export default function Meetups() {
    // const [searchQuery, setSearchQuery] = useState("")

    // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   setSearchQuery(event.target.value)
    //   // Here you would typically trigger your search logic
    //   console.log("Searching for:", event.target.value)
    // }
  
  return (
    <DashboardLayout>
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Meetups</h1>
            <div className="flex items-center border-2 border-gray-200 rounded-full w-fit">
                <button className="text-black bg-white py-2 px-2 rounded-l-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
                    <ChevronLeft />
                </button>
                <div className="text-black bg-white w-[75px] py-2 px-2 text-center">
                    1 - 16
                </div>
                <button className="text-black bg-white py-2 px-2 rounded-r-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {/* <MeetupCard /> 
            <MeetupCard /> 
            <MeetupCard />  
            <MeetupCard />  */}
        </div>
    </DashboardLayout>
  )
}
