"use client"

import { useEffect, useState } from "react"
import { Folder, Plus, ChevronRight, ChevronDown, File, Trash2, FolderPlus, MoreHorizontal, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ITeamspace, INote } from "@/types/types"
import { useSidebar } from "@/contexts/SidebarContext"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SidebarProps {
  onNoteSelect?: (noteId: string) => void
}

export default function Sidebar({ onNoteSelect }: SidebarProps) {
  const { teamSpaces, setTeamSpaces, openStates, setOpenStates } = useSidebar()
  const router = useRouter()
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)

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

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNoteToDelete(noteId)
  }

  const confirmDelete = async () => {
    if (!noteToDelete) return
    
    try {
      const response = await fetch(`/api/notes/${noteToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete note')
      }

      await fetchTeamSpaces()
      router.push('/')
    } catch (error) {
      console.error('Error deleting note:', error)
    } finally {
      setNoteToDelete(null)
    }
  }

  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFolderToDelete(folderId)
  }

  const confirmDeleteFolder = async () => {
    if (!folderToDelete) return
    
    try {
      const response = await fetch(`/api/folders/${folderToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete folder')
      }

      await fetchTeamSpaces()
      router.push('/')
    } catch (error) {
      console.error('Error deleting folder:', error)
    } finally {
      setFolderToDelete(null)
    }
  }

  const renderFolderItems = (folders: Folder[], depth = 0) => {
    return folders.map((folder) => {
      const isOpen = openStates[`folder-${folder.id}`]
      
      return (
        <div key={folder.id}>
          <div 
            className="group flex items-center hover:bg-gray-100/50 rounded px-2 py-1 cursor-pointer transition-colors duration-150 text-sm"
            style={{ paddingLeft: `${(depth + 1) * 16}px` }}
          >
            <button
              onClick={() => toggleOpen(`folder-${folder.id}`)}
              className="flex items-center flex-1"
            >
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 mr-1" />
              )}
              <Folder className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              <span>{folder.title}</span>
            </button>
            <button
              onClick={(e) => handleDeleteFolder(folder.id, e)}
              className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          
          {isOpen && (
            <div>
              <button
                onClick={() => createNewNote(folder.id, 'folder')}
                className="flex items-center hover:bg-gray-100/40 rounded px-2 py-1 text-sm text-gray-600 transition-colors duration-150"
                style={{ paddingLeft: `${(depth + 2) * 16}px` }}
                disabled={isCreatingNote}
              >
                {isCreatingNote ? (
                  <span className="flex items-center">
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New Note
                  </>
                )}
              </button>
              
              {folder.notes &&
                folder.notes.map((note: INote) => (
                  <div
                    key={note.id}
                    className="text-notion-text-secondary hover:bg-gray-100/40 rounded p-1 cursor-pointer flex items-center justify-between transition-colors duration-150 group text-sm"
                    style={{ paddingLeft: `${(depth + 2) * 16}px` }}
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <File className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{note.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity flex-shrink-0 ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
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
    if (isCreatingNote) return // Prevent double-clicks
    
    try {
      setIsCreatingNote(true)
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
    } finally {
      setIsCreatingNote(false)
    }
  };

  const createNewFolder = async (teamSpaceId: string) => {
    if (isCreatingFolder) return
    const title = prompt("Enter folder name:")
    if (title) {
      try {
        setIsCreatingFolder(true)
        const response = await fetch('/api/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            teamSpaceId
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create folder')
        }

        await fetchTeamSpaces()
      } catch (error) {
        console.error('Error creating folder:', error)
      } finally {
        setIsCreatingFolder(false)
      }
    }
  }

  return (
    <>
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
              className="group flex items-center text-notion-text-primary hover:bg-gray-100/40 rounded p-1 cursor-pointer transition-colors duration-150"
            >
              <div 
                className="flex-1 flex items-center"
                onClick={() => toggleOpen(`ts-${teamSpace.id}`)}
              >
                {openStates[`ts-${teamSpace.id}`] ? (
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 mr-1" />
                )}
                <Users className="h-3.5 w-3.5 mr-1.5" />
                <span className="font-semibold">{teamSpace.title}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200/50 rounded transition-all">
                    <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => createNewNote(teamSpace.id, 'teamspace')}
                    disabled={isCreatingNote}
                    className={isCreatingNote ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isCreatingNote ? (
                      <span className="flex items-center">
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        New Note
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => createNewFolder(teamSpace.id)}
                    disabled={isCreatingFolder}
                    className={isCreatingFolder ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isCreatingFolder ? (
                      <span className="flex items-center">
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <>
                        <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
                        New Folder
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {openStates[`ts-${teamSpace.id}`] && (
              <>
                <div className="flex ml-4 gap-1">
                  <button
                    onClick={() => createNewNote(teamSpace.id, 'teamspace')}
                    className="flex items-center hover:bg-gray-100/40 rounded px-2 py-1 text-sm text-gray-600 transition-colors duration-150"
                    disabled={isCreatingNote}
                  >
                    {isCreatingNote ? (
                      <span className="flex items-center">
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        New Note
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => createNewFolder(teamSpace.id)}
                    className="flex items-center hover:bg-gray-100/40 rounded px-2 py-1 text-sm text-gray-600 transition-colors duration-150"
                    disabled={isCreatingFolder}
                  >
                    {isCreatingFolder ? (
                      <span className="flex items-center">
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <>
                        <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
                        New Folder
                      </>
                    )}
                  </button>
                </div>

                {teamSpace.notes?.map((note) => (
                  <div
                    key={note.id}
                    className="ml-4 text-notion-text-secondary hover:bg-gray-100/40 rounded p-1 cursor-pointer flex items-center justify-between transition-colors duration-150 group text-sm"
                    onClick={() => handleNoteClick(note.id)}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <File className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{note.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity flex-shrink-0 ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                
                {renderFolderItems(teamSpace.folders)}
              </>
            )}
          </div>
        ))}
      </aside>

      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!folderToDelete} onOpenChange={() => setFolderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this folder and all notes within it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteFolder}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

