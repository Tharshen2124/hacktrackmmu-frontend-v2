import { useState } from "react";
import { OnboardingMemberModal } from "../OnboardingMemberModal";
import { Member, MemberStatus } from "@/types/types";
import dayjs from "dayjs";
import Link from "next/link";
// import { apiUrl } from "@/utils/env";
// import axios from "axios";
// import useAuthStore from "@/store/useAuthStore";

interface OnboardingTableRowProps {
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
  [MemberStatus.Terminated]: "",
};

export default function OnboardingTableRow({
  member,
  mutateOnboarding,
}: OnboardingTableRowProps) {
  // const { token } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [onboardingMembers, setOnboardingMembers] = useState<any>()
  // const [paginationNumber, setPaginationNumber] = useState<number>(1);
  // const [totalPagination, setTotalPagination] = useState<number>(1);
  // const [isError, setIsError] = useState<boolean>(false)

  // useEffect(() => {
  //   async function getData() {
  //       try {
  //           const response = await axios.get(
  //               `${apiUrl}/api/v1/onboarding/members/?page=${paginationNumber}`,
  //               {
  //                 headers: {
  //                   Accept: "application/json",
  //                   Authorization: `Bearer ${token}`,
  //                 },
  //               },
  //             );
  //             setOnboardingMembers(response.data.data)
  //             setTotalPagination(response.data.meta.total_pages);
  //       } catch(error: any) {
  //           setIsError(true)
  //           console.log("Error occured and caught")
  //       }
  //   }

  //   getData();
  // }, [paginationNumber]);

  const handleViewClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
        <span
          className={`px-2 py-1 text-xs font-medium border-gray-200 border ${statusColour[member.status] || "text-blue-500"} rounded-full`}
        >
          {member.status.toUpperCase()}
        </span>
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
