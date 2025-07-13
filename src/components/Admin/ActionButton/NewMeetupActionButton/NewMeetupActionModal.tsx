// import { SearchableDropdown } from "@/components/atomComponents/Dropdown/SelectDropdown";
// import { SubmitButton } from "@/components/atomComponents/SubmitButton";
// import { ErrorImage } from "@/components/errorComponent";
// import { ModalLayout } from "@/components/ModalLayout";
// import { useToast } from "@/components/Toast/ToastProvider";
// import useAuthStore from "@/store/useAuthStore";
// import { apiUrl } from "@/utils/env";
// import axios from "axios";
// import { useEffect, useState } from "react";

// interface NewMeetupActionModalProps {
//   isModalOpen: boolean;
//   handleCloseModal: () => void;
// }

export function NewMeetupActionModal(
  // {
  //   isModalOpen,
  //   handleCloseModal,
  // }: NewMeetupActionModalProps
) {
//   const [isLoading, setIsLoading] = useState(true)
//   const [isError, setIsError] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
  
//   const { token } = useAuthStore();
//   const { showToast } = useToast();

//   // const [haveHosted, setHaveHosted] = useState<any>()
//   // const [yetToHost, setYetToHost] = useState<any>()
//   const [members, setMembers] = useState<any>()
//   const [meetupNumber, setMeetupNumber] = useState<number>(0)
//   const [date, setDate] = useState<string>(
//     new Date().toISOString().split("T")[0],
//   );  

//   const [category, setCategory] = useState<string>("regular_meetup");
//   const [selectedHostID, setSelectedHostID] = useState<string>("")

//   useEffect(() => {
//     async function getData() {
//       try {
//         const response = await axios.get(
//           `${apiUrl}/api/v1/dashboard/create_meetup`,
//           {
//             headers: {
//               Accept: "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );
//         // setHaveHosted(response.data.hosts.HaveHosted)
//         // setYetToHost(response.data.hosts.YetToHost)
//         setMembers(response.data.members);
//         setMeetupNumber(response.data.meetup_number.number)
//         setIsLoading(false);
//       } catch (error: any) {
//         setIsLoading(false);
//         setIsError(true);
//         console.error("Error occured during fetch", error);
//       }
//     }

//     getData();
//   }, []);

//   async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setIsSubmitting(true);

//     if(selectedHostID === "") {
//       setIsSubmitting(false);
//       showToast("Host field is required.", "error")
//       return
//     }

//     try {
//       await axios.post(
//         `${apiUrl}/api/v1/meetups`, 
//         {
//           meetup: {
//             "date": date,
//             "number": meetupNumber,
//             "host_id": selectedHostID,
//             "category": category,
//           }
//         },
//         {
//           headers: {
//             Accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setIsSubmitting(false);
//       handleCloseModal();
//       showToast("Successfully added meetup!", "success");  
//     } catch (error: any) {
//       setIsSubmitting(true);
//       console.log("Error caught in POST:", error)
//       showToast("Error occured, meetup was not saved.", "error")
//     }
// }

//   if (isLoading) {
//     return (
//       <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
//         <h1>Loading...</h1>
//       </ModalLayout>
//     );
//   }

//   if (isError) {
//     return (
//       <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
//         <ErrorImage />
//         <button
//           onClick={() => handleCloseModal()}
//           className="dark:bg-white text-black mt-5 hover:bg-gray-900 bg-blue-500 dark:hover:bg-blue-700 dark:active:bg-blue-800 active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
//         >
//           Close
//         </button>
//       </ModalLayout>
//     );
//   }

  return (
    // <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
    //   <div className="flex justify-between items-center  mb-4">
    //     <h2 className="text-2xl font-bold">New Meetup</h2>
    //   </div>
    //   {/* <div className="border border-gray-700 py-3 px-4 rounded-md mb-3">
    //     <h1 className="font-semibold">Potential Host</h1>
    //     {haveHosted && haveHosted.map(([name, number]: [string, number], index: number) => (
    //       <p key={index} className="text-sm">{name}</p>
    //     ))}
    //   </div> */}
    //   <form
    //     action=""
    //     className="flex flex-col gap-y-4"
    //     onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}
    //   >
    //     <div>
    //       <label htmlFor="" className="font-semibold">
    //         Number
    //       </label>
    //       <input
    //         type="number"
    //         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    //           setMeetupNumber(Number(e.target.value))
    //         }
    //         value={meetupNumber}
    //         className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="" className="font-semibold">
    //         Date
    //       </label>
    //       <input
    //         type="date"
    //         value={date}
    //         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    //           setDate(e.target.value)
    //         }
    //         className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
    //       />
    //     </div>
    //     <div>
    //       <SearchableDropdown
    //         label="Host"
    //         id="host"
    //         name="host"
    //         placeholder="Search for a host..."
    //         options={members}
    //         value={selectedHostID}
    //         onChange={setSelectedHostID}
    //       />
    //     </div>
    //     <div className="">
    //       <label htmlFor="" className="font-semibold">
    //         Category
    //       </label>
    //       <div className="flex gap-x-5">
    //         <div className="flex items-center gap-x-1">
    //           <input
    //             type="radio"
    //             defaultChecked
    //             name="category"
    //             onChange={() => setCategory("regular_meetup")}
    //             className="bg-333"
    //           />
    //           <label>Regular Meetup</label>
    //         </div>
    //         <div className="flex items-center gap-x-1">
    //           <input
    //             type="radio"
    //             name="category"
    //             onChange={() => setCategory("hackathon")}
    //           />
    //           <label>Hackathon</label>
    //         </div>
    //       </div> 
    //     </div>
    //     <SubmitButton isSubmitting={isSubmitting}/>
    //   </form>
    // </ModalLayout>
    <div>test</div>
  );
}
