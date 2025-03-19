import { CalendarPlus, UserPlus } from "lucide-react";
import { ActionButton } from "..";
import { useState } from "react";
import { NewMeetupActionModal } from "./NewMeetupActionModal";

export function NewMeetupActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ActionButton
        label="New Meetup"
        icon={<CalendarPlus />}
        onClick={handleCloseModal}
        bgColor="border-orange-600"
        textColor="text-orange-600"
        hoverShadowColor="hover:shadow-orange-500/50"
      />

      <NewMeetupActionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
