import { Filter, ListFilter } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ReactNode } from "react";

interface FilterPopoverHandle {
  closePopover: () => void;
}

type FilterPopoverProps = {
  children?: ReactNode;
  filterTitle?: string;
  isOnboarding?: boolean;
};

const FilterPopover = forwardRef<FilterPopoverHandle, FilterPopoverProps>(
  ({ children, filterTitle, isOnboarding }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      closePopover: () => setIsOpen(false),
    }));

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    useEffect(() => {
      function handleEscape(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen]);

    return (
      <div className="relative items-end flex flex-col" ref={popoverRef}>
        {isOnboarding && (
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="border rounded-md p-[5px] bg-gray-900 border-gray-700 hover:bg-gray-800 active:border-gray-600 active:outline active:outline-1 active:outline-gray-600 transition duration-100"
          >
            <Filter size="20" />
          </div>
        )}
        {!isOnboarding && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-black bg-white border border-gray-300 rounded-3xl hover:bg-gray-200 active:bg-gray-400"
          >
            <ListFilter />
            <p className=" hidden sm:block">Filter</p>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""} hidden sm:block`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-black">
                {filterTitle || "Filter Options"}
              </h3>
              <div className="space-y-3">{children}</div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

FilterPopover.displayName = "FilterPopover";

export default FilterPopover;
