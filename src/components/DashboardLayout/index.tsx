import NavigationBar from "../NavigationBar";
import Head from "next/head";
import useAuthStore from "@/store/useAuthStore";
import { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardLayout({
  children,
  pageTitle = "HackTrack",
}: {
  DashboardLayoutProps;
}) {
  const { hydrateAuth, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    hydrateAuth();
    setIsHydrated(true);
  }, [hydrateAuth]);

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
