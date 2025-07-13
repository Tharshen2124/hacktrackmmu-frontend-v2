export default function SkeletonActionButton() {
  return (
    <button
      disabled
      className="border border-gray-500 rounded-lg py-5 flex flex-col items-center justify-center gap-2 transition duration-200 bg-gray-200 dark:bg-[#333] text-transparent cursor-default"
    >
      <div className="w-8 h-8 animate-pulse bg-gray-300 dark:bg-gray-600 rounded-md"></div>
      <span className="w-20 h-4 animate-pulse bg-gray-300 dark:bg-gray-600 rounded-md"></span>
    </button>
  );
}
