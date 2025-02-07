"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSidebar } from "@/contexts/SidebarContext"
import type { IFolder } from "@/types/types"

interface NoteEditorProps {
  noteId?: string
}

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const { teamSpaces } = useSidebar()
  const [folders, setFolders] = useState<IFolder[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const allFolders = teamSpaces.flatMap((ts) => ts.folders)
    setFolders(allFolders)
  }, [teamSpaces])

  useEffect(() => {
    if (noteId) {
      fetchNote(noteId)
    } else {
      // Clear the form when creating a new note
      setTitle("")
      setContent("")
      setSelectedFolder(null)
    }
  }, [noteId])

  const fetchNote = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notes/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch note")
      }
      const note = await response.json()
      setTitle(note.title)
      setContent(note.content)
      setSelectedFolder(note.folderId)
    } catch (error) {
      console.error("Error fetching note:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!noteId && !selectedFolder) {
      alert("Please select a folder for the new note.")
      return
    }

    const noteData = {
      title,
      content,
      ...(noteId ? {} : { folderId: selectedFolder }),
    }

    const url = noteId ? `/api/notes/${noteId}` : "/api/notes"
    const method = noteId ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      })

      if (response.ok) {
        alert(noteId ? "Note updated successfully!" : "Note created successfully!")
      } else {
        throw new Error("Failed to save note")
      }
    } catch (error) {
      console.error("Error saving note:", error)
      alert("Failed to save note. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-120">
      <Input
        placeholder="Untitled"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-notion-default text-notion-text-primary border-0 text-4xl font-bold placeholder:text-notion-text-secondary focus-visible:ring-0 px-0"
      />
      {!noteId && (
        <Select value={selectedFolder || undefined} onValueChange={setSelectedFolder}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select folder" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Textarea
        placeholder="Type '/' for commands"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        className="bg-notion-default text-notion-text-primary border-0 resize-none placeholder:text-notion-text-secondary focus-visible:ring-0 px-0"
      />
      <Button onClick={handleSave} className="bg-notion-hover hover:bg-notion-sidebar text-notion-text-primary">
        {noteId ? "Update Note" : "Create Note"}
      </Button>
    </div>
  )
}

