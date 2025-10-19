import { LoaderCircle } from "lucide-react";

export function SubmitButton({
  isSubmitting,
  isLogin = false,
}: {
  isSubmitting: boolean;
  isLogin?: boolean;
}) {
  return (
    <button
      type="submit"
      className={`items-center rounded-full duration-200 transition active:bg-blue-800 hover:bg-blue-700 bg-blue-600 group relative w-full flex justify-center py-3 px-4 border border-transparent font-semibold text-white focus:ring-2 focus:ring-blue-300 ${
        isSubmitting
          ? "cursor-not-allowed bg-blue-400 hover:bg-blue-400 active:bg-blue-400 focus:ring-0"
          : ""
      }`}
    >
      {isSubmitting && <LoaderCircle className="animate-spin mr-2" size="20" />}
      {isLogin
        ? isSubmitting
          ? "Logging in..."
          : "Login"
        : isSubmitting
          ? "Submiting..."
          : "Submit"}
    </button>
  );
}
