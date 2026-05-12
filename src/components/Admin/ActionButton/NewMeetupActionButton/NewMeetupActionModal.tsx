import { SearchableDropdown } from "@/components/atomComponents/Dropdown/SelectDropdown";
import { SubmitButton } from "@/components/atomComponents/SubmitButton";
import { ErrorImage } from "@/components/errorComponent";
import { ModalLayout } from "@/components/ModalLayout";
import { useToast } from "@/components/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import axios from "axios";
import { useEffect, useState } from "react";
import { createApiLogger } from "@/utils/logger";

interface NewMeetupActionModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  mutateMeetups: () => void;
  mutateHackathons: () => void;
}

type Host = {
  id: string;
  name: string;
};

export function NewMeetupActionModal({
  isModalOpen,
  handleCloseModal,
  mutateMeetups,
  mutateHackathons,
}: NewMeetupActionModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuthStore();
  const { showToast } = useToast();
  const [haveHosted, setHaveHosted] = useState<Host[]>();
  const [yetToHost, setYetToHost] = useState<Host[]>();
  const [meetupNumberInput, setMeetupNumberInput] = useState<number>(0);
  const [regularMeetupNumber, setRegularMeetupNumber] = useState<number>(0);
  const [hackathonNumber, setHackathonNumber] = useState<number>(0);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [category, setCategory] = useState<"regular_meetup" | "hackathon">(
    "regular_meetup",
  );
  const [selectedHostID, setSelectedHostID] = useState<string>("");

  useEffect(() => {
    if (isModalOpen) {
      getData();
      // Reset form fields when modal opens
      setSelectedHostID("");
      setCategory("regular_meetup");
      setIsSubmitting(false);
      setIsError(false);
    }
  }, [token, isModalOpen]);

  async function getData() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/dashboard/create_meetup`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const transformHosts = (hosts: [string, number][]) =>
        hosts.map(([name, id]) => ({ id: id.toString(), name }));

      setHaveHosted(transformHosts(response.data.hosts["Have Hosted"]));
      setYetToHost(transformHosts(response.data.hosts["Yet To Host"]));

      setRegularMeetupNumber(response.data.meetup_number.number);
      setHackathonNumber(response.data.meetup_number.hackathon_number);
      setMeetupNumberInput(response.data.meetup_number.number);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setIsError(true);
      const fetchLogger = createApiLogger("NewMeetupActionModal", "getData");
      fetchLogger.failure("Failed to fetch meetup data", error, Date.now(), {
        errorCode: error.response?.status,
      });
    }
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    if (selectedHostID === "") {
      setIsSubmitting(false);
      showToast("Host field is required.", "error");
      return;
    }

    const payload: any = {
      date: date,
      host_id: selectedHostID,
      category: category,
    };

    // The Fix:
    if (category === "hackathon") {
      payload.hackathon_number = meetupNumberInput;
    } else {
      payload.number = meetupNumberInput;
    }

    try {
      await axios.post(
        `${apiUrl}/api/v1/meetups`,
        {
          meetup: payload,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (category === "hackathon") {
        await mutateHackathons();
      } else if (category === "regular_meetup") {
        await mutateMeetups();
      }
      setIsSubmitting(false);
      handleCloseModal();
      showToast("Successfully added meetup!", "success");
    } catch (error: any) {
      setIsSubmitting(false); // Fix this: previously was true!
      const submitLogger = createApiLogger("NewMeetupActionModal", "handleSubmit");
      submitLogger.failure("Failed to create meetup", error, Date.now(), {
        errorCode: error.response?.status,
        errorMessage: error.response?.data?.message,
      });
      showToast("Error occurred, meetup was not saved.", "error");
    }
  }

  if (isLoading) {
    return (
      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1>Loading...</h1>
      </ModalLayout>
    );
  }

  if (isError) {
    return (
      <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
        <ErrorImage />
        <button
          onClick={() => handleCloseModal()}
          className="dark:bg-white text-black mt-5 hover:bg-gray-900 bg-blue-500 dark:hover:bg-blue-700 dark:active:bg-blue-800 active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
        >
          Close
        </button>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout isOpen={isModalOpen} onClose={handleCloseModal}>
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-2xl font-bold">New Meetup</h2>
      </div>
      {/* <div className="border border-gray-700 py-3 px-4 rounded-md mb-3">
        <h1 className="font-semibold">Potential Host</h1>
        {haveHosted && haveHosted.map(([name, number]: [string, number], index: number) => (
          <p key={index} className="text-sm">{name}</p>
        ))}
      </div> */}
      <form
        action=""
        className="flex flex-col gap-y-4"
        onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <div>
          <label htmlFor="" className="font-semibold">
            Number
          </label>
          <input
            type="number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMeetupNumberInput(Number(e.target.value))
            }
            value={meetupNumberInput}
            className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="" className="font-semibold">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
            className="mt-1 flex w-full dark:bg-[#333] dark:border-[#555] rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-blue-400 dark:focus:ring-blue-500"
          />
        </div>
        <div>
          <SearchableDropdown
            label="Host"
            id="host"
            name="host"
            placeholder="Search for a host..."
            groups={[
              { label: "Have Hosted", options: haveHosted || [] },
              { label: "Yet To Host", options: yetToHost || [] },
            ]}
            value={selectedHostID}
            onChange={setSelectedHostID}
          />
        </div>
        <div className="">
          <label htmlFor="" className="font-semibold">
            Category
          </label>
          <div className="flex gap-x-5">
            <div className="flex items-center gap-x-1">
              <input
                type="radio"
                defaultChecked
                name="category"
                onChange={() => {
                  setCategory("regular_meetup");
                  setMeetupNumberInput(regularMeetupNumber);
                }}
                className="bg-333"
                id="regular-meetup"
              />
              <label className="cursor-pointer" htmlFor="regular-meetup">
                Regular Meetup
              </label>
            </div>
            <div className="flex items-center gap-x-1">
              <input
                type="radio"
                name="category"
                onChange={() => {
                  setCategory("hackathon");
                  setMeetupNumberInput(hackathonNumber);
                }}
                id="hackathon"
              />
              <label className="cursor-pointer" htmlFor="hackathon">
                Hackathon
              </label>
            </div>
          </div>
        </div>
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </ModalLayout>
  );
}
