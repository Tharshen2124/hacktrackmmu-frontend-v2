import DashboardLayout from "@/components/DashboardLayout";
import MemberCard from "@/components/MemberCard";
import { useToast } from "@/components/Toast/ToastProvider";
import useAuthStore from "@/store/useAuthStore";
import { apiUrl } from "@/utils/env";
import { isTokenExpired } from "@/utils/isTokenExpired";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Members() {
  const { token, validUntil } = useAuthStore();
  const [paginationNumber, setPaginationNumber] = useState<number>(1)
  const [members, setMembers] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter()
  const { showToast } = useToast()
    
  useEffect(() => {
      if(isTokenExpired(validUntil)) {
          router.push('/login')
          showToast('You are not authorised to view this page. Login first.', "error")
          return 
      }
      
      async function getData() {
          setIsLoading(true)
          const response = await axios.get(`${apiUrl}/api/v1/members/?page=${paginationNumber}`, {
              headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`
              }
          });
          console.log(response.data.data)
          setMembers(response.data.data)
          setIsLoading(false)
      }

      getData()
  }, [paginationNumber]) 

  useEffect(() => {

  }, [])

  if(isLoading) {
    return (
      <DashboardLayout>
          <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Meetups</h1>
          </div>
          <div className="mt-10">
              <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">Regular Meetups</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                  {Array.from({ length: 28 }).map((_, index) => (
                      <SkeletonHackathonCard key={index} />
                  ))}
              </div>

          </div>

          <div className="mt-10">
              <div className="flex justify-between items-center">
              <h2 className="text-3xl flex items-center font-semibold">Hackathons</h2>
              </div>            
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                  {Array.from({ length: 28 }).map((_, index) => (
                      <SkeletonHackathonCard key={index} />
                  ))}
              </div>
          </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
        <h1 className="text-4xl font-bold mt-6">Members</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {members && members.map((member: any) => (
            <MemberCard 
                key={member.id}
                name={member.name} 
                active={member.active}
                projects={member.projects}
            />
          ))}
        </div>
    </DashboardLayout>
  )
}
