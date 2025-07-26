import { SubmitButton } from "@/components/atomComponents/SubmitButton";
import { ErrorImage } from "@/components/errorComponent";
import { ModalLayout } from "@/components/ModalLayout";
import { useToast } from "@/components/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { MultiSelectDropdown } from "@/components/atomComponents/Dropdown/MultiSelectDropdown";
import { useCreateUpdateData } from "../NewUpdateActionButton/NewUpdateActionModal";

interface NewProjectActionModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  mutateMembers: () => void;
}

export function NewProjectActionModal({
  isModalOpen,
  handleCloseModal,
  mutateMembers,
}: NewProjectActionModalProps) {
  const { showToast } = useToast();
  const { token } = useAuthStore();
  const { mutate: mutateCreateUpdate } = useCreateUpdateData();

  const [members, setMembers] = useState<any>();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [projectCategory, setProjectCategory] = useState<string>("project");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/dashboard/create_project`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setMembers(response.data.members);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setIsError(true);
        console.error("Error occured during fetch", error);
      }
    }

    getData();
  }, []);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if(projectName === "") {
      setIsSubmitting(false);
      showToast("Project Name is required.", "error")
      return
    }

    if(selectedMemberIds.length === 0) {
      setIsSubmitting(false);
      showToast("Select at least one member for the project", "error")
      return
    }

    try {
      await axios.post(
        `${apiUrl}/api/v1/projects`, 
        {
          project: {
            name: projectName,
            category: projectCategory,
            completed: isCompleted,
            member_ids: selectedMemberIds,
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
      await mutateMembers();
      await mutateCreateUpdate();
      handleCloseModal();
      showToast("Successfully added project!", "success");  
    } catch (error: any) {
      setIsSubmitting(false); // Fixed: was setting to true 
      console.log("Error caught in POST:", error)
      showToast("Error occured, project was not saved.", "error")
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
        <h2 className="text-2xl font-bold">New Project</h2>
      </div>
      <form
        action=""
        className="flex flex-col gap-y-4"
        onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <div>
          <label htmlFor="" className="font-semibold">
            Name
          </label>
          <input
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProjectName(e.target.value)
            }
            className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
          />
        </div>
        <div>
          <MultiSelectDropdown
            label="Members"
            id="members"
            name="members"
            placeholder="Search for a member..."
            options={members}
            selectedValues={selectedMemberIds}
            onChange={setSelectedMemberIds}
          />
        </div>
        <div className="flex flex-col justify-center gap-x-2">
          <label htmlFor="" className="font-semibold">
            Category
          </label>
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              onChange={() => setProjectCategory("project")}
              name="project_category"
              defaultChecked
              className="bg-333"
            />
            <label>Project</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              onChange={() => setProjectCategory("group_project")}
              name="project_category"
            />
            <label>Group Project</label>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="ms-2 font-medium text-gray-900 dark:text-gray-300">
            Is Project Completed?
          </label>
        </div>
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </ModalLayout>
  );
}
