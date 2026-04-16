import {
  Laptop,
  CircleAlert,
  RefreshCcw,
  Timer,
  User,
  Trash,
  Edit,
} from "lucide-react";
import { useState } from "react";
import { dateMod } from "@/utils/dateMod";
import { ModalLayout } from "../ModalLayout";
import { Update, Project, Meetup } from "@/types/types";
import { apiUrl } from "@/utils/env";
import useSWR from "swr";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import { fetcherWithToken } from "@/utils/fetcher";
import { useToast } from "@/components/Toast/ToastProvider";

interface HackathonCardProps {
  number: number;
  numberOfUpdates: number;
  date: string;
  hostName: string;
  updates: Update[];
  mutateHackathons?: () => void;
}

export default function HackathonCard({
  number,
  numberOfUpdates,
  date,
  hostName,
  updates,
  mutateHackathons,
}: HackathonCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<"list" | "edit">("list");
  const [editingUpdateId, setEditingUpdateId] = useState<
    string | number | null
  >(null);
  const [selectedMemberId, setSelectedMemberId] = useState<
    string | number | null
  >(null);
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | number | null
  >(null);
  const [selectedMeetupId, setSelectedMeetupId] = useState<
    string | number | null
  >(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");

  const { token, isAdmin } = useAuthStore();
  const { showToast } = useToast();

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR(
    token ? [`${apiUrl}/api/v1/members?unpaginated=true`, token] : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );
  const membersList = membersData?.data || membersData || [];

  const {
    data: projectsData,
    error: projectsError,
    isLoading: projectsLoading,
  } = useSWR(
    token && selectedMemberId
      ? [`${apiUrl}/api/v1/projects?member_id=${selectedMemberId}`, token]
      : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );
  const projectsList = projectsData?.data || projectsData || [];

  // Fetch only hackathons for the date dropdown
  const {
    data: hackathonsData,
    error: hackathonsError,
    isLoading: hackathonsLoading,
  } = useSWR<Meetup[]>(
    token
      ? [`${apiUrl}/api/v1/meetups?category=hackathon&limit=20`, token]
      : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );
  const hackathonsList = hackathonsData?.data || hackathonsData || [];

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setTimeout(() => {
      setModalView("list");
      setEditingUpdateId(null);
    }, 3000);
  };

  const handleEditClick = (updateId: string | number) => {
    const update = updates.find((u) => u.id === updateId);

    setEditingUpdateId(updateId);
    setModalView("edit");

    if (update) {
      setSelectedMemberId(update.member.id);
      setSelectedProjectId(update.project.id);
      setSelectedMeetupId(update.meetup_id);
      setSelectedDescription(update.description);
    }
  };

  const handleCancelEditClick = () => {
    setEditingUpdateId(null);
    setSelectedMemberId(null);
    setSelectedProjectId(null);
    setSelectedMeetupId(null);
    setSelectedDescription("");
    setModalView("list");
  };

  const handleSaveClick = async () => {
    const findEditingUpdate = updates.find((u) => u.id === editingUpdateId);
    if (!findEditingUpdate) return;

    // Category is omitted from the payload for Hackathons
    const payload = {
      update: {
        meetup_id: selectedMeetupId,
        project_id: selectedProjectId,
        member_id: selectedMemberId,
        description: selectedDescription,
      },
    };

    try {
      await axios.patch(
        `${apiUrl}/api/v1/updates/${findEditingUpdate.id}`,
        payload,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (mutateHackathons) {
        await mutateHackathons();
      }
      showToast("Update edited successfully!", "success");

      setEditingUpdateId(null);
      setSelectedMemberId(null);
      setSelectedProjectId(null);
      setSelectedMeetupId(null);
      setModalView("list");
    } catch (error) {
      showToast("Unable to edit update. Please try again.", "error");
    }
  };

  const handleDeleteClick = async (updateId: string | number) => {
    if (confirm("Are you sure you want to delete this update?")) {
      try {
        await axios.delete(`${apiUrl}/api/v1/updates/${updateId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (mutateHackathons) {
          await mutateHackathons();
        }

        setEditingUpdateId(null);
        setSelectedMemberId(null);
        setSelectedProjectId(null);
        setSelectedMeetupId(null);
        setModalView("list");
        showToast("Update deleted successfully", "success");
      } catch (error) {
        showToast("Unable to delete update. Please try again.", "error");
      }
    }
  };

  const findEditingUpdate = updates.find(
    (update) => update.id === editingUpdateId,
  );

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-[#222] rounded-lg p-4 border-2 dark:border border-neutral-300 dark:border-gray-600 hover:border-red-600 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-red-500/50 active:shadow-none transition duration-200 cursor-pointer"
      >
        <h1 className="text-lg flex items-center">
          <Laptop size="18" className="mr-2" />
          <span className="font-bold">Hackathon {number}</span>
        </h1>
        <hr className="border-gray-600 mb-2 mt-1" />
        <p className="flex items-center">
          <User size="16" className="mr-2" />
          Host: {hostName}
        </p>
        <p className="flex items-center">
          <Timer size="16" className="mr-2" />
          Date: {dateMod(date)}
        </p>
        <p className="flex items-center">
          <RefreshCcw size="16" className="mr-2" />
          {numberOfUpdates} Updates
        </p>
      </div>

      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalView === "list" ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Hackathon {number}</h2>
            <h3 className="text-lg font-semibold mb-1">Details</h3>
            <div className="border border-gray-700 py-3 px-4 rounded-md mb-3">
              <p>
                <strong>Host:</strong> {hostName}
              </p>
              <p>
                <strong>Date:</strong> {dateMod(date)}
              </p>
              <p>{numberOfUpdates} updates</p>
            </div>

            <h3 className="text-lg font-semibold mb-1">Updates</h3>
            <div className="overflow-y-auto border flex flex-col gap-y-4 px-4 py-3 mb-8 max-h-56 lg:max-h-96 rounded-md border-gray-700">
              {updates.length !== 0 ? (
                updates.map((update, index: number) => (
                  <div
                    key={update.id || index}
                    className="border-b border-gray-700 pb-4 last:border-0 last:mb-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold">
                        {update.project.name.length > 40
                          ? update.project.name.slice(0, 40) + "..."
                          : update.project.name}
                      </p>

                      {/* ACTION BUTTONS */}
                      {isAdmin && (
                        <div className="flex gap-x-3 shrink-0 ml-4 mt-1">
                          <button onClick={() => handleEditClick(update.id)}>
                            <Edit
                              size="16"
                              className="text-blue-500 hover:text-blue-400"
                            />
                          </button>
                          <button onClick={() => handleDeleteClick(update.id)}>
                            <Trash
                              size="16"
                              className="text-red-500 hover:text-red-400"
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-sm flex mt-1">
                      <strong>
                        <span className="mr-1">By:</span>
                      </strong>
                      {update.member.name.length > 40
                        ? update.member.name.slice(0, 40) + "..."
                        : update.member.name}
                    </p>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {update.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-red-500 dark:text-red-400 flex items-center gap-x-2">
                  <CircleAlert size="18" />
                  No updates
                </p>
              )}
            </div>

            <button
              onClick={handleCloseModal}
              className="dark:bg-white hover:bg-white-600 dark:text-black bg-[#222] dark:hover:bg-[#e0e0e0] dark:active:bg-[#c7c7c7] text-white hover:bg-[#333] active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Edit Update</h2>

            {findEditingUpdate && (
              <div className="flex flex-col gap-5 mb-8">
                {/* By (Member Dropdown) */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <label className="font-semibold text-sm">By</label>

                  <select
                    name="edit-member-id"
                    defaultValue={findEditingUpdate.member.id}
                    value={selectedMemberId || ""}
                    onChange={(e) => {
                      setSelectedMemberId(e.target.value);
                      setSelectedProjectId("");
                    }}
                    disabled={membersLoading || membersError}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
                    key={`member-select-${findEditingUpdate.id}-${membersLoading}`}
                  >
                    {membersLoading && (
                      <option value={findEditingUpdate.member.id}>
                        Loading members...
                      </option>
                    )}

                    {membersError && (
                      <option value={findEditingUpdate.member.id}>
                        Failed to load members
                      </option>
                    )}

                    {!membersLoading &&
                      !membersError &&
                      membersList.map((member: any) => (
                        <option
                          key={member.id}
                          value={member.id}
                          className="bg-black"
                        >
                          {member.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* For (Project Dropdown) */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <label className="font-semibold text-sm">For</label>

                  <select
                    name="edit-project-id"
                    defaultValue={findEditingUpdate.project.id}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    disabled={
                      projectsLoading || projectsError || !selectedMemberId
                    }
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
                    key={`project-select-${findEditingUpdate.id}-${projectsLoading}-${selectedMemberId}`}
                  >
                    {projectsLoading && <option>Loading projects...</option>}
                    {projectsError && <option>Failed to load projects</option>}

                    {!projectsLoading &&
                      !projectsError &&
                      projectsList.length === 0 && (
                        <option disabled>
                          No projects found for this member
                        </option>
                      )}

                    {!projectsLoading &&
                      !projectsError &&
                      projectsList.length > 0 && (
                        <>
                          {selectedMemberId === findEditingUpdate.member.id &&
                            !projectsList.some(
                              (p: Project) =>
                                p.id === findEditingUpdate.project.id,
                            ) && (
                              <option value={findEditingUpdate.project.id}>
                                {findEditingUpdate.project.name}
                              </option>
                            )}

                          <optgroup
                            label={
                              membersList.find(
                                (m: any) =>
                                  String(m.id) === String(selectedMemberId),
                              )?.name || findEditingUpdate.member.name
                            }
                            className="font-bold bg-black"
                          >
                            {projectsList.map((project: any) => (
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

                {/* On (Date) */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <label className="font-semibold text-sm">On</label>

                  <select
                    name="edit-meetup-id"
                    value={selectedMeetupId || ""}
                    onChange={(e) => setSelectedMeetupId(e.target.value)}
                    disabled={hackathonsLoading || hackathonsError}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
                    key={`meetup-select-${findEditingUpdate.id}-${hackathonsLoading}`}
                  >
                    {hackathonsLoading && (
                      <option value="">Loading dates...</option>
                    )}
                    {hackathonsError && (
                      <option value="">Failed to load dates</option>
                    )}

                    {!hackathonsLoading &&
                      !hackathonsError &&
                      hackathonsList.length > 0 && (
                        <>
                          {selectedMeetupId === "" && (
                            <option value="" disabled>
                              Select a date...
                            </option>
                          )}

                          {/* Fallback injection if current hackathon isn't in top 20 */}
                          {selectedMeetupId &&
                            !hackathonsList.some(
                              (m: Meetup) =>
                                String(m.id) === String(selectedMeetupId),
                            ) && (
                              <option value={selectedMeetupId}>
                                {dateMod(date)}
                              </option>
                            )}

                          {hackathonsList.map((meetup: Meetup) => {
                            const dateString =
                              typeof meetup.date === "string"
                                ? meetup.date.split("T")[0]
                                : new Date(meetup.date)
                                    .toISOString()
                                    .split("T")[0];

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

                {/* Description */}
                <div className="grid grid-cols-[100px_1fr] items-start">
                  <label className="font-semibold text-sm pt-2">
                    Description
                  </label>
                  <textarea
                    value={selectedDescription}
                    onChange={(e) => setSelectedDescription(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full h-32 resize-y"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleCancelEditClick}
                className="flex-1 border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333] font-bold py-2 px-4 rounded transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Save
              </button>
            </div>
          </>
        )}
      </ModalLayout>
    </>
  );
}
