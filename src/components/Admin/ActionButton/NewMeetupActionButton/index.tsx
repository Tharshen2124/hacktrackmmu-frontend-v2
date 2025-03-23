import { CalendarPlus, UserPlus } from "lucide-react";
import { ActionButton } from "..";
import { useState } from "react";
import { NewMeetupActionModal } from "./NewMeetupActionModal";

export function NewMeetupActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ActionButton
        label="New Meetup"
        icon={<CalendarPlus />}
        onClick={handleViewClick}
        bgColor="border-white"
        textColor="text-white"
        hoverShadowColor="hover:shadow-white/50"
      />

      <NewMeetupActionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
