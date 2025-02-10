"use client"

import { useEffect } from "react"
import { Folder, Plus, ChevronRight, ChevronDown, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ITeamspace, INote } from "@/types/types"
import { useSidebar } from "@/contexts/SidebarContext"
import { useRouter } from "next/navigation"

interface SidebarProps {
  onNoteSelect?: (noteId: string) => void
}

export default function Sidebar({ onNoteSelect }: SidebarProps) {
  const { teamSpaces, setTeamSpaces, openStates, setOpenStates } = useSidebar()
  const router = useRouter()

  useEffect(() => {
    fetchTeamSpaces()
  }, [])

  const fetchTeamSpaces = async () => {
    try {
      const response = await fetch("/api/teamspaces")
      const data = await response.json()
      setTeamSpaces(data)
      
      // Only initialize open states for new teamspaces/folders
      setOpenStates(prevStates => {
        const newOpenStates = { ...prevStates }
        
        data.forEach((ts: ITeamspace) => {
          // Only set if not already in state
          if (!((`ts-${ts.id}`) in newOpenStates)) {
            newOpenStates[`ts-${ts.id}`] = true
          }
          ts.folders.forEach((folder) => {
            if (!((`folder-${folder.id}`) in newOpenStates)) {
              newOpenStates[`folder-${folder.id}`] = false
            }
          })
        })
        
        return newOpenStates
      })
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

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`)
  }

  const renderFolderItems = (folders: Folder[], depth = 0) => {
    return folders.map((folder) => {
      const isOpen = openStates[`folder-${folder.id}`]
      
      return (
        <div key={folder.id}>
          <div 
            className="flex items-center hover:bg-gray-100/50 rounded px-2 py-1 cursor-pointer transition-colors duration-150"
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            <button
              onClick={() => toggleOpen(`folder-${folder.id}`)}
              className="flex items-center flex-1"
            >
              <ChevronRight className={`w-4 h-4 ${isOpen ? 'transform rotate-90' : ''}`} />
              <Folder className="w-4 h-4 ml-1" />
              <span className="ml-1">{folder.title}</span>
            </button>
          </div>
          
          {isOpen && (
            <div>
              <button
                onClick={() => createNewNote(folder.id, 'folder')}
                className="flex items-center hover:bg-gray-100/40 rounded px-2 py-1 text-sm text-gray-600 transition-colors duration-150"
                style={{ paddingLeft: `${(depth + 1) * 16}px` }}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Note
              </button>
              
              {folder.notes &&
                folder.notes.map((note: INote) => (
                  <div
                    key={note.id}
                    className="ml-7 text-notion-text-secondary hover:bg-gray-100/40 rounded p-1 cursor-pointer flex items-center transition-colors duration-150"
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <File className="h-4 w-4 mr-2" />
                    <span>{note.title}</span>
                  </div>
                ))}
              
              {folder.children && renderFolderItems(folder.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const createNewNote = async (referenceId: string, referenceType: 'folder' | 'teamspace') => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled',
          content: '',
          referenceId,
          referenceType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();
      await fetchTeamSpaces();
      router.push(`/notes/${newNote.id}`);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

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
            className="flex items-center text-notion-text-primary hover:bg-gray-100/40 rounded p-1 cursor-pointer transition-colors duration-150"
            onClick={() => toggleOpen(`ts-${teamSpace.id}`)}
          >
            {openStates[`ts-${teamSpace.id}`] ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <span className="font-semibold">{teamSpace.title}</span>
          </div>
          {openStates[`ts-${teamSpace.id}`] && (
            <>
              <button
                onClick={() => createNewNote(teamSpace.id, 'teamspace')}
                className="flex items-center hover:bg-gray-100/40 rounded px-2 py-1 text-sm text-gray-600 transition-colors duration-150 ml-4"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Note
              </button>
              
              {teamSpace.notes?.map((note) => (
                <div
                  key={note.id}
                  className="ml-4 text-notion-text-secondary hover:bg-gray-100/40 rounded p-1 cursor-pointer flex items-center transition-colors duration-150"
                  onClick={() => handleNoteClick(note.id)}
                >
                  <File className="h-4 w-4 mr-2" />
                  <span>{note.title}</span>
                </div>
              ))}
              
              {renderFolderItems(teamSpace.folders)}
            </>
          )}
        </div>
      ))}
    </aside>
  )
}

