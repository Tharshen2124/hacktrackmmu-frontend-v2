import { useRef, useState } from "react";
import FilterPopover from ".";
import Selector from "./FilterComponent/selector";
import { MemberStatus, MemberStatusLabels } from "@/types/types";

const ALL_OPTION = "all";
const ALL_LABEL = "All";

interface MemberFilterProps {
  onStatusChange: (status: string[]) => void;
  currentStatus: string;
  availableStatuses?: MemberStatus[]
  defaultStatuses?: MemberStatus[]
}

export default function MemberFilter({
  onStatusChange,
  currentStatus,
  availableStatuses = Object.values(MemberStatus), // Default: all statuses
  defaultStatuses = [MemberStatus.Active, MemberStatus.SociallyActive], // Default: active members
}: MemberFilterProps) {
  const filterPopoverRef = useRef<{ closePopover: () => void }>(null);
  const isOnboarding = availableStatuses.length < Object.values(MemberStatus).length;

  const selectorOptions = [
    { value: ALL_OPTION, label: ALL_LABEL },
    ...availableStatuses.map((status) => ({
      value: status,
      label: MemberStatusLabels[status],
    })),
  ];

  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentStatus === "all" ? ALL_OPTION : currentStatus
  );

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
  };

  const handleApplyFilter = () => {
    const statusesToSend =
      selectedStatus === ALL_OPTION
        ? availableStatuses
        : [selectedStatus];

    onStatusChange(statusesToSend);
    filterPopoverRef.current?.closePopover();
  };

  const handleClear = () => {
    setSelectedStatus(ALL_OPTION);
    onStatusChange(defaultStatuses);
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
        <div className="buttons flex flex-row gap-2">
          <button
            onClick={handleApplyFilter}
            className="py-2 w-1/2 border border-gray-300 rounded-md bg-blue-500 hover:bg-blue-400 text-white"
          >
            Filter
          </button>
          <button
            onClick={handleClear}
            className="py-2 w-1/2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
    </FilterPopover>
  );
}