import { dateMod } from "@/utils/dateMod";
import { Laptop, RefreshCcw, Timer, User } from "lucide-react";
import { useState } from "react";
import { ModalLayout } from "../ModalLayout";
import { Update } from "@/types/types";

interface MeetupCardProps {
  number: number;
  numberOfUpdates: number;
  date: string;
  hostName: string;
  updates: Update[];
}


export default function HackathonCard({
  number,
  numberOfUpdates,
  date,
  hostName,
  updates,
}: MeetupCardProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        className="bg-white dark:bg-[#222] rounded-lg p-4 border border-red-400 dark:border-gray-600 hover:border-red-600 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-red-500/50 active:shadow-none transition duration-200"
      >
        <h1 className="text-lg flex items-center">
          <Laptop size="18" className="mr-2" />
          <span className="font-bold">Hackathon {number}</span>
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

        <div className="border border-gray-700 py-3 px-4 rounded-md mb-3">
          <p>
            <strong>Host:</strong> {hostName}
          </p>
          <p>
            <strong>Date:</strong> {dateMod(date)}
          </p>
          <p>{numberOfUpdates} updates</p>
        </div>

        <div className="overflow-y-auto border px-4 py-3 mb-8 h-56 lg:h-96 rounded-md border-gray-700">
          {updates.map((update, index: number) => (
            <>
              <div key={index} className="">
                <p className="font-bold">
                  {update.project.name.length > 30
                    ? update.project.name.slice(0, 30) + "..."
                    : update.project.name}
                </p>
                <p className="text-sm">{update.description}</p>
              </div>
              <hr className="border-gray-700 my-3" />
            </>
          ))}
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
