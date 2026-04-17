import { useState } from "react";
import useSWR from "swr";
import useAuthStore from "@/store/useAuthStore";
import { fetcherWithToken } from "@/utils/fetcher";
import { apiUrl } from "@/utils/env";
import { Update, Member, Project, Meetup } from "@/types/types";

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
          <select
            value={memberId || ""}
            onChange={(e) => {
              setMemberId(e.target.value);
              setProjectId(""); // Reset project when member changes
            }}
            disabled={membersLoading || membersError}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
          >
            {membersLoading && (
              <option value={memberId}>Loading members...</option>
            )}
            {membersError && (
              <option value={memberId}>Failed to load members</option>
            )}
            {!membersLoading &&
              !membersError &&
              membersList.map((m: Member) => (
                <option key={m.id} value={m.id} className="bg-black">
                  {m.name}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">For</label>
          <select
            value={projectId || ""}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={projectsLoading || projectsError || !memberId}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
          >
            {projectsLoading && <option>Loading projects...</option>}
            {projectsError && <option>Failed to load projects</option>}
            {!projectsLoading &&
              !projectsError &&
              projectsList.length === 0 && (
                <option disabled>No projects found for this member</option>
              )}
            {!projectsLoading && !projectsError && projectsList.length > 0 && (
              <>
                {/* Fallback injection if current project isn't fetched */}
                {String(memberId) ===
                  String(update.member?.id || update.member_id) &&
                  !projectsList.some(
                    (p: Project) =>
                      String(p.id) ===
                      String(update.project?.id || update.project_id),
                  ) && (
                    <option value={update.project?.id || update.project_id}>
                      {update.project?.name || "Unknown Project"}
                    </option>
                  )}
                <optgroup
                  label={
                    membersList.find(
                      (m: Member) => String(m.id) === String(memberId),
                    )?.name ||
                    update.member?.name ||
                    "Member"
                  }
                  className="font-bold bg-black"
                >
                  {projectsList.map((project: Project) => (
                    <option
                      key={project.id}
                      value={project.id}
                      className="bg-black font-normal"
                    >
                      {project.name}
                    </option>
                  ))}
                </optgroup>
              </>
            )}
          </select>
        </div>

        <div className="grid grid-cols-[100px_1fr] items-center">
          <label className="font-semibold text-sm">On</label>
          <select
            value={meetupId || ""}
            onChange={(e) => setMeetupId(e.target.value)}
            disabled={meetupsLoading || meetupsError}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
          >
            {meetupsLoading && <option value="">Loading dates...</option>}
            {meetupsError && <option value="">Failed to load dates</option>}
            {!meetupsLoading && !meetupsError && meetupsList.length > 0 && (
              <>
                {meetupId === "" && (
                  <option value="" disabled>
                    Select a date...
                  </option>
                )}
                {/* Fallback injection if current meetup isn't fetched */}
                {meetupId &&
                  !meetupsList.some(
                    (m: Meetup) => String(m.id) === String(meetupId),
                  ) && (
                    <option value={meetupId}>
                      Original Date (Hidden from recent)
                    </option>
                  )}
                {meetupsList.map((meetup: Meetup) => {
                  const dateString =
                    typeof meetup.date === "string"
                      ? meetup.date.split("T")[0]
                      : new Date(meetup.date).toISOString().split("T")[0];
                  return (
                    <option
                      key={meetup.id}
                      value={meetup.id}
                      className="bg-black"
                    >
                      {dateString}
                    </option>
                  );
                })}
              </>
            )}
          </select>
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
