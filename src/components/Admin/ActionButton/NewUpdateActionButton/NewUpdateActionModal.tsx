import { SearchableDropdown } from "@/components/atomComponents/Dropdown/SelectDropdown";
import { SubmitButton } from "@/components/atomComponents/SubmitButton";
import { ErrorImage } from "@/components/errorComponent";
import { ModalLayout } from "@/components/ModalLayout";
import { useToast } from "@/components/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import { fetcherWithToken } from "@/utils/fetcher"; // Assuming you have this utility
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface NewUpdateActionModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

type Category = "idea_talk" | "progress_talk";

export function useCreateUpdateData() {
  const { token } = useAuthStore();
  
  return useSWR(
    token ? [`${apiUrl}/api/v1/dashboard/create_update`, token] : null,
    ([url, token]) => fetcherWithToken(url, token)
  );
}

export function NewUpdateActionModal({
  isModalOpen,
  handleCloseModal,
}: NewUpdateActionModalProps) {
  const { showToast } = useToast();
  const { token } = useAuthStore();

  // Use the custom hook
  const {
    data: createUpdateData,
    error,
    isLoading,
  } = useCreateUpdateData();

  const [projects, setProjects] = useState<any>();
  const [category, setCategory] = useState<Category>("idea_talk");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMemberID, setSelectedMemberID] = useState<string>("")
  const [selectedProjectID, setSelectedProjectID] = useState<string>("")
  const [selectedMeetupID, setSelectedMeetupID] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  // Extract members and dates from SWR data
  const members = createUpdateData?.members;
  const dates = createUpdateData?.dates;
  const isError = !!error;

  // Update projects when selectedMemberID changes
  useEffect(() => {
    if (selectedMemberID !== "" && members) {
      const member = members.find((m: any) => m.id === selectedMemberID)
      setProjects(member?.projects || [])
    }
  }, [selectedMemberID, members])

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedMemberID("");
      setSelectedProjectID("");
      setSelectedMeetupID("");
      setDescription("");
      setCategory("idea_talk");
      setProjects(undefined);
    }
  }, [isModalOpen]);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if(selectedMemberID === "") {
      setIsSubmitting(false);
      showToast("Host field is required.", "error")
      return
    }

    if(selectedProjectID === "") {
      setIsSubmitting(false);
      showToast("Project field is required.", "error")
      return
    }

    if(selectedMeetupID === "") {
      setIsSubmitting(false);
      showToast("Date field is required.", "error")
      return
    }

    if(description === "") {
      setIsSubmitting(false);
      showToast("Description field is required.", "error")
      return
    }

    try {
      await axios.post(
        `${apiUrl}/api/v1/updates`, 
        {
          update: {
            "meetup_id": selectedMeetupID,
            "project_id": selectedProjectID,
            "member_id": selectedMemberID,
            "category": category,
            "description": description,
          }
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsSubmitting(false);
      handleCloseModal();
      showToast("Successfully added updates!", "success");  
    } catch (error: any) {
      setIsSubmitting(false); // Fixed: was setting to true
      console.log("Error caught in POST:", error)
      showToast("Error occured, update was not saved.", "error")
    }
  }

  if (isLoading) {
    return (
      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1>Loading...</h1>
      </ModalLayout>
    );
  }

  if (isError) {
    return (
      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        <ErrorImage />
        <button
          onClick={() => handleCloseModal()}
          className="dark:bg-white text-black mt-5 hover:bg-gray-900 bg-blue-500 dark:hover:bg-blue-700 dark:active:bg-blue-800 active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
        >
          Close
        </button>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-2xl font-bold">New Update</h2>
      </div>
      <form
        action=""
        className="flex flex-col gap-y-4"
        onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <div className="flex flex-col justify-center gap-x-2">
          <label htmlFor="" className="font-semibold">
            Category
          </label>
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              name="group_project"
              className="bg-333"
              defaultChecked
              onChange={() => setCategory("idea_talk")}
            />
            <label>Idea Talk</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              name="group_project"
              onChange={() => setCategory("progress_talk")}
            />
            <label>Progress Talk</label>
          </div>
        </div>
        <div>
          <SearchableDropdown
            label="Member"
            id="member"
            name="member"
            placeholder="Search for a member..."
            options={members || []}
            value={selectedMemberID}
            onChange={setSelectedMemberID}
          />
        </div>
        <div>
          <SearchableDropdown
            label="Project"
            id="project"
            name="project"
            placeholder="Search for a project..."
            options={projects || []}
            value={selectedProjectID}
            onChange={setSelectedProjectID}
          />
        </div>
        <div>
          <SearchableDropdown
            label="Date"
            id="date"
            name="date"
            placeholder="Search for a meetup date..."
            options={dates || []}
            value={selectedMeetupID}
            onChange={setSelectedMeetupID}
            displayKey={"date"}
          />
        </div>
        <div>
          <label htmlFor="" className="font-semibold">
            Update Description
          </label>
          <textarea
            className="mt-1 flex w-full h-40 dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>

        <SubmitButton isSubmitting={isSubmitting}/>
      </form>
    </ModalLayout>
  );
}