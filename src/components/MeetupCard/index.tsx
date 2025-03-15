import {
  Calendar,
  CircleAlert,
  Hammer,
  RefreshCcw,
  Timer,
  User,
} from "lucide-react";
import { useState } from "react";
import { dateMod } from "@/utils/dateMod";
import { ModalLayout } from "../ModalLayout";

interface MeetupCardProps {
  number: number;
  numberOfUpdates: number;
  date: string;
  hostName: string;
  updates: Update[];
}

interface Project {
  category: string;
  completed: boolean;
  name: string;
}

interface Update {
  category: string;
  description: string;
  member: Member;
  project: Project;
}

interface Member {
  name: string;
  active: boolean;
}

export default function MeetupCard({
  number,
  numberOfUpdates,
  date,
  hostName,
  updates,
}: MeetupCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-[#222] rounded-lg p-4 border border-blue-400 dark:border-gray-600 hover:border-blue-600 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-blue-500/50 active:shadow-none transition duration-200"
      >
        <h1 className="text-lg flex items-center">
          <Calendar size="18" className="mr-2" />
          <span className="font-bold">Meetup {number}</span>
        </h1>
        <hr className="border-gray-600 mb-2 mt-1" />
        <p className="flex items-center">
          <User size="16" className="mr-2" />
          Host: {hostName}
        </p>
        <p className="flex items-center">
          <Timer size="16" className="mr-2" />
          Date: {dateMod(date)}
        </p>
        <p className="flex items-center">
          <RefreshCcw size="16" className="mr-2" />
          {numberOfUpdates} Updates
        </p>
      </div>

      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-4">Meetup {number}</h2>
        <h3 className="text-lg font-semibold mb-1">Details</h3>
        <div className="border border-gray-700 py-3 px-4 rounded-md mb-3">
          <p>
            <strong>Host:</strong> {hostName}
          </p>
          <p>
            <strong>Date:</strong> {dateMod(date)}
          </p>
          <p>{numberOfUpdates} updates</p>
        </div>

        <h3 className="text-lg font-semibold mb-1">Updates</h3>
        <div className="overflow-y-auto border flex flex-col gap-y-4 px-4 py-3 mb-8 max-h-56 lg:max-h-96 rounded-md border-gray-700">
          {updates.length !== 0 ? (
            updates.map((update, index: number) => (
              <>
                <div key={index} className="">
                  <p className="font-bold">
                    {update.project.name.length > 30
                      ? update.project.name.slice(0, 30) + "..."
                      : update.project.name}
                  </p>
                  <p className="text-sm flex items-center">
                    <strong>Category: </strong>
                    {update.category === "progress_talk" ? (
                      <>
                        <Hammer size="14" className="mx-1" /> Progress Talk
                      </>
                    ) : (
                      <>
                        <Hammer size="14" className="mx-1" /> Idea Talk
                      </>
                    )}
                  </p>
                  <p className="text-sm mt-1">{update.description}</p>
                </div>
              </>
            ))
          ) : (
            <p className="text-red-400 flex items-center gap-x-2">
              <CircleAlert size="18" />
              No updates
            </p>
          )}
        </div>

        <button
          onClick={handleCloseModal}
          className="bg-white hover:bg-white-600 text-black font-bold py-2 px-4 rounded w-full"
        >
          Close
        </button>
      </ModalLayout>
    </>
  );
}
