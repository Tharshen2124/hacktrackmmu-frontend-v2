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
import Head from "next/head";
import { useState } from "react";
import { dateMod } from "@/utils/dateMod";
import { ModalLayout } from "../ModalLayout";
import { Update } from "@/types/types";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import { useToast } from "@/components/Toast/ToastProvider";
import { EditUpdateForm, EditUpdateData } from "../Forms/EditUpdateForm";

interface MeetupCardProps {
  number: number;
  numberOfUpdates: number;
  date: string;
  hostName: string;
  updates: Update[];
  mutateMeetups?: () => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const [isSaving, setIsSaving] = useState(false);

  const { token, isAdmin } = useAuthStore();
  const { showToast } = useToast();

  const handleCardClick = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalView("list");
      setEditingUpdateId(null);
    }, 300);
  };

  const handleEditClick = (updateId: string | number) => {
    setEditingUpdateId(updateId);
    setModalView("edit");
  };

  const handleSaveUpdate = async (data: EditUpdateData) => {
    if (!editingUpdateId) return;
    setIsSaving(true);

    try {
      await axios.patch(
        `${apiUrl}/api/v1/updates/${editingUpdateId}`,
        {
          update: {
            meetup_id: data.meetupId,
            project_id: data.projectId,
            member_id: data.memberId,
            category: data.category,
            description: data.description,
          },
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await sleep(500);
      if (mutateMeetups) await mutateMeetups();

      showToast("Update edited successfully!", "success");
      setModalView("list");
      setEditingUpdateId(null);
    } catch (error) {
      showToast("Unable to edit update. Please try again.", "error");
    } finally {
      setIsSaving(false);
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

        await sleep(500);
        if (mutateMeetups) await mutateMeetups();

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
      {isModalOpen && (
        <Head>
          <title key="title">
            {modalView === "edit"
              ? "HackTrack - Edit Update"
              : `HackTrack - Meetup ${number}`}
          </title>
        </Head>
      )}
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
        {modalView === "list" && (
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
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {update.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-red-500 dark:text-red-400 flex items-center gap-x-2">
                  <CircleAlert size="18" /> No updates
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

        {modalView === "edit" && findEditingUpdate && (
          <EditUpdateForm
            update={findEditingUpdate}
            isSaving={isSaving}
            meetupFetchUrl={`${apiUrl}/api/v1/meetups?category=regular_meetup&limit=20`}
            onCancel={() => setModalView("list")}
            onSave={handleSaveUpdate}
          />
        )}
      </ModalLayout>
    </>
  );
}
