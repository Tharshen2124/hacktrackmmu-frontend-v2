import { Member, MemberStatus, MemberStatusLabels } from "@/types/types";
import dayjs from "dayjs";
import { OnboardingMemberModal } from "../OnboardingMemberModal";
import { useState } from "react";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import { useToast } from "@/components/Toast/ToastProvider";
import Link from "next/link";

interface OnboardingMobileCardProps {
  member: Member;
  mutateOnboarding: () => void;
}

const statusColour: Partial<Record<MemberStatus, string>> = {
  [MemberStatus.Registered]: "bg-red-700",
  [MemberStatus.Contacted]: "bg-blue-700",
  [MemberStatus.IdeaTalked]: "bg-green-800",
};

const ONBOARDING_STATUSES = [
  MemberStatus.Registered,
  MemberStatus.Contacted,
  MemberStatus.IdeaTalked,
];

export default function OnboardingMobileCard({
  member,
  mutateOnboarding,
}: OnboardingMobileCardProps) {
  const { token } = useAuthStore();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleViewClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleStatusChange = async (newStatus: MemberStatus) => {
    if (newStatus === member.status) return;

    setIsUpdating(true);
    try {
      await axios.put(
        `${apiUrl}/api/v1/members/${member.id}`,
        { member: { status: newStatus } },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      mutateOnboarding();
      showToast("Member status updated successfully", "success");
    } catch (error) {
      console.error("Error updating status", error);
      showToast("Failed to update status", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 mb-5">
      <div className="upper-part flex justify-between">
        <div className="left-side">
          <h2 className="text-lg font-bold mb-2">{member.name}</h2>
          <p className="text-sm mb-1 truncate">
            <span className="font-bold">Contact Number: </span>
            {member.contact_number || "N/A"}
          </p>
          <p className="text-sm mb-1 truncate">
            <span className="font-bold">Created At: </span>
            {dayjs(member.created_at).format("MMM D, YYYY")}
          </p>
        </div>
        <div className="right-side">
          <select
            value={member.status}
            onChange={(e) => handleStatusChange(e.target.value as MemberStatus)}
            disabled={isUpdating}
            className={`truncate px-2 py-1 text-xs font-medium border-gray-200 border ${
              statusColour[member.status as MemberStatus] || "text-blue-500"
            } rounded-full bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {ONBOARDING_STATUSES.map((status) => (
              <option key={status} value={status} className="bg-[#1e1e1e] text-white">
                {MemberStatusLabels[status].toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bottom-part mt-3">
        <div className="button-container flex justify-evenly gap-x-2">
          <button
            className="w-full text-black text-sm font-semibold bg-[#d9d9d9] py-2 rounded-md transition duration-200 hover:bg-gray-200 active:bg-gray-400"
            onClick={handleViewClick}
          >
            View
          </button>
          <Link href={`/member/${member.id}/edit?source=onboarding`} passHref className="w-full">
            <button className="w-full text-white text-sm font-semibold bg-blue-800 py-2 rounded-md transition duration-200 hover:bg-blue-700 active:bg-gray-400">
              Edit
            </button>
          </Link>
          <button className="w-full text-white text-sm font-semibold bg-red-800 py-2 rounded-md transition duration-200 hover:bg-red-700 active:bg-gray-400">
            Delete
          </button>
        </div>
      </div>
      <OnboardingMemberModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        member={member}
        mutateOnboarding={mutateOnboarding}
      />
    </div>
  );
}