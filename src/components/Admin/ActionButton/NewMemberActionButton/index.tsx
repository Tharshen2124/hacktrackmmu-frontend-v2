import { UserPlus } from "lucide-react";
import { ActionButton } from "..";
import { useState } from "react";
import { NewMemberActionModal } from "./NewMemberActionModal";

export function NewMemberActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <ActionButton
        label="New Member"
        icon={<UserPlus />}
        onClick={handleCloseModal}
        bgColor="border-blue-500"
        textColor="text-blue-500"
        hoverShadowColor="hover:shadow-blue-500/50"
      />

      <NewMemberActionModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
