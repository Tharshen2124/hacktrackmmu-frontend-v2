import { ModalLayout } from "@/components/ModalLayout";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  return (
    <ModalLayout isOpen={isOpen} onClose={onClose}>
      <div>
        <h3 className="text-lg font-semibold mb-4">Delete Member</h3>
        <p className="text-sm">
          Are you sure you want to delete this member&apos;s data?{" "}
        </p>
        <p className="text-red-500 dark:text-red-400 font-semibold">
          Doing so cannot be reversed!
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md border border-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-md bg-red-700 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
