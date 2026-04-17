import NavigationBar from "../NavigationBar";
import Head from "next/head";

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
