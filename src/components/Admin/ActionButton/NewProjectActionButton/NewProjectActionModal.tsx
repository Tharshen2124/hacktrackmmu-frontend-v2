import { ModalLayout } from "@/components/ModalLayout";
import { useToast } from "@/components/Toast/ToastProvider";

interface NewProjectActionModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
}

export function NewProjectActionModal({
  isModalOpen,
  handleCloseModal,
}: NewProjectActionModalProps) {
  const { showToast } = useToast();

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    handleCloseModal()
  }

  return (
    <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-2xl font-bold">New Project</h2>
      </div>
      <form action="" className="flex flex-col gap-y-4" onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}>
        <div>
          <label htmlFor="" className="font-semibold">Name</label>
          <input type="text" className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="" className="font-semibold">Member</label>
          <input type="text" className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500" />
        </div>
        <div className="flex flex-col justify-center gap-x-2">
          <label htmlFor="" className="font-semibold">Category</label>
          <div className="flex items-center gap-x-1">
          <input type="radio" value="project" className="bg-333"/><label>Project</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input type="radio" value="group_project"/><label>Group Project</label>
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
