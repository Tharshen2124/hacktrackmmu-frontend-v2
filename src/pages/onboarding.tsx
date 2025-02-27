import DashboardLayout from "@/components/DashboardLayout";
import { Phone } from "lucide-react";

export default function Onboarding() {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mt-6">Onboarding</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border border-gray-800 rounded-lg px-8 py-4 hover:border-gray-200 active:shadow-none transition duration-200">
          <h1 className="text-sm text-gray-400 flex items-center">
            <span className="font-bold">
              New Registrants Today
            </span>
          </h1>
          <p className="text-4xl mt-3 font-semibold">
            20
          </p>

        </div>
        <div className="border border-gray-800 rounded-lg px-8 py-4 hover:text-gray hover:border-gray-200 active:shadow-none transition duration-200">
          <h1 className="text-sm text-gray-400 flex items-center">
            <span className="font-bold">
              Un-contacted members
            </span>
          </h1>
          <p className="text-4xl mt-3 font-semibold">
            4
          </p>

        </div>
      </div>

      <div className="mt-4 border w-full border-gray-800 rounded-lg active:shadow-none transition duration-200">
      <table className="w-full">
          <thead className="border-b pb-3">
            <tr className="border-b border-gray-800 pb-3 ">
              <th className="text-left pl-8 pr-2 bg-[#1e1e1e] rounded-tl-lg">Name</th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e] rounded-tl-lg">Contact Number</th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e] rounded-tl-lg">Register Date</th>
              <th className="text-left py-4 px-4 bg-[#1e1e1e] rounded-tl-lg">Status</th>
              <th className="text-left pl-2 pr-8 bg-[#1e1e1e] rounded-tl-lg w-[297px]">Options</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-800">
              <td className="text-left pl-8 pr-2">John Doe</td>
              <td className="text-left py-4 px-4">+60106673148</td>
              <td className="text-left py-4 px-4">21/7/2025</td>
              <td className="text-left py-2 px-4">
                <div className="">
                  <p className="border border-blue-400 py-2 text-sm w-24 text-center rounded-md font-semibold text-blue-400">Contacted</p>
                </div>
              </td>
              <td className="text-left flex py-2 pl-2 pr-8 gap-x-2 flex-wrap w-[297px]">
                <button className="w-[80px] text-black text-sm font-semibold bg-[#d9d9d9] py-2 px-3 rounded-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
                  View
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-blue-800 py-2 px-3 rounded-full transition duration-200 hover:bg-blue-700 active:bg-gray-400">
                  Edit
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-red-800 py-2 px-3 rounded-full transition duration-200 hover:bg-red-700 active:bg-gray-400">
                  Delete
                </button>
              </td>
            </tr>
            <tr className="border border-gray-800">
              <td className="text-left pl-8 pr-2">John Doe</td>
              <td className="text-left py-4 px-4">+60106673148</td>
              <td className="text-left py-4 px-4">21/7/2025</td>
              <td className="text-left py-2 px-4">
                <div className="">
                  <p className="border border-red-400 py-2 text-sm w-24 text-center rounded-md font-semibold text-red-400">Terminated</p>
                </div>
              </td>
              <td className="text-left flex py-2 pl-2 pr-8 gap-x-2 flex-wrap w-[297px]">
                <button className="w-[80px] text-black text-sm font-semibold bg-[#d9d9d9] py-2 px-3 rounded-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
                  View
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-blue-800 py-2 px-3 rounded-full transition duration-200 hover:bg-blue-700 active:bg-gray-400">
                  Edit
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-red-800 py-2 px-3 rounded-full transition duration-200 hover:bg-red-700 active:bg-gray-400">
                  Delete
                </button>
              </td>
            </tr>
            <tr className="border border-gray-800">
              <td className="text-left pl-8 pr-2">John Doe</td>
              <td className="text-left py-4 px-4">+60106673148</td>
              <td className="text-left py-4 px-4">21/7/2025</td>
              <td className="text-left py-2 px-4">
                <div className="">
                  <p className="border border-green-400 py-2 text-sm text-center rounded-md font-semibold text-green-400 w-[170px]">IdeaTalked, Discorded</p>
                </div>
              </td>
              <td className="text-left flex py-2 pl-2 pr-8 gap-x-2 flex-wrap w-[297px]">
                <button className="w-[80px] text-black text-sm font-semibold bg-[#d9d9d9] py-2 px-3 rounded-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
                  View
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-blue-800 py-2 px-3 rounded-full transition duration-200 hover:bg-blue-700 active:bg-gray-400">
                  Edit
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-red-800 py-2 px-3 rounded-full transition duration-200 hover:bg-red-700 active:bg-gray-400">
                  Delete
                </button>
              </td>
            </tr>
            <tr className="border border-gray-800">
              <td className="text-left pl-8 pr-2">John Doe</td>
              <td className="text-left py-4 px-4">+60106673148</td>
              <td className="text-left py-4 px-4">21/7/2025</td>
              <td className="text-left py-2 px-4">
                <div className="">
                  <p className="border border-white py-2 text-sm w-24 text-center rounded-md font-semibold text-white">Active</p>
                </div>
              </td>
              <td className="text-left flex py-2 pl-2 pr-8 gap-x-2 flex-wrap w-[297px]">
                <button className="w-[80px] text-black text-sm font-semibold bg-[#d9d9d9] py-2 px-3 rounded-full transition duration-200 hover:bg-gray-200 active:bg-gray-400">
                  View
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-blue-800 py-2 px-3 rounded-full transition duration-200 hover:bg-blue-700 active:bg-gray-400">
                  Edit
                </button>
                <button className="w-[80px] text-white text-sm font-semibold bg-red-800 py-2 px-3 rounded-full transition duration-200 hover:bg-red-700 active:bg-gray-400">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
      </table>
      </div>
      
    </DashboardLayout>
  )
}

