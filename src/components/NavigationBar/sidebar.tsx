import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  handleLogout: () => void;
}

export function Sidebar({ isOpen, onClose, isAdmin, handleLogout }: SidebarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-4 py-6">
            <Link
              href="/"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/members"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Members
            </Link>
            <Link
              href="/meetups"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Meetups
            </Link>
            {isClient && isAdmin && (
              <Link href="/onboarding" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Onboarding
              </Link>
            )}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {isClient && isAdmin &&
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Admin Mode
              </p>
            }
            <button
              onClick={handleLogout}
              className="w-full bg-gray-800 text-white dark:bg-white dark:text-black font-semibold py-2 px-4 rounded-md hover:bg-gray-700 dark:hover:bg-gray-100 transition duration-200">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
