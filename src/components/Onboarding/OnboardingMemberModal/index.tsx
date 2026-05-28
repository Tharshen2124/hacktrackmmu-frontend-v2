import { NullTextIndicator } from "@/components/atomComponents/NullTextIndicator";
import { ModalLayout } from "@/components/ModalLayout";
import { useToast } from "@/components/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";
import { Member, MemberStatus, MemberStatusLabels } from "@/types/types";
import dayjs from "dayjs";
import {
  Copy,
  Edit,
  Mail,
  Phone,
  Tag,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { handleConfirmDeleteMember } from "../handleConfirmDeleteMember";
import DeleteModal from "../DeleteModal";

interface OnboardingMemberModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  member: Member;
  mutateOnboarding: () => void;
}

const convertToWhatsapp = (phoneNumber: string) => {
  const cleanedNumber = phoneNumber.replace(/\D/g, "");
  const countryCode = "60";

  if (cleanedNumber.startsWith(countryCode)) {
    return `https://wa.me/${cleanedNumber}`;
  } else {
    return `https://wa.me/${countryCode}${cleanedNumber}`;
  }
};

export function OnboardingMemberModal({
  isModalOpen,
  handleCloseModal,
  member,
  mutateOnboarding,
}: OnboardingMemberModalProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const { token } = useAuthStore();

  const copyToClipBoard = async (text: string, toastText: string = "Item") => {
    if (!text) {
      showToast(`No ${toastText} Available`, "error");
      return;
    }

    await navigator.clipboard.writeText(text);
    showToast(`${toastText} copied to Clipboard!`, "success");
  };

  const handleWhatsapp = (phoneNumber: string) => {
    if (!phoneNumber) {
      showToast("No Contact Number Available", "error");
      return;
    }
    const whatsappLink = convertToWhatsapp(phoneNumber);
    window.open(whatsappLink, "_blank");
  };

  const handleDeleteMember = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <>
      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <div className="flex gap-x-2">
            <Link
              href={`/member/${member.id}/edit?source=onboarding`}
              passHref
              className="border p-[5px] border-blue-600 bg-blue-600 rounded-md"
            >
              <Edit size="16" className="text-white" />
            </Link>
            <button
              onClick={handleDeleteMember}
              className="border p-[5px] border-red-600 bg-red-600 rounded-md cursor-pointer"
            >
              <Trash size="16" className="text-white" />
            </button>
          </div>
        </div>
      

      <div className="status-container flex flex-row justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          Status:{" "}
          {MemberStatusLabels[member.status as MemberStatus] || member.status}
        </h3>
      </div>

      <h3 className="text-lg font-semibold mt-4 mb-1">Contact Information</h3>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between border border-gray-700 py-3 px-4 rounded-md gap-3">
          <p className="min-w-0 truncate">
            <span className="font-bold">Email:</span> {member.email || "N/A"}
          </p>
          <div className="flex flex-row gap-x-4">
            <Copy
              onClick={() => copyToClipBoard(member.email, "Email")}
              className="hover:text-gray-400 hover:cursor-pointer active:text-green-500"
              size="16"
            />
            <Link href={`mailto:${member.email}`} passHref>
              <Mail
                className="hover:text-gray-400 active:text-blue-500"
                size="16"
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-between border border-gray-700 py-3 px-4 rounded-md gap-3">
          <p className="min-w-0 truncate">
            <span className="font-bold">Contact Number:</span>{" "}
            {member.contact_number || <NullTextIndicator />}
          </p>
          <div className="flex flex-row gap-x-4">
            <Copy
              onClick={() =>
                copyToClipBoard(member.contact_number, "Contact Number")
              }
              className="hover:text-gray-400 hover:cursor-pointer active:text-green-500"
              size="16"
            />
            <Phone onClick={() => handleWhatsapp(member.contact_number)} size={16} />
          </div>
        </div>
        <div className="flex items-center justify-between border border-gray-700 py-3 px-4 rounded-md gap-3">
          <p className="min-w-0 truncate">
            <span className="font-bold">Discord Tag:</span>{" "}
            {member.discord_tag || <NullTextIndicator />}
          </p>
          <div className="flex flex-row gap-x-4">
            <Copy
              onClick={() =>
                copyToClipBoard(member.discord_tag, "Discord Tag")
              }
              className="hover:text-gray-400 hover:cursor-pointer active:text-green-500"
              size="16"
            />
            <Tag size={16} />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-1 mt-4">Comment</h3>
      <div className="flex flex-col gap-x-2 border border-gray-700 py-3 px-4 rounded-md max-h-36 lg:max-h-48 overflow-y-auto">
        <p>{member.comment || <NullTextIndicator />}</p>
      </div>

      <h3 className="text-lg font-semibold mb-1 mt-4">Other Information</h3>
      <div className="flex flex-col gap-x-2 border border-gray-700 py-3 px-4 rounded-md max-h-36 lg:max-h-48 overflow-y-auto">
        <p>
          <span className="font-semibold">Register Date:</span>{" "}
          {dayjs(member.created_at).format("DD/MM/YYYY")}
        </p>
        <p>
          <span className="font-semibold">Register Time:</span>{" "}
          {dayjs(member.created_at).format("HH:mm")}
        </p>
      </div>

        <button
          onClick={handleCloseModal}
          className="dark:bg-white mt-5 hover:bg-white-600 dark:text-black bg-[#222] dark:hover:bg-[#e0e0e0] dark:active:bg-[#c7c7c7] text-white hover:bg-[#333] active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
        >
          Close
        </button>
      </ModalLayout>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={() =>
          handleConfirmDeleteMember({
            memberId: member.id,
            token,
            mutateOnboarding,
            showToast,
            handleCloseDeleteModal,
            setIsDeleting,
          })
        }
        isDeleting={isDeleting}
      />
    </>
  );
}
