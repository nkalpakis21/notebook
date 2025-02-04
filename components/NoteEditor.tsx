"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function NoteEditor() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSave = async () => {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
    if (response.ok) {
      setTitle("")
      setContent("")
      alert("Note saved successfully!")
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Untitled"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-notion-default text-notion-text-primary border-0 text-4xl font-bold placeholder:text-notion-text-secondary focus-visible:ring-0 px-0"
      />
      <Textarea
        placeholder="Type '/' for commands"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="bg-notion-default text-notion-text-primary border-0 resize-none placeholder:text-notion-text-secondary focus-visible:ring-0 px-0"
      />
      <Button onClick={handleSave} className="bg-notion-hover hover:bg-notion-sidebar text-notion-text-primary">
        Save Note
      </Button>
    </div>
  )
}

