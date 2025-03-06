import { CheckCircle, CircleAlert, FolderCheck, FolderCode, Hammer, Lightbulb, Speech, User } from "lucide-react";
import Modal from "../ModalLayout";
import { useState } from "react";
import { dateMod } from "@/utils/dateMod";

interface MemberCardProps { 
  active: boolean
  comment?: string
  contact_number?: string
  email?: string
  name: string
  register_date?: string
  status?: string
  projects: Project[]
}

interface Project {
  category: string
  completed: boolean
  name: string
  updates: Update[]
  length: string
}

interface Update {
  id: string
  category: string
  date: string
  description: string
  meetup: Meetup
}

interface Meetup {
  id: string
  date: string
}

export default function MemberCard({  name, projects }: MemberCardProps) {
  const numberOfCompletedProjects = projects.filter(project => project.completed).length
  const numberOfUpdates = projects.reduce((acc, project) => acc + project.updates.length, 0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div
        onClick={handleCardClick} 
        className="bg-white dark:bg-[#222] rounded-lg p-4 border border-gray-600 hover:border-gray-200 hover:shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.1)] hover:shadow-gray-200/50 active:shadow-none transition duration-200"
      >
        <h1 className="text-lg flex items-center">
          <User size="18" className="mr-2" />
          <span className="font-bold">
            {name.length > 20 ? name.slice(0, 30) + "..." : name}
          </span>
        </h1>
      <hr className="border-gray-600 mb-2" />
      <p className="flex items-center">
        <FolderCode size="16" className="mr-2" />
        {projects.length} Projects
      </p>
      <p className="flex items-center">
        <FolderCheck size="16" className="mr-2" />
        {numberOfCompletedProjects} Projects Completed
      </p>
      <p className="flex items-center">
        <Speech size="16" className="mr-2" />
        {numberOfUpdates} Talks
      </p>
    </div>
    
    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
      <h2 className="text-2xl font-bold mb-4">{name}</h2>

      <h3 className="text-lg font-semibold mb-1">Projects</h3>
      <div className="border border-gray-700 py-3 px-4 rounded-md mb-3 max-h-36 lg:max-h-48 overflow-y-auto">
        { projects && projects.length != 0 ? projects.map((project: Project) => (
           <> 
              {project.completed ? (
                <p className="text-green-500 flex items-center gap-x-2">
                  {project.name}
                  <CheckCircle size="18"/>
                </p>
              ) : (
                <p>{project.name}</p>
              )}
           </> 
        )) : (
          <p className="text-red-400 flex items-center gap-x-2">
             <CircleAlert size="18" />
             No projects made 
          </p>
        )}
      </div>  
    
    <h3 className="text-lg font-semibold mb-1">Talks</h3>
    <div className="overflow-y-auto border flex flex-col gap-y-2 px-4 py-3 mb-8 max-h-56 lg:max-h-96 rounded-md border-gray-700">
      {projects && projects.length !==0 ? (
        projects.map((project, index: number) =>
          project.updates && projects.length !==0 ? (
            project.updates.map((update: Update) => (
              <div key={update.id}>
                <div className="font-bold flex items-center">
                  <p className="font-semibold">{project.name}</p>
                  {update.category === 'idea_talk' ? (
                    <Lightbulb size="14" className="ml-2"/>
                  ) : (
                    <Hammer size="14" className="ml-2"/>
                  )}
                </div>

                <p className="text-sm">{update.description}</p>
                <p className="text-[#777] mt-1 text-sm font-semibold">{dateMod(update.meetup.date)}</p>
              </div>
            ))
          ) : (
            <p key={index} className="text-red-400 flex items-center gap-x-2">
              <CircleAlert size="18" />
              No updates made 
            </p>
          )
        )
      ) : (
        <p className="text-red-400 flex items-center gap-x-2">
            <CircleAlert size="18" />
            No updates made 
        </p>
      )}
    </div>
      
      <button
        onClick={handleCloseModal}
        className="dark:bg-white hover:bg-white-600 dark:text-black bg-[#222] dark:hover:bg-[#e0e0e0] dark:active:bg-[#c7c7c7] text-white hover:bg-[#333] active:bg-[#444] font-bold py-2 px-4 rounded w-full transition duration-200"
      >
        Close
      </button>
    </Modal>
  </>

  )
}
