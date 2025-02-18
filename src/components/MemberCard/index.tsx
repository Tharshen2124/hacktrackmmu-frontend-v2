import { FolderCheck, FolderCode, RefreshCcw, Speech, Timer, User } from "lucide-react";

export default function MemberCard() {
  return (
    <div className="bg-white dark:bg-[#222] rounded-lg shadow-md p-4 border border-gray-600 hover:border-gray-200 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-gray-200/50 active:shadow-none transition duration-200">
      <h1 className="text-lg flex items-center">
        <User size="18" className="mr-2" />
        <span className="font-bold">Meetup 401</span>
      </h1>
      <hr className="border-gray-600 mb-2" />
      <p className="flex items-center">
        <FolderCode size="16" className="mr-2" />
        8 Projects
      </p>
      <p className="flex items-center">
        <FolderCheck size="16" className="mr-2" />
        16 Projects Completed
      </p>
      <p className="flex items-center">
        <Speech size="16" className="mr-2" />
        31 Talks
      </p>
    </div>
  )
}
