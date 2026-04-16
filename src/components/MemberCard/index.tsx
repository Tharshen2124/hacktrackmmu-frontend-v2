import {
  CheckCircle,
  CircleAlert,
  FolderCheck,
  FolderCode,
  Hammer,
  Lightbulb,
  PenLine,
  Speech,
  User,
  Edit,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { ModalLayout } from "../ModalLayout";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import dayjs from "dayjs";
import { Member, Project, Update, Meetup } from "@/types/types";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import useSWR from "swr";
import { fetcherWithToken } from "@/utils/fetcher";
import { useToast } from "@/components/Toast/ToastProvider";

interface MemberCardProps extends Member {
  mutateMembers?: () => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function MemberCard({
  id,
  name,
  projects,
  status,
  mutateMembers,
}: MemberCardProps) {
  const { token, isAdmin } = useAuthStore();
  const { showToast } = useToast();

  const numberOfCompletedProjects = projects.filter(
    (project) => project.completed,
  ).length;
  const numberOfUpdates = projects.reduce(
    (acc, project) => acc + project.updates.length,
    0,
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalView, setModalView] = useState<
    "list" | "edit-project" | "edit-update"
  >("list");

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const [editingProjectId, setEditingProjectId] = useState<
    string | number | null
  >(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectCompleted, setEditProjectCompleted] = useState(false);

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

  // --- SWR Fetches for the Update Edit Form ---
  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR(
    token && modalView === "edit-update"
      ? [`${apiUrl}/api/v1/members?unpaginated=true`, token]
      : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );
  const membersList = membersData?.data || membersData || [];

  const {
    data: projectsData,
    error: projectsError,
    isLoading: projectsLoading,
  } = useSWR(
    token && modalView === "edit-update" && selectedMemberId
      ? [`${apiUrl}/api/v1/projects?member_id=${selectedMemberId}`, token]
      : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );
  const projectsList = projectsData?.data || projectsData || [];

  const {
    data: meetupsData,
    error: meetupsError,
    isLoading: meetupsLoading,
  } = useSWR<Meetup[]>(
    token && modalView === "edit-update"
      ? [`${apiUrl}/api/v1/meetups?category=regular_meetup&limit=20`, token]
      : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );
  const meetupsList = meetupsData?.data || meetupsData || [];

  // --- Helper Functions ---
  const handleCardClick = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalView("list");
      setEditingProjectId(null);
      setEditingUpdateId(null);
    }, 300);
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return "";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // PROJECT HANDLERS
  const handleEditProjectClick = (project: Project) => {
    setEditingProjectId(project.id);
    setEditProjectName(project.name);
    setEditProjectCompleted(project.completed);
    setModalView("edit-project");
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setModalView("list");
  };

  const handleSaveProject = async () => {
    if (!editingProjectId) return;
    setIsSaving(true);

    try {
      await axios.patch(
        `${apiUrl}/api/v1/projects/${editingProjectId}`,
        {
          project: { name: editProjectName, completed: editProjectCompleted },
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await sleep(500);
      if (mutateMembers) await mutateMembers();
      showToast("Project edited successfully!", "success");
      handleCancelEditProject();
    } catch (error) {
      showToast("Unable to edit project. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: string | number) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This will also delete any associated updates!",
      )
    ) {
      setDeletingId(projectId);
      try {
        await axios.delete(`${apiUrl}/api/v1/projects/${projectId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await sleep(500);
        if (mutateMembers) await mutateMembers();
        showToast("Project deleted successfully", "success");
      } catch (error) {
        showToast("Unable to delete project.", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // UPDATE HANDLERS
  const handleEditUpdateClick = (update: Update) => {
    setEditingUpdateId(update.id);
    setSelectedMemberId(update.member?.id || update.member_id);
    setSelectedProjectId(update.project?.id || update.project_id);
    setSelectedMeetupId(update.meetup_id);
    setSelectedCategory(update.category);
    setSelectedDescription(update.description);
    setModalView("edit-update");
  };

  const handleCancelEditUpdate = () => {
    setEditingUpdateId(null);
    setModalView("list");
  };

  const handleSaveUpdate = async () => {
    if (!editingUpdateId) return;
    setIsSaving(true);

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
        `${apiUrl}/api/v1/updates/${editingUpdateId}`,
        payload,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await sleep(500);
      if (mutateMembers) await mutateMembers();
      showToast("Update edited successfully!", "success");
      handleCancelEditUpdate();
    } catch (error) {
      showToast("Unable to edit update.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUpdate = async (updateId: string | number) => {
    if (confirm("Are you sure you want to delete this update?")) {
      setDeletingId(`update-${updateId}`);
      try {
        await axios.delete(`${apiUrl}/api/v1/updates/${updateId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await sleep(500);
        if (mutateMembers) await mutateMembers();
        showToast("Update deleted successfully", "success");
      } catch (error) {
        showToast("Unable to delete update.", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // --- Safely find current update data for the form ---
  let findEditingUpdate: Update | undefined;
  if (modalView === "edit-update") {
    projects.forEach((p) => {
      const match = p.updates?.find((u) => u.id === editingUpdateId);
      if (match) findEditingUpdate = match;
    });
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-[#222] rounded-lg p-4 border-2 dark:border border-neutral-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-200 hover:shadow-gray-600/50 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] dark:hover:shadow-gray-200/50 active:shadow-none transition duration-200 cursor-pointer"
      >
        <h1 className="text-lg flex justify-between">
          <div className="flex items-center">
            <User size="18" className="mr-2" />
            <span className="font-bold">
              {name.length > 20 ? name.slice(0, 30) + "..." : name}
            </span>
          </div>
          <span className="text-gray-500 ml-2 text-[12px]">
            {formatStatus(status)}
          </span>
        </h1>
        <hr className="border-gray-600 mb-2" />
        <p className="flex items-center">
          <FolderCode size="16" className="mr-2" />
          {projects.length} Projects
        </p>
        <p className="flex items-center">
          <FolderCheck size="16" className="mr-2" />
          {numberOfCompletedProjects} Projects Completed
        </p>
        <p className="flex items-center">
          <Speech size="16" className="mr-2" />
          {numberOfUpdates} Talks
        </p>
      </div>

      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        {/* VIEW 1: THE LIST VIEW (SHOWS PROJECTS & UPDATES) */}
        {modalView === "list" && (
          <>
            <div className="flex flex-row gap-2 items-center mb-4 justify-between">
              <h2 className="text-2xl font-bold">{name}</h2>
              {isAdmin && (
                <Link href={`/member/${id}/edit`}>
                  <PenLine
                    size={16}
                    className="hover:cursor-pointer hover:text-blue-500 transition duration-200"
                  />
                </Link>
              )}
            </div>

            {/* PROJECTS SECTION */}
            <h3 className="text-lg font-semibold mb-1">Projects</h3>
            <div className="border border-gray-700 py-3 px-4 rounded-md mb-3 max-h-48 lg:max-h-64 overflow-y-auto flex flex-col gap-1 opacity-100">
              {projects && projects.length != 0 ? (
                projects.map((project: Project) => (
                  <div
                    key={project.id}
                    className={
                      "flex items-start justify-between group py-1.5 border-b border-gray-700 last:border-0"
                    }
                  >
                    <div className="flex items-center gap-x-2 mr-2">
                      {project.completed ? (
                        <p className="text-green-500 flex items-center gap-x-2 font-medium">
                          {project.name}
                          <CheckCircle size="16" className="shrink-0" />
                        </p>
                      ) : (
                        <p>{project.name}</p>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex gap-x-3 shrink-0 ml-auto opacity-100  mt-0.5">
                        <button onClick={() => handleEditProjectClick(project)}>
                          <Edit
                            size="16"
                            className="text-blue-500 hover:text-blue-400"
                          />
                        </button>
                        <button onClick={() => handleDeleteProject(project.id)}>
                          <Trash
                            size="16"
                            className="text-red-500 hover:text-red-400"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-red-400 flex items-center gap-x-2">
                  <CircleAlert size="18" /> No projects made
                </p>
              )}
            </div>

            {/* UPDATES SECTION */}
            <h3 className="text-lg font-semibold mb-1">Talks</h3>
            <div className="overflow-y-auto border flex flex-col gap-y-3 px-4 py-3 mb-8 max-h-56 lg:max-h-80 rounded-md border-gray-700">
              {projects && projects.length !== 0 && numberOfUpdates > 0 ? (
                projects.map((project) =>
                  project.updates
                    ? project.updates.map((update: Update) => (
                        <div
                          key={update.id}
                          className={`border-b border-gray-700 pb-3 last:border-0 last:pb-0 transition-opacity duration-200 ${
                            deletingId === `update-${update.id}`
                              ? "opacity-30 pointer-events-none"
                              : "opacity-100"
                          }`}
                        >
                          <div className="flex justify-between items-start group">
                            <div className="font-bold flex items-center mt-1">
                              <p className="font-semibold truncate">
                                {project.name}
                              </p>
                              {update.category === "idea_talk" ? (
                                <Lightbulb
                                  size="14"
                                  className="ml-2 shrink-0"
                                />
                              ) : (
                                <Hammer
                                  size="14"
                                  className="ml-2 shrink-0 text-blue-400"
                                />
                              )}
                            </div>

                            {/* UPDATE ACTION BUTTONS */}
                            {isAdmin && (
                              <div className="flex gap-x-3 shrink-0 ml-4 opacity-100 mt-1">
                                <button
                                  onClick={() => handleEditUpdateClick(update)}
                                >
                                  <Edit
                                    size="16"
                                    className="text-blue-500 hover:text-blue-400"
                                  />
                                </button>
                                <button
                                  onClick={() => handleDeleteUpdate(update.id)}
                                >
                                  <Trash
                                    size="16"
                                    className="text-red-500 hover:text-red-400"
                                  />
                                </button>
                              </div>
                            )}
                          </div>

                          <p className="text-sm mt-1 whitespace-pre-line">
                            {update.description}
                          </p>
                          <p className="text-[#777] mt-1 text-sm font-semibold">
                            {update.meetup
                              ? dayjs(update.meetup.date).format("MMM D, YYYY")
                              : "Unknown Date"}
                          </p>
                        </div>
                      ))
                    : null,
                )
              ) : (
                <p className="text-red-400 flex items-center gap-x-2">
                  <CircleAlert size="18" /> No updates made
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
        )}

        {/* VIEW 2: THE EDIT PROJECT FORM */}
        {modalView === "edit-project" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
            <div className="flex flex-col gap-5 mb-8">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <label className="font-semibold text-sm">Name</label>
                <input
                  type="text"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full"
                  placeholder="Enter project name..."
                />
              </div>

              <div className="grid grid-cols-[100px_1fr] items-center mt-2">
                <label className="font-semibold text-sm">Status</label>
                <label className="flex items-center gap-2 cursor-pointer w-max">
                  <input
                    type="checkbox"
                    checked={editProjectCompleted}
                    onChange={(e) => setEditProjectCompleted(e.target.checked)}
                    className="cursor-pointer w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm select-none">Mark as Completed</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleCancelEditProject}
                disabled={isSaving}
                className="flex-1 border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333] font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                disabled={isSaving || editProjectName.trim() === ""}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}

        {/* VIEW 3: THE EDIT UPDATE FORM */}
        {modalView === "edit-update" && (
          <>
            {findEditingUpdate ? (
              <>
                <h2 className="text-2xl font-bold mb-6">Edit Update</h2>
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
                      value={selectedMemberId || ""}
                      onChange={(e) => {
                        setSelectedMemberId(e.target.value);
                        setSelectedProjectId("");
                      }}
                      disabled={membersLoading || membersError}
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
                    >
                      {membersLoading && (
                        <option
                          value={
                            findEditingUpdate?.member?.id ||
                            findEditingUpdate?.member_id
                          }
                        >
                          Loading members...
                        </option>
                      )}
                      {membersError && (
                        <option
                          value={
                            findEditingUpdate?.member?.id ||
                            findEditingUpdate?.member_id
                          }
                        >
                          Failed to load members
                        </option>
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

                  {/* For (Project Dropdown) */}
                  <div className="grid grid-cols-[100px_1fr] items-center">
                    <label className="font-semibold text-sm">For</label>
                    <select
                      value={selectedProjectId || ""}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      disabled={
                        projectsLoading || projectsError || !selectedMemberId
                      }
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
                    >
                      {projectsLoading && <option>Loading projects...</option>}
                      {projectsError && (
                        <option>Failed to load projects</option>
                      )}
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
                            {selectedMemberId ===
                              (findEditingUpdate?.member?.id ||
                                findEditingUpdate?.member_id) &&
                              !projectsList.some(
                                (p: Project) =>
                                  p.id ===
                                  (findEditingUpdate?.project?.id ||
                                    findEditingUpdate?.project_id),
                              ) && (
                                <option
                                  value={
                                    findEditingUpdate?.project?.id ||
                                    findEditingUpdate?.project_id
                                  }
                                >
                                  {findEditingUpdate?.project?.name ||
                                    "Unknown Project"}
                                </option>
                              )}
                            <optgroup
                              label={
                                membersList.find(
                                  (m: Member) =>
                                    String(m.id) === String(selectedMemberId),
                                )?.name ||
                                findEditingUpdate?.member?.name ||
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

                  {/* On (Date) */}
                  <div className="grid grid-cols-[100px_1fr] items-center">
                    <label className="font-semibold text-sm">On</label>
                    <select
                      value={selectedMeetupId || ""}
                      onChange={(e) => setSelectedMeetupId(e.target.value)}
                      disabled={meetupsLoading || meetupsError}
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent text-sm w-full disabled:opacity-50"
                    >
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

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={handleCancelEditUpdate}
                    disabled={isSaving}
                    className="flex-1 border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333] font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUpdate}
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            ) : (
              <p>Loading update data...</p>
            )}
          </>
        )}
      </ModalLayout>
    </>
  );
}
