import { ChevronDown, ChevronRight, Users, FolderPlus } from "lucide-react"
import type { ITeamspace } from "@/types/types"
import { useSidebar } from "@/contexts/SidebarContext"
import { ActionButton } from "./ActionButton"
import { NotesList } from "./NotesList"
import { FolderList } from "./FolderList"
import { TeamSpaceDropdown } from "./TeamSpaceDropdown"
import { useState } from "react"

interface TeamSpaceItemProps {
  teamSpace: ITeamspace
}

export function TeamSpaceItem({ teamSpace }: TeamSpaceItemProps) {
  const { openStates, toggleOpen } = useSidebar()
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  const handleCreateFolder = async () => {
    if (isCreatingFolder) return
    setIsCreatingFolder(true)
    try {
      // Your folder creation logic here
    } catch (error) {
      console.error('Error creating folder:', error)
    } finally {
      setIsCreatingFolder(false)
    }
  }

  return (
    <div className="mb-2">
      <div className="group flex items-center text-notion-text-primary hover:bg-gray-100/40 rounded p-1 cursor-pointer transition-colors duration-150">
        <div 
          className="flex-1 flex items-center"
          onClick={() => toggleOpen(`ts-${teamSpace.id}`)}
        >
          {openStates[`ts-${teamSpace.id}`] ? (
            <ChevronDown className="h-3.5 w-3.5 mr-1" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 mr-1" />
          )}
          <Users className="h-3.5 w-3.5 mr-1.5" />
          <span className="font-semibold">{teamSpace.title}</span>
        </div>
        <TeamSpaceDropdown teamSpaceId={teamSpace.id} />
      </div>

      {openStates[`ts-${teamSpace.id}`] && (
        <>
          <div className="ml-8">
            <ActionButton
              icon={FolderPlus}
              label="New Folder"
              onClick={handleCreateFolder}
              isLoading={isCreatingFolder}
            />
          </div>
          <NotesList notes={teamSpace.notes} />
          <FolderList folders={teamSpace.folders} />
        </>
      )}
    </div>
  )
} 