"use client"

import { useState, useEffect } from "react"
import { Folder, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ITeamspace } from "@/types/types"

export default function Sidebar() {
  const [teamSpaces, setTeamSpaces] = useState<ITeamspace[]>([])

  useEffect(() => {
    fetchTeamSpaces()
  }, [])

  const fetchTeamSpaces = async () => {
    const response = await fetch("/api/teamspaces")
    const data = await response.json()
    setTeamSpaces(data)
  }

  const createTeamSpace = async () => {
    const name = prompt("Enter team space name:")
    if (name) {
      const response = await fetch("/api/teamspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (response.ok) {
        fetchTeamSpaces()
      }
    }
  }

  return (
    <aside className="w-64 bg-notion-sidebar p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-notion-text-primary">Team Spaces</h2>
        <Button
          onClick={createTeamSpace}
          size="icon"
          variant="ghost"
          className="text-notion-text-primary hover:bg-notion-hover hover:text-notion-text-primary"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {teamSpaces.map((teamSpace) => (
        <div key={teamSpace.id} className="mb-4">
          <h3 className="font-semibold text-notion-text-primary">{teamSpace.title}</h3>
          {teamSpace.folders.map((folder) => (
            <div
              key={folder.id}
              className="ml-4 mt-2 text-notion-text-secondary hover:bg-notion-hover rounded p-1 cursor-pointer"
            >
              <Folder className="h-4 w-4 inline mr-2" />
              {folder.title}
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}

