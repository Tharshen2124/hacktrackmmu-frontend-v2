import { FolderCheck, FolderCode, Speech, User } from "lucide-react";

export default function SkeletonMemberCard() {
  return (
    <div className="bg-white dark:bg-[#222] rounded-lg p-4 border border-gray-600 hover:border-gray-200 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-gray-200/50 active:shadow-none transition duration-200">
      <h1 className="text-lg flex items-center mb-2">
        <User size="18" className="mr-2" />
        <span className="font-bold">
          <div className="h-[18px] w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </span>
      </h1>
      <hr className="border-gray-600 mb-2" />
      <div className="flex items-center mb-2">
        <FolderCode size="16" className="mr-2" />
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center mb-2">
        <FolderCheck size="16" className="mr-2" />
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center mb-2">
        <Speech size="16" className="mr-2" />
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
