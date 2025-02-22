'use client'

import { ChevronDown, ChevronRight, Users, FolderPlus, Plus } from "lucide-react"
import type { ITeamspace } from "@/types/types"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/SidebarContext"
import { useTeamSpaceActions } from "@/hooks/useTeamSpaceActions"

interface TeamSpaceItemProps {
  teamSpace: ITeamspace
}

export function TeamSpaceItem({ teamSpace }: TeamSpaceItemProps) {
  const { openStates, toggleOpen } = useSidebar()
  const { dialogState, setDialogState } = useTeamSpaceActions()

  const handleCreateFolder = () => {
    console.log("Creating folder");
    setDialogState({
      type: 'folder',
      isOpen: true,
      teamSpaceId: teamSpace.id,
      isLoading: false
    })
  }

  const handleCreateNote = (folderId: string) => {
    setDialogState({
      type: 'note',
      isOpen: true,
      teamSpaceId: teamSpace.id,
      folderId,
      isLoading: false
    })
  }

  return (
    <div className="space-y-1">
      {/* Team Space Header */}
      <div 
        className="group flex items-center text-notion-text-primary hover:bg-notion-hover rounded p-1 cursor-pointer"
        onClick={() => toggleOpen(`ts-${teamSpace.id}`)}
      >
        {openStates[`ts-${teamSpace.id}`] ? (
          <ChevronDown className="h-3.5 w-3.5 mr-1" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 mr-1" />
        )}
        <Users className="h-3.5 w-3.5 mr-1.5" />
        <span className="flex-1">{teamSpace.title}</span>
      </div>

      {/* Folders List */}
      {openStates[`ts-${teamSpace.id}`] && (
        <div className="ml-4 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCreateFolder}
            className="w-full justify-start text-notion-text-secondary hover:text-notion-text-primary hover:bg-notion-hover"
          >
            <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
            New Folder
          </Button>

          {/* Folders */}
          {teamSpace.folders?.map((folder) => (
            <div key={folder.id} className="space-y-1">
              <div 
                className="group flex items-center text-notion-text-primary hover:bg-notion-hover rounded p-1 cursor-pointer"
                onClick={() => toggleOpen(`folder-${folder.id}`)}
              >
                {openStates[`folder-${folder.id}`] ? (
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 mr-1" />
                )}
                <span className="flex-1">{folder.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCreateNote(folder.id)
                  }}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Notes */}
              {openStates[`folder-${folder.id}`] && (
                <div className="ml-4 space-y-1">
                  {folder.notes?.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center text-notion-text-primary hover:bg-notion-hover rounded p-1 cursor-pointer"
                    >
                      <span className="ml-4">{note.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 