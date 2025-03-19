import { ActionButton } from "..";
import { useState } from "react";
import { NewProjectActionModal } from "./NewProjectActionModal";
import { FolderOpen } from "lucide-react";

export function NewProjectActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ActionButton
        label="New Project"
        icon={<FolderOpen />}
        onClick={handleCloseModal}
        bgColor="border-green-600"
        textColor="text-green-600"
        hoverShadowColor="hover:shadow-green-500/50"
      />

      <NewProjectActionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
