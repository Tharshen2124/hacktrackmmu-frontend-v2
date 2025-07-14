import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { useDarkMode } from "@/hooks/useDarkMode";
import axios from "axios";
import { apiUrl } from "@/utils/env";
import { useToast } from "@/components/Toast/ToastProvider";

export default function NavigationBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { clearToken, clearValidUntil, clearAdmin, isAdmin, token } = useAuthStore();
  const { isDarkMode } = useDarkMode();
  const { showToast } = useToast();

  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  async function handleLogout() {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/logout`, 
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

      if (response.status === 200) {
        showToast(
          "Logout successfully! Redirecting you to main page",
          "success",
        );

        router.push("/");

        clearAdmin();
        clearValidUntil();
        clearToken();
      }
    } catch (error: any) {
      if (
        error.response &&
          error.response?.data?.message === "Invalid password"
      ) {
        showToast("Invalid password. Try again.", "error");
      }
    }
  }

  return (
    <>
      <nav className="border-b dark:border-[#333] border-[#e0e0e0] w-full h-[70px] flex items-center">
        <div className="container w-[95%] mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {isDarkMode ? (
              <Image
                src="/hackerspaceLogoWhite.svg"
                alt="logo"
                className="md:w-12 md:h-12"
                width={40}
                height={40}
              />
            ) : (
              <Image
                src="/hackerspaceLogo.svg"
                alt="logo"
                className="md:w-14 md:h-14"
                width={40}
                height={40}
              />
            )}
            <h1 className="ml-2 text-lg md:text-xl font-bold">
              Hackerspace MMU
            </h1>
          </div>
          <div className="hidden lg:flex items-center">
            <Link href="/dashboard" className="hover:text-blue-400">
              Dashboard
            </Link>
            <Link href="/members" className="ml-4 hover:text-blue-400">
              Members
            </Link>
            <Link href="/meetups" className="ml-4 hover:text-blue-400">
              Meetups
            </Link>
          </div>
          <div className="hidden lg:flex items-center">
            {isAdmin == "true" && <p className="mr-6">Admin Mode</p>}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 dark:bg-white dark:text-black text-white bg-gray-800 font-semibold px-8 py-3 rounded-full"
            >
              Logout
            </button>
          </div>
          <div className="block lg:hidden">
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-2 dark:bg-white dark:text-black text-white bg-gray-800 font-semibold px-2 py-2 rounded-md"
            >
              {isSidebarOpen ? <X size="20" /> : <Menu size="20" />}
            </button>
          </div>
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} isAdmin={isAdmin} />
    </>
  );
}
