import { useState, useEffect } from "react";
import useSWR from "swr";
import useAuthStore from "@/store/useAuthStore";
import { fetcherWithToken } from "@/utils/fetcher";
import { apiUrl } from "@/utils/env";
import { SearchableDropdown } from "@/components/atomComponents/Dropdown/SelectDropdown";
import { Member } from "@/types/types";

export interface EditMeetupData {
  number: number;
  hostId: string;
  date: string;
}

interface EditMeetupFormProps {
  type: "Meetup" | "Hackathon";
  initialNumber: number;
  initialHost: string;
  initialDate: string;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (data: EditMeetupData) => void;
}

export function EditMeetupForm({
  type,
  initialNumber,
  initialHost,
  initialDate,
  isSaving,
  onCancel,
  onSave,
}: EditMeetupFormProps) {
  const { token } = useAuthStore();

  const [number, setNumber] = useState(initialNumber);
  const [hostId, setHostId] = useState<string>(""); // Starts empty until we find the ID

  // Extract YYYY-MM-DD for the HTML date input
  const formattedDate = initialDate
    ? new Date(initialDate).toISOString().split("T")[0]
    : "";
  const [date, setDate] = useState(formattedDate);

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR(
    token && token !== "0"
      ? [`${apiUrl}/api/v1/members?unpaginated=true`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  const membersList = membersData?.data || membersData || [];

  useEffect(() => {
    if (membersList.length > 0 && hostId === "") {
      const matchedMember = membersList.find(
        (m: Member) => m.name === initialHost,
      );
      if (matchedMember) {
        setHostId(String(matchedMember.id));
      } else {
        // Fallback if the original host was deleted or not found
        setHostId("0");
      }
    }
  }, [membersList, initialHost, hostId]);

  // Map members to dropdown options
  const memberOptions = membersList.map((m: Member) => ({
    id: String(m.id),
    name: m.name,
  }));

  const currentHostInList = memberOptions.some(
    (m: { id: string; name: string }) => m.id === hostId,
  );
  if (hostId && hostId !== "0" && !currentHostInList) {
    memberOptions.unshift({
      id: hostId,
      name: `${initialHost} (Original)`,
    });
  }

  const handleSave = () => {
    onSave({ number, hostId, date });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Edit {type}</h2>
      <div className="flex flex-col gap-5 mb-8">
        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">Number</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full"
            placeholder={`${type} number...`}
          />
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">Host</label>
          <div className="w-full">
            <SearchableDropdown
              id={`meetup-host-${type}`}
              name="host"
              label=""
              placeholder={
                membersLoading || hostId === ""
                  ? "Loading host data..."
                  : membersError
                    ? "Failed to load members"
                    : "Search and select host..."
              }
              options={memberOptions}
              value={hostId}
              onChange={(val) => setHostId(val)}
            />
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-auto">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333] font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !hostId || hostId === "0" || !date}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
