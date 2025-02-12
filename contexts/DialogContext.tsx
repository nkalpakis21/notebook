"use client"

import { createContext, useContext, ReactNode, useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"

interface DialogContextType {
  openDialog: (content: ReactNode) => void
  closeDialog: () => void
  openAlert: (content: ReactNode) => void
  closeAlert: () => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogContent, setDialogContent] = useState<ReactNode | null>(null)
  const [alertContent, setAlertContent] = useState<ReactNode | null>(null)

  const openDialog = (content: ReactNode) => setDialogContent(content)
  const closeDialog = () => setDialogContent(null)
  const openAlert = (content: ReactNode) => setAlertContent(content)
  const closeAlert = () => setAlertContent(null)

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, openAlert, closeAlert }}>
      {children}
      
      <Dialog open={!!dialogContent} onOpenChange={() => closeDialog()}>
        <DialogContent>
          {dialogContent}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!alertContent} onOpenChange={() => closeAlert()}>
        <AlertDialogContent>
          {alertContent}
        </AlertDialogContent>
      </AlertDialog>
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) throw new Error('useDialog must be used within DialogProvider')
  return context
} 