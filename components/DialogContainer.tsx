"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"

interface DialogContainerProps {
  isTeamSpaceDialogOpen: boolean
  setIsTeamSpaceDialogOpen: (open: boolean) => void
  isFolderDialogOpen: boolean
  setIsFolderDialogOpen: (open: boolean) => void
  noteToDelete: string | null
  setNoteToDelete: (id: string | null) => void
  folderToDelete: string | null
  setFolderToDelete: (id: string | null) => void
  children: React.ReactNode
}

export function DialogContainer({
  isTeamSpaceDialogOpen,
  setIsTeamSpaceDialogOpen,
  isFolderDialogOpen,
  setIsFolderDialogOpen,
  noteToDelete,
  setNoteToDelete,
  folderToDelete,
  setFolderToDelete,
  children
}: DialogContainerProps) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  )
} 