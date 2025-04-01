// import axios from "axios";
import { NewMeetupActionButton } from "../ActionButton/NewMeetupActionButton";
import { NewProjectActionButton } from "../ActionButton/NewProjectActionButton";
import { NewUpdateActionButton } from "../ActionButton/NewUpdateActionButton";
// import { useState } from "react";
// import { apiUrl } from "@/utils/env";
// import { ErrorPage } from "@/components/errorComponent";

interface ControlPanelProps {
  members: any;
  meetups: any;
  token: string;
}

export default function ControlPanel({
  members,
  meetups,
  // token,
}: ControlPanelProps) {
  const recentMeetupNumber: number = meetups[0].number;
  // const [fetchedMembers, setFetchedMembers] = useState<any>();
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   async function getData() {
  //     try {
  //       const response = await axios.get(`${apiUrl}/api/v1/all-members`, {
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       setFetchedMembers(response.data);
  //     } catch (error: any) {
  //       setError(true);
  //       console.error("Error caught during fetch:", error)
  //     }
  //   }

  //   getData();
  // }, []);

  // console.log("members", fetchedMembers);

  // if(error) {
  //   return <ErrorPage />
  // }

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
        <NewProjectActionButton members={members} />
        <NewUpdateActionButton />
      </div>
    </>
  );
}
