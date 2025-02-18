"use client"

import { createContext, useContext, useState, useCallback } from "react"
import type { ITeamspace } from "@/types/types"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

interface SidebarContextType {
  teamSpaces: ITeamspace[]
  setTeamSpaces: (teamSpaces: ITeamspace[]) => void
  openStates: { [key: string]: boolean }
  setOpenStates: (states: { [key: string]: boolean }) => void
  fetchTeamSpaces: () => Promise<void>
  toggleOpen: (key: string) => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [teamSpaces, setTeamSpaces] = useState<ITeamspace[]>([])
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({})

  const fetchTeamSpaces = useCallback(async () => {
    try {
      const teamSpacesRef = collection(db, 'teamspaces')
      const snapshot = await getDocs(teamSpacesRef)
      const teamSpacesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as ITeamspace[]
      
      setTeamSpaces(teamSpacesData)
      
      // Initialize open states for new items
      setOpenStates(prev => {
        const newStates = { ...prev }
        teamSpacesData.forEach(ts => {
          if (!newStates[`ts-${ts.id}`]) {
            newStates[`ts-${ts.id}`] = true
          }
          ts.folders?.forEach(folder => {
            if (!newStates[`folder-${folder.id}`]) {
              newStates[`folder-${folder.id}`] = false
            }
          })
        })
        return newStates
      })
    } catch (error) {
      console.error("Error fetching team spaces:", error)
    }
  }, [])

  const toggleOpen = useCallback((key: string) => {
    setOpenStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }, [])

  return (
    <SidebarContext.Provider value={{
      teamSpaces,
      setTeamSpaces,
      openStates,
      setOpenStates,
      fetchTeamSpaces,
      toggleOpen
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

