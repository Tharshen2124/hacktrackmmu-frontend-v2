import { Speech } from "lucide-react";
import { ActionButton } from "..";
import { useState } from "react";
import { NewUpdateActionModal } from "./NewUpdateActionModal";

export function NewUpdateActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ActionButton
        label="New Update"
        icon={<Speech />}
        onClick={handleViewClick}
        bgColor="border-red-500"
        textColor="text-red-500"
        hoverShadowColor="hover:shadow-red-500/50"
      />

      <NewUpdateActionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
