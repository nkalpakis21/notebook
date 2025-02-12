import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteDialog } from "./hooks/useDeleteDialog"

interface TeamSpaceDropdownProps {
  teamSpaceId: string
}

export function TeamSpaceDropdown({ teamSpaceId }: TeamSpaceDropdownProps) {
  const { handleDeleteClick } = useDeleteDialog()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
          aria-label="More options"
        >
          <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="right"
        align="start" 
        className="w-48"
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DropdownMenuItem 
          onClick={() => handleDeleteClick(teamSpaceId)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Delete Team Space
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 