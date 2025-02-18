import { RefreshCcw, Timer, User, Users } from 'lucide-react';

export default function MeetupCard() {
  return (
    <div className="bg-white dark:bg-[#222] rounded-lg shadow-md p-4 border border-gray-600 hover:border-blue-600 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-blue-500/50 active:shadow-none transition duration-200">
        <h1 className="text-lg flex items-center">
            <Users size="18" className="mr-2" />
            <span className="font-bold">Meetup 401</span>
        </h1>
        <hr className="border-gray-600 mb-2 mt-1" />
        <p className="flex items-center">
          <User size="16" className="mr-2" />
          Host: Liew Kuan Yung
        </p>
        <p className="flex items-center">
          <Timer size="16" className="mr-2" />
          Date: 12th September 2021
        </p>
        <p className="flex items-center">
          <RefreshCcw size="16" className="mr-2" />
          6 Updates
        </p>

      </div>
  )
}
