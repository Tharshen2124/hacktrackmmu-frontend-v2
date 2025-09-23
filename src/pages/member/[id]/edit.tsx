import DashboardLayout from "@/components/DashboardLayout";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import { fetcherWithToken } from "@/utils/fetcher";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Member } from "@/types/types";

export default function MemberPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const { id, source } = router.query;

  const {
    data: member,
    // error: memberError,
    // isLoading: memberLoading,
    // mutate: mutateMember,
  } = useSWR<Member>(
    token ? [`${apiUrl}/api/v1/members/${id}`, token] : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );

  return (
    <DashboardLayout>
      <button
        className="back-section mb-4 flex flex-row gap-2 rounded-2xl bg-white pl-2 pr-4 py-2 text-black"
        onClick={() => router.back()}
      >
        <ChevronLeft />
        <span>
          Back to{" "}
          {typeof source === "string"
            ? source.slice(0, 1).toUpperCase() + source.slice(1)
            : "Members"}
        </span>
      </button>
      <h1>Member Details</h1>
      <p>Member ID: {member?.id}</p>
      <p>Name: {member?.name}</p>
      <p>Status: {member?.status}</p>
      <p>
        Projects:{" "}
        {member?.projects && member.projects.length > 0
          ? member.projects.map((project) => (
              <span key={project.id}>{project.name}, </span>
            ))
          : "None"}
      </p>
      <p>Created At: {member?.created_at.toString()}</p>
      <p>Updated At: {member?.updated_at.toString()}</p>
    </DashboardLayout>
  );
}
