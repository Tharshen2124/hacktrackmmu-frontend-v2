import axios, { AxiosError } from "axios";
import { NewMeetupActionButton } from "../ActionButton/NewMeetupActionButton";
import { NewProjectActionButton } from "../ActionButton/NewProjectActionButton";
import { NewUpdateActionButton } from "../ActionButton/NewUpdateActionButton";
import { useEffect, useState } from "react";
import { apiUrl } from "@/utils/env";

interface ControlPanelProps {
  members: any
  meetups: any
  token: string
}

export default function ControlPanel({ members, meetups, token }: ControlPanelProps) {
  const recentMeetupNumber: number = meetups[0].number
  const [fetchedMembers, setFetchedMembers] = useState<any>()
  const [error, setError] = useState(false)

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/all-members`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        setFetchedMembers(response.data)
      
      } catch(error: any) {
        setError(true)
      }
    }

    getData()
  }, [])

  console.log('members', fetchedMembers)

  return (
    <>
      <div className="flex items-center mt-10">
        <h2 className="text-3xl font-semibold mb-2">Control Panel</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <NewMemberActionButton /> */}
        <NewMeetupActionButton 
          members={members}
          recentMeetupNumber={recentMeetupNumber}
        />
        <NewProjectActionButton 
          members={members}
        />
        <NewUpdateActionButton />
      </div>
    </>
  );
}
