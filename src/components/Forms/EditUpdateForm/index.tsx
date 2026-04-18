import { useState } from "react";
import useSWR from "swr";
import useAuthStore from "@/store/useAuthStore";
import { fetcherWithToken } from "@/utils/fetcher";
import { apiUrl } from "@/utils/env";
import { Update, Member, Project, Meetup } from "@/types/types";
import { SearchableDropdown } from "@/components/atomComponents/Dropdown/SelectDropdown";

export interface EditUpdateData {
  memberId: string | number;
  projectId: string | number;
  meetupId: string | number;
  category: string;
  description: string;
}

interface EditUpdateFormProps {
  update: Update;
  isSaving: boolean;
  showCategory?: boolean;
  meetupFetchUrl: string;
  onCancel: () => void;
  onSave: (data: EditUpdateData) => void;
}

export function EditUpdateForm({
  update,
  isSaving,
  showCategory = true,
  meetupFetchUrl,
  onCancel,
  onSave,
}: EditUpdateFormProps) {
  const { token } = useAuthStore();

  const [memberId, setMemberId] = useState<string | number>(
    update.member?.id || update.member_id,
  );
  const [projectId, setProjectId] = useState<string | number>(
    update.project?.id || update.project_id,
  );
  const [meetupId, setMeetupId] = useState<string | number>(update.meetup_id);
  const [description, setDescription] = useState<string>(update.description);

  const rawCategory = String(update.category);
  const [category, setCategory] = useState<string>(
    rawCategory === "1" || rawCategory === "progress_talk"
      ? "progress_talk"
      : "idea_talk",
  );

  // Fetch Members
  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR(
    token ? [`${apiUrl}/api/v1/members?unpaginated=true`, token] : null,
    ([url, token]) => fetcherWithToken(url, token),
  );
  const membersList = membersData?.data || membersData || [];

  // Fetch Projects (Dependent on selected memberId)
  const {
    data: projectsData,
    error: projectsError,
    isLoading: projectsLoading,
  } = useSWR(
    token && memberId
      ? [`${apiUrl}/api/v1/projects?member_id=${memberId}`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
  );
  const projectsList = projectsData?.data || projectsData || [];

  // Fetch Meetups (URL provided by parent)
  const {
    data: meetupsData,
    error: meetupsError,
    isLoading: meetupsLoading,
  } = useSWR(token ? [meetupFetchUrl, token] : null, ([url, token]) =>
    fetcherWithToken(url, token),
  );
  const meetupsList = meetupsData?.data || meetupsData || [];

  const handleSave = () => {
    onSave({ memberId, projectId, meetupId, category, description });
  };

  // 1. Convert Members to options
  const memberOptions = membersList.map((m: Member) => ({
    id: String(m.id),
    name: m.name,
  }));

  // 2. Convert Projects to options (handles optgroup fallback logic)
  const currentProjectInList = projectsList.some(
    (p: Project) =>
      String(p.id) === String(update.project?.id || update.project_id),
  );
  const injectFallbackProject =
    String(memberId) === String(update.member?.id || update.member_id) &&
    !currentProjectInList;

  const projectOptions = projectsList.map((p: Project) => ({
    id: String(p.id),
    name: p.name,
  }));

  if (injectFallbackProject) {
    projectOptions.unshift({
      id: String(update.project?.id || update.project_id),
      name: update.project?.name || "Unknown Project",
    });
  }

  const groupLabel =
    membersList.find((m: Member) => String(m.id) === String(memberId))?.name ||
    update.member?.name ||
    "Member";

  const projectGroups =
    projectOptions.length > 0
      ? [
          {
            label: groupLabel,
            options: projectOptions,
          },
        ]
      : [];

  // 3. Convert Meetups to options
  const meetupOptions = meetupsList.map((meetup: Meetup) => {
    const dateString =
      typeof meetup.date === "string"
        ? meetup.date.split("T")[0]
        : new Date(meetup.date).toISOString().split("T")[0];
    return {
      id: String(meetup.id),
      name: dateString, // Using 'name' ensures standard formatting
    };
  });

  const currentMeetupInList = meetupsList.some(
    (m: Meetup) => String(m.id) === String(meetupId),
  );

  if (meetupId && !currentMeetupInList) {
    meetupOptions.unshift({
      id: String(meetupId),
      name: "Original Date (Hidden from recent)",
    });
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Edit Update</h2>
      <div className="flex flex-col gap-5 mb-8">
        {showCategory && (
          <div className="grid grid-cols-[100px_1fr] items-center">
            <label className="font-semibold text-sm">Category</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`update-category-${update.id}`}
                  value="idea_talk"
                  checked={category === "idea_talk"}
                  onChange={(e) => setCategory(e.target.value)}
                  className="cursor-pointer accent-blue-500"
                />
                <span className="text-sm">Idea Talk</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`update-category-${update.id}`}
                  value="progress_talk"
                  checked={category === "progress_talk"}
                  onChange={(e) => setCategory(e.target.value)}
                  className="cursor-pointer accent-blue-500"
                />
                <span className="text-sm">Progress Talk</span>
              </label>
            </div>
          </div>
        )}

        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">By</label>
          <div className="w-full">
            <SearchableDropdown
              id={`update-member-${update.id}`}
              name="member"
              label=""
              placeholder={
                membersLoading
                  ? "Loading members..."
                  : membersError
                    ? "Failed to load members"
                    : "Search and select..."
              }
              options={memberOptions}
              value={String(memberId || "")}
              onChange={(val) => {
                setMemberId(val);
                setProjectId(""); // Reset project when member changes
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">For</label>
          <div className="w-full">
            <SearchableDropdown
              id={`update-project-${update.id}`}
              name="project"
              label=""
              placeholder={
                projectsLoading
                  ? "Loading projects..."
                  : projectsError
                    ? "Failed to load projects"
                    : projectGroups.length === 0
                      ? "No projects found for this member"
                      : "Search and select..."
              }
              groups={projectGroups}
              options={projectOptions}
              value={String(projectId || "")}
              onChange={(val) => setProjectId(val)}
            />
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">On</label>
          <div className="w-full">
            <SearchableDropdown
              id={`update-meetup-${update.id}`}
              name="meetup"
              label=""
              placeholder={
                meetupsLoading
                  ? "Loading dates..."
                  : meetupsError
                    ? "Failed to load dates"
                    : "Search and select..."
              }
              options={meetupOptions}
              value={String(meetupId || "")}
              onChange={(val) => setMeetupId(val)}
            />
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-start">
          <label className="font-semibold text-sm pt-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full h-32 resize-y"
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
          disabled={isSaving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}
