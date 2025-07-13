// import axios from "axios";
import { NewMeetupActionButton } from "../ActionButton/NewMeetupActionButton";
import { NewProjectActionButton } from "../ActionButton/NewProjectActionButton";
import { NewUpdateActionButton } from "../ActionButton/NewUpdateActionButton";

export default function ControlPanel() {
  return (
    <>
      <div className="flex items-center mt-10">
        <h2 className="text-3xl font-semibold mb-2">Control Panel</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* <NewMemberActionButton /> */}
        <NewMeetupActionButton />
        <NewProjectActionButton />
        <NewUpdateActionButton />
      </div>
    </>
  );
}
