"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, useCallback } from "react"
import type { ITeamspace } from "@/types/types"

interface SidebarContextType {
  teamSpaces: ITeamspace[]
  setTeamSpaces: (teamSpaces: ITeamspace[]) => void
  openStates: { [key: string]: boolean }
  setOpenStates: (states: { [key: string]: boolean }) => void
  fetchTeamSpaces: () => Promise<void>
  updateNoteTitle: (noteId: string, newTitle: string) => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [teamSpaces, setTeamSpaces] = useState<ITeamspace[]>([])
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({})

  const fetchTeamSpaces = useCallback(async () => {
    // Implementation of fetchTeamSpaces
  }, [])

  const updateNoteTitle = useCallback((noteId: string, newTitle: string) => {
    setTeamSpaces(currentTeamSpaces => {
      return currentTeamSpaces.map(teamSpace => {
        // Check teamspace-level notes
        if (teamSpace.notes) {
          const noteIndex = teamSpace.notes.findIndex(note => note.id === noteId)
          if (noteIndex !== -1) {
            const updatedNotes = [...teamSpace.notes]
            updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], title: newTitle }
            return { ...teamSpace, notes: updatedNotes }
          }
        }

        // Check folder-level notes
        const updatedFolders = teamSpace.folders.map(folder => {
          if (folder.notes) {
            const noteIndex = folder.notes.findIndex(note => note.id === noteId)
            if (noteIndex !== -1) {
              const updatedNotes = [...folder.notes]
              updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], title: newTitle }
              return { ...folder, notes: updatedNotes }
            }
          }
          return folder
        })

        return { ...teamSpace, folders: updatedFolders }
      })
    })
  }, [])

  return (
    <SidebarContext.Provider value={{
      teamSpaces,
      setTeamSpaces,
      openStates,
      setOpenStates,
      fetchTeamSpaces,
      updateNoteTitle
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === null) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

