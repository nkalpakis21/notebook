import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/contexts/SidebarContext"

export function useDeleteDialog() {
  const router = useRouter()
  const { setTeamSpaces } = useSidebar()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [teamspaceToDelete, setTeamspaceToDelete] = useState<string | null>(null)

  const handleDeleteClick = (teamspaceId: string) => {
    setTeamspaceToDelete(teamspaceId)
    setIsDeleteDialogOpen(true)
  }

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setTeamspaceToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!teamspaceToDelete) return
    
    try {
      const response = await fetch(`/api/teamspaces/${teamspaceToDelete}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete teamspace')
      
      // Refresh the teamspaces data
      const updatedTeamSpaces = await fetch("/api/teamspaces").then(res => res.json())
      setTeamSpaces(updatedTeamSpaces)
      router.push('/')
    } catch (error) {
      console.error('Error deleting teamspace:', error)
    } finally {
      setIsDeleteDialogOpen(false)
      setTeamspaceToDelete(null)
    }
  }

  return {
    isDeleteDialogOpen,
    teamspaceToDelete,
    handleDeleteClick,
    handleCancelDelete,
    handleConfirmDelete
  }
} 