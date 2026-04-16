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
import { Member, Project, Update } from "@/types/types";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { useToast } from "@/components/Toast/ToastProvider";

interface MemberCardProps extends Member {
  mutateMembers?: () => void;
}

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

  const [modalView, setModalView] = useState<"list" | "edit-project">("list");
  const [editingProjectId, setEditingProjectId] = useState<
    string | number | null
  >(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectCompleted, setEditProjectCompleted] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalView("list");
      setEditingProjectId(null);
      setEditProjectName("");
      setEditProjectCompleted(false);
    }, 300);
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return "";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // --- Handlers for Project Editing/Deleting ---

  const handleEditProjectClick = (project: Project) => {
    setEditingProjectId(project.id);
    setEditProjectName(project.name);
    setEditProjectCompleted(project.completed);
    setModalView("edit-project");
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setEditProjectName("");
    setEditProjectCompleted(false);
    setModalView("list");
  };

  const handleSaveProject = async () => {
    if (!editingProjectId) return;
    setIsSaving(true);

    const payload = {
      project: {
        name: editProjectName,
        completed: editProjectCompleted,
      },
    };

    try {
      await axios.patch(
        `${apiUrl}/api/v1/projects/${editingProjectId}`,
        payload,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (mutateMembers) {
        await mutateMembers();
      }

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

        if (mutateMembers) {
          await mutateMembers();
        }

        showToast("Project deleted successfully", "success");
      } catch (error) {
        showToast("Unable to delete project. Please try again.", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

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
        {modalView === "list" ? (
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

            <h3 className="text-lg font-semibold mb-1">Projects</h3>
            <div className="border border-gray-700 py-3 px-4 rounded-md mb-3 max-h-48 lg:max-h-64 overflow-y-auto flex flex-col gap-1">
              {projects && projects.length != 0 ? (
                projects.map((project: Project) => (
                  <div
                    key={project.id}
                    className={`flex items-start justify-between group py-1.5 border-b border-gray-700 last:border-0 transition-opacity duration-200 ${
                      deletingId === project.id
                        ? "opacity-30 pointer-events-none"
                        : "opacity-100"
                    }`}
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
                      <div className="flex gap-x-3 shrink-0 ml-auto opacity-100 mt-0.5">
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
                  <CircleAlert size="18" />
                  No projects made
                </p>
              )}
            </div>

            <h3 className="text-lg font-semibold mb-1">Talks</h3>
            <div className="overflow-y-auto border flex flex-col gap-y-3 px-4 py-3 mb-8 max-h-56 lg:max-h-80 rounded-md border-gray-700">
              {projects && projects.length !== 0 ? (
                projects.map((project, index: number) =>
                  project.updates && project.updates.length !== 0
                    ? project.updates.map((update: Update) => (
                        <div
                          key={update.id}
                          className="border-b border-gray-700 pb-3 last:border-0 last:pb-0"
                        >
                          <div className="font-bold flex items-center">
                            <p className="font-semibold">{project.name}</p>
                            {update.category === "idea_talk" ? (
                              <Lightbulb size="14" className="ml-2" />
                            ) : (
                              <Hammer
                                size="14"
                                className="ml-2 text-blue-400"
                              />
                            )}
                          </div>

                          <p className="text-sm mt-1">{update.description}</p>
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
                  <CircleAlert size="18" />
                  No updates made
                </p>
              )}
              {/* Fallback if projects exist but NO updates exist across any of them */}
              {projects && projects.length > 0 && numberOfUpdates === 0 && (
                <p className="text-red-400 flex items-center gap-x-2">
                  <CircleAlert size="18" />
                  No updates made
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
          // THE EDIT PROJECT FORM
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
      </ModalLayout>
    </>
  );
}
