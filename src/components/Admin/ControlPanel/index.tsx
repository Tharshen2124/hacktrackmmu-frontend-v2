// import axios from "axios";
import { mutate } from "swr";
import { NewMeetupActionButton } from "../ActionButton/NewMeetupActionButton";
import { NewProjectActionButton } from "../ActionButton/NewProjectActionButton";
import { NewUpdateActionButton } from "../ActionButton/NewUpdateActionButton";

interface ControlPanelProps {
  mutateMeetups: () => void;
  mutateHackathons: () => void;
  mutateMembers: () => void;
}


export default function ControlPanel({ mutateMeetups, mutateHackathons, mutateMembers }: ControlPanelProps) {
  return (
    <>
      <div className="flex items-center mt-10">
        <h2 className="text-3xl font-semibold mb-2">Control Panel</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NewMeetupActionButton mutateMeetups={mutateMeetups} mutateHackathons={mutateHackathons} />
        <NewProjectActionButton mutateMembers={mutateMembers} />
        <NewUpdateActionButton  />
      </div>
    </>
  );
}