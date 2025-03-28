import { SearchableDropdown } from "@/components/Dropdown";
import { ModalLayout } from "@/components/ModalLayout";
import { useToast } from "@/components/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { useState } from "react";

interface NewMeetupActionModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  members: any
  recentMeetupNumber: number
}

export function NewMeetupActionModal({
  isModalOpen,
  handleCloseModal,
  members,
  recentMeetupNumber
}: NewMeetupActionModalProps) {
  const { token } = useAuthStore()
  const [selectedHost, setSelectedHost] = useState<string>("")
  const [number, setNumber] = useState<number>(recentMeetupNumber+1)
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState<string>("regular_meetup")
  const { showToast } = useToast();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await axios.post(
        `${apiUrl}/api/v1/meetups`, 
        {
          meetup: {
						"date": date,
						"number": number,
						"host_id": 1,
						"category": category
					}
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      )

    } catch (error: any) {
      if(error?.message) {
        showToast(error.message, "error")
      }
      console.error("error", error)
    }
 
    handleCloseModal()
  }

  return (
    <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal} >
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-2xl font-bold">New Meetup</h2>
      </div>
      <form action="" className="flex flex-col gap-y-4" onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}>
        <div>
          <label htmlFor="" className="font-semibold">Number</label>
          <input type="number" value={number} onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setNumber(Number(e.target.value)))} className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="" className="font-semibold">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} 
            className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
          />
        </div>
        <div>
          <SearchableDropdown
            label="Host"
            id="host"
            name="host"
            placeholder="Search for a host..."
            options={members}
            value={selectedHost}
            onChange={setSelectedHost}
          />
        </div>
        <div className="flex flex-col justify-center gap-x-2">
          <label htmlFor="" className="font-semibold">Category</label>
          <div className="flex items-center gap-x-1">
          <input type="radio" defaultChecked name="category" onChange={() => setCategory('regular_meetup')} className="bg-333"/><label>Regular Meetup</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input type="radio"  name="category" onChange={() => setCategory('hackathon')} /><label>Hackathon</label>
          </div>
        </div>
        <input
          type="submit"
          value="Submit"
          className="dark:bg-white text-black mt-5 hover:bg-gray-900 bg-blue-500 dark:hover:bg-blue-700 dark:active:bg-blue-800 active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
        />
      </form>
    </ModalLayout>
  );
}
