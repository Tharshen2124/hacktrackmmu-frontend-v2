import { Speech } from "lucide-react";
import { ActionButton } from "..";
import { useState } from "react";
import { NewProjectActionModal } from "../NewProjectActionButton/NewProjectActionModal";

export function NewUpdateActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ActionButton
        label="New Update"
        icon={<Speech />}
        onClick={handleCloseModal}
        bgColor="border-purple-500"
        textColor="text-purple-500"
        hoverShadowColor="hover:shadow-purple-500/50"
      />

      <NewProjectActionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
