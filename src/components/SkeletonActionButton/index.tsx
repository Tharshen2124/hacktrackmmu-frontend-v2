import React from 'react'

export default function SkeletonActionButton() {
  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 dark:bg-[#222] rounded-lg py-[20px] flex flex-col items-center justify-center">
        {/* Icon skeleton */}
        <div className="mb-2 w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        
        {/* Label skeleton */}
        <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
    </>
  )
}
