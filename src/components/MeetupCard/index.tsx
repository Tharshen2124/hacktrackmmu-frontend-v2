import {
  Calendar,
  CircleAlert,
  Hammer,
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

interface MeetupCardProps {
  number: number;
  numberOfUpdates: number;
  date: string;
  hostName: string;
  updates: Update[];
  mutateMeetups?: () => void;
}

export default function MeetupCard({
  number,
  numberOfUpdates,
  date,
  hostName,
  updates,
  mutateMeetups,
}: MeetupCardProps) {
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const { token } = useAuthStore();

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR<Member>(
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

  const {
    data: meetupsData,
    error: meetupsError,
    isLoading: meetupsLoading,
  } = useSWR<Meetup[]>(
    token
      ? [`${apiUrl}/api/v1/meetups?category=regular_meetup&limit=20`, token]
      : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );

  const meetupsList = meetupsData?.data || meetupsData || [];

  const projectsList = projectsData?.data || projectsData || [];

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
      setSelectedCategory(update.category);
      setSelectedDescription(update.description);
    }
  };

  const handleCancelEditClick = () => {
    setEditingUpdateId(null);
    setSelectedMemberId(null);
    setSelectedProjectId(null);
    setSelectedMeetupId(null);
    setSelectedCategory("");
    setSelectedDescription("");
    setModalView("list");
  };

  const handleSaveClick = async () => {
    if (!findEditingUpdate) return;

    const payload = {
      update: {
        meetup_id: selectedMeetupId,
        project_id: selectedProjectId,
        member_id: selectedMemberId,
        category: selectedCategory,
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

      if (mutateMeetups) {
        mutateMeetups();
      }
      setEditingUpdateId(null);
      setSelectedMemberId(null);
      setSelectedProjectId(null);
      setSelectedMeetupId(null);
      setModalView("list");
    } catch (error) {
      console.error("Failed to save update:", error);
      alert("Failed to save update. Please check your inputs.");
    }
  };

  const handleDeleteClick = () => {
    if (confirm("Are you sure you want to delete this update?")) {
      // TODO: call delete endpoint
      console.log("Deleting update...");
    }
  };

  const findEditingUpdate = updates.find(
    (update) => update.id === editingUpdateId,
  );

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-[#222] rounded-lg p-4 border-2 dark:border border-neutral-300 dark:border-gray-600 hover:border-blue-600 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-blue-500/50 active:shadow-none transition duration-200 cursor-pointer"
      >
        <h1 className="text-lg flex items-center">
          <Calendar size="18" className="mr-2" />
          <span className="font-bold">Meetup {number}</span>
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
            <h2 className="text-2xl font-bold mb-4">Meetup {number}</h2>
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
                      <div className="flex gap-x-3 shrink-0 ml-4 mt-1">
                        <button onClick={() => handleEditClick(update.id)}>
                          <Edit
                            size="16"
                            className="text-blue-500 hover:text-blue-400"
                          />
                        </button>
                        <button onClick={handleDeleteClick}>
                          <Trash
                            size="16"
                            className="text-red-500 hover:text-red-400"
                          />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm flex items-center mt-1">
                      <strong>Category: </strong>
                      <Hammer size="14" className="mx-1" />
                      {update.category === "progress_talk"
                        ? "Progress Talk"
                        : "Idea Talk"}
                    </p>

                    <p className="text-sm flex mt-0.25">
                      <strong>
                        <span className="mr-1">By:</span>
                      </strong>
                      {update.member.name.length > 40
                        ? update.member.name.slice(0, 40) + "..."
                        : update.member.name}
                    </p>
                    <p className="text-sm mt-1">{update.description}</p>
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
                {/* Category Radio */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <label className="font-semibold text-sm">Category</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit-category"
                        value="idea_talk"
                        checked={selectedCategory === "idea_talk"}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="cursor-pointer accent-blue-500"
                      />
                      <span className="text-sm">Idea Talk</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit-category"
                        value="progress_talk"
                        checked={selectedCategory === "progress_talk"}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="cursor-pointer accent-blue-500"
                      />
                      <span className="text-sm">Progress Talk</span>
                    </label>
                  </div>
                </div>

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
                    {/* Loading State */}
                    {membersLoading && (
                      <option value={findEditingUpdate.member.id}>
                        Loading members...
                      </option>
                    )}

                    {/* Error State */}
                    {membersError && (
                      <option value={findEditingUpdate.member.id}>
                        Failed to load members
                      </option>
                    )}

                    {/* Success State: Loop over the data */}
                    {!membersLoading &&
                      !membersError &&
                      membersList.map((member: Member) => (
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
                                (m: Member) =>
                                  String(m.id) === String(selectedMemberId),
                              )?.name || findEditingUpdate.member.name
                            }
                            className="font-bold bg-black"
                          >
                            {projectsList.map((project: any) => (
                              <option
                                key={project.id}
                                value={project.id}
                                className="bg-black"
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
                    disabled={meetupsLoading || meetupsError}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
                    key={`meetup-select-${findEditingUpdate.id}-${meetupsLoading}`}
                  >
                    {/* Loading & Error States */}
                    {meetupsLoading && (
                      <option value="">Loading dates...</option>
                    )}
                    {meetupsError && (
                      <option value="">Failed to load dates</option>
                    )}

                    {!meetupsLoading &&
                      !meetupsError &&
                      meetupsList.length > 0 && (
                        <>
                          {/* Force selection if cleared */}
                          {selectedMeetupId === "" && (
                            <option value="" disabled>
                              Select a date...
                            </option>
                          )}

                          {meetupsList.map((meetup: Meetup) => {
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
