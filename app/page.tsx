"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import NoteEditor from "@/components/NoteEditor"

export default function Home() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>()

  return (
    <div className="flex h-screen bg-notion-default">
      <Sidebar onNoteSelect={setSelectedNoteId} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 my-16">
          <NoteEditor noteId={selectedNoteId} />
        </div>
      </main>
    </div>
  )
}

