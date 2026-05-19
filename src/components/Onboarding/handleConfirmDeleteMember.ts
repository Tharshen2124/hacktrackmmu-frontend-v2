import axios from "axios";
import { apiUrl } from "@/utils/env";
import { error as logError } from "@/utils/logger";

interface HandleConfirmDeleteMemberParams {
  memberId: number;
  token: string;
  mutateOnboarding: () => void;
  showToast: (message: string, type: "success" | "error") => void;
  handleCloseDeleteModal: () => void;
  setIsDeleting: (isDeleting: boolean) => void;
}

export const handleConfirmDeleteMember = async ({
  memberId,
  token,
  mutateOnboarding,
  showToast,
  handleCloseDeleteModal,
  setIsDeleting,
}: HandleConfirmDeleteMemberParams) => {
  setIsDeleting(true);
  try {
    await axios.delete(`${apiUrl}/api/v1/members/${memberId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    mutateOnboarding();
    showToast("Member deleted successfully", "success");
    handleCloseDeleteModal();
  } catch (error) {
    logError("Failed to delete member", error, {
      component: "handleConfirmDeleteMember",
      memberId,
    });
    showToast("Failed to delete member", "error");
  } finally {
    setIsDeleting(false);
  }
};
