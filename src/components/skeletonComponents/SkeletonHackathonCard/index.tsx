import { Laptop, RefreshCcw, Timer, User } from "lucide-react"

export function SkeletonHackathonCard() {
  return (
    <div className="bg-white dark:bg-[#222] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h1 className="text-lg flex items-center">
        <Laptop size="18" className="mr-2 text-gray-300 dark:text-gray-600" />
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </h1>
      <hr className="border-gray-300 dark:border-gray-600 mb-2 mt-1" />
      <div className="flex items-center mb-2">
        <User size="16" className="mr-2 text-gray-300 dark:text-gray-600" />
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center mb-2">
        <Timer size="16" className="mr-2 text-gray-300 dark:text-gray-600" />
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center">
        <RefreshCcw size="16" className="mr-2 text-gray-300 dark:text-gray-600" />
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

