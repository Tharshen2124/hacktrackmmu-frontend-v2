import { Member, MemberStatus } from "@/types/types";
import dayjs from "dayjs";
import { OnboardingMemberModal } from "../OnboardingMemberModal";
import { useState } from "react";

interface OnboardingMobileCardProps {
  member: Member;
  mutateOnboarding: () => void;
}

const statusColour: Record<MemberStatus, string> = {
  [MemberStatus.Registered]: "bg-red-700",
  [MemberStatus.Contacted]: "bg-blue-700",
  [MemberStatus.IdeaTalked]: "bg-green-800",
  [MemberStatus.All]: "",
  [MemberStatus.NeverActive]: "",
  [MemberStatus.Active]: "",
  [MemberStatus.SociallyActive]: "",
  [MemberStatus.WasActive]: "",
  [MemberStatus.WasSociallyInactive]: "",
  [MemberStatus.Terminated]: ""
};

export default function OnboardingMobileCard({
  member,
  mutateOnboarding,
}: OnboardingMobileCardProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleViewClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="border border-gray-700 rounded-lg p-4 mb-5 ">
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
          <span
            className={`truncate px-2 py-1 text-xs font-medium border-gray-200 border ${statusColour[member.status] || "text-blue-500"} rounded-full`}
          >
            {member.status.toUpperCase()}
          </span>
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
          <button className="w-full text-white text-sm font-semibold bg-blue-800 py-2 rounded-md transition duration-200 hover:bg-blue-700 active:bg-gray-400">
            Edit
          </button>
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