import NavigationBar from "../NavigationBar";
import Head from "next/head";
import useAuthStore from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcherWithToken } from "@/utils/fetcher";
import { apiUrl } from "@/utils/env";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({
  children,
  pageTitle = "HackTrack",
}: DashboardLayoutProps) {
  const { hydrateAuth, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    hydrateAuth();
    setIsHydrated(true);
  }, [hydrateAuth]);

  useSWR(
    isHydrated && token && token !== "0"
      ? [`${apiUrl}/api/v1/members?unpaginated=true`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  useSWR(
    isHydrated && token && token !== "0"
      ? [`${apiUrl}/api/v1/meetups?category=regular_meetup`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  useSWR(
    isHydrated && token && token !== "0"
      ? [`${apiUrl}/api/v1/meetups?category=hackathon`, token]
      : null,
    ([url, token]) => fetcherWithToken(url, token),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
      </Head>
      <NavigationBar />
      <div className="container mx-auto mt-8 w-[95%]">{children}</div>
    </>
  );
}
