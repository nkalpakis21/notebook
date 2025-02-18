'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTeamSpaceActions } from "@/hooks/useTeamSpaceActions"

export function CreateDialog() {
  const [title, setTitle] = useState("")
  const { dialogState, setDialogState, createTeamSpace, createFolder, createNote } = useTeamSpaceActions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      if (dialogState.type === 'teamspace') {
        await createTeamSpace(title)
      } else if (dialogState.type === 'folder' && dialogState.teamSpaceId) {
        await createFolder(dialogState.teamSpaceId, title)
      } else if (dialogState.type === 'note' && dialogState.folderId) {
        await createNote(dialogState.folderId, title)
      }
      handleClose()
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  const handleClose = () => {
    setDialogState({
      type: null,
      isOpen: false,
      teamSpaceId: undefined,
      folderId: undefined,
      isLoading: false
    })
    setTitle("")
  }

  const getDialogTitle = () => {
    switch (dialogState.type) {
      case 'teamspace':
        return 'Create Team Space'
      case 'folder':
        return 'Create Folder'
      case 'note':
        return 'Create Note'
      default:
        return ''
    }
  }

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={dialogState.isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 