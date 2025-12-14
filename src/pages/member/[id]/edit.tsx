import DashboardLayout from "@/components/DashboardLayout";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import { fetcherWithToken } from "@/utils/fetcher";
import { Member, MemberStatus } from "@/types/types";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";

export default function EditMemberPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const { id } = router.query;

  const {
    data: member,
    error: memberError,
    isLoading: memberLoading,
  } = useSWR<Member>(
    token && id ? [`${apiUrl}/api/v1/members/${id}`, token] : null,
    ([url, token]: [string, string]) => fetcherWithToken(url, token),
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "" as MemberStatus | "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        email: member.email || "",
        status: member.status || "",
        comment: member.comment || "",
      });
    }
  }, [member]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/v1/members/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ member: formData }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update member");
      }

      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (memberLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <LoaderCircle className="animate-spin mr-2" size="80" />
        </div>
      </DashboardLayout>
    );
  }

  if (memberError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Error occurred</h1>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <button
        className="transition back-section mb-4 flex flex-row gap-2 rounded-2xl pl-2 pr-4 py-2 hover:text-blue-400 active:text-blue-500"
        onClick={() => router.back()}
      >
        <ChevronLeft />
        <span>Back</span>
      </button>
      <div className="flex justify-center">
        <div className="p-6 bg-[#222] border border-gray-700 w-[500px] rounded-lg">
          <h1 className="text-3xl font-bold mb-4 mt-2">Edit Member</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#333]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#333]"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md text-blac bg-[#333]"
              >
                <option value="">Select a status</option>
                {Object.values(MemberStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-1">
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-[#333]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="transition px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="transition px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}