import DashboardLayout from "@/components/DashboardLayout";
import OnboardingTableRow from "@/components/Onboarding/OnboardingTableRow";
import { Filter } from "lucide-react";

export default function Onboarding() {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mt-6">Onboarding</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border border-gray-800 rounded-lg px-8 py-4 hover:border-gray-200 active:shadow-none transition duration-200">
          <h1 className="text-sm text-gray-400 flex items-center">
            <span className="font-bold">New Registrants Today</span>
          </h1>
          <p className="text-4xl mt-3 font-semibold">20</p>
        </div>
        <div className="border border-gray-800 rounded-lg px-8 py-4 hover:text-gray hover:border-gray-200 active:shadow-none transition duration-200">
          <h1 className="text-sm text-gray-400 flex items-center">
            <span className="font-bold">Un-contacted members</span>
          </h1>
          <p className="text-4xl mt-3 font-semibold">4</p>
        </div>
      </div>

      <div className="mt-4 border w-full border-gray-800 rounded-lg active:shadow-none transition duration-200">
        <table className="w-full">
          <thead className="border-b pb-3">
            <tr className="border-b border-gray-800 pb-3 ">
              <th className="text-left pl-8 pr-2 bg-[#1e1e1e] rounded-tl-lg">
                Name
              </th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e] rounded-tl-lg">
                Contact Number
              </th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e] rounded-tl-lg">
                Register Date
              </th>
              <th className="text-left flex items-center gap-x-3 py-4 px-4 bg-[#1e1e1e] rounded-tl-lg">
                Status
                <div className="border rounded-md p-[5px] bg-gray-900 border-gray-700 hover:bg-gray-800 active:border-gray-600 active:outline active:outline-1 active:outline-gray-600 transition duration-100">
                  <Filter size="20"/>
                </div>
              </th>
              <th className="text-left pl-2 pr-8 bg-[#1e1e1e] rounded-tl-lg w-[297px]">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-800">
              <OnboardingTableRow />
            </tr>
            <tr className="border border-gray-800">
              <OnboardingTableRow />
            </tr>
            <tr className="border border-gray-800">
             <OnboardingTableRow />
            </tr>
            <tr className="border border-gray-800">
              <OnboardingTableRow />
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
