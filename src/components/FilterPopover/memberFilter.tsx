import { useRef, useState } from "react";
import FilterPopover from ".";
import Selector from "./FilterComponent/selector";

enum MemberStatus {
  All = "All",
  Registered = "Registered",
  Contacted = "Contacted",
  IdeaTalked = "Idea Talked",
  NeverActive = "Never Active",
  Active = "Active",
  Inactive = "Inactive",
  Terminated = "Terminated",
}

const statusMapping = {
  [MemberStatus.All]: ["all"],
  [MemberStatus.Registered]: ["registered"],
  [MemberStatus.Contacted]: ["contacted"],
  [MemberStatus.IdeaTalked]: ["ideatalked"],
  [MemberStatus.NeverActive]: ["never_active"],
  [MemberStatus.Active]: ["active", "socially_active"],
  [MemberStatus.Inactive]: ["was_active", "was_socially_active"],
  [MemberStatus.Terminated]: ["terminated"],
};

const onboardingStatusMapping = {
  ...statusMapping,
  [MemberStatus.All]: ["registered", "contacted", "ideatalked"],
};

const reverseStatusMapping: { [key: string]: string } = {};
Object.entries(statusMapping).forEach(([displayValue, backendValues]) => {
  backendValues.forEach((backendValue) => {
    reverseStatusMapping[backendValue] = displayValue;
  });
});

const onboardingStatuses = [
  MemberStatus.Registered,
  MemberStatus.Contacted,
  MemberStatus.IdeaTalked,
];

interface MemberFilterProps {
  onStatusChange: (status: string[]) => void;
  currentStatus: string;
  isOnboarding?: boolean;
}

export default function MemberFilter({
  onStatusChange,
  currentStatus,
  isOnboarding = false,
}: MemberFilterProps) {
  const filterPopoverRef = useRef<{ closePopover: () => void }>(null);

  const availableStatuses = isOnboarding
    ? [MemberStatus.All, ...onboardingStatuses]
    : Object.values(MemberStatus);

  const currentStatusMapping = isOnboarding
    ? onboardingStatusMapping
    : statusMapping;

  const [selectedStatus, setSelectedStatus] = useState<string>(
    reverseStatusMapping[currentStatus] || MemberStatus.All,
  );

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
  };

  const handleApplyFilter = () => {
    const selectedStatusValue = selectedStatus as MemberStatus;
    const backendValue = currentStatusMapping[selectedStatusValue];
    onStatusChange(backendValue);
    filterPopoverRef.current?.closePopover();
  };

  const handleClear = () => {
    if (isOnboarding) {
      setSelectedStatus(MemberStatus.All);
      onStatusChange(["registered", "contacted", "ideatalked"]);
    } else {
      setSelectedStatus(MemberStatus.Active);
      onStatusChange(["active", "socially_active"]);
    }
    filterPopoverRef.current?.closePopover();
  };

  return (
    <FilterPopover
      filterTitle={"Member Filter"}
      ref={filterPopoverRef}
      isOnboarding={isOnboarding}
    >
      <div className="space-y-3">
        <Selector
          label="Status"
          selection={availableStatuses}
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
