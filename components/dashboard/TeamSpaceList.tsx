'use client'

import { useEffect } from "react"
import { ChevronDown, ChevronRight, Users, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/SidebarContext"
import { TeamSpaceItem } from "./TeamSpaceItem"

export function TeamSpaceList() {
  const { teamSpaces, fetchTeamSpaces } = useSidebar()

  useEffect(() => {
    fetchTeamSpaces()
  }, [fetchTeamSpaces])

  return (
    <div className="space-y-1">
      {teamSpaces.map((teamSpace) => (
        <TeamSpaceItem key={teamSpace.id} teamSpace={teamSpace} />
      ))}
    </div>
  )
} 