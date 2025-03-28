import { ActionButton } from "..";
import { useState } from "react";
import { NewProjectActionModal } from "./NewProjectActionModal";
import { FolderOpen } from "lucide-react";

export function NewProjectActionButton({ members }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ActionButton
        label="New Project"
        icon={<FolderOpen />}
        onClick={handleViewClick}
        bgColor="border-blue-500"
        textColor="text-blue-500"
        hoverShadowColor="hover:shadow-blue-500/50"
      />

      <NewProjectActionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        members={members}
      />
    </>
  );
}
