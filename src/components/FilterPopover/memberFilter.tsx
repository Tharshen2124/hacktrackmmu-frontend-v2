import { useRef, useState } from "react";
import FilterPopover from ".";
import Selector from "./FilterComponent/selector";
import { MemberStatus, MemberStatusLabels } from "@/types/types";

const ALL_OPTION = "all";
const ALL_LABEL = "All";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "talks_desc", label: "Most Talks" },
];

interface MemberFilterProps {
  onStatusChange: (status: string[]) => void;
  onSortChange: (sortBy: string) => void;
  currentStatus: string;
  currentSortBy: string;
  availableStatuses?: MemberStatus[];
  defaultStatuses?: MemberStatus[];
  isOnboarding?: boolean;
}

export default function MemberFilter({
  onStatusChange,
  onSortChange,
  currentStatus,
  currentSortBy,
  availableStatuses = Object.values(MemberStatus), // Default: all statuses
  defaultStatuses = [MemberStatus.Active, MemberStatus.SociallyActive], // Default: active members
  isOnboarding = false,
}: MemberFilterProps) {
  const filterPopoverRef = useRef<{ closePopover: () => void }>(null);

  const selectorOptions = [
    { value: ALL_OPTION, label: ALL_LABEL },
    ...availableStatuses.map((status) => ({
      value: status,
      label: MemberStatusLabels[status],
    })),
  ];

  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentStatus === "all" ? ALL_OPTION : currentStatus,
  );
  const [selectedSort, setSelectedSort] = useState<string>(currentSortBy);

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
  };

  const handleApplyFilter = () => {
    const statusesToSend =
      selectedStatus === ALL_OPTION ? availableStatuses : [selectedStatus];

    onStatusChange(statusesToSend);
    onSortChange(selectedSort);
    filterPopoverRef.current?.closePopover();
  };

  const handleClear = () => {
    setSelectedStatus(ALL_OPTION);
    setSelectedSort("");
    onStatusChange(defaultStatuses);
    onSortChange("");
    filterPopoverRef.current?.closePopover();
  };

  return (
    <FilterPopover
      filterTitle="Member Filter"
      ref={filterPopoverRef}
      isOnboarding={isOnboarding}
    >
      <div className="space-y-3">
        <Selector
          label="Status"
          options={selectorOptions}
          value={selectedStatus}
          onChange={handleStatusSelect}
        />
        <Selector
          label="Sort By"
          options={SORT_OPTIONS}
          value={selectedSort}
          onChange={setSelectedSort}
        />
        <div className="buttons flex flex-row gap-2">
          <button
            onClick={handleApplyFilter}
            className="py-2 w-1/2 border border-gray-300 dark:border-blue-900 rounded-md bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
          >
            Filter
          </button>
          <button
            onClick={handleClear}
            className="py-2 w-1/2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            Clear
          </button>
        </div>
      </div>
    </FilterPopover>
  );
}
