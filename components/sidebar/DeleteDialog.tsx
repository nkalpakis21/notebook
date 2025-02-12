import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteDialog } from "./hooks/useDeleteDialog"

export function DeleteDialog() {
  const { 
    isDeleteDialogOpen, 
    handleCancelDelete, 
    handleConfirmDelete 
  } = useDeleteDialog()

console.log(isDeleteDialogOpen)
  return (
    <Dialog
      open={isDeleteDialogOpen}
      onOpenChange={(open) => {
        if (!open) handleCancelDelete()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete T4542545425eam Space?</DialogTitle>
          <DialogDescription>
            This will permanently delete this team space and all its contents. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 