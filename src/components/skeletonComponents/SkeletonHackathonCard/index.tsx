import { Laptop, RefreshCcw, Timer, User } from "lucide-react";

export default function SkeletonHackathonCard() {
  return (
    <>
      <div className="bg-white dark:bg-[#222] rounded-lg p-4 border border-red-400 dark:border-gray-600 hover:border-red-600 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-red-500/50 active:shadow-none transition duration-200">
        <h1 className="text-lg flex items-center mb-2">
          <Laptop size="18" className="mr-2" />
          <span className="font-bold">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </span>
        </h1>
        <hr className="border-gray-600 mb-3 mt-1" />
        <div className="flex items-center mb-2">
          <User size="16" className="mr-2" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center mb-2">
          <Timer size="16" className="mr-2" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center">
          <RefreshCcw size="16" className="mr-2" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </>
  );
}
