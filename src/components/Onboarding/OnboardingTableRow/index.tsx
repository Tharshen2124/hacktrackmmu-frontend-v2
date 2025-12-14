import { useState } from "react";
import { OnboardingMemberModal } from "../OnboardingMemberModal";
import { Member, MemberStatus, MemberStatusLabels } from "@/types/types";
import dayjs from "dayjs";
import Link from "next/link";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import { useToast } from "@/components/Toast/ToastProvider";

interface OnboardingTableRowProps {
  member: Member;
  mutateOnboarding: () => void;
}

const statusColour: Partial<Record<MemberStatus, string>> = {
  [MemberStatus.Registered]: "bg-red-700",
  [MemberStatus.Contacted]: "bg-blue-700",
  [MemberStatus.IdeaTalked]: "bg-green-800",
};

// Easy to modify: just add/remove statuses here
const ONBOARDING_STATUSES = [
  MemberStatus.Registered,
  MemberStatus.Contacted,
  MemberStatus.IdeaTalked,
];

export default function OnboardingTableRow({
  member,
  mutateOnboarding,
}: OnboardingTableRowProps) {
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
        {
          member: {
            status: newStatus
          }
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
    } catch (error) {
      console.error("Error updating status", error);
      showToast("Failed to update status", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <td className="pl-8 pr-2 py-4 min-w-[150px] overflow-auto">
        {member.name}
      </td>
      <td className="py-4 px-4">{member.contact_number || "N/A"}</td>
      <td className="py-4 px-4">
        {dayjs(member.register_date || "N/A").format("MMM D, YYYY")}
      </td>

      <td className="py-4 px-4">
        <select
          value={member.status}
          onChange={(e) => handleStatusChange(e.target.value as MemberStatus)}
          disabled={isUpdating}
          className={`px-2 py-1 text-xs font-medium border-gray-200 border ${
            statusColour[member.status as MemberStatus] || "text-blue-500"
          } rounded-full bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {ONBOARDING_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[#1e1e1e] text-white">
              {MemberStatusLabels[status].toUpperCase()}
            </option>
          ))}
        </select>
      </td>
      <td className="text-left py-2 pl-2 pr-8 w-[297px] items-center ">
        <div className="button-container flex gap-x-2 gap-y-2 flex-wrap justify-center">
          <button
            onClick={handleViewClick}
            className="w-[80px] text-black text-sm font-semibold bg-[#d9d9d9] py-2 px-3 rounded-full transition duration-200 hover:bg-gray-200 active:bg-gray-400"
          >
            View
          </button>
          <Link href={`/member/${member.id}/edit?source=onboarding`} passHref>
            <button className="w-[80px] text-white text-sm font-semibold bg-blue-800 py-2 px-3 rounded-full transition duration-200 hover:bg-blue-700 active:bg-gray-400">
              Edit
            </button>
          </Link>
          <button className="w-[80px] text-white text-sm font-semibold bg-red-800 py-2 px-3 rounded-full transition duration-200 hover:bg-red-700 active:bg-gray-400">
            Delete
          </button>
        </div>
      </td>

      <OnboardingMemberModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        member={member}
        mutateOnboarding={mutateOnboarding}
      />
    </>
  );
}
