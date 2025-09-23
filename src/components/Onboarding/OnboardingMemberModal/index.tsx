import { ModalLayout } from "@/components/ModalLayout";
import { useToast } from "@/components/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";
import { Member, MemberStatus } from "@/types/types";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import dayjs from "dayjs";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Edit,
  Mail,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const MemberStatusMap: Record<MemberStatus, number> = {
  [MemberStatus.Registered]: 0,
  [MemberStatus.Contacted]: 1,
  [MemberStatus.IdeaTalked]: 2,
  [MemberStatus.NeverActive]: 3,
  [MemberStatus.Active]: 4,
  [MemberStatus.SociallyActive]: 5,
  [MemberStatus.WasActive]: 6,
  [MemberStatus.WasSociallyInactive]: 7,
  [MemberStatus.Terminated]: 8,
  [MemberStatus.All]: -10,
};

export function OnboardingMemberModal({
  isModalOpen,
  handleCloseModal,
  member,
  mutateOnboarding,
}: OnboardingMemberModalProps) {
  const [isClient, setIsClient] = useState(false);

  const { showToast } = useToast();
  const { token } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateStatus = async (
    change: "up" | "down",
    currentStatus: MemberStatus,
  ) => {
    const currentStatusValue = MemberStatusMap[currentStatus];
    let newStatusValue = currentStatusValue;

    if (change === "up" && currentStatusValue < 8) {
      newStatusValue += 1;
    } else if (change === "down" && currentStatusValue > 0) {
      newStatusValue -= 1;
    }

    const newStatus = Object.keys(MemberStatusMap).find(
      (key) => MemberStatusMap[key as MemberStatus] === newStatusValue,
    ) as MemberStatus | undefined;

    try {
      await axios.put(
        `${apiUrl}/api/v1/members/${member.id}`,
        {
          member: {
            status: newStatus || currentStatus,
          },
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      mutateOnboarding();
      showToast("Member status updated successfully", "success");
    } catch (error: any) {
      console.error("Error occured during fetch", error);
      return;
    }
  };

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

  return (
    <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-2xl font-bold">{member.name}</h2>
        <div className="flex gap-x-2">
          <Link
            href={`/member/${member.id}/edit?source=onboarding`}
            passHref
            className="border p-[5px] border-blue-600 bg-blue-600 rounded-md"
          >
            <Edit size="16" />
          </Link>
          <div className="border p-[5px] border-red-600 bg-red-600 rounded-md">
            <Trash size="16" />
          </div>
        </div>
      </div>

      <div className="status-container flex flex-row justify-between items-center">
        <h3 className="text-lg font-semibold">
          Status:{" "}
          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
        </h3>
        {isClient && (
          <div className="arrow-containers flex flex-row gap-x-2 items-center">
            {MemberStatusMap[member.status] === 2 && (
              <Link
                href={`/member/${member.id}/edit?source=onboarding`}
                passHref
              >
                <button
                  className="bg-green-600 p-1 rounded-md"
                  title="Assign Status in Edit Page"
                >
                  <Check size="16" />
                </button>
              </Link>
            )}
            {MemberStatusMap[member.status] < 2 &&
            MemberStatusMap[member.status] >= 0 ? (
              <button
                title={`Promote to ${
                  Object.keys(MemberStatusMap).find(
                    (key) =>
                      MemberStatusMap[key as MemberStatus] ===
                      MemberStatusMap[member.status] + 1,
                  ) || ""
                }`}
                className="bg-blue-600 p-1 rounded-md"
                onClick={() => updateStatus("up", member.status)}
              >
                <ArrowUp size="16" />
              </button>
            ) : (
              <div className="bg-gray-600 p-1 rounded-md">
                <ArrowUp size="16" />
              </div>
            )}
            {MemberStatusMap[member.status] > 0 &&
            MemberStatusMap[member.status] <= 2 ? (
              <button
                title={`Demote to ${
                  Object.keys(MemberStatusMap).find(
                    (key) =>
                      MemberStatusMap[key as MemberStatus] ===
                      MemberStatusMap[member.status] - 1,
                  ) || ""
                }`}
                className="bg-yellow-500 p-1 rounded-md"
                onClick={() => updateStatus("down", member.status)}
              >
                <ArrowDown size="16" />
              </button>
            ) : (
              <div className="bg-gray-600 p-1 rounded-md">
                <ArrowDown size="16" />
              </div>
            )}
          </div>
        )}
      </div>
      {MemberStatusMap[member.status] === 2 ? (
        <div className="bg-green-500 text-black font-bold text-sm p-2 rounded-md mt-2">
          <p>Select Tick Icon to Assign Status in Edit Page.</p>
        </div>
      ) : null}

      <h3 className="text-lg font-semibold mt-4 mb-1">Contact Information</h3>
      <div className="flex items-center justify-between border border-gray-700 py-3 px-4 rounded-md mb-2 gap-3">
        <p className=" min-w-0 truncate">
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
              onClick={() => {}}
              className="hover:text-gray-400 active:text-blue-500"
              size="16"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between border border-gray-700 py-3 px-4 rounded-md gap-3">
        <p className=" min-w-0 truncate">
          <span className="font-bold">Contact Number:</span>{" "}
          {member.contact_number || "N/A"}
        </p>
        <div className="flex flex-row gap-x-4">
          <Copy
            onClick={() =>
              copyToClipBoard(member.contact_number, "Contact Number")
            }
            className="hover:text-gray-400 hover:cursor-pointer active:text-green-500"
            size="16"
          />
          <Image
            src="/whatsapp.svg"
            alt="WhatsApp"
            width={16}
            height={16}
            className="hover:opacity-70 hover:cursor-pointer active:opacity-50"
            onClick={() => handleWhatsapp(member.contact_number)}
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-1 mt-4">Other Information</h3>
      <div className="flex flex-col gap-x-2 border border-gray-700 py-3 px-4 rounded-md max-h-36 lg:max-h-48 overflow-y-auto">
        <p>
          <span className="font-semibold">Register Date:</span>{" "}
          {dayjs(member.created_at).format("DD/MM/YYYY HH:mm")}
        </p>

        <p>
          <span className="font-semibold">Comment:</span>{" "}
          {member.comment || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Old Status:</span>{" "}
          {typeof member.active === "boolean"
            ? member.active
              ? "Active"
              : "Inactive"
            : "N/A"}
        </p>
      </div>
      <button
        onClick={handleCloseModal}
        className="dark:bg-white mt-5 hover:bg-white-600 dark:text-black bg-[#222] dark:hover:bg-[#e0e0e0] dark:active:bg-[#c7c7c7] text-white hover:bg-[#333] active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
      >
        Close
      </button>
    </ModalLayout>
  );
}
