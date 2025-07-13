import { ModalLayout } from "@/components/ModalLayout";
// import { useToast } from "@/components/Toast/ToastProvider";
import { Edit, Trash } from "lucide-react";

interface NewMemberActionModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  memberInfo?: any;
}

export function NewMemberActionModal({
  isModalOpen,
  handleCloseModal,
}: NewMemberActionModalProps) {
  // const { showToast } = useToast();

  const status = "Active";

  return (
    <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-2xl font-bold">Tharshen A/L Surian Balan</h2>
        <div className="flex gap-x-2">
          <div className="border p-[5px] border-blue-600 bg-blue-600 rounded-md">
            <Edit size="16" />
          </div>
          <div className="border p-[5px] border-red-600 bg-red-600 rounded-md">
            <Trash size="16" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold">Status: {status}</h3>

      <h3 className="text-lg font-semibold mt-4 mb-1">Contact Information</h3>
      <div className="flex items-center justify-between border border-gray-700 py-3 px-4 rounded-md mb-2">
        <p>
          <span className="font-semibold">Email:</span>{" "}
          tharshensurianbalan@gmail.com
        </p>
      </div>
      <div className="flex items-center justify-between border border-gray-700 py-3 px-4 rounded-md">
        <p>
          <span className="font-semibold">Contact Number:</span> 0123123123
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-1 mt-4">Other Information</h3>
      <div className="flex flex-col gap-x-2 border border-gray-700 py-3 px-4 rounded-md max-h-36 lg:max-h-48 overflow-y-auto">
        <p>
          <span className="font-semibold">Active:</span>{" "}
        </p>

        <p>
          <span className="font-semibold">Register Date:</span>{" "}
        </p>

        <p>
          <span className="font-semibold">Comment:</span>{" "}
        </p>
      </div>
      <button
        onClick={handleCloseModal}
        className="dark:bg-white mt-5 hover:bg-white-600 dark:text-black bg-[#222] dark:hover:bg-[#e0e0e0] dark:active:bg-[#c7c7c7] text-white hover:bg-[#333] active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
      >
        Close
      </button>
    </ModalLayout>
  );
}
