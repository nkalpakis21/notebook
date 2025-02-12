import { useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/SidebarContext"
import { TeamSpaceList } from "./TeamSpaceList"
import { CreateDialog } from "./CreateDialog"
import { DeleteDialog } from "./DeleteDialog"
import { useTeamSpaceActions } from "./hooks/useTeamSpaceActions"

export default function Sidebar() {
  const { teamSpaces, setTeamSpaces } = useSidebar()
  const { dialogState, openDialog, fetchTeamSpaces } = useTeamSpaceActions()

  useEffect(() => {
    fetchTeamSpaces()
  }, [])

  return (
    <>
      <aside className="w-64 bg-notion-sidebar p-4 overflow-y-auto h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-notion-text-primary">Team Spaces</h2>
          <Button
            onClick={() => openDialog('teamspace')}
            size="icon"
            variant="ghost"
            className="text-notion-text-primary hover:bg-notion-hover hover:text-notion-text-primary"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <TeamSpaceList teamSpaces={teamSpaces} />
      </aside>

      <CreateDialog />
      <DeleteDialog />
    </>
  )
} 