import { useState } from "react";
import { OnboardingMemberModal } from "../OnboardingMemberModal";
// import { apiUrl } from "@/utils/env";
// import axios from "axios";
// import useAuthStore from "@/store/useAuthStore";

export default function OnboardingTableRow() {
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
      <td className="text-left pl-8 pr-2">John Doe</td>
      <td className="text-left py-4 px-4">+60106673148</td>
      <td className="text-left py-4 px-4">21/7/2025</td>
      <td className="text-left py-2 px-4">
        <div className="">
          <p className="border-2 border-white py-2 text-sm w-24 text-center rounded-md font-bold text-white">
            Active
          </p>
        </div>
      </td>
      <td className="text-left flex py-2 pl-2 pr-8 gap-x-2 flex-wrap w-[297px]">
        <button
          onClick={handleViewClick}
          className="w-[80px] text-black text-sm font-semibold bg-[#d9d9d9] py-2 px-3 rounded-full transition duration-200 hover:bg-gray-200 active:bg-gray-400"
        >
          View
        </button>
        <button className="w-[80px] text-white text-sm font-semibold bg-blue-800 py-2 px-3 rounded-full transition duration-200 hover:bg-blue-700 active:bg-gray-400">
          Edit
        </button>
        <button className="w-[80px] text-white text-sm font-semibold bg-red-800 py-2 px-3 rounded-full transition duration-200 hover:bg-red-700 active:bg-gray-400">
          Delete
        </button>
      </td>

      <OnboardingMemberModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
