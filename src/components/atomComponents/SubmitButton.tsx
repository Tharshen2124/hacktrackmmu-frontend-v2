import { LoaderCircle } from "lucide-react";

export function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      className={`items-center rounded-md duration-200 transition active:bg-[#d9d9d9] hover:bg-[#e0e0e0] bg-white group relative w-full flex justify-center py-2 px-4 border border-transparent font-semibold dark:text-black focus:ring-2 focus:ring-blue-300 ${
        isSubmitting
          ? "cursor-not-allowed bg-blue-400 hover:bg-blue-400 active:bg-blue-400 focus:ring-0"
          : ""
      }`}
    >
      {isSubmitting && <LoaderCircle className="animate-spin mr-2" size="20" />}
      {isSubmitting ? "Logging in..." : "Login"}
    </button>
  );
}
