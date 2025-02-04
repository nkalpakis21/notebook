"use client"

import { useEffect } from "react"
import { Folder, Plus, ChevronRight, ChevronDown, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ITeamspace, INote } from "@/types/types"
import { useSidebar } from "@/contexts/SidebarContext"

export default function Sidebar() {
  const { teamSpaces, setTeamSpaces, openStates, setOpenStates } = useSidebar()

  useEffect(() => {
    fetchTeamSpaces()
  }, [])

  const fetchTeamSpaces = async () => {
    try {
      const response = await fetch("/api/teamspaces")
      const data = await response.json()
      setTeamSpaces(data)
      // Initialize all teamspaces as open and all folders as closed
      const initialOpenStates = data.reduce((acc: { [key: string]: boolean }, ts: ITeamspace) => {
        acc[`ts-${ts.id}`] = true
        ts.folders.forEach((folder) => {
          acc[`folder-${folder.id}`] = false
        })
        return acc
      }, {})
      setOpenStates(initialOpenStates)
    } catch (error) {
      console.error("Error fetching teamspaces:", error)
    }
  }

  const createTeamSpace = async () => {
    const name = prompt("Enter team space name:")
    if (name) {
      try {
        const response = await fetch("/api/teamspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
        if (response.ok) {
          fetchTeamSpaces()
        }
      } catch (error) {
        console.error("Error creating teamspace:", error)
      }
    }
  }

  const toggleOpen = (key: string) => {
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside className="w-64 bg-notion-sidebar p-4 overflow-y-auto h-screen">
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
        <div key={teamSpace.id} className="mb-2">
          <div
            className="flex items-center text-notion-text-primary hover:bg-notion-hover rounded p-1 cursor-pointer"
            onClick={() => toggleOpen(`ts-${teamSpace.id}`)}
          >
            {openStates[`ts-${teamSpace.id}`] ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <span className="font-semibold">{teamSpace.title}</span>
          </div>
          {openStates[`ts-${teamSpace.id}`] &&
            teamSpace.folders.map((folder) => (
              <div key={folder.id} className="ml-4">
                <div
                  className="flex items-center text-notion-text-secondary hover:bg-notion-hover rounded p-1 cursor-pointer"
                  onClick={() => toggleOpen(`folder-${folder.id}`)}
                >
                  {openStates[`folder-${folder.id}`] ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  <Folder className="h-4 w-4 mr-2" />
                  <span>{folder.title}</span>
                </div>
                {openStates[`folder-${folder.id}`] &&
                  folder.notes &&
                  folder.notes.map((note: INote) => (
                    <div
                      key={note.id}
                      className="ml-7 text-notion-text-secondary hover:bg-notion-hover rounded p-1 cursor-pointer flex items-center"
                    >
                      <File className="h-4 w-4 mr-2" />
                      <span>{note.title}</span>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      ))}
    </aside>
  )
}

