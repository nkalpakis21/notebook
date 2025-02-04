"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { ITeamspace } from "@/types/types"

interface SidebarContextType {
  teamSpaces: ITeamspace[]
  setTeamSpaces: React.Dispatch<React.SetStateAction<ITeamspace[]>>
  openStates: { [key: string]: boolean }
  setOpenStates: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [teamSpaces, setTeamSpaces] = useState<ITeamspace[]>([])
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({})

  return (
    <SidebarContext.Provider value={{ teamSpaces, setTeamSpaces, openStates, setOpenStates }}>
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

