"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import SaveIndicator from "./SaveIndicator"
import debounce from "lodash/debounce"
import { useSidebar } from "@/contexts/SidebarContext"

interface NoteEditorProps {
  noteId?: string
}

type SaveStatus = "idle" | "saving" | "saved"

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const [title, setTitle] = useState("Untitled")
  const [content, setContent] = useState("")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const router = useRouter()
  const { fetchTeamSpaces, updateNoteTitle } = useSidebar()

  // Create a debounced save function
  const debouncedSave = useCallback(
    debounce(async (newTitle: string, newContent: string) => {
      setSaveStatus("saving")
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        })

        if (!response.ok) {
          throw new Error("Failed to save note")
        }
        setSaveStatus("saved")
        // Reset to idle after showing "Saved" for 2 seconds
        setTimeout(() => setSaveStatus("idle"), 2000)
      } catch (error) {
        console.error("Error saving note:", error)
        setSaveStatus("idle")
      }
    }, 3000),
    [noteId]
  )

  // Cancel debounced save on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  useEffect(() => {
    if (noteId) {
      fetchNote()
    }
  }, [noteId])

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/notes/${noteId}`)
      const note = await response.json()
      setTitle(note.title)
      setContent(note.content)
    } catch (error) {
      console.error("Error fetching note:", error)
    }
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    // Update the title in the sidebar immediately
    if (noteId) {
      updateNoteTitle(noteId, newTitle)
    }
    // Still save to the server with debounce
    debouncedSave(newTitle, content)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    debouncedSave(title, newContent)
  }

  if (!noteId) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="text-3xl font-bold w-full bg-transparent border-none outline-none"
        />
        <SaveIndicator status={saveStatus} />
      </div>
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start writing..."
        className="w-full h-[calc(100vh-200px)] bg-transparent border-none outline-none resize-none"
      />
    </div>
  )
}

