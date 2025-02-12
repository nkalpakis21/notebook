import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/contexts/SidebarContext"

interface DialogState {
  type: 'teamspace' | 'folder' | null
  isOpen: boolean
  isLoading: boolean
  teamSpaceId?: string
}

export function useTeamSpaceActions() {
  const router = useRouter()
  const { setTeamSpaces, setOpenStates } = useSidebar()
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    isOpen: false,
    isLoading: false
  })

  const fetchTeamSpaces = async () => {
    try {
      const response = await fetch("/api/teamspaces")
      const data = await response.json()
      setTeamSpaces(data)
      initializeOpenStates(data)
    } catch (error) {
      console.error("Error fetching teamspaces:", error)
    }
  }

  const initializeOpenStates = (data: any[]) => {
    setOpenStates(prevStates => {
      const newOpenStates = { ...prevStates }
      data.forEach((ts) => {
        if (!((`ts-${ts.id}`) in newOpenStates)) {
          newOpenStates[`ts-${ts.id}`] = true
        }
        ts.folders.forEach((folder: any) => {
          if (!((`folder-${folder.id}`) in newOpenStates)) {
            newOpenStates[`folder-${folder.id}`] = false
          }
        })
      })
      return newOpenStates
    })
  }

  const openDialog = (type: 'teamspace' | 'folder', teamSpaceId?: string) => {
    setDialogState({
      type,
      isOpen: true,
      isLoading: false,
      teamSpaceId
    })
  }

  return {
    dialogState,
    setDialogState,
    openDialog,
    fetchTeamSpaces
  }
} 