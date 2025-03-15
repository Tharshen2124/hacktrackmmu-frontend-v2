import NavigationBar from "../NavigationBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationBar />
      <div className="container mx-auto mt-8 w-[95%]">{children}</div>
    </>
  );
}
